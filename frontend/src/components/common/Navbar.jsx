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
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
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
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navCategories = [
    { name: 'Audio', path: '/products?category=Audio' },
    { name: 'Electronics', path: '/products?category=Electronics' },
    { name: 'Computers', path: '/products?category=Computers%20%26%20Accessories' },
    { name: 'Wearables', path: '/products?category=Wearables' },
    { name: 'Lifestyle', path: '/products?category=Fashion%20%26%20Lifestyle' },
    { name: 'Catalog', path: '/products' },
  ];

  return (
    <header className="sticky top-0 z-40 h-14 bg-white/80 backdrop-blur-xl border-b border-line/60 transition-colors">
      <div className="container-page h-full flex items-center justify-between">
        
        {/* Brand Logo - Plain, confident wordmark */}
        <Link 
          to="/" 
          className="text-lg font-semibold tracking-tight text-ink hover:opacity-80 transition-opacity flex-shrink-0"
        >
          ShopNova
        </Link>

        {/* Center Desktop Category Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          {navCategories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="text-sm font-normal text-ink/80 hover:text-ink transition-colors duration-150"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Search Toggle */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  autoFocus
                  className="w-48 sm:w-64 h-8 pl-8 pr-3 text-sm bg-surface-alt border border-line rounded-full focus:outline-none focus:border-accent text-ink placeholder:text-ink-muted/70"
                />
                <Search className="w-3.5 h-3.5 text-ink-muted absolute left-2.5 top-2.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-1.5 text-ink-muted hover:text-ink ml-1"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-ink/80 hover:text-ink rounded-full transition-colors"
                aria-label="Search store"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="relative p-2 text-ink/80 hover:text-ink rounded-full transition-colors"
            aria-label={`Wishlist, ${wishlistCount} items`}
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute 1 top-0.5 right-0.5 min-w-[15px] h-[15px] px-1 bg-accent text-white text-[10px] font-semibold rounded-full flex items-center justify-center leading-none">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Link */}
          <Link
            to="/cart"
            className="relative p-2 text-ink/80 hover:text-ink rounded-full transition-colors"
            aria-label={`Cart, ${itemCount} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            {itemCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[15px] h-[15px] px-1 bg-accent text-white text-[10px] font-semibold rounded-full flex items-center justify-center leading-none">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Account / User Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full text-ink hover:text-ink-muted transition-colors text-left"
                aria-label="User account menu"
                aria-expanded={userDropdownOpen}
              >
                <div className="w-7 h-7 rounded-full bg-surface-alt border border-line text-ink font-medium text-xs flex items-center justify-center uppercase">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <ChevronDown className="w-3 h-3 text-ink-muted" />
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-surface rounded-card shadow-lift border border-line p-2 z-50 text-sm animate-in fade-in"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-line/60">
                    <p className="font-semibold text-ink truncate">{user?.name}</p>
                    <p className="text-xs text-ink-muted truncate">{user?.email}</p>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-ink hover:bg-surface-alt rounded-lg font-medium transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-accent" />
                      Admin Dashboard
                    </Link>
                  )}

                  <Link
                    to="/my-orders"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-ink hover:bg-surface-alt rounded-lg transition-colors"
                  >
                    <Package className="w-4 h-4 text-ink-muted" />
                    My Orders
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-ink hover:bg-surface-alt rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4 text-ink-muted" />
                    Account Settings
                  </Link>

                  <div className="border-t border-line/60 my-1"></div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-danger hover:bg-rose-50/50 rounded-lg transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-normal text-ink/90 hover:text-accent transition-colors px-2 py-1"
            >
              Sign in
            </Link>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden text-ink/80 hover:text-ink"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 bg-surface border-b border-line shadow-lift px-6 py-6 space-y-4 animate-in fade-in">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full h-11 pl-9 pr-3 text-sm bg-surface-alt border border-line rounded-lg text-ink"
            />
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-3.5" />
          </form>

          <div className="flex flex-col space-y-1">
            {navCategories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                onClick={() => setMobileMenuOpen(false)}
                className="h-12 flex items-center text-base font-medium text-ink hover:text-accent transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="h-12 flex items-center justify-between text-base font-medium text-ink hover:text-accent transition-colors"
            >
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="text-xs bg-surface-alt px-2.5 py-0.5 rounded-full text-ink-muted">
                  {wishlistCount}
                </span>
              )}
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="h-12 flex items-center text-base font-semibold text-accent"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
