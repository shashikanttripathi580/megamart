import React from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import { fetchCategoryBySlug } from '@/api/categories';
import { fetchProducts } from '@/api/products';
import { ProductCard } from '@/components/common/ProductCard';
import { ProductGridSkeleton } from '@/components/common/ProductSkeleton';
import { EmptyState } from '@/components/common/EmptyState';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const subcategory = searchParams.get('subcategory') || '';
  const sortBy = (searchParams.get('sortBy') as any) || 'createdAt';
  const sortOrder = (searchParams.get('sortOrder') as any) || 'desc';

  // 1. Fetch category metadata
  const { 
    data: category, 
    isLoading: categoryLoading, 
    isError: categoryError 
  } = useQuery({
    queryKey: ['category-details', slug],
    queryFn: () => fetchCategoryBySlug(slug!),
    enabled: Boolean(slug),
  });

  // 2. Fetch products in this category/subcategory
  const { 
    data: productsData, 
    isLoading: productsLoading, 
    isError: productsError,
    refetch 
  } = useQuery({
    queryKey: ['category-products', slug, subcategory, page, sortBy, sortOrder],
    queryFn: () =>
      fetchProducts({
        category: slug,
        subcategory: subcategory || undefined,
        page,
        limit: 12,
        sortBy,
        sortOrder,
      }),
    enabled: Boolean(slug),
  });

  const handleSubcategorySelect = (subSlug: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (subSlug) {
      newParams.set('subcategory', subSlug);
    } else {
      newParams.delete('subcategory');
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sb, so] = e.target.value.split('-');
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sortBy', sb);
    newParams.set('sortOrder', so);
    setSearchParams(newParams);
  };

  if (categoryLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
        <ProductGridSkeleton count={8} />
      </div>
    );
  }

  if (categoryError || !category) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          icon="error"
          title="Category Not Found"
          description="The supermarket aisle or section you are looking for does not exist or has been relocated."
          actionLabel="Browse All Aisles"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-5 sm:space-y-6 pb-20 md:pb-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link to="/" className="hover:text-emerald-700 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/products" className="hover:text-emerald-700 transition-colors">Categories</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-800">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
        <div className="space-y-1.5 max-w-xl z-10">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              {category.description}
            </p>
          )}
        </div>

        {category.image && (
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-white/10 p-2 shrink-0 hidden sm:flex items-center justify-center overflow-hidden border border-white/20">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Subcategories Filter Chips */}
      {category.subcategories && category.subcategories.length > 0 && (
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Sub-Sections:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleSubcategorySelect(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                !subcategory
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-300'
              }`}
            >
              All {category.name}
            </button>
            {category.subcategories.map((sub) => (
              <button
                key={sub._id}
                onClick={() => handleSubcategorySelect(sub.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  subcategory === sub.slug
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-300'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product List Header with Count & Sort */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <span className="text-xs sm:text-sm text-slate-600 font-medium">
          Showing <span className="font-bold text-slate-900">{productsData?.data?.length || 0}</span> items
        </span>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 hidden sm:inline">Sort:</span>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={handleSortChange}
            className="h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="sellingPrice-asc">Price: Low to High</option>
            <option value="sellingPrice-desc">Price: High to Low</option>
            <option value="discountPercentage-desc">Biggest Discount</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {productsLoading ? (
        <ProductGridSkeleton count={8} />
      ) : productsError ? (
        <EmptyState
          icon="error"
          title="Could not load products"
          description="Failed to load products for this aisle. Please retry."
          actionLabel="Try Again"
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
          title="No products found in this aisle"
          description="Items may be temporarily out of stock or categorized elsewhere."
          actionLabel="View All Products"
          actionHref="/products"
        />
      )}
    </div>
  );
};
