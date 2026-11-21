import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Clock,
  AlertTriangle,
  Info,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/EmptyState';
import { validateCart } from '@/api/orders';
import { PriceComparison } from '@/components/cart/PriceComparison';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    itemCount,
    subtotal,
    mrpTotal,
    discount,
    deliveryFee,
    total,
    freeDeliveryThreshold,
    amountToFreeDelivery,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCartItems,
  } = useCart();

  // Validate cart against server database on load and when items change
  const { data: validationResult, isLoading: isValidating } = useQuery({
    queryKey: ['cart-validation', items.map((i) => `${i.id}-${i.quantity}-${i.price}`).join(',')],
    queryFn: () =>
      validateCart(
        items.map((i) => ({
          productId: i.productId,
          variantSku: i.variantSku,
          quantity: i.quantity,
          clientPrice: i.price,
        }))
      ),
    enabled: items.length > 0,
    staleTime: 10000,
  });

  // Automatically refresh local cart prices if server detects price differences
  useEffect(() => {
    if (validationResult?.items && validationResult.items.length > 0) {
      refreshCartItems(
        validationResult.items.map((vi) => ({
          productId: vi.productId,
          variantSku: vi.variantSku,
          price: vi.unitPrice,
          mrp: vi.mrp,
          stock: vi.stock,
        }))
      );
    }
  }, [validationResult, refreshCartItems]);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon="cart"
          title="Your Supermarket Basket is Empty"
          description="Looks like you haven't added any fresh groceries or daily essentials to your cart yet."
          actionLabel="Start Grocery Shopping"
          actionHref="/products"
        />
      </div>
    );
  }

  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
  const hasBlockingIssues = validationResult && !validationResult.isValid;
  const priceChangedIssues = validationResult?.issues?.filter((i) => i.type === 'price_changed') || [];

  let savedLocation = { city: 'Mumbai', pincode: '400001' };
  try {
    const raw = localStorage.getItem('megamart_location');
    if (raw) savedLocation = JSON.parse(raw);
  } catch (e) {
    // fallback
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 space-y-6 pb-24 lg:pb-8">
      {/* Page Title & Item Count */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Your Cart</span>
            <span className="text-sm font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear All
        </button>
      </div>

      {/* Delivery Location Indicator */}
      <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-200/80 rounded-xl px-3.5 py-2 text-xs text-emerald-900">
        <span className="flex items-center gap-1.5 font-semibold">
          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
          <span>Delivering groceries to: <strong>{savedLocation.city} {savedLocation.pincode}</strong></span>
        </span>
        <span className="text-[11px] text-emerald-700 font-bold hidden sm:inline">Standard 24-48 Hr Delivery</span>
      </div>

      {/* Cart Warnings / Notifications */}
      {priceChangedIssues.length > 0 && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs sm:text-sm text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Price Update:</span> Some product prices in your basket were updated to reflect current store rates. Your total has been recalculated.
          </div>
        </div>
      )}

      {hasBlockingIssues && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs sm:text-sm text-rose-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Stock Attention Required:</span> One or more items in your cart exceed available inventory. Please adjust quantities or remove unavailable items.
          </div>
        </div>
      )}

      {/* Free Delivery Progress Bar */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
          <span className="text-slate-700">
            {amountToFreeDelivery > 0 ? (
              <>Add {formatCurrency(amountToFreeDelivery)} more for free delivery</>
            ) : (
              <span className="text-emerald-700 font-bold">Free delivery applied</span>
            )}
          </span>
          <span className="text-emerald-700 font-bold">{freeDeliveryProgress}%</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all duration-500"
            style={{ width: `${freeDeliveryProgress}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Cart Items List + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => {
            const product = item.product;
            const primaryImage = product.images?.[0]?.url;
            const maxStock = item.variant ? item.variant.stock : product.stock;

            // Find any validation issue for this item
            const itemIssue = validationResult?.issues?.find(
              (iss) =>
                iss.productId === item.productId &&
                (iss.variantSku || undefined) === (item.variantSku || undefined)
            );

            const isItemOutOfStock = itemIssue?.type === 'out_of_stock' || itemIssue?.type === 'unavailable' || maxStock <= 0;
            const isItemInsufficientStock = itemIssue?.type === 'insufficient_stock' || item.quantity > maxStock;

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border transition-all ${
                  isItemOutOfStock
                    ? 'border-rose-300 bg-rose-50/50'
                    : isItemInsufficientStock
                    ? 'border-amber-300 bg-amber-50/30'
                    : 'border-slate-200 bg-white shadow-xs'
                }`}
              >
                {/* Product Thumbnail */}
                <Link
                  to={`/products/${product.slug}`}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white border border-slate-200 p-2 shrink-0 flex items-center justify-center overflow-hidden"
                >
                  {primaryImage ? (
                    <img
                      src={primaryImage}
                      alt={product.name}
                      className="max-h-full max-w-full w-auto h-auto object-contain mix-blend-multiply select-none"
                    />
                  ) : (
                    <ShoppingBag className="w-6 h-6 text-slate-300" />
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                    {product.brand}
                  </div>
                  <Link
                    to={`/products/${product.slug}`}
                    className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-emerald-700 transition-colors line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                    {item.variant ? item.variant.name : product.weight || product.unit}
                  </span>

                  {/* Stock Warning Badges */}
                  {isItemOutOfStock && (
                    <span className="inline-block mt-1 text-[10px] font-bold text-rose-700 bg-rose-100 border border-rose-200 px-1.5 py-0.5 rounded">
                      Out of Stock — Please remove
                    </span>
                  )}
                  {!isItemOutOfStock && isItemInsufficientStock && (
                    <span className="inline-block mt-1 text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded">
                      Only {itemIssue?.availableStock ?? maxStock} available in stock
                    </span>
                  )}

                  {/* Unit price */}
                  <div className="flex items-baseline gap-1.5 mt-1 text-xs">
                    <span className="font-bold text-slate-900">{formatCurrency(item.price)}</span>
                    {item.mrp > item.price && (
                      <span className="text-[10px] text-slate-400 line-through">
                        {formatCurrency(item.mrp)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {/* Stepper */}
                  <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 h-8">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-full flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-l-lg"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center text-xs font-bold text-slate-900 select-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= maxStock || isItemOutOfStock}
                      className="w-7 h-full flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-r-lg disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-black text-slate-900 block">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-slate-400 hover:text-rose-600 text-xs p-1 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Card */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Bill Details
            </h2>

            {discount > 0 && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Yay! You saved {formatCurrency(discount)} on this order!</span>
              </div>
            )}

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Items Total (MRP)</span>
                <span>{formatCurrency(mrpTotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount Savings</span>
                  <span>- {formatCurrency(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-600 items-center">
                <span className="flex items-center gap-1">
                  Delivery Charge
                  <Clock className="w-3 h-3 text-slate-400" />
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
                <span className="text-base font-bold text-slate-900">MegaMart Cart Total</span>
                <span className="text-xl font-black text-slate-950">{formatCurrency(total)}</span>
              </div>
            </div>

            <Button
              size="lg"
              variant="supermarket"
              disabled={Boolean(hasBlockingIssues) || isValidating}
              onClick={() => navigate('/checkout')}
              className="w-full text-sm font-bold shadow-md shadow-emerald-700/20 disabled:opacity-50"
            >
              {isValidating
                ? 'Validating Basket...'
                : hasBlockingIssues
                ? 'Resolve Stock Issues'
                : 'Proceed to Checkout'}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>

          {/* Simple Price Comparison Section */}
          <PriceComparison megaMartTotal={total} />
        </div>
      </div>

      {/* Sticky Mobile Checkout Bar */}
      <div className="fixed lg:hidden bottom-0 left-0 right-0 p-3 bg-white border-t border-slate-200 shadow-lg z-40 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-500 font-medium block">MegaMart Cart Total</span>
          <span className="text-base font-black text-slate-900">{formatCurrency(total)}</span>
        </div>
        <Button
          size="default"
          variant="supermarket"
          disabled={Boolean(hasBlockingIssues) || isValidating}
          onClick={() => navigate('/checkout')}
          className="font-bold text-xs px-5 shadow-xs"
        >
          Proceed to Checkout <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
};
