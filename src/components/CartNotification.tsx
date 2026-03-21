import React from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const CartNotification: React.FC = () => {
  const { showNotification, setShowNotification, cart } = useCart();

  if (!showNotification) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-fade-up">
      <div className="bg-primary text-primary-foreground px-4 py-3 rounded-lg shadow-lg border border-primary/20 flex items-center gap-3 min-w-[300px]">
        <div className="flex-shrink-0">
          <ShoppingCart size={20} />
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">Item added to cart!</p>
          <p className="text-xs opacity-90">{cart.length} item{cart.length !== 1 ? 's' : ''} in cart</p>
        </div>
        <button
          onClick={() => setShowNotification(false)}
          className="flex-shrink-0 hover:bg-primary-foreground/10 rounded p-1 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default CartNotification;