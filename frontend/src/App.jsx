import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
            <Routes>
              {/* Customer Facing Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="my-orders" element={<MyOrdersPage />} />
                <Route path="orders/:id" element={<OrderDetailPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
              </Route>

              {/* Admin Portal Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="coupons" element={<AdminCouponsPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

