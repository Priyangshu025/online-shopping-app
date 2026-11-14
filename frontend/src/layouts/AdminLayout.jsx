import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';
import LinkButton from '../components/ui/LinkButton';

const AdminLayout = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-alt p-4">
        <div className="max-w-md w-full bg-surface p-8 sm:p-10 rounded-card border border-line text-center space-y-4 shadow-card">
          <div className="w-14 h-14 bg-surface-alt text-ink-muted rounded-full flex items-center justify-center mx-auto border border-line">
            <ShieldAlert className="w-7 h-7 text-danger" />
          </div>
          <h2 className="text-xl font-semibold text-ink">Administrator Access Required</h2>
          <p className="text-sm text-ink-muted">
            You do not have permission to view the administration dashboard. Please sign in with an administrator account.
          </p>
          <div className="pt-2">
            <LinkButton
              to="/login"
              variant="primary"
              size="sm"
            >
              Sign in as Admin
            </LinkButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface-alt">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Admin Topbar */}
        <header className="h-14 bg-surface border-b border-line/60 px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-success"></span>
            <h1 className="font-semibold text-ink text-sm">Store Administration</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-surface-alt border border-line text-ink font-semibold text-xs flex items-center justify-center">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-ink leading-tight">{user?.name}</p>
              <p className="text-[11px] text-ink-muted capitalize">{user?.role}</p>
            </div>
          </div>
        </header>

        {/* Admin Main Body */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
