import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types/store';
import { ProductCard } from '@/components/common/ProductCard';
import { ProductCardSkeleton } from '@/components/common/ProductSkeleton';

interface ProductCarouselProps {
  products: Product[];
  isLoading?: boolean;
  skeletonCount?: number;
  emptyMessage?: string;
  className?: string;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  isLoading = false,
  skeletonCount = 5,
  emptyMessage = 'No products found',
  className = '',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll positions to update button states
  const updateScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollState, { passive: true });
      window.addEventListener('resize', updateScrollState);
      return () => {
        el.removeEventListener('scroll', updateScrollState);
        window.removeEventListener('resize', updateScrollState);
      };
    }
  }, [products, isLoading]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      // Scroll by approximately one screen width or 2-3 items
      const cardWidth = scrollRef.current.clientWidth / 5;
      const scrollDistance = direction === 'left' ? -(cardWidth * 3) : cardWidth * 3;
      scrollRef.current.scrollBy({
        left: scrollDistance,
        behavior: 'smooth',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-stretch gap-3 overflow-hidden py-1">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div
            key={i}
            className="w-[calc(50%-6px)] min-w-[155px] sm:min-w-0 sm:w-[calc(33.333%-8px)] md:w-[calc(25%-9px)] lg:w-[calc(20%-11.2px)] shrink-0"
          >
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      {/* Left Navigation Arrow Button */}
      {canScrollLeft && (
        <button
          onClick={() => handleScroll('left')}
          className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 text-slate-800 shadow-md border border-slate-200 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-all cursor-pointer select-none"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Right Navigation Arrow Button */}
      {canScrollRight && (
        <button
          onClick={() => handleScroll('right')}
          className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 text-slate-800 shadow-md border border-slate-200 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-all cursor-pointer select-none"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* 
        Horizontal Scroll Row:
        - Exactly 5 items visible on desktop screen (lg:w-[calc(20%-11.2px)] with gap-3.5)
        - 4 items on md, 3 items on sm, 2 items on mobile
      */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 sm:gap-3.5 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5"
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="w-[calc(50%-6px)] min-w-[155px] sm:min-w-0 sm:w-[calc(33.333%-8px)] md:w-[calc(25%-9px)] lg:w-[calc(20%-11.2px)] shrink-0 flex flex-col"
          >
            <ProductCard product={product} className="h-full" />
          </div>
        ))}
      </div>
    </div>
  );
};
