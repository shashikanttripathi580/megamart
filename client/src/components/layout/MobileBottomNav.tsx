import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutGrid, Search, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export const MobileBottomNav: React.FC = () => {
  const { itemCount } = useCart();

  const navItems = [
    { label: 'Home', to: '/', icon: Home },
    { label: 'Categories', to: '/products', icon: LayoutGrid },
    { label: 'Search', to: '/search', icon: Search },
    { label: 'Cart', to: '/cart', icon: ShoppingBag, badge: itemCount },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.05)]"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 8px), 8px)' }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 relative ${
                  isActive
                    ? 'text-emerald-600 font-semibold scale-105'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2.5 bg-emerald-600 text-white text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center animate-pulse shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
