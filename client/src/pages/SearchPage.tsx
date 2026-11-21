import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, X, Sparkles } from 'lucide-react';
import { fetchProducts } from '@/api/products';
import { ProductCard } from '@/components/common/ProductCard';
import { ProductGridSkeleton } from '@/components/common/ProductSkeleton';
import { EmptyState } from '@/components/common/EmptyState';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(queryParam);

  // Sync input with URL param changes
  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  // Debounced search sync to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim() !== queryParam) {
        const newParams = new URLSearchParams(searchParams);
        if (searchTerm.trim()) {
          newParams.set('q', searchTerm.trim());
        } else {
          newParams.delete('q');
        }
        setSearchParams(newParams);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, queryParam, searchParams, setSearchParams]);

  const {
    data: productsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['search-results', queryParam],
    queryFn: () => fetchProducts({ search: queryParam, limit: 20 }),
    enabled: queryParam.trim().length > 0,
  });

  const handleClear = () => {
    setSearchTerm('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('q');
    setSearchParams(newParams);
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-5 sm:space-y-6 pb-20 md:pb-8">
      {/* Search Input Bar */}
      <div className="max-w-2xl mx-auto text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Search Products
        </h1>

        <div className="relative pt-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full h-12 pl-12 pr-10 rounded-2xl border-2 border-emerald-500/40 bg-white text-sm focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
              aria-label="Clear search text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs">
          <span className="text-slate-400 font-medium">Popular:</span>
          {['Atta', 'Sunflower Oil', 'Toor Dal', 'Butter', 'Shampoo', 'Surf Excel'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-medium transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="pt-6">
        {queryParam ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs sm:text-sm text-slate-600">
              <div>
                Showing results for{' '}
                <span className="font-bold text-slate-900">"{queryParam}"</span>
              </div>
              <div className="font-semibold text-emerald-700">
                {productsData?.meta?.totalDocs ?? 0} items found
              </div>
            </div>

            {isLoading ? (
              <ProductGridSkeleton count={8} />
            ) : isError ? (
              <EmptyState
                icon="error"
                title="Search request failed"
                description="Unable to retrieve results from the database. Please try again."
                actionLabel="Retry"
                onActionClick={() => refetch()}
              />
            ) : productsData?.data && productsData.data.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4.5">
                {productsData.data.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="search"
                title={`No products found for "${queryParam}"`}
                description="Check for spelling mistakes, try more general terms, or explore our supermarket aisles."
                actionLabel="Browse All Aisles"
                actionHref="/products"
              />
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-sm">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
            Type a product name or category above to begin searching.
          </div>
        )}
      </div>
    </div>
  );
};
