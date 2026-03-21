import { useState, useEffect } from "react";
import { ShoppingCart, MessageCircle, ChevronDown, Eye } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLazyLoad } from "@/hooks/useLazyLoad";
import { useCart } from "@/contexts/CartContext";
import { loadContentWithLiveEditor } from "@/utils/contentLoader";
import CartSidebar from "./CartSidebar";
import LazyImage from "./LazyImage";

interface Product {
  id: string;
  title: string;
  description: string | null;
  specs?: string | null;
  price: number;
  image_url: string | null;
}

const WHATSAPP_NUMBER = "+233548656980"; // Replace with your number

export default function ShopSection() {
  const { ref, isVisible } = useScrollReveal();
  const [products, setProducts] = useState<Product[]>([]);
  const [currency, setCurrency] = useState<'USD' | 'GHS'>('GHS');
  const [exchangeRate, setExchangeRate] = useState<number>(11);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, addToCart, getTotal } = useCart();
  const { displayedItems, hasMore, loadMore, totalCount, displayedCount } = useLazyLoad(products, {
    initialCount: 4,
    incrementCount: 2,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await loadContentWithLiveEditor('products', 'products');
      setProducts(data as Product[]);
    };

    fetchProducts();

    // Set up live editor update listener
    // useLiveEditorUpdates(fetchProducts);

    // Simple polling every 30 seconds as backup
    const interval = setInterval(fetchProducts, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=GHS');
        const data = await response.json();
        if (data?.rates?.GHS) {
          setExchangeRate(data.rates.GHS);
        }
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      }
    };

    fetchRate();
  }, []);

  const placeholders: Product[] = products.length > 0 ? products : [
    { id: "1", title: "Wireless Earbuds Pro", description: "Active noise cancellation with 36-hour battery.", price: 79.99, image_url: null },
    { id: "2", title: "Mechanical Keyboard", description: "Hot-swappable switches, RGB backlit, compact 75%.", price: 129.99, image_url: null },
    { id: "3", title: "USB-C Hub 7-in-1", description: "HDMI 4K, USB 3.0, SD card reader, PD charging.", price: 49.99, image_url: null },
    { id: "4", title: "Smart LED Desk Lamp", description: "Adjustable color temperature, wireless charging base.", price: 64.99, image_url: null },
  ];

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const itemsToShow = products.length > 0 ? displayedItems : placeholders;

  const convertPrice = (price: number) => (currency === 'USD' ? price : price * exchangeRate);
  const formatPrice = (price: number) => currency === 'USD' ? `$${price.toFixed(2)}` : `GHS ${convertPrice(price).toFixed(2)}`;

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const checkout = () => {
    const productNames = cart.map((p) => p.title).join(", ");
    const total = getTotal(currency, exchangeRate);
    const message = encodeURIComponent(
      `Hi! I'd like to order: ${productNames}. Total: ${currency === 'USD' ? '$' : 'GHS '}${total.toFixed(2)} (${currency}).`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    setIsCartOpen(false);
  };

  return (
    <section id="shop" className="section-padding bg-secondary/30" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3 font-orbitron">◆ Shop ◆</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance font-orbitron glow-text" style={{ color: "#ff00ff" }}>Tech Gadgets</h2>
          <div className="mt-4 flex flex-wrap justify-center items-center gap-3 text-sm">
            <span className="font-rajdhani">Currency:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as 'USD' | 'GHS')}
              className="px-3 py-1 rounded-lg border border-border bg-secondary/50 font-rajdhani"
            >
              <option value="USD">USD</option>
              <option value="GHS">GHS</option>
            </select>
            {currency === 'GHS' && exchangeRate > 0 && (
              <span className="text-muted-foreground font-rajdhani">1 USD = {exchangeRate.toFixed(2)} GHS</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2">Showing {displayedCount} of {totalCount} products</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {itemsToShow.map((product, i) => (
            <div
              key={product.id}
              className={`glass-card-hover overflow-hidden group transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 fade-up-stagger ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: `${150 + i * 80}ms`, animationDelay: `${150 + i * 80}ms` }}
            >
              <div className="aspect-square bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center overflow-hidden relative">
                {product.image_url ? (
                  <LazyImage src={product.image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <ShoppingCart size={40} className="text-primary/25" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 font-orbitron"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2 font-rajdhani">{product.title}</h3>
                <p className="text-xs text-muted-foreground mb-3 text-pretty line-clamp-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary tabular-nums font-space-mono">{formatPrice(product.price)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:shadow-lg hover:shadow-secondary/25 transition-all duration-300 active:scale-95 font-rajdhani"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-medium hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 active:scale-95 font-rajdhani"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMore}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-accent-foreground font-medium text-sm shadow-lg shadow-primary/50 hover:shadow-primary/75 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97] font-orbitron btn-neon-glow"
            >
              Load More
              <ChevronDown size={16} />
            </button>
          </div>
        )}

        {cart.length > 0 && (
          <div className="mt-8 flex justify-center animate-fade-up">
            <button
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-secondary to-accent text-accent-foreground font-medium shadow-lg shadow-secondary/50 hover:shadow-secondary/75 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97] font-orbitron btn-neon-glow"
            >
              <Eye size={18} />
              View Cart ({cart.length} items)
            </button>
          </div>
        )}

        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <div className="glass-card max-w-3xl w-full overflow-hidden">
              <div className="flex justify-between items-start p-4 border-b border-glass-border">
                <div>
                  <h3 className="text-xl font-bold font-rajdhani">{selectedProduct.title}</h3>
                  <p className="text-sm text-muted-foreground font-space-mono">{formatPrice(selectedProduct.price)}</p>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>
              {selectedProduct.image_url ? (
                <div className="aspect-[16/9] bg-black/5">
                  <LazyImage src={selectedProduct.image_url} alt={selectedProduct.title} className="w-full h-full object-cover" />
                </div>
              ) : null}
              <div className="p-4">
                <p className="text-sm text-muted-foreground mb-2">{selectedProduct.description}</p>
                {selectedProduct.specs && (
                  <div className="mb-3">
                    <strong className="text-sm text-foreground">Specs:</strong>
                    <p className="text-sm text-muted-foreground">{selectedProduct.specs}</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Add to cart or use WhatsApp checkout to contact us.</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => {handleAddToCart(selectedProduct); setSelectedProduct(null);}} className="px-3 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-rajdhani hover:shadow-lg hover:shadow-primary/50">Add to Cart</button>
                  <button onClick={() => {checkout(); setSelectedProduct(null);}} className="px-3 py-2 rounded-lg bg-gradient-to-r from-secondary to-accent text-accent-foreground font-rajdhani hover:shadow-lg hover:shadow-secondary/50">Checkout</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        currency={currency}
        exchangeRate={exchangeRate}
        onCheckout={checkout}
      />
    </section>
  );
}
