import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import CartSidebar from "@/components/CartSidebar";
import { useCart } from "@/contexts/CartContext";

const WHATSAPP_NUMBER = "+233548656980";

export default function FloatingCartButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, getTotal } = useCart();
  const cartCountLabel = cart.length > 99 ? "99+" : String(cart.length);

  useEffect(() => {
    const handleOpenCart = () => setIsOpen(true);
    window.addEventListener("open-cart", handleOpenCart);
    return () => window.removeEventListener("open-cart", handleOpenCart);
  }, []);

  const checkout = () => {
    const productNames = cart
      .map((product) => (product.selectedSize ? `${product.title} (${product.selectedSize})` : product.title))
      .join(", ");
    const total = getTotal();
    const message = encodeURIComponent(
      `Hi! I'd like to order: ${productNames}. Total: GHS ${total.toFixed(2)}.`
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-5 left-5 z-[80]">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative inline-flex h-14 w-14 items-center justify-center overflow-visible rounded-[1.25rem] border border-white/15 bg-black/70 text-white shadow-[0_18px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:text-primary"
          aria-label="Open shopping cart"
        >
          <ShoppingCart size={22} />
          {cart.length > 0 && (
            <span className="pointer-events-none absolute right-1 top-1 z-20 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-black/70 shadow-[0_6px_14px_rgba(0,0,0,0.45)]">
              {cartCountLabel}
            </span>
          )}
        </button>
      </div>

      <CartSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} onCheckout={checkout} />
    </>
  );
}