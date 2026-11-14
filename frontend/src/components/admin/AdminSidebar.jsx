import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Tag, FolderTree, ArrowLeft } from 'lucide-react';

const AdminSidebar = () => {
  const navItems = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { to: '/admin/categories', label: 'Categories', icon: FolderTree },
    { to: '/admin/coupons', label: 'Coupons', icon: Tag },
  ];

  return (
    <aside className="w-60 bg-surface border-r border-line/60 min-h-screen flex flex-col justify-between p-4 flex-shrink-0">
      <div>
        {/* Admin Brand */}
        <div className="flex items-center gap-2.5 px-3 py-3 border-b border-line/50">
          <Link to="/" className="text-base font-semibold text-ink tracking-tight">
            ShopNova Admin
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="mt-5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-ink text-white'
                      : 'text-ink-muted hover:text-ink hover:bg-surface-alt'
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
      <div className="pt-3 border-t border-line/50">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
