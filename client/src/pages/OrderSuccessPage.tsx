import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  CheckCircle2, 
  ShoppingBag, 
  Truck, 
  MapPin, 
  ArrowRight, 
  Calendar,
  CreditCard,
  Banknote,
  PackageCheck
} from 'lucide-react';
import { getOrderByIdentifier } from '@/api/orders';
import { formatCurrency } from '@/lib/utils';
import { getProductImageUrl, handleImageErrorFallback } from '@/lib/imageUtils';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/EmptyState';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order-confirmation', orderId],
    queryFn: () => getOrderByIdentifier(orderId!),
    enabled: Boolean(orderId),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center space-y-6 animate-pulse">
        <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto" />
        <div className="h-8 w-64 bg-slate-200 rounded mx-auto" />
        <div className="h-40 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon="error"
          title="Order Not Found"
          description="We couldn't retrieve the requested order details. Please verify your reference number."
          actionLabel="Return to Store"
          actionHref="/"
        />
      </div>
    );
  }

  const isPaid = order.payment.status === 'paid';

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-12 max-w-2xl space-y-5 sm:space-y-6 pb-20 sm:pb-12">
      {/* Celebration Header */}
      <div className="text-center space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Order Confirmed!
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Thank You, {order.customer.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Your grocery order has been received and is being prepared for express delivery.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-2">
          <span className="text-xs text-slate-500">Order Reference:</span>
          <span className="text-xs sm:text-sm font-mono font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
            {order.orderNumber}
          </span>
        </div>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Placed on: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-1 font-bold text-emerald-700 capitalize">
            <PackageCheck className="w-4 h-4" />
            <span>Status: {order.orderStatus.replace(/_/g, ' ')}</span>
          </div>
        </div>

        {/* Ordered Items Summary */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Items Ordered ({order.items.length})
          </h2>

          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 p-1 shrink-0 flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={getProductImageUrl(item.image)}
                        alt={item.productName}
                        onError={(e) => handleImageErrorFallback(e, item.image)}
                        className="max-h-full max-w-full object-contain select-none"
                      />
                    ) : (
                      <ShoppingBag className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{item.productName}</p>
                    <p className="text-[11px] text-slate-400">
                      {formatCurrency(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-slate-900 shrink-0">
                  {formatCurrency(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address Summary */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" /> Delivery Address
          </h2>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-900">{order.deliveryAddress.fullName} • {order.deliveryAddress.phone}</p>
            <p>{order.deliveryAddress.addressLine1}{order.deliveryAddress.addressLine2 ? `, ${order.deliveryAddress.addressLine2}` : ''}</p>
            {order.deliveryAddress.landmark && <p className="text-slate-500">Landmark: {order.deliveryAddress.landmark}</p>}
            <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - <span className="font-bold text-slate-800">{order.deliveryAddress.pincode}</span></p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            {order.payment.paymentMethod === 'cod' ? (
              <Banknote className="w-4 h-4 text-emerald-600" />
            ) : (
              <CreditCard className="w-4 h-4 text-emerald-600" />
            )}
            Payment Information
          </h2>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 capitalize">
                {order.payment.paymentMethod === 'cod'
                  ? 'Cash on Delivery (COD)'
                  : 'Online Payment (Mock Gateway)'}
              </p>
              {order.payment.transactionId && (
                <p className="text-[10px] font-mono text-slate-400">Ref: {order.payment.transactionId}</p>
              )}
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded capitalize ${
              isPaid
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {order.payment.status}
            </span>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>{formatCurrency(order.pricing.subtotal)}</span>
          </div>
          {order.pricing.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Savings</span>
              <span>- {formatCurrency(order.pricing.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Delivery Charge</span>
            <span>
              {order.pricing.deliveryFee === 0 ? (
                <span className="text-emerald-700 font-bold uppercase">FREE</span>
              ) : (
                formatCurrency(order.pricing.deliveryFee)
              )}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm font-bold text-slate-900">
            <span>Total Paid / Payable</span>
            <span className="text-base font-black">{formatCurrency(order.pricing.total)}</span>
          </div>
        </div>

        {/* Expected Next Step */}
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-xs text-emerald-900">
          <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
          <p>
            Estimated delivery within <span className="font-bold">25-40 minutes</span> to your doorstep.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link to="/products" className="block">
            <Button size="lg" variant="supermarket" className="w-full text-sm font-bold shadow-md shadow-emerald-700/20">
              Continue Shopping <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
