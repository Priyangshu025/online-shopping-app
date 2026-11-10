import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('shopnova_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('shopnova_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/profile');
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('shopnova_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Session expired or invalid token:', err.message);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.data) {
        setUser(res.data);
        setToken(res.data.token);
        localStorage.setItem('shopnova_token', res.data.token);
        localStorage.setItem('shopnova_user', JSON.stringify(res.data));
        toast.success(`Welcome back, ${res.data.name}!`);
        return { success: true, user: res.data };
      }
    } catch (err) {
      toast.error(err.message || 'Login failed');
      return { success: false, message: err.message };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, phone });
      if (res.success && res.data) {
        setUser(res.data);
        setToken(res.data.token);
        localStorage.setItem('shopnova_token', res.data.token);
        localStorage.setItem('shopnova_user', JSON.stringify(res.data));
        toast.success('Registration successful! Welcome to ShopNova.');
        return { success: true, user: res.data };
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('shopnova_token');
    localStorage.removeItem('shopnova_user');
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('shopnova_user', JSON.stringify(res.data));
        toast.success('Profile updated successfully');
        return { success: true, user: res.data };
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
      return { success: false, message: err.message };
    }
  };

  const toggleWishlist = async (productId) => {
    if (!token) {
      toast.error('Please login to save items to your wishlist');
      return false;
    }
    try {
      const res = await api.post('/auth/wishlist/toggle', { productId });
      if (res.success) {
        const updatedWishlist = res.data.wishlist;
        setUser(prev => ({ ...prev, wishlist: updatedWishlist }));
        toast.success(res.message);
        return res.data.isWishlisted;
      }
    } catch (err) {
      toast.error('Could not update wishlist');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        toggleWishlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

