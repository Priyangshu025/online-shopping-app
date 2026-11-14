import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

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
    <div className="container-page py-16 sm:py-24 flex items-center justify-center">
      <div className="w-full max-w-md bg-surface p-8 sm:p-10 rounded-card border border-line shadow-card space-y-6">
        
        {/* Heading */}
        <div className="space-y-1.5 text-center">
          <h1 className="text-3xl font-semibold text-ink tracking-tight">Sign in to ShopNova</h1>
          <p className="text-sm text-ink-muted">Access your orders, saved bag, and personal wishlist.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1.5">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="input"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Signing in...' : 'Continue'}
            </Button>
          </div>
        </form>

        {/* Demo Fast-fill Shortcuts */}
        <div className="pt-2 border-t border-line/60 text-center space-y-2">
          <p className="text-xs text-ink-muted">Demo credentials for testing:</p>
          <div className="flex items-center justify-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => fillCredentials('customer@shopnova.com', 'customer123')}
              className="text-accent hover:underline font-medium"
            >
              Customer demo
            </button>
            <span className="text-line">•</span>
            <button
              type="button"
              onClick={() => fillCredentials('admin@shopnova.com', 'admin123')}
              className="text-accent hover:underline font-medium"
            >
              Admin demo
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-ink-muted pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-accent hover:underline">
            Create one now
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
