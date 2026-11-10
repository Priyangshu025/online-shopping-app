import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, toggleWishlist } = useAuth();
  const wishlist = user?.wishlist || [];

  const isWishlisted = (productId) => {
    return wishlist.includes(productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isWishlisted,
        toggleWishlist,
        count: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

