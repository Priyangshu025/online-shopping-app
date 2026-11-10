import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X,
  Package,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Top promotional announcement */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4 text-center font-medium tracking-wide">
        🎉 Limited Festive Sale! Use code <span className="text-amber-400 font-bold tracking-wider">WELCOME10</span> for 10% off • Free Delivery on orders over ₹1,000!
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ShopNova
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search premium electronics, audio, gadgets, lifestyle..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-100/80 border border-slate-200 rounded-full text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full transition-colors flex items-center justify-center"
            >
              Search
            </button>
          </form>

          {/* Nav Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Explore Catalogue link */}
            <Link
              to="/products"
              className="hidden lg:flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors px-2 py-1"
            >
              <Layers className="w-4 h-4" />
              <span>Catalog</span>
            </Link>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="relative p-2.5 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-full transition-all"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-all flex items-center"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Dropdown / Auth CTA */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center uppercase">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 max-w-[80px] truncate hidden sm:inline">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 text-sm animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-indigo-600 hover:bg-indigo-50 font-medium transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/my-orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      My Orders
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Account Profile
                    </Link>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl shadow-sm transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </form>
            <div className="flex flex-col space-y-2 pt-2 text-sm font-medium">
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
              >
                All Products
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Wishlist</span>
                <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">{wishlistCount}</span>
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-indigo-600 bg-indigo-50 font-semibold"
                >
                  Admin Portal
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

