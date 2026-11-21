import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowRight, 
  Package, 
  Flame, 
  TrendingDown, 
  Truck, 
  ShieldCheck, 
  Scale, 
  Sparkles
} from 'lucide-react';
import { fetchCategories } from '@/api/categories';
import { fetchProducts } from '@/api/products';
import { ProductCarousel } from '@/components/common/ProductCarousel';

export const HomePage: React.FC = () => {
  // 1. Fetch dynamic categories
  const { 
    data: categories = [], 
    isLoading: categoriesLoading,
    isError: categoriesError 
  } = useQuery({
    queryKey: ['home-categories'],
    queryFn: () => fetchCategories({ tree: true }),
    staleTime: 1000 * 60 * 5,
  });

  // 2. Fetch popular/featured staples (increased limit to support 5 on-screen + horizontal scrolling)
  const { 
    data: staplesData, 
    isLoading: staplesLoading 
  } = useQuery({
    queryKey: ['home-staples-products'],
    queryFn: () => fetchProducts({ category: 'groceries-staples', limit: 12 }),
  });

  // 3. Fetch snacks & beverages
  const { 
    data: snacksData, 
    isLoading: snacksLoading 
  } = useQuery({
    queryKey: ['home-snacks-products'],
    queryFn: () => fetchProducts({ category: 'snacks-biscuits', limit: 12 }),
  });

  // 4. Fetch deals (highest discount products)
  const { 
    data: dealsData, 
    isLoading: dealsLoading 
  } = useQuery({
    queryKey: ['home-deals-products'],
    queryFn: () => fetchProducts({ sortBy: 'discountPercentage', sortOrder: 'desc', limit: 12 }),
  });

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-8 sm:space-y-10 pb-20 md:pb-16">
      {/* 1. Category Navigation Grid */}
      <section>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Shop by Category
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">Explore our complete supermarket catalog</p>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
          >
            All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 sm:h-32 rounded-xl sm:rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : categoriesError ? (
          <div className="p-4 rounded-xl bg-rose-50 text-rose-800 text-xs text-center border border-rose-200">
            Failed to load categories.
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                className="group p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-md transition-all flex flex-col items-center text-center gap-1.5 sm:gap-2.5"
              >
                <div className="w-14 h-14 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden p-1.5 sm:p-2 group-hover:scale-105 transition-transform">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                      loading="lazy"
                    />
                  ) : (
                    <Package className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-700" />
                  )}
                </div>
                <h3 className="text-[11px] sm:text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 2. Daily Staples Shelf */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-100 text-emerald-800">
                <Flame className="w-4 h-4 text-emerald-600 fill-current" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Daily Grocery Staples
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Atta, Basmati Rice, Sunflower Oil, Toor Dal & Salt
            </p>
          </div>
          <Link
            to="/products?category=groceries-staples"
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:underline flex items-center gap-1 shrink-0"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ProductCarousel
          products={staplesData?.data || []}
          isLoading={staplesLoading}
          skeletonCount={5}
          emptyMessage="No staples found. Check back soon."
        />
      </section>

        {/* 5. "Snacks, Biscuits & Cold Drinks" Shelf */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Snacks, Biscuits & Beverages</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Family Packs
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Parle-G, Good Day, Haldiram Aloo Bhujia, Coca-Cola and Maggi Noodles
              </p>
            </div>
            <Link
              to="/products?category=snacks-biscuits"
              className="text-xs sm:text-sm font-bold text-emerald-700 hover:underline flex items-center gap-1 shrink-0"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <ProductCarousel
            products={snacksData?.data || []}
            isLoading={snacksLoading}
            skeletonCount={5}
            emptyMessage="No snacks found."
          />
        </section>

        {/* 6. "Top Supermarket Deals (Highest Discounts)" Shelf */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 fill-current" />
                Top Supermarket Deals & Discounts
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Save up to 40% on personal care, laundry and household essentials
              </p>
            </div>
            <Link
              to="/products?sortBy=discountPercentage&sortOrder=desc"
              className="text-xs sm:text-sm font-bold text-emerald-700 hover:underline flex items-center gap-1 shrink-0"
            >
              All Deals <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <ProductCarousel
            products={dealsData?.data || []}
            isLoading={dealsLoading}
            skeletonCount={5}
            emptyMessage="No deals found."
          />
        </section>

        {/* 7. JioMart-inspired "Why MegaMart" Trust Pillars */}
        <section className="pt-6 border-t border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Lowest Prices Guaranteed</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Everyday value pricing directly from manufacturer partners on trusted brands.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Free & Fast Delivery</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Automatic free doorstep delivery on all orders totaling ₹499 or more.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">100% Genuine Quality</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Studio-fresh packaging, authentic barcodes, and fresh production batch dates.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Easy Guest Checkout</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Checkout in seconds with your phone number and address. Zero password hassle.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
};
