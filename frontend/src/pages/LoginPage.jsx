import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Mail, Lock, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      if (res.user.role === 'admin' && redirect === '/') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    }
  };

  const fillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
        
        {/* Brand & Heading */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-500">Sign in to access your orders, cart, and personalized wishlist</p>
        </div>

        {/* Demo Fast-fill Badges */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
            Instant Demo Sign In:
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('customer@shopnova.com', 'customer123')}
              className="flex-1 py-1.5 px-2 bg-blue-100/70 hover:bg-blue-100 text-blue-800 text-[11px] font-bold rounded-xl transition-colors text-center"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin@shopnova.com', 'admin123')}
              className="flex-1 py-1.5 px-2 bg-indigo-100/70 hover:bg-indigo-100 text-indigo-800 text-[11px] font-bold rounded-xl transition-colors text-center"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Password</label>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:underline">
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;

