import { useState, useEffect, useCallback } from "react";
import { ShoppingCart, ChevronDown, Eye, Maximize2 } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLazyLoad } from "@/hooks/useLazyLoad";
import { useCart } from "@/contexts/CartContext";
import { loadContentWithLiveEditor, useLiveEditorUpdates } from "@/utils/contentLoader";
import CartSidebar from "./CartSidebar";
import LazyImage from "./LazyImage";

interface Product {
  id: string;
  title: string;
  description: string | null;
  specs?: string | null;
  price: number;
  category: string;
  image_url: string | null;
  image_urls?: string[];
  sizes?: string[];
  selectedSize?: string;
}

const WHATSAPP_NUMBER = "+233548656980"; // Replace with your number

export default function ShopSection() {
  const { ref, isVisible } = useScrollReveal();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, addToCart, getTotal } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const filteredProducts = selectedCategory === 'All' ? products : products.filter(p => p.category === selectedCategory);
  const { displayedItems, hasMore, loadMore, totalCount, displayedCount } = useLazyLoad(filteredProducts, {
    initialCount: 4,
    incrementCount: 2,
  });

  const fetchProducts = useCallback(async () => {
    const data = await loadContentWithLiveEditor('products', 'products');
    setProducts(data as Product[]);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useLiveEditorUpdates(fetchProducts);

  const placeholders: Product[] = products.length > 0 ? products : [
    { id: "1", title: "Wireless Earbuds Pro", description: "Active noise cancellation with 36-hour battery.", price: 79.99, category: "Electronics", image_url: null },
    { id: "2", title: "Mechanical Keyboard", description: "Hot-swappable switches, RGB backlit, compact 75%.", price: 129.99, category: "Electronics", image_url: null },
    { id: "3", title: "USB-C Hub 7-in-1", description: "HDMI 4K, USB 3.0, SD card reader, PD charging.", price: 49.99, category: "Electronics", image_url: null },
    { id: "4", title: "Smart LED Desk Lamp", description: "Adjustable color temperature, wireless charging base.", price: 64.99, category: "Electronics", image_url: null },
  ];

  const itemsToShow = filteredProducts.length > 0 ? displayedItems : placeholders;

  const formatPrice = (price: number) => `GHS ${price.toFixed(2)}`;

  const getProductImages = (product: Product) => {
    const normalize = (value: string) => {
      const trimmed = (value || '').trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('http') || trimmed.startsWith('/')) return trimmed;
      return `/${trimmed}`;
    };

    const fromPrimary = product.image_url
      ? product.image_url
          .split(',')
          .map((part) => normalize(part))
          .filter(Boolean)
      : [];

    const fromArray = Array.isArray(product.image_urls)
      ? product.image_urls
          .flatMap((entry) => String(entry || '').split(','))
          .map((part) => normalize(part))
          .filter(Boolean)
      : [];

    const images = [...fromPrimary, ...fromArray];
    return Array.from(new Set(images));
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize('');
    setSelectedImageIndex(0);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setSelectedSize('');
    setSelectedImageIndex(0);
  };

  const handleAddToCart = (product: Product, size?: string) => {
    addToCart(product, size);
  };

  const handleProductAction = (product: Product) => {
    if (product.category === 'Clothing') {
      openProductModal(product);
      return;
    }

    handleAddToCart(product);
  };

  const checkout = () => {
    const productNames = cart
      .map((product) => product.selectedSize ? `${product.title} (${product.selectedSize})` : product.title)
      .join(", ");
    const total = getTotal();
    const message = encodeURIComponent(
      `Hi! I'd like to order: ${productNames}. Total: GHS ${total.toFixed(2)}.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    setIsCartOpen(false);
  };

  return (
    <section id="shop" className="section-padding bg-secondary/30" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3 font-orbitron">◆ Shop ◆</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance font-orbitron text-primary">Products</h2>
          <div className="mt-4 flex flex-wrap justify-center items-center gap-3 text-sm">
            <span className="font-rajdhani">Category:</span>
            <div className="flex gap-2">
              {['All', 'Electronics', 'Clothing'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg border font-rajdhani transition-colors ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border bg-secondary/50 hover:bg-primary/20 hover:text-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Showing {displayedCount} of {totalCount} products</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {itemsToShow.map((product, i) => (
            <div
              key={product.id}
              className={`relative overflow-hidden rounded-[28px] border border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-2xl shadow-[0_14px_45px_rgba(0,0,0,0.16)] transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_24px_70px_rgba(249,115,22,0.22)] fade-up-stagger ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: `${150 + i * 80}ms`, animationDelay: `${150 + i * 80}ms` }}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.18),transparent_28%)]" />
              <div className="aspect-square bg-gradient-to-br from-primary/10 via-white/5 to-accent/10 flex items-center justify-center overflow-hidden relative">
                {product.image_url ? (
                  <LazyImage src={product.image_url} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <ShoppingCart size={40} className="text-primary/25" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80" />
                <div className="absolute left-3 right-3 top-3 flex items-center justify-between opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <button
                    onClick={() => setLightboxImage(getProductImages(product)[0] ?? null)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-2 text-xs font-medium text-white backdrop-blur-xl transition hover:bg-black/55"
                  >
                    <Maximize2 size={14} />
                    View Image
                  </button>
                  <div className="rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-[11px] text-white backdrop-blur-xl">
                    {product.category}
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-3 flex justify-center px-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <button
                    onClick={() => handleProductAction(product)}
                    className="w-full max-w-[180px] rounded-2xl bg-gradient-to-r from-primary to-orange-400 px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-[1.02] font-orbitron"
                  >
                    {product.category === 'Clothing' ? 'Choose Size' : 'Add to Cart'}
                  </button>
                </div>
              </div>
              <div className="relative p-5 text-left">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-sm line-clamp-2 font-rajdhani text-foreground">{product.title}</h3>
                  <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                    {product.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-4 text-pretty line-clamp-3">{product.description}</p>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg font-bold text-primary tabular-nums font-space-mono">{formatPrice(product.price)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openProductModal(product)}
                      className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium text-foreground backdrop-blur-xl transition-all duration-300 hover:border-primary/30 hover:bg-white/15 hover:shadow-lg hover:shadow-primary/10 active:scale-95 font-rajdhani"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleProductAction(product)}
                      className="rounded-xl bg-gradient-to-r from-primary to-orange-400 px-3 py-2 text-xs font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/40 active:scale-95 font-rajdhani"
                    >
                      {product.category === 'Clothing' ? 'Sizes' : 'Add'}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="glass-card max-w-5xl w-full overflow-hidden rounded-[32px] bg-[#111]/95 border border-orange-500/30 shadow-[0_20px_80px_rgba(0,0,0,0.65)]">
              <div className="flex justify-between items-start p-4 border-b border-orange-500/20">
                <div>
                  <h3 className="text-xl font-bold text-white font-rajdhani">{selectedProduct.title}</h3>
                  <p className="text-sm text-orange-300 font-space-mono">{formatPrice(selectedProduct.price)}</p>
                </div>
                <button onClick={closeProductModal} className="text-white/80 hover:text-white">✕</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-6">
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      const activeImage = getProductImages(selectedProduct)[selectedImageIndex] ?? selectedProduct.image_url;
                      if (activeImage) {
                        setLightboxImage(activeImage);
                      }
                    }}
                    className="group relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left"
                  >
                    {getProductImages(selectedProduct)[selectedImageIndex] ? (
                      <LazyImage
                        src={getProductImages(selectedProduct)[selectedImageIndex]}
                        alt={selectedProduct.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        eager
                      />
                    ) : selectedProduct.image_url ? (
                      <LazyImage
                        src={selectedProduct.image_url}
                        alt={selectedProduct.title}
                        className="w-full h-full object-cover"
                        eager
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/30 text-6xl">{selectedProduct.title.charAt(0)}</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <div className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-2 text-xs text-white backdrop-blur-xl">
                      <Maximize2 size={14} />
                      Full View
                    </div>
                  </button>
                  {getProductImages(selectedProduct).length > 1 && (
                    <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                      {getProductImages(selectedProduct).map((image, idx) => (
                        <button
                          key={`${selectedProduct.id}-${idx}`}
                          type="button"
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border transition-all ${selectedImageIndex === idx ? 'border-primary shadow-[0_0_0_2px_rgba(249,115,22,0.3)]' : 'border-white/10 hover:border-white/30'}`}
                        >
                          <LazyImage
                            src={image}
                            alt={`${selectedProduct.title} preview ${idx + 1}`}
                            className="h-full w-full object-cover"
                            eager
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-white">
                  <p className="text-sm text-orange-100 mb-3 whitespace-pre-line">{selectedProduct.description}</p>
                  {selectedProduct.specs && (
                    <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <strong className="text-sm text-orange-200">Specs:</strong>
                      <p className="text-sm text-orange-100 whitespace-pre-line mt-2">{selectedProduct.specs}</p>
                    </div>
                  )}
                  {selectedProduct.category === 'Clothing' && selectedProduct.sizes && (
                    <div className="mb-4 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4">
                      <strong className="text-sm text-orange-200">Choose Size</strong>
                      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {selectedProduct.sizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={`rounded-xl border px-3 py-2 text-sm font-medium transition-all ${selectedSize === size ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'border-white/10 bg-white/5 text-white hover:border-primary/40 hover:bg-white/10'}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      {!selectedSize && (
                        <p className="mt-3 text-xs text-orange-300">Pick a size before adding this clothing item to the cart.</p>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-orange-300">Use Full View to inspect the image, then add the item to cart or checkout via WhatsApp.</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button 
                      onClick={() => {
                        handleAddToCart(selectedProduct, selectedProduct.category === 'Clothing' ? selectedSize : undefined);
                        closeProductModal();
                      }} 
                      className="rounded-2xl bg-orange-500 px-4 py-2.5 font-bold text-black transition hover:-translate-y-0.5 hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={selectedProduct.category === 'Clothing' && !selectedSize}
                    >
                      Add to Cart
                    </button>
                    <button onClick={() => {
                      const activeImage = getProductImages(selectedProduct)[selectedImageIndex] ?? selectedProduct.image_url;
                      if (activeImage) {
                        setLightboxImage(activeImage);
                      }
                    }} className="rounded-2xl border border-white/15 px-4 py-2.5 text-white transition hover:bg-white/10">View Image</button>
                    <button onClick={() => {checkout(); closeProductModal();}} className="rounded-2xl border border-orange-400 px-4 py-2.5 text-orange-400 transition hover:bg-orange-500 hover:text-black">Checkout</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {lightboxImage && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md" onClick={() => setLightboxImage(null)}>
            <div className="relative max-h-[92vh] max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-black/70 shadow-[0_24px_90px_rgba(0,0,0,0.65)]" onClick={(event) => event.stopPropagation()}>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-black/50 px-3 py-2 text-sm text-white backdrop-blur-xl transition hover:bg-black/70"
              >
                Close
              </button>
              <img src={lightboxImage} alt="Full product view" className="max-h-[92vh] w-full object-contain" />
            </div>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={checkout}
      />
    </section>
  );
}
