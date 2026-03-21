import { useState, useEffect } from "react";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";

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
  const [cart, setCart] = useState<Product[]>([]);
  const [currency, setCurrency] = useState<'USD' | 'GHS'>('GHS');
  const [exchangeRate, setExchangeRate] = useState<number>(11);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Try to load from Supabase first
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          setProducts(data as Product[]);
        } else {
          // Fallback to local JSON file
          const response = await fetch('/content.json');
          const content = await response.json();
          setProducts(content.products || []);
        }
      } catch (error) {
        // Fallback to local JSON file
        try {
          const response = await fetch('/content.json');
          const content = await response.json();
          setProducts(content.products || []);
        } catch (fallbackError) {
          console.error("Error loading products data:", fallbackError);
          setProducts([]);
        }
      }
    };

    fetchProducts();

    // Simple polling every 30 seconds
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

  const convertPrice = (price: number) => (currency === 'USD' ? price : price * exchangeRate);
  const formatPrice = (price: number) => currency === 'USD' ? `$${price.toFixed(2)}` : `GHS ${convertPrice(price).toFixed(2)}`;

  const addToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
  };

  const checkout = () => {
    const productNames = cart.map((p) => p.title).join(", ");
    const total = cart.reduce((sum, p) => sum + convertPrice(p.price), 0);
    const message = encodeURIComponent(
      `Hi! I'd like to order: ${productNames}. Total: ${currency === 'USD' ? '$' : 'GHS '}${total.toFixed(2)} (${currency}).`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <section id="shop" className="section-padding bg-secondary/30" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">Shop</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">Tech Gadgets</h2>
          <div className="mt-4 flex justify-center items-center gap-3 text-sm">
            <span>Currency:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as 'USD' | 'GHS')}
              className="px-3 py-1 rounded-lg border border-border bg-secondary/50"
            >
              <option value="USD">USD</option>
              <option value="GHS">GHS</option>
            </select>
            {currency === 'GHS' && exchangeRate > 0 && (
              <span className="text-muted-foreground">1 USD = {exchangeRate.toFixed(2)} GHS</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {placeholders.map((product, i) => (
            <div
              key={product.id}
              className={`glass-card-hover overflow-hidden group transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: `${150 + i * 80}ms` }}
            >
              <div className="aspect-square bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center overflow-hidden relative">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <ShoppingCart size={40} className="text-primary/25" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <button
                    onClick={() => addToCart(product)}
                    className="opacity-0 group-hover:opacity-100 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.title}</h3>
                <p className="text-xs text-muted-foreground mb-3 text-pretty line-clamp-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary tabular-nums">{formatPrice(product.price)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:shadow-lg hover:shadow-secondary/25 transition-all duration-300 active:scale-95"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 active:scale-95"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="mt-8 flex justify-center animate-fade-up">
            <button
              onClick={checkout}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
            >
              <MessageCircle size={18} />
              Checkout via WhatsApp ({cart.length} items)
            </button>
          </div>
        )}

        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <div className="glass-card max-w-3xl w-full overflow-hidden">
              <div className="flex justify-between items-start p-4 border-b border-glass-border">
                <div>
                  <h3 className="text-xl font-bold">{selectedProduct.title}</h3>
                  <p className="text-sm text-muted-foreground">${selectedProduct.price.toFixed(2)}</p>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>
              {selectedProduct.image_url ? (
                <div className="aspect-[16/9] bg-black/5">
                  <img src={selectedProduct.image_url} alt={selectedProduct.title} className="w-full h-full object-cover" />
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
                  <button onClick={() => {addToCart(selectedProduct); setSelectedProduct(null);}} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80">Add to Cart</button>
                  <button onClick={() => {checkout(); setSelectedProduct(null);}} className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80">Checkout via WhatsApp</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
