import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ChevronRight, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Percent, 
  Check, 
  Package,
  Truck,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { fetchProductBySlug } from '@/api/products';
import { useCart } from '@/hooks/useCart';
import { ProductVariant } from '@/types/store';
import { formatCurrency } from '@/lib/utils';
import { getProductImageUrl, handleImageErrorFallback } from '@/lib/imageUtils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addItem, getItemQuantity } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [imageError, setImageError] = useState<boolean>(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const { 
    data: product, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['product-detail', slug],
    queryFn: () => fetchProductBySlug(slug!),
    enabled: Boolean(slug),
  });

  // Default to first variant on load if product has variants
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(undefined);
    }
    setActiveImageIndex(0);
    setQuantity(1);
    setImageError(false);
  }, [product]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 space-y-8 animate-pulse">
        <div className="h-4 w-48 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="h-96 bg-slate-100 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-4 w-20 bg-slate-200 rounded" />
            <div className="h-8 w-3/4 bg-slate-200 rounded" />
            <div className="h-6 w-32 bg-slate-200 rounded" />
            <div className="h-24 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          icon="error"
          title="Product Not Found"
          description="The grocery product you requested does not exist or has been removed from our catalog."
          actionLabel="Browse Supermarket"
          actionHref="/products"
        />
      </div>
    );
  }

  const effectivePrice = selectedVariant ? selectedVariant.sellingPrice : product.sellingPrice;
  const effectiveMrp = selectedVariant ? selectedVariant.mrp : product.mrp;
  const effectiveStock = selectedVariant ? selectedVariant.stock : product.stock;
  const effectiveSku = selectedVariant ? selectedVariant.sku : product.sku;
  const savings = Math.max(0, effectiveMrp - effectivePrice);
  const discountPercent = effectiveMrp > effectivePrice
    ? Math.round((savings / effectiveMrp) * 100)
    : 0;

  const isOutOfStock = effectiveStock <= 0;
  const isLowStock = !isOutOfStock && effectiveStock <= (product.lowStockThreshold || 5);
  const existingCartQty = getItemQuantity(product._id, selectedVariant?.sku);

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

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ url: '', alt: product.name, isDefault: true }];

  const currentDisplayImage = images[activeImageIndex]?.url || images[0]?.url;

  const handleAddToCart = () => {
    const res = addItem(product, selectedVariant, quantity);
    if (res.success) {
      setFeedbackNotice(`Added ${quantity} item(s) to your cart!`);
      setTimeout(() => setFeedbackNotice(null), 3000);
    } else if (res.message) {
      setFeedbackNotice(res.message);
      setTimeout(() => setFeedbackNotice(null), 3000);
    }
  };

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(1);
    setImageError(false);
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-6 sm:space-y-8 pb-28 md:pb-8">
      {/* Breadcrumb Bar */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto no-scrollbar">
        <Link to="/" className="hover:text-emerald-700 transition-colors shrink-0">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <Link to="/products" className="hover:text-emerald-700 transition-colors shrink-0">Aisles</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        {typeof product.category === 'object' && product.category && (
          <>
            <Link
              to={`/category/${product.category.slug}`}
              className="hover:text-emerald-700 transition-colors shrink-0"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </>
        )}
        <span className="font-semibold text-slate-800 truncate">{product.name}</span>
      </nav>

      {/* Main Product Presentation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white p-5 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
        {/* Left Col: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-2xl bg-white border border-slate-200/90 flex items-center justify-center p-6 sm:p-8 overflow-hidden">
            {currentDisplayImage && !imageError ? (
              <img
                src={getProductImageUrl(currentDisplayImage)}
                alt={product.name}
                onError={(e) => handleImageErrorFallback(e, currentDisplayImage, () => setImageError(true))}
                className="max-h-full max-w-full w-auto h-auto object-contain select-none transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-300">
                <Package className="w-16 h-16 stroke-[1.2]" />
                <span className="text-xs text-slate-400 mt-2 font-medium">MegaMart</span>
              </div>
            )}

            {/* Discount Badge */}
            {discountPercent > 0 && (
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-md bg-emerald-600 text-white shadow-sm">
                  <Percent className="w-3 h-3" /> {discountPercent}% OFF
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setImageError(false);
                  }}
                  className={`w-16 h-16 rounded-xl border-2 p-1.5 bg-white flex items-center justify-center shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={getProductImageUrl(img.url)}
                    alt={`${product.name} ${idx + 1}`}
                    onError={(e) => handleImageErrorFallback(e, img.url)}
                    className="max-h-full max-w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Details & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
                {product.brand}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                SKU: {effectiveSku}
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              {/* Veg Indicator */}
              {isFoodItem && (
                <div className="w-4 h-4 rounded-xs border border-emerald-600 bg-white p-0.5 flex items-center justify-center shrink-0 mt-1 shadow-2xs" title="100% Vegetarian">
                  <div className="w-2 h-2 rounded-full bg-emerald-600" />
                </div>
              )}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-snug">
                {product.name}
              </h1>
            </div>

            {product.shortDescription && (
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {product.shortDescription}
              </p>
            )}
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-950">
                {formatCurrency(effectivePrice)}
              </span>
              {effectiveMrp > effectivePrice && (
                <span className="text-sm sm:text-base text-slate-400 line-through">
                  MRP: {formatCurrency(effectiveMrp)}
                </span>
              )}
            </div>
            {savings > 0 && (
              <span className="text-xs font-extrabold text-emerald-600 block">
                You Save {formatCurrency(savings)} ({discountPercent}% OFF)
              </span>
            )}
            <span className="text-[11px] text-slate-400 block pt-0.5">
              Inclusive of all taxes
            </span>
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Select Pack Size / Quantity:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.sku === v.sku;
                  return (
                    <button
                      key={v.sku}
                      onClick={() => handleVariantChange(v)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all text-left flex flex-col ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span>{v.name}</span>
                      <span className="text-[11px] font-black text-slate-900 mt-0.5">
                        {formatCurrency(v.sellingPrice)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock Status Indicator */}
          <div className="flex items-center gap-2">
            {isOutOfStock ? (
              <Badge variant="destructive" className="text-xs font-bold px-2.5 py-1">
                Out of Stock
              </Badge>
            ) : isLowStock ? (
              <Badge variant="discount" className="text-xs font-bold px-2.5 py-1">
                Limited Stock: Only {effectiveStock} units left
              </Badge>
            ) : (
              <Badge variant="success" className="text-xs font-bold px-2.5 py-1 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock
              </Badge>
            )}
          </div>

          {/* Add to Cart Actions */}
          <div className="space-y-3 pt-2">
            {feedbackNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{feedbackNotice}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 h-11 px-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="w-8 h-full flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-slate-900 select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(effectiveStock, q + 1))}
                  disabled={quantity >= effectiveStock || isOutOfStock}
                  className="w-8 h-full flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add Button */}
              <Button
                size="lg"
                variant="supermarket"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex-1 h-11 text-sm sm:text-base font-bold gap-2 shadow-emerald-700/20"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{isOutOfStock ? 'Out of Stock' : `Add to Cart • ${formatCurrency(effectivePrice * quantity)}`}</span>
              </Button>
            </div>

            {existingCartQty > 0 && (
              <p className="text-xs text-slate-500 font-medium">
                You already have <span className="font-bold text-emerald-700">{existingCartQty}</span> of this item in your{' '}
                <Link to="/cart" className="underline font-bold hover:text-emerald-800">cart</Link>.
              </p>
            )}

            {/* JioMart Supermarket Delivery & Trust Box */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3 text-xs">
              <div className="flex items-center gap-3 text-slate-700 font-medium">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Standard Delivery: <strong>24 - 48 Hours</strong> (FREE above ₹499)</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Genuine Studio Fresh Guarantee</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 font-medium">
                <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Easy replacement within 7 days if defective or damaged</span>
              </div>
            </div>
          </div>

          {/* Specifications Table */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Product Details
              </h3>
              <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                {product.specifications.map((spec, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-2.5 ${
                      i % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'
                    }`}
                  >
                    <span className="font-medium text-slate-500">{spec.key}</span>
                    <span className="font-bold text-slate-800">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Description */}
          {product.description && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Description
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Mobile Add to Cart Bar */}
      <div 
        className="fixed md:hidden bottom-0 left-0 right-0 px-4 py-3 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 flex items-center justify-between gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 12px), 12px)' }}
      >
        <div className="min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black text-slate-900">
              {formatCurrency(effectivePrice * quantity)}
            </span>
            {effectiveMrp > effectivePrice && (
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(effectiveMrp * quantity)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 font-medium truncate block">
            {selectedVariant ? selectedVariant.name : product.weight || product.unit}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Stepper on mobile bar */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 h-9">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || isOutOfStock}
              className="w-7 h-full flex items-center justify-center text-slate-600 active:bg-slate-200 rounded-l-lg disabled:opacity-30 touch-manipulation"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-7 text-center text-xs font-black select-none text-slate-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(effectiveStock, q + 1))}
              disabled={quantity >= effectiveStock || isOutOfStock}
              className="w-7 h-full flex items-center justify-center text-slate-600 active:bg-slate-200 rounded-r-lg disabled:opacity-30 touch-manipulation"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <Button
            size="default"
            variant="supermarket"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="h-9 px-4 text-xs font-bold gap-1.5 shadow-xs touch-manipulation disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
