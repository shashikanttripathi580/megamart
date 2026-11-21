import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeft, 
  CheckCircle2, 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  AlertCircle,
  Truck,
  Loader2,
  MapPin,
  User,
  Info
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/utils';
import { getProductImageUrl, handleImageErrorFallback } from '@/lib/imageUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createOrder, validateCart } from '@/api/orders';
import { EmptyState } from '@/components/common/EmptyState';

const phoneRegex = /^[6-9]\d{9}$/;
const pincodeRegex = /^[1-9][0-9]{5}$/;

const checkoutFormSchema = z.object({
  // Customer details
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9)'),
  email: z
    .string()
    .trim()
    .email('Enter a valid email address')
    .optional()
    .or(z.literal('')),

  // Delivery Address
  addressLine1: z
    .string()
    .min(5, 'Flat/House No. & Street name must be at least 5 characters')
    .max(200, 'Address is too long')
    .trim(),
  addressLine2: z
    .string()
    .max(200, 'Area/Locality is too long')
    .trim()
    .optional()
    .or(z.literal('')),
  landmark: z
    .string()
    .max(150, 'Landmark is too long')
    .trim()
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .min(2, 'City is required')
    .max(100, 'City name is too long')
    .trim(),
  state: z
    .string()
    .min(2, 'State is required')
    .max(100, 'State name is too long')
    .trim(),
  pincode: z
    .string()
    .trim()
    .regex(pincodeRegex, 'Enter a valid 6-digit Indian PIN code (cannot start with 0)'),
  addressType: z.enum(['home', 'work', 'other']),

  // Payment
  paymentMethod: z.enum(['cod', 'mock_online']),
  notes: z.string().max(500).trim().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    itemCount,
    subtotal,
    mrpTotal,
    discount,
    deliveryFee,
    total,
    clearCart,
    refreshCartItems,
  } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const [isPreValidating, setIsPreValidating] = useState(false);

  const getInitialLocation = () => {
    try {
      const raw = localStorage.getItem('megamart_location');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { city: 'Mumbai', pincode: '400001' };
  };
  const initLoc = getInitialLocation();
  const initState = initLoc.city === 'Bengaluru' ? 'Karnataka' : initLoc.city === 'Delhi NCR' ? 'Delhi' : 'Maharashtra';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      addressLine1: '',
      addressLine2: '',
      landmark: '',
      city: initLoc.city || 'Mumbai',
      state: initState,
      pincode: initLoc.pincode || '400001',
      addressType: 'home',
      paymentMethod: 'mock_online',
      notes: '',
    },
  });

  const selectedPaymentMethod = watch('paymentMethod');
  const selectedAddressType = watch('addressType');

  // Verify cart with server on page mount
  useEffect(() => {
    if (items.length === 0) return;

    let isMounted = true;
    const runValidation = async () => {
      setIsPreValidating(true);
      try {
        const res = await validateCart(
          items.map((i) => ({
            productId: i.productId,
            variantSku: i.variantSku,
            quantity: i.quantity,
            clientPrice: i.price,
          }))
        );

        if (!isMounted) return;

        if (res.hasPriceChanges) {
          setValidationWarning('Some product prices were updated to current supermarket rates.');
          refreshCartItems(
            res.items.map((vi) => ({
              productId: vi.productId,
              variantSku: vi.variantSku,
              price: vi.unitPrice,
              mrp: vi.mrp,
              stock: vi.stock,
            }))
          );
        }

        if (!res.isValid) {
          const blockingIssue = res.issues.find(
            (iss) => iss.type === 'out_of_stock' || iss.type === 'insufficient_stock' || iss.type === 'unavailable'
          );
          if (blockingIssue) {
            setValidationWarning(blockingIssue.message);
          }
        }
      } catch (err) {
        console.error('Pre-checkout validation failed:', err);
      } finally {
        if (isMounted) setIsPreValidating(false);
      }
    };

    runValidation();

    return () => {
      isMounted = false;
    };
  }, [items, refreshCartItems]);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon="cart"
          title="Your Basket is Empty"
          description="You cannot proceed to checkout with an empty cart. Please add items from our supermarket catalog."
          actionLabel="Return to Shopping"
          actionHref="/products"
        />
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // 1. Server-side fresh validation before placing order
      const validation = await validateCart(
        items.map((i) => ({
          productId: i.productId,
          variantSku: i.variantSku,
          quantity: i.quantity,
          clientPrice: i.price,
        }))
      );

      if (!validation.isValid) {
        const errorMsg =
          validation.issues.find((iss) => iss.type !== 'price_changed')?.message ||
          'Some items in your cart are no longer available in the requested quantity.';
        setSubmissionError(errorMsg);
        setIsSubmitting(false);
        return;
      }

      // 2. Prepare clean order payload
      const orderPayload = {
        customer: {
          name: data.name.trim(),
          phone: data.phone.trim(),
          email: data.email ? data.email.trim() : undefined,
        },
        deliveryAddress: {
          fullName: data.name.trim(),
          phone: data.phone.trim(),
          addressLine1: data.addressLine1.trim(),
          addressLine2: data.addressLine2 ? data.addressLine2.trim() : undefined,
          landmark: data.landmark ? data.landmark.trim() : undefined,
          city: data.city.trim(),
          state: data.state.trim(),
          pincode: data.pincode.trim(),
          addressType: data.addressType,
        },
        items: items.map((i) => ({
          productId: i.productId,
          variantSku: i.variantSku,
          quantity: i.quantity,
        })),
        paymentMethod: data.paymentMethod,
        notes: data.notes ? data.notes.trim() : undefined,
      };

      // 3. Create order on backend
      const createdOrder = await createOrder(orderPayload);

      // 4. Clear local cart after successful order creation
      clearCart();

      // 5. Navigate to order confirmation
      navigate(`/order-success/${encodeURIComponent(createdOrder.orderNumber)}`);
    } catch (err: any) {
      console.error('Order placement failed:', err);
      setSubmissionError(err?.message || 'Something went wrong while placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-5 sm:space-y-6 pb-28 lg:pb-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/cart" className="hover:text-emerald-700 flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Basket
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-900">Guest Checkout</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>Checkout & Delivery</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Guest Checkout
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          No password or login required. Complete your delivery details below.
        </p>
      </div>

      {/* Warning Notice */}
      {validationWarning && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs sm:text-sm text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Notice:</span> {validationWarning}
          </div>
        </div>
      )}

      {/* Error Alert */}
      {submissionError && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs sm:text-sm text-rose-900 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Order Placement Failed:</span> {submissionError}
          </div>
        </div>
      )}

      {/* Main Grid: Form Left, Summary Right */}
      <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Form Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Customer Contact Info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-700" /> Customer Information
                </h2>
                <p className="text-xs text-slate-400">Where we will send your order updates & SMS alerts</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label htmlFor="name" className="text-xs font-semibold text-slate-700">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  id="name"
                  placeholder="e.g. Rajesh Sharma"
                  {...register('name')}
                  className={errors.name ? 'border-rose-400 focus-visible:ring-rose-400' : ''}
                />
                {errors.name && (
                  <p className="text-[11px] font-medium text-rose-600">{errors.name.message}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="space-y-1">
                <label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                  Mobile Number (India) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold select-none">
                    +91
                  </span>
                  <Input
                    id="phone"
                    placeholder="9876543210"
                    {...register('phone')}
                    className={`pl-11 ${errors.phone ? 'border-rose-400 focus-visible:ring-rose-400' : ''}`}
                    maxLength={10}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] font-medium text-rose-600">{errors.phone.message}</p>
                )}
              </div>

              {/* Optional Email */}
              <div className="sm:col-span-2 space-y-1">
                <label htmlFor="email" className="text-xs font-semibold text-slate-700">
                  Email Address <span className="text-slate-400 font-normal">(Optional, for receipt)</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="rajesh.sharma@example.com"
                  {...register('email')}
                  className={errors.email ? 'border-rose-400 focus-visible:ring-rose-400' : ''}
                />
                {errors.email && (
                  <p className="text-[11px] font-medium text-rose-600">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-700" /> Delivery Address
                </h2>
                <p className="text-xs text-slate-400">Our delivery partner will bring your groceries to this address</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Address Line 1 */}
              <div className="sm:col-span-2 space-y-1">
                <label htmlFor="addressLine1" className="text-xs font-semibold text-slate-700">
                  Flat / House / Building & Street <span className="text-rose-500">*</span>
                </label>
                <Input
                  id="addressLine1"
                  placeholder="e.g. Flat 402, Sunshine Apartments, MG Road"
                  {...register('addressLine1')}
                  className={errors.addressLine1 ? 'border-rose-400 focus-visible:ring-rose-400' : ''}
                />
                {errors.addressLine1 && (
                  <p className="text-[11px] font-medium text-rose-600">{errors.addressLine1.message}</p>
                )}
              </div>

              {/* Address Line 2 (Area/Locality) */}
              <div className="space-y-1">
                <label htmlFor="addressLine2" className="text-xs font-semibold text-slate-700">
                  Area / Locality / Sector <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <Input
                  id="addressLine2"
                  placeholder="e.g. Bandra West"
                  {...register('addressLine2')}
                />
              </div>

              {/* Landmark */}
              <div className="space-y-1">
                <label htmlFor="landmark" className="text-xs font-semibold text-slate-700">
                  Landmark <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <Input
                  id="landmark"
                  placeholder="e.g. Near HDFC Bank"
                  {...register('landmark')}
                />
              </div>

              {/* City */}
              <div className="space-y-1">
                <label htmlFor="city" className="text-xs font-semibold text-slate-700">
                  City <span className="text-rose-500">*</span>
                </label>
                <Input
                  id="city"
                  placeholder="e.g. Mumbai"
                  {...register('city')}
                  className={errors.city ? 'border-rose-400 focus-visible:ring-rose-400' : ''}
                />
                {errors.city && (
                  <p className="text-[11px] font-medium text-rose-600">{errors.city.message}</p>
                )}
              </div>

              {/* State */}
              <div className="space-y-1">
                <label htmlFor="state" className="text-xs font-semibold text-slate-700">
                  State <span className="text-rose-500">*</span>
                </label>
                <Input
                  id="state"
                  placeholder="e.g. Maharashtra"
                  {...register('state')}
                  className={errors.state ? 'border-rose-400 focus-visible:ring-rose-400' : ''}
                />
                {errors.state && (
                  <p className="text-[11px] font-medium text-rose-600">{errors.state.message}</p>
                )}
              </div>

              {/* Pincode */}
              <div className="space-y-1">
                <label htmlFor="pincode" className="text-xs font-semibold text-slate-700">
                  PIN Code <span className="text-rose-500">*</span>
                </label>
                <Input
                  id="pincode"
                  placeholder="e.g. 400050"
                  {...register('pincode')}
                  maxLength={6}
                  className={errors.pincode ? 'border-rose-400 focus-visible:ring-rose-400' : ''}
                />
                {errors.pincode && (
                  <p className="text-[11px] font-medium text-rose-600">{errors.pincode.message}</p>
                )}
              </div>

              {/* Address Type */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Address Type
                </label>
                <div className="flex gap-2">
                  {(['home', 'work', 'other'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setValue('addressType', type)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all capitalize ${
                        selectedAddressType === type
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Payment Selection */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-700" /> Payment Method
                </h2>
                <p className="text-xs text-slate-400">Select how you would like to pay for your groceries</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Option 1: Mock Online Payment */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedPaymentMethod === 'mock_online'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  value="mock_online"
                  {...register('paymentMethod')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      Pay Online (Instant Mock Payment)
                    </span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-600 text-white uppercase">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Simulates instant UPI / Card authorization. Order is placed with status <span className="font-semibold text-emerald-700">Paid</span>.
                  </p>
                </div>
              </label>

              {/* Option 2: Cash on Delivery */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedPaymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  value="cod"
                  {...register('paymentMethod')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      Cash on Delivery (COD)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Pay with cash or UPI directly to the delivery person upon arrival.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Order Summary & Place Order */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5 sticky top-24">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-semibold text-slate-500">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </h2>

            {/* Item List Preview */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => {
                const img = item.product.images?.[0]?.url;
                return (
                  <div key={item.id} className="flex items-center justify-between gap-2.5 text-xs">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      {img ? (
                        <img
                          src={getProductImageUrl(img)}
                          alt={item.product.name}
                          onError={(e) => handleImageErrorFallback(e, img)}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className="w-4 h-4 bg-slate-200 rounded" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{item.product.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {item.variant ? item.variant.name : item.product.weight || item.product.unit} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Savings Callout */}
            {discount > 0 && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <span className="text-sm">🎉</span>
                <span>You're saving {formatCurrency(discount)} on this order!</span>
              </div>
            )}

            {/* Price Calculations */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Items Total (MRP)</span>
                <span>{formatCurrency(mrpTotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Product Savings</span>
                  <span>- {formatCurrency(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-600 items-center">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  Delivery Charge
                </span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-xs">FREE</span>
                  ) : (
                    formatCurrency(deliveryFee)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-base font-bold text-slate-900">Total Payable</span>
                <span className="text-xl font-black text-slate-950">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <Button
              type="submit"
              size="lg"
              variant="supermarket"
              disabled={isSubmitting || isPreValidating}
              className="w-full text-sm font-bold shadow-md shadow-emerald-700/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Placing Your Order...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Place Order ({formatCurrency(total)})
                </span>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Genuine Supermarket Groceries</span>
            </div>
          </div>
        </div>
      </form>

      {/* Sticky Mobile Place Order Bar */}
      <div 
        className="fixed lg:hidden bottom-0 left-0 right-0 px-4 py-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] z-40 flex items-center justify-between gap-3"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 12px), 12px)' }}
      >
        <div>
          <span className="text-[10px] text-slate-500 font-medium block">Total Payable</span>
          <span className="text-base sm:text-lg font-black text-slate-900">{formatCurrency(total)}</span>
        </div>
        <Button
          type="submit"
          form="checkout-form"
          size="default"
          variant="supermarket"
          disabled={isSubmitting || isPreValidating}
          className="font-bold text-xs sm:text-sm px-5 h-10 shadow-xs touch-manipulation disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Placing...</span>
          ) : (
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Place Order</span>
          )}
        </Button>
      </div>
    </div>
  );
};
