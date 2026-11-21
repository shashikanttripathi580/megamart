import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5 flex flex-col justify-between animate-pulse">
      <div>
        <div className="h-44 w-full bg-slate-100 rounded-lg mb-3" />
        <div className="flex justify-between items-center mb-2">
          <div className="h-3 w-16 bg-slate-200 rounded" />
          <div className="h-3 w-10 bg-slate-100 rounded" />
        </div>
        <div className="h-4 w-full bg-slate-200 rounded mb-1" />
        <div className="h-4 w-3/4 bg-slate-200 rounded" />
      </div>
      <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
        <div>
          <div className="h-5 w-16 bg-slate-200 rounded mb-1" />
          <div className="h-3 w-12 bg-slate-100 rounded" />
        </div>
        <div className="h-8 w-16 bg-slate-200 rounded-md" />
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
