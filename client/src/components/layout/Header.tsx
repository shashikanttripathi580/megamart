import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Layers,
  MapPin,
  ChevronDown,
  Flame,
  Truck,
  ShieldCheck,
  Check,
  Server
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchCategories } from '@/api/categories';
import { useCart } from '@/hooks/useCart';
import { MegaMartLogo } from '@/components/common/MegaMartLogo';
import { ServerConfigModal } from '@/components/common/ServerConfigModal';

const POPULAR_LOCATIONS = [
  { city: 'Mumbai', pincode: '400001' },
  { city: 'Thane', pincode: '400601' },
  { city: 'Navi Mumbai', pincode: '400703' },
  { city: 'Pune', pincode: '411001' },
  { city: 'Delhi NCR', pincode: '110001' },
  { city: 'Bengaluru', pincode: '560001' },
];

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [serverConfigOpen, setServerConfigOpen] = useState(false);
  
  const [currentLocation, setCurrentLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('megamart_location');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // ignore
    }
    return POPULAR_LOCATIONS[0];
  });

  const handleLocationSelect = (loc: typeof POPULAR_LOCATIONS[0]) => {
    setCurrentLocation(loc);
    try {
      localStorage.setItem('megamart_location', JSON.stringify(loc));
      window.dispatchEvent(new Event('megamart_location_changed'));
    } catch (e) {
      // ignore
    }
    setLocationDropdownOpen(false);
  };

  const navigate = useNavigate();
  const { itemCount } = useCart();

  // Fetch categories from API
  const { data: categories = [] } = useQuery({
    queryKey: ['categories-header'],
    queryFn: () => fetchCategories({ tree: true }),
    staleTime: 1000 * 60 * 5,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs">
      {/* 1. Real Store Signboard-inspired Top Bar */}
      <div className="bg-[#1c1917] text-slate-200 text-[11px] font-medium py-1.5 px-3 sm:px-4 border-b border-[#2d2825]">
        <div className="container mx-auto flex items-center justify-between gap-2">
          {/* Location Selector */}
          <div className="relative">
            <button
              onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
              className="flex items-center gap-1 hover:text-white transition-colors text-slate-300 text-left"
              title="Select Delivery Location"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate max-w-[190px] sm:max-w-none">
                Deliver to: <strong className="text-white">{currentLocation.city} {currentLocation.pincode}</strong>
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {locationDropdownOpen && (
              <div 
                className="absolute left-0 mt-2 w-56 rounded-xl bg-white text-slate-800 shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn"
                onMouseLeave={() => setLocationDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Select Delivery Location
                </div>
                <div className="py-1">
                  {POPULAR_LOCATIONS.map((loc) => (
                    <button
                      key={loc.pincode}
                      onClick={() => handleLocationSelect(loc)}
                      className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                    >
                      <span className="font-semibold">{loc.city} ({loc.pincode})</span>
                      {currentLocation.pincode === loc.pincode && (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Top Bar Value Highlights (Red, Orange, Green matching logo) */}
          <div className="hidden md:flex items-center gap-6 text-slate-300">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-orange-400" />
              <span>FREE Delivery above ₹499</span>
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Genuine Studio Fresh Products</span>
            </span>
            <Link 
              to="/products?isFeatured=true" 
              className="flex items-center gap-1 text-red-400 hover:text-red-300 font-bold transition-colors"
            >
              <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse fill-current" />
              <span>Low Price Store (Up to 40% OFF)</span>
            </Link>
            <button
              onClick={() => setServerConfigOpen(true)}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors ml-1"
              title="Configure API Server for Android / Network"
            >
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>API Server</span>
            </button>
          </div>

          {/* Mobile Server Config Link in Top Bar */}
          <button
            onClick={() => setServerConfigOpen(true)}
            className="md:hidden flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 shrink-0"
            title="Configure API Server"
          >
            <Server className="w-3 h-3 text-emerald-400" />
            <span>Server</span>
          </button>
        </div>
      </div>

      {/* 2. Main Header Bar */}
      <div className="container mx-auto py-2 sm:py-3 px-3 sm:px-4">
        {/* Row 1: Brand Logo + Desktop Search + Cart & Drawer Menu */}
        <div className="flex items-center justify-between gap-2.5 sm:gap-6">
          {/* Authentic Real Store Brand Logo */}
          <Link to="/" className="flex items-center shrink-0 group transition-transform hover:scale-[1.02]" aria-label="MegaMart Home">
            <div className="sm:hidden">
              <MegaMartLogo size="sm" />
            </div>
            <div className="hidden sm:block">
              <MegaMartLogo size="md" />
            </div>
          </Link>

          {/* Desktop Search Bar (Hidden on Mobile) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative flex items-center w-full">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for atta, rice, oil, biscuits, snacks, shampoo..."
                className="w-full h-10 pl-10 pr-24 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-1 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-xs"
              >
                Search
              </button>
            </div>
          </form>

          {/* Cart & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Link 
              to="/products?sortBy=discountPercentage&sortOrder=desc" 
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-red-700 hover:text-red-800 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Flame className="w-4 h-4 text-red-500 fill-current" />
              <span>Deals</span>
            </Link>

            <Link to="/cart">
              <Button
                variant="supermarket"
                size="default"
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 h-9 sm:h-10 shadow-sm bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="font-bold hidden sm:inline">My Cart</span>
                <span className="flex items-center justify-center bg-orange-500 text-white font-black text-[11px] sm:text-xs h-4.5 sm:h-5 min-w-[18px] sm:min-w-5 px-1 rounded-full shadow-xs">
                  {itemCount}
                </span>
              </Button>
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 md:hidden text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Row 2: Mobile Search Bar (Full Width on Mobile) */}
        <div className="mt-2 md:hidden">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search atta, dal, oil, biscuits, snacks..."
                className="w-full h-9 pl-9 pr-20 rounded-xl border border-slate-200 bg-slate-100/80 focus:bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all shadow-2xs"
              />
              <button
                type="submit"
                className="absolute right-1 px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold transition-colors shadow-2xs"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Row 3: Mobile Quick Category Pills (Horizontally Scrollable) */}
      <div className="md:hidden border-t border-slate-100 bg-slate-50/70 py-1.5 px-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] font-bold">
          <Link
            to="/products?sortBy=discountPercentage&sortOrder=desc"
            className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200"
          >
            <Flame className="w-3 h-3 text-red-500 fill-current" />
            <span>Deals</span>
          </Link>
          <Link
            to="/products"
            className="shrink-0 px-2.5 py-1 rounded-full bg-white text-slate-700 border border-slate-200"
          >
            All Aisles
          </Link>
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat._id}
              to={`/category/${cat.slug}`}
              className="shrink-0 px-2.5 py-1 rounded-full bg-white text-slate-700 border border-slate-200 hover:border-emerald-500 whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Category Navigation Strip */}
      <nav className="border-t border-slate-100 bg-slate-50/80 hidden md:block">
        <div className="container mx-auto px-4 flex items-center justify-between text-xs py-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 shrink-0 mr-4">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <Link to="/products" className="hover:text-emerald-700 transition-colors">
              All Aisles
            </Link>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar font-semibold text-slate-600">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                className="hover:text-emerald-700 whitespace-nowrap transition-colors hover:underline underline-offset-4"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-4">
            <Link
              to="/products?isFeatured=true"
              className="font-extrabold text-xs px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors flex items-center gap-1"
            >
              <Flame className="w-3 h-3 text-amber-600" />
              <span>Low Price Deals</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* 4. Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white p-4 space-y-4 shadow-lg max-h-[80vh] overflow-y-auto">
          {/* Mobile Brand & Close Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <MegaMartLogo size="sm" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Delivery Location */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Delivery to: <strong>{currentLocation.city} {currentLocation.pincode}</strong></span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" /> All Products
            </Link>
            <Link
              to="/products?isFeatured=true"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-amber-50 text-amber-900 text-xs font-bold text-center flex items-center justify-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5 text-amber-600" /> Low Price Store
            </Link>
          </div>

          {/* Categories Grid */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Browse Categories</p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-slate-50 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors truncate"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setServerConfigOpen(true);
              }}
              className="w-full p-2.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-200"
            >
              <Server className="w-4 h-4 text-emerald-600" />
              Configure Android API Server
            </button>
            <Link 
              to="/cart" 
              onClick={() => setMobileMenuOpen(false)} 
              className="w-full"
            >
              <Button size="default" variant="supermarket" className="w-full">
                View Cart ({itemCount} items)
              </Button>
            </Link>
          </div>
        </div>
      )}

      <ServerConfigModal
        isOpen={serverConfigOpen}
        onClose={() => setServerConfigOpen(false)}
      />
    </header>
  );
};
