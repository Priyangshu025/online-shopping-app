import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Tag, FolderTree, ArrowLeft, ShieldCheck } from 'lucide-react';

const AdminSidebar = () => {
  const navItems = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { to: '/admin/categories', label: 'Categories', icon: FolderTree },
    { to: '/admin/coupons', label: 'Coupons', icon: Tag },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between p-4 flex-shrink-0">
      <div>
        {/* Admin Brand */}
        <div className="flex items-center gap-3 px-3 py-4 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-white text-base tracking-tight">Admin Portal</h2>
            <p className="text-[11px] text-slate-400">ShopNova Control Center</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Return Link */}
      <div className="pt-4 border-t border-slate-800">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;

