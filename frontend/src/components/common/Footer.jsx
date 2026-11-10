import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Headphones, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800 text-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Free Express Delivery</h4>
              <p className="text-xs text-slate-400">On all orders above ₹1,000</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Secure Checkout</h4>
              <p className="text-xs text-slate-400">Cards, UPI, NetBanking & COD</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">7 Days Easy Return</h4>
              <p className="text-xs text-slate-400">Hassle-free refunds & returns</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">24/7 Dedicated Care</h4>
              <p className="text-xs text-slate-400">Friendly assistance anytime</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-12 border-b border-slate-800">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">ShopNova</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed pr-6">
              Your premier destination for cutting-edge electronics, premium audio gear, ergonomic workspace equipment, and lifestyle products with genuine manufacturer warranties.
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Tech Park, Koramangala, Bengaluru, Karnataka 560095</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>+91 1800-456-7890 (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>support@shopnova.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Shop Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products?category=Audio" className="hover:text-white transition-colors">Audio & Headphones</Link></li>
              <li><Link to="/products?category=Electronics" className="hover:text-white transition-colors">Cameras & Gadgets</Link></li>
              <li><Link to="/products?category=Computers%20%26%20Accessories" className="hover:text-white transition-colors">Keyboards & Mice</Link></li>
              <li><Link to="/products?category=Wearables" className="hover:text-white transition-colors">Smart Watches</Link></li>
              <li><Link to="/products?category=Fashion%20%26%20Lifestyle" className="hover:text-white transition-colors">Lifestyle Bags</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/my-orders" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">View Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">My Wishlist</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Account Settings</Link></li>
              <li><a href="#help" className="hover:text-white transition-colors">Shipping Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Legal & Compliance</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Notice (DPDP Act)</a></li>
              <li><a href="#consumer" className="hover:text-white transition-colors">Consumer Protection Rules</a></li>
              <li><a href="#returns" className="hover:text-white transition-colors">Cancellation & Refunds</a></li>
              <li><a href="#grievance" className="hover:text-white transition-colors">Grievance Redressal</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Compliance Note */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ShopNova E-Commerce Ltd. Compliant with Digital Personal Data Protection Act, 2023 & Consumer Protection (E-Commerce) Rules.</p>
          <div className="flex items-center gap-4">
            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded font-mono text-[11px]">UPI</span>
            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded font-mono text-[11px]">Razorpay</span>
            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded font-mono text-[11px]">Visa / Mastercard</span>
            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded font-mono text-[11px]">COD</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

