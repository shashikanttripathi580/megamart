import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Filter, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal,
  RotateCcw,
  Flame
} from 'lucide-react';
import { fetchProducts } from '@/api/products';
import { fetchCategories } from '@/api/categories';
import { ProductCard } from '@/components/common/ProductCard';
import { ProductGridSkeleton } from '@/components/common/ProductSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const COMMON_BRANDS = [
  'Aashirvaad',
  'Fortune',
  'Tata Sampann',
  'India Gate',
  'Amul',
  'Britannia',
  'Parle',
  'Haldiram',
  'Coca-Cola',
  'Head & Shoulders',
  'Clinic Plus',
  'Dettol',
  'Dove',
  'Colgate',
  'Surf Excel',
  'Tata Salt',
  'Maggi',
];

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Read URL query parameters
  const page = parseInt(searchParams.get('page') || '1', 10);
  const categoryParam = searchParams.get('category') || '';
  const brandParam = searchParams.get('brand') || '';
  const searchParam = searchParams.get('search') || '';
  const isFeaturedParam = searchParams.get('isFeatured') === 'true';
  const sortByParam = (searchParams.get('sortBy') as any) || 'createdAt';
  const sortOrderParam = (searchParams.get('sortOrder') as any) || 'desc';

  // Fetch categories for sidebar & top quick pill bar
  const { data: categories = [] } = useQuery({
    queryKey: ['filter-categories'],
    queryFn: () => fetchCategories({ tree: true }),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch filtered products
  const { 
    data: productsData, 
    isLoading, 
    isError,
    refetch 
  } = useQuery({
    queryKey: ['products-list', page, categoryParam, brandParam, searchParam, isFeaturedParam, sortByParam, sortOrderParam],
    queryFn: () =>
      fetchProducts({
        page,
        limit: 12,
        category: categoryParam || undefined,
        brand: brandParam || undefined,
        search: searchParam || undefined,
        isFeatured: isFeaturedParam || undefined,
        sortBy: sortByParam,
        sortOrder: sortOrderParam,
      }),
  });

  const updateFilters = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, val);
      }
    });
    // Reset to page 1 on filter change
    if (!('page' in updates)) {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const handleClearAll = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = categoryParam || brandParam || searchParam || isFeaturedParam;

  // Find active category object if selected
  const activeCategoryObj = categories.find((c) => c.slug === categoryParam);

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 space-y-4">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto no-scrollbar pb-1">
        <Link to="/" className="hover:text-emerald-700 transition-colors shrink-0">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <Link 
          to="/products" 
          onClick={() => handleClearAll()} 
          className={`shrink-0 hover:text-emerald-700 transition-colors ${!categoryParam ? 'font-bold text-slate-900' : ''}`}
        >
          All Aisles
        </Link>
        {activeCategoryObj && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-bold text-slate-900 truncate shrink-0">{activeCategoryObj.name}</span>
          </>
        )}
      </nav>

      {/* 2. JioMart-inspired Horizontal Category Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 border-b border-slate-100">
        <button
          onClick={() => updateFilters({ category: null })}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            !categoryParam
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Items
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => updateFilters({ category: cat.slug })}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              categoryParam === cat.slug
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* 3. Header Bar & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {searchParam
                ? `Search: "${searchParam}"`
                : activeCategoryObj
                ? activeCategoryObj.name
                : 'Low Price Supermarket Catalog'}
            </h1>
            {isFeaturedParam && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded bg-amber-400 text-slate-950 uppercase">
                <Flame className="w-3 h-3 fill-current text-rose-700" /> Deals
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {productsData?.meta?.totalDocs ?? 0} grocery items at lowest store prices
          </p>
        </div>

        {/* Quick Filter Badges + Sort & Mobile Filter Toggle */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Quick Deals Toggle */}
          <button
            onClick={() => updateFilters({ isFeatured: isFeaturedParam ? null : 'true' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isFeaturedParam
                ? 'bg-amber-400 border-amber-400 text-slate-950 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span>Low Price Deals</span>
          </button>

          {/* Mobile Filter Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-1.5 text-xs font-semibold h-9"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters {hasActiveFilters ? '•' : ''}</span>
          </Button>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={`${sortByParam}-${sortOrderParam}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                updateFilters({ sortBy: sb, sortOrder: so });
              }}
              className="h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="sellingPrice-asc">Price: Low to High</option>
              <option value="sellingPrice-desc">Price: High to Low</option>
              <option value="discountPercentage-desc">Biggest Discount</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <span className="text-xs text-slate-400 font-medium">Active:</span>

          {categoryParam && (
            <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1 text-xs">
              <span>Category: {categoryParam}</span>
              <button
                onClick={() => updateFilters({ category: null })}
                className="hover:text-red-500 p-0.5"
                aria-label="Remove category filter"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {brandParam && (
            <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1 text-xs">
              <span>Brand: {brandParam}</span>
              <button
                onClick={() => updateFilters({ brand: null })}
                className="hover:text-red-500 p-0.5"
                aria-label="Remove brand filter"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {searchParam && (
            <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1 text-xs">
              <span>"{searchParam}"</span>
              <button
                onClick={() => updateFilters({ search: null })}
                className="hover:text-red-500 p-0.5"
                aria-label="Remove search filter"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {isFeaturedParam && (
            <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1 text-xs">
              <span>Featured Only</span>
              <button
                onClick={() => updateFilters({ isFeatured: null })}
                className="hover:text-red-500 p-0.5"
                aria-label="Remove featured filter"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          <button
            onClick={handleClearAll}
            className="text-xs font-semibold text-emerald-700 hover:underline ml-2 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Clear All
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 pt-6">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <span>Filter Products</span>
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={handleClearAll}
                  className="text-xs text-slate-500 hover:text-emerald-700"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Categories Filter */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Aisles & Categories</h4>
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                <div
                  onClick={() => updateFilters({ category: null })}
                  className={`text-xs p-2 rounded-lg cursor-pointer transition-colors ${
                    !categoryParam ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Categories
                </div>
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    onClick={() => updateFilters({ category: cat.slug })}
                    className={`text-xs p-2 rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                      categoryParam === cat.slug
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({cat.subcategories.length})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Brands Filter */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Popular Brands</h4>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <div
                  onClick={() => updateFilters({ brand: null })}
                  className={`text-xs p-2 rounded-lg cursor-pointer transition-colors ${
                    !brandParam ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Brands
                </div>
                {COMMON_BRANDS.map((b) => (
                  <div
                    key={b}
                    onClick={() => updateFilters({ brand: b })}
                    className={`text-xs p-2 rounded-lg cursor-pointer transition-colors ${
                      brandParam.toLowerCase() === b.toLowerCase()
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {b}
                  </div>
                ))}
              </div>
            </div>

            {/* Fast Offers Filter */}
            <div className="pt-3 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={isFeaturedParam}
                  onChange={(e) => updateFilters({ isFeatured: e.target.checked ? 'true' : null })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Featured / Deals Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3 space-y-6">
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : isError ? (
            <EmptyState
              icon="error"
              title="Unable to load products"
              description="There was an error communicating with the MegaMart database. Please ensure the backend is running."
              actionLabel="Try Again"
              onActionClick={() => refetch()}
            />
          ) : productsData?.data && productsData.data.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
                {productsData.data.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {productsData.meta && productsData.meta.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-8">
                  <div className="text-xs text-slate-500">
                    Page <span className="font-bold text-slate-800">{productsData.meta.page}</span> of{' '}
                    <span className="font-bold text-slate-800">{productsData.meta.totalPages}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!productsData.meta.hasPrevPage}
                      onClick={() => updateFilters({ page: (page - 1).toString() })}
                      className="text-xs h-8 gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Previous
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!productsData.meta.hasNextPage}
                      onClick={() => updateFilters({ page: (page + 1).toString() })}
                      className="text-xs h-8 gap-1"
                    >
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon="search"
              title="No products matched your criteria"
              description="Try selecting another category or clear your active filters to explore more items."
              actionLabel="Reset All Filters"
              onActionClick={handleClearAll}
            />
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer / Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto w-4/5 max-w-sm h-full bg-white shadow-xl flex flex-col justify-between p-5 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b">
                <h3 className="font-bold text-base text-slate-900">Filter Products</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1 text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Categories */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase">Categories</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  <div
                    onClick={() => {
                      updateFilters({ category: null });
                      setMobileFiltersOpen(false);
                    }}
                    className={`text-xs p-2 rounded-lg ${!categoryParam ? 'bg-emerald-50 text-emerald-800 font-bold' : ''}`}
                  >
                    All Categories
                  </div>
                  {categories.map((c) => (
                    <div
                      key={c._id}
                      onClick={() => {
                        updateFilters({ category: c.slug });
                        setMobileFiltersOpen(false);
                      }}
                      className={`text-xs p-2 rounded-lg ${categoryParam === c.slug ? 'bg-emerald-50 text-emerald-800 font-bold' : ''}`}
                    >
                      {c.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Brands */}
              <div className="space-y-2 pt-3 border-t">
                <h4 className="text-xs font-bold text-slate-700 uppercase">Brands</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  <div
                    onClick={() => {
                      updateFilters({ brand: null });
                      setMobileFiltersOpen(false);
                    }}
                    className={`text-xs p-2 rounded-lg ${!brandParam ? 'bg-emerald-50 text-emerald-800 font-bold' : ''}`}
                  >
                    All Brands
                  </div>
                  {COMMON_BRANDS.map((b) => (
                    <div
                      key={b}
                      onClick={() => {
                        updateFilters({ brand: b });
                        setMobileFiltersOpen(false);
                      }}
                      className={`text-xs p-2 rounded-lg ${brandParam.toLowerCase() === b.toLowerCase() ? 'bg-emerald-50 text-emerald-800 font-bold' : ''}`}
                    >
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex gap-2">
              <Button
                variant="outline"
                className="w-1/2 text-xs"
                onClick={() => {
                  handleClearAll();
                  setMobileFiltersOpen(false);
                }}
              >
                Clear All
              </Button>
              <Button
                className="w-1/2 bg-emerald-600 text-xs"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
