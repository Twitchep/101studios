import React from 'react';
import { X, ShoppingCart, Trash2, MessageCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import LazyImage from './LazyImage';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  onCheckout
}) => {
  const { cart, removeFromCart, getTotal } = useCart();

  const formatPrice = (price: number) => `GHS ${price.toFixed(2)}`;

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 left-5 z-[80] w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[1.5rem] border border-white/20 bg-black/70 text-white shadow-[0_18px_70px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
      <div className="flex max-h-[70vh] flex-col">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart size={48} className="mx-auto mb-4 text-white/40" />
              <p className="text-white/65">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={item.cartItemId ?? `${item.id}-${index}`} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  {item.image_url && (
                    <LazyImage
                      src={item.image_url}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.title}</h3>
                    {item.selectedSize && (
                      <p className="text-xs text-primary mt-1">Size: {item.selectedSize}</p>
                    )}
                    <p className="mt-1 text-sm text-white/70">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartItemId ?? item.id)}
                    className="flex-shrink-0 rounded-lg p-2 text-red-300 transition-colors hover:bg-red-500/15 hover:text-red-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg text-primary">
                {formatPrice(getTotal())}
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
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