import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Product {
  id: string;
  title: string;
  description: string | null;
  specs?: string | null;
  price: number;
  image_url: string | null;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getTotal: (currency: 'USD' | 'GHS', exchangeRate: number) => number;
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

  const addToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
    setShowNotification(true);
    // Hide notification after 3 seconds
    setTimeout(() => setShowNotification(false), 3000);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = (currency: 'USD' | 'GHS', exchangeRate: number) => {
    return cart.reduce((sum, product) => {
      const price = currency === 'USD' ? product.price : product.price * exchangeRate;
      return sum + price;
    }, 0);
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