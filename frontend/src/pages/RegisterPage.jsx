import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await register(name, email, password, phone);
    setLoading(false);
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div className="container-page py-16 sm:py-24 flex items-center justify-center">
      <div className="w-full max-w-md bg-surface p-8 sm:p-10 rounded-card border border-line shadow-card space-y-6">
        
        {/* Heading */}
        <div className="space-y-1.5 text-center">
          <h1 className="text-3xl font-semibold text-ink tracking-tight">Create an account</h1>
          <p className="text-sm text-ink-muted">Join ShopNova for express checkout and live order tracking.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1.5">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Priya Sharma"
              required
              className="input"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1.5">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="priya@example.com"
              required
              className="input"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1.5">Phone number (optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="input"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1.5">Password (at least 6 characters)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              minLength={6}
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
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </div>
        </form>

        <p className="text-center text-xs text-ink-muted pt-2 border-t border-line/60">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-accent hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;
