import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('shopnova_guest_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch server cart when user logs in
  useEffect(() => {
    const fetchUserCart = async () => {
      if (isAuthenticated) {
        try {
          // If we had items in guest cart, sync them first
          const guestItems = JSON.parse(localStorage.getItem('shopnova_guest_cart') || '[]');
          if (guestItems.length > 0) {
            await api.post('/cart/sync', { items: guestItems });
            localStorage.removeItem('shopnova_guest_cart');
          }

          const res = await api.get('/cart');
          if (res.success && res.data) {
            setItems(res.data.items || []);
          }
        } catch (err) {
          console.error('Failed to load user cart:', err.message);
        }
      }
    };
    fetchUserCart();
  }, [isAuthenticated]);

  // Persist guest cart locally
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('shopnova_guest_cart', JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  // Totals calculation
  const subtotal = items.reduce((sum, item) => {
    const price = item.discountPrice > 0 ? item.discountPrice : item.price;
    return sum + price * item.quantity;
  }, 0);

  let discount = 0;
  if (coupon) {
    discount = Math.round((subtotal * coupon.discountPercent) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  }

  const deliveryCharge = items.length === 0 || subtotal >= 1000 ? 0 : 99;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * 0.10);
  const finalTotal = Math.max(0, taxableAmount + deliveryCharge + tax);

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const addToCart = async (product, quantity = 1) => {
    if (product.stock <= 0) {
      toast.error('Sorry, this product is out of stock');
      return;
    }

    if (isAuthenticated) {
      try {
        setLoading(true);
        const res = await api.post('/cart/items', { productId: product._id, quantity });
        if (res.success) {
          setItems(res.data.items);
          toast.success(`Added ${product.name.slice(0, 24)}... to cart!`);
        }
      } catch (err) {
        toast.error(err.message || 'Could not add to cart');
      } finally {
        setLoading(false);
      }
    } else {
      // Guest Cart
      setItems((prev) => {
        const index = prev.findIndex((i) => i.productId === product._id);
        if (index > -1) {
          const nextItems = [...prev];
          const newQty = nextItems[index].quantity + quantity;
          if (newQty > product.stock) {
            toast.error(`Only ${product.stock} units available in stock`);
            return prev;
          }
          nextItems[index].quantity = newQty;
          toast.success('Cart updated!');
          return nextItems;
        } else {
          toast.success(`Added to cart!`);
          return [
            ...prev,
            {
              productId: product._id,
              name: product.name,
              price: product.price,
              discountPrice: product.discountPrice || 0,
              image: product.images?.[0] || '',
              quantity,
              stock: product.stock,
            },
          ];
        }
      });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    if (isAuthenticated) {
      try {
        const res = await api.patch(`/cart/items/${productId}`, { quantity });
        if (res.success) {
          setItems(res.data.items);
        }
      } catch (err) {
        toast.error(err.message || 'Could not update quantity');
      }
    } else {
      setItems((prev) =>
        prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
      );
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await api.delete(`/cart/items/${productId}`);
        if (res.success) {
          setItems(res.data.items);
          toast.success('Item removed from cart');
        }
      } catch (err) {
        toast.error(err.message || 'Could not remove item');
      }
    } else {
      setItems((prev) => prev.filter((item) => item.productId !== productId));
      toast.success('Item removed from cart');
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await api.delete('/cart');
      } catch (err) {
        console.error(err);
      }
    }
    setItems([]);
    setCoupon(null);
    localStorage.removeItem('shopnova_guest_cart');
  };

  const applyCouponCode = async (code) => {
    if (!code || !code.trim()) {
      toast.error('Please enter a coupon code');
      return false;
    }
    try {
      const res = await api.post('/coupons/apply', { code, cartTotal: subtotal });
      if (res.success && res.data) {
        setCoupon(res.data);
        toast.success(res.message);
        return true;
      }
    } catch (err) {
      toast.error(err.message || 'Invalid coupon');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    toast.success('Coupon removed');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totals: {
          subtotal,
          discount,
          deliveryCharge,
          tax,
          finalTotal,
        },
        coupon,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCouponCode,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

