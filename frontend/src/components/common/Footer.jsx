import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, RefreshCw, Headphones, MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-surface-alt text-ink-muted border-t border-line/60 pt-16 pb-12 mt-20">
      <div className="container-page">
        
        {/* Value Highlights - Calm, monochrome trust strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-line/60">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-ink-muted mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-ink">Free Express Delivery</h4>
              <p className="text-xs text-ink-muted mt-0.5">On all orders above ₹1,000</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-ink-muted mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-ink">Secure Checkout</h4>
              <p className="text-xs text-ink-muted mt-0.5">Cards, UPI & NetBanking</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <RefreshCw className="w-5 h-5 text-ink-muted mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-ink">7-Day Easy Returns</h4>
              <p className="text-xs text-ink-muted mt-0.5">Doorstep pickup & quick refunds</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Headphones className="w-5 h-5 text-ink-muted mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-ink">Dedicated Support</h4>
              <p className="text-xs text-ink-muted mt-0.5">Assistance whenever you need it</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12 border-b border-line/60 text-sm">
          
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="text-lg font-semibold tracking-tight text-ink block">
              ShopNova
            </Link>
            <p className="text-xs text-ink-muted leading-relaxed max-w-sm">
              Curated audio equipment, productivity peripherals, cameras, and personal technology engineered with precision and genuine manufacturer warranty.
            </p>
            <div className="space-y-1.5 text-xs text-ink-muted pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-ink-muted" />
                <span>Bengaluru, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-ink-muted" />
                <span>support@shopnova.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-ink mb-3 tracking-tight">Shop</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/products?category=Audio" className="hover:text-ink transition-colors">Audio & Headphones</Link></li>
              <li><Link to="/products?category=Electronics" className="hover:text-ink transition-colors">Cameras & Tech</Link></li>
              <li><Link to="/products?category=Computers%20%26%20Accessories" className="hover:text-ink transition-colors">Workstation Gear</Link></li>
              <li><Link to="/products?category=Wearables" className="hover:text-ink transition-colors">Smartwatches</Link></li>
              <li><Link to="/products?category=Fashion%20%26%20Lifestyle" className="hover:text-ink transition-colors">Everyday Gear</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-ink mb-3 tracking-tight">Account & Orders</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/my-orders" className="hover:text-ink transition-colors">Order History</Link></li>
              <li><Link to="/cart" className="hover:text-ink transition-colors">Shopping Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-ink transition-colors">Saved Wishlist</Link></li>
              <li><Link to="/profile" className="hover:text-ink transition-colors">Account Settings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-ink mb-3 tracking-tight">Customer Care</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/products" className="hover:text-ink transition-colors">Product Warranty</Link></li>
              <li><Link to="/cart" className="hover:text-ink transition-colors">Shipping Estimates</Link></li>
              <li><Link to="/my-orders" className="hover:text-ink transition-colors">Return Policy</Link></li>
              <li><Link to="/profile" className="hover:text-ink transition-colors">Privacy Notice</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <p>© {new Date().getFullYear()} ShopNova. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>India</span>
            <span className="text-line">•</span>
            <span>UPI • Cards • NetBanking • COD</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
