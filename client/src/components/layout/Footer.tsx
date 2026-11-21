import React from 'react';
import { Link } from 'react-router-dom';
import { MegaMartLogo } from '@/components/common/MegaMartLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1c1917] text-slate-400 mt-16 border-t border-[#2d2825]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center shrink-0 hover:opacity-95 transition-opacity">
            <MegaMartLogo size="md" theme="dark" />
          </Link>

          <div className="flex items-center gap-6 text-xs font-medium text-slate-300">
            <Link to="/products" className="hover:text-white transition-colors">
              Products
            </Link>
            <Link to="/cart" className="hover:text-white transition-colors">
              Cart
            </Link>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} MegaMart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
