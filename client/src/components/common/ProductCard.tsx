import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Package, AlertCircle, Zap } from 'lucide-react';
import { Product, ProductVariant } from '@/types/store';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/utils';
import { getProductImageUrl, handleImageErrorFallback } from '@/lib/imageUtils';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  selectedVariant?: ProductVariant;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  selectedVariant,
  className = '',
}) => {
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const [imageError, setImageError] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeVariant = selectedVariant || (product.variants && product.variants.length > 0 ? product.variants[0] : undefined);
  const effectivePrice = activeVariant ? activeVariant.sellingPrice : product.sellingPrice;
  const effectiveMrp = activeVariant ? activeVariant.mrp : product.mrp;
  const effectiveStock = activeVariant ? activeVariant.stock : product.stock;
  const discountPercent = effectiveMrp > effectivePrice
    ? Math.round(((effectiveMrp - effectivePrice) / effectiveMrp) * 100)
    : 0;
  const savingsAmount = effectiveMrp > effectivePrice ? effectiveMrp - effectivePrice : 0;

  const currentQty = getItemQuantity(product._id, activeVariant?.sku);
  const isOutOfStock = effectiveStock <= 0;
  const isLowStock = !isOutOfStock && effectiveStock <= (product.lowStockThreshold || 5);

  const primaryImage = product.images?.find((img) => img.isDefault)?.url || product.images?.[0]?.url;

  // Determine if it's a food item for Indian grocery veg mark
  const isFoodItem = [
    'groceries-staples', 
    'dairy-bread-eggs', 
    'snacks-biscuits', 
    'beverages'
  ].some(c => 
    typeof product.category === 'object' && product.category 
      ? product.category.slug === c 
      : false
  );

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = addItem(product, activeVariant, 1);
    if (!res.success && res.message) {
      setToastMessage(res.message);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const itemId = `${product._id}-${activeVariant?.sku || 'default'}`;
    const res = updateQuantity(itemId, currentQty + 1);
    if (!res.success && res.message) {
      setToastMessage(res.message);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const itemId = `${product._id}-${activeVariant?.sku || 'default'}`;
    updateQuantity(itemId, currentQty - 1);
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-400 hover:shadow-lg transition-all duration-200 overflow-hidden ${className}`}
    >
      {/* 1. JioMart-inspired Badges Bar */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-start justify-between gap-1 pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {discountPercent > 0 && (
            <span className="inline-flex items-center text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-600 text-white shadow-xs tracking-tight">
              {discountPercent}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500 text-white shadow-xs">
              <Zap className="w-2.5 h-2.5 fill-current" /> LOW PRICE
            </span>
          )}
        </div>

        {/* Veg Symbol for Food Items */}
        {isFoodItem && (
          <div className="w-4 h-4 rounded-xs border border-emerald-600 bg-white p-0.5 flex items-center justify-center shrink-0 shadow-2xs" title="100% Vegetarian">
            <div className="w-2 h-2 rounded-full bg-emerald-600" />
          </div>
        )}
      </div>

      {/* Stock warning pill */}
      {isLowStock && (
        <div className="absolute bottom-1 right-2.5 z-10">
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
            Only {effectiveStock} left
          </span>
        </div>
      )}

      {/* 2. Studio Packshot Image Link */}
      <Link
        to={`/products/${product.slug}`}
        className="relative block w-full aspect-square bg-white border-b border-slate-100 p-2.5 sm:p-4 overflow-hidden"
      >
        <div className="h-full w-full flex items-center justify-center">
          {primaryImage && !imageError ? (
            <img
              src={getProductImageUrl(primaryImage)}
              alt={product.name}
              onError={(e) => handleImageErrorFallback(e, primaryImage, () => setImageError(true))}
              className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105 select-none"
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center text-slate-300 bg-slate-50/60 rounded-lg">
              <Package className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.2]" />
              <span className="text-[10px] text-slate-400 mt-1 font-medium">MegaMart</span>
            </div>
          )}
        </div>
      </Link>

      {/* 3. Product Content Details */}
      <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Weight Pill */}
          <div className="flex items-center justify-between gap-1 text-[11px] mb-1">
            <span className="font-extrabold text-emerald-800 uppercase tracking-wider truncate text-[9px] sm:text-[10px]">
              {product.brand}
            </span>
            <span className="text-slate-600 font-semibold shrink-0 bg-slate-100 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] max-w-[80px] sm:max-w-none truncate">
              {activeVariant ? activeVariant.name : product.weight || product.unit}
            </span>
          </div>

          {/* Title */}
          <Link
            to={`/products/${product.slug}`}
            className="block text-xs sm:text-sm font-semibold text-slate-900 hover:text-emerald-700 transition-colors line-clamp-2 leading-tight sm:leading-snug min-h-[2rem] sm:min-h-[2.4rem]"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>

        {/* 4. JioMart Pricing & Add to Cart Stepper */}
        <div className="pt-2 sm:pt-3 border-t border-slate-100 mt-2">
          {/* Toast Warning */}
          {toastMessage && (
            <div className="mb-1.5 p-1 px-1.5 rounded bg-amber-50 text-amber-800 text-[10px] flex items-center gap-1 border border-amber-200 animate-fadeIn">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span className="truncate">{toastMessage}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1.5 sm:gap-2">
            {/* Price Stack */}
            <div className="min-w-0">
              <div className="flex items-baseline gap-1 flex-wrap">
                <span className="text-sm sm:text-base lg:text-lg font-black text-slate-950">
                  {formatCurrency(effectivePrice)}
                </span>
                {effectiveMrp > effectivePrice && (
                  <span className="text-[10px] sm:text-[11px] text-slate-400 line-through">
                    {formatCurrency(effectiveMrp)}
                  </span>
                )}
              </div>
              {savingsAmount > 0 && (
                <div className="mt-0.5">
                  <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block leading-none truncate max-w-full">
                    Save {formatCurrency(savingsAmount)}
                  </span>
                </div>
              )}
            </div>

            {/* Add / Stepper Button */}
            <div className="shrink-0 w-full sm:w-auto">
              {isOutOfStock ? (
                <Button
                  size="sm"
                  variant="outline"
                  disabled
                  className="w-full sm:w-auto h-7 sm:h-8 px-2 text-[10px] sm:text-[11px] text-slate-400 border-slate-200 bg-slate-50 rounded-lg"
                >
                  Sold Out
                </Button>
              ) : currentQty > 0 ? (
                <div className="flex items-center justify-between sm:justify-center h-7 sm:h-8 w-full sm:w-auto rounded-lg border-2 border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs">
                  <button
                    onClick={handleDecrement}
                    className="w-8 sm:w-7 h-full flex items-center justify-center hover:bg-emerald-200/60 active:bg-emerald-300 transition-colors rounded-l-md font-bold touch-manipulation"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5 text-emerald-800" />
                  </button>
                  <span className="px-2 text-center text-xs font-black select-none text-emerald-900">
                    {currentQty}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={currentQty >= effectiveStock}
                    className="w-8 sm:w-7 h-full flex items-center justify-center hover:bg-emerald-200/60 active:bg-emerald-300 transition-colors rounded-r-md disabled:opacity-40 font-bold touch-manipulation"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-800" />
                  </button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="supermarket"
                  onClick={handleAdd}
                  className="w-full sm:w-auto h-7 sm:h-8 px-2.5 sm:px-3.5 text-xs font-bold gap-1 rounded-lg shadow-xs hover:shadow transition-all touch-manipulation flex items-center justify-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
