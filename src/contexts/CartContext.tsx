import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Product {
  id: string;
  title: string;
  description: string | null;
  specs?: string | null;
  price: number;
  image_url: string | null;
  cartItemId?: string;
  selectedSize?: string;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product, selectedSize?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  showNotification: boolean;
  setShowNotification: (show: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  const addToCart = (product: Product, selectedSize?: string) => {
    const cartItemId = `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setCart((prev) => [...prev, { ...product, cartItemId, selectedSize }]);
    setShowNotification(true);
    // Hide notification after 3 seconds
    setTimeout(() => setShowNotification(false), 3000);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((sum, product) => sum + product.price, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      getTotal,
      showNotification,
      setShowNotification,
    }}>
      {children}
    </CartContext.Provider>
  );
};