import React from 'react';
import { X, ShoppingCart, Trash2, MessageCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currency: 'USD' | 'GHS';
  exchangeRate: number;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  currency,
  exchangeRate,
  onCheckout
}) => {
  const { cart, removeFromCart, getTotal } = useCart();

  const convertPrice = (price: number) => (currency === 'USD' ? price : price * exchangeRate);
  const formatPrice = (price: number) => currency === 'USD' ? `$${price.toFixed(2)}` : `GHS ${convertPrice(price).toFixed(2)}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="relative ml-auto w-full max-w-md bg-card border-l border-border shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-200px)]">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg text-primary">
                {formatPrice(getTotal(currency, exchangeRate))}
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <MessageCircle size={18} />
              Checkout via WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;