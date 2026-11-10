import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Bell, User } from 'lucide-react';

const AdminLayout = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Administrator Access Required</h2>
          <p className="text-sm text-slate-500">
            You do not have permission to view the administration dashboard. Please sign in with an administrator account (e.g. <code>admin@shopnova.com</code>).
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-md shadow-blue-500/20"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Admin Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 className="font-bold text-slate-800 text-sm">Store Administration</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name}</p>
                <p className="text-[10px] text-slate-400 capitalize">{user?.role} Role</p>
              </div>
            </div>
          </div>
        </header>

        {/* Admin Main Body */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

