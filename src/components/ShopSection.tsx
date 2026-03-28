import { useState, useEffect, useCallback, useMemo } from "react";
import { ShoppingCart, ChevronDown, Eye, Maximize2 } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLazyLoad } from "@/hooks/useLazyLoad";
import { useCart } from "@/contexts/CartContext";
import { loadContentWithLiveEditor, useLiveEditorUpdates } from "@/utils/contentLoader";
import { useLocation, useNavigate } from "react-router-dom";
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
  isNew?: boolean;
}

interface ShopSectionProps {
  initialProducts?: Product[];
}

const WHATSAPP_NUMBER = "+233548656980"; // Replace with your number

export default function ShopSection({ initialProducts = [] }: ShopSectionProps) {
  const { ref, isVisible } = useScrollReveal();
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { cart, addToCart, getTotal } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [activeTile, setActiveTile] = useState<number | null>(null);

  const filteredProducts = selectedCategory === 'All' ? products : products.filter(p => p.category === selectedCategory);
  const { displayedItems, hasMore, loadMore, totalCount, displayedCount } = useLazyLoad(filteredProducts, {
    initialCount: 4,
    incrementCount: 2,
  });

  const fetchProducts = useCallback(async () => {
    const data = await loadContentWithLiveEditor('products', 'products', 'created_at', {
      skipSupabase: initialProducts.length > 0,
    });
    setProducts(data as Product[]);
  }, [initialProducts.length]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useLiveEditorUpdates(fetchProducts);

  const placeholders: Product[] = products.length > 0 ? products : [
    { id: "1",  title: "Wireless Earbuds Pro",          description: "Active noise cancellation, rich bass, 36-hour battery life.",             price: 320,  category: "Electronics", image_url: "/images/products/1.jpg"   },
    { id: "2",  title: "Smart LED Desk Lamp",            description: "Warm-to-cool colour temperature with built-in wireless charging base.",   price: 180,  category: "Electronics", image_url: "/images/products/2.jpg"   },
    { id: "3",  title: "USB-C Hub 7-in-1",               description: "HDMI 4K, 3× USB 3.0, SD card reader, 100W PD fast charging.",           price: 130,  category: "Electronics", image_url: "/images/products/3.jpg"   },
    { id: "4",  title: "Mechanical Keyboard",            description: "Hot-swappable RGB switches, compact 75% layout, aluminium frame.",       price: 450,  category: "Electronics", image_url: "/images/products/4.jpg"   },
    { id: "5",  title: "Portable Bluetooth Speaker",    description: "360° surround sound, IPX7 waterproof, 20-hour playtime.",                price: 200,  category: "Electronics", image_url: "/images/products/5.jpg"   },
    { id: "6",  title: "Gaming Mouse RGB",               description: "16 000 DPI optical sensor, 7 programmable buttons, lightweight design.", price: 170,  category: "Electronics", image_url: "/images/products/5.png"   },
    { id: "7",  title: "Phone Stand & Charger",          description: "Adjustable alloy mount with 15W Qi wireless fast charging.",             price: 95,   category: "Electronics", image_url: "/images/products/6.jpg"   },
    { id: "8",  title: "Smart Watch Series X",           description: "Health & GPS tracking, AMOLED display, 7-day battery life.",             price: 550,  category: "Electronics", image_url: "/images/products/7.jpg"   },
    { id: "9",  title: "Noise-Cancelling Headphones",   description: "Studio-grade sound, 30-hour ANC battery, foldable travel design.",      price: 490,  category: "Electronics", image_url: "/images/products/8.jpeg"  },
    { id: "10", title: "4K Webcam HD Pro",               description: "Crystal-clear video calls with auto-focus and built-in ring light.",     price: 220,  category: "Electronics", image_url: "/images/products/9.jpg"   },
    { id: "11", title: "Mini Portable Projector",        description: "1080p HD projection up to 150-inch screen, 3-hour runtime.",            price: 780,  category: "Electronics", image_url: "/images/products/10.jpg"  },
    { id: "12", title: "USB Fast Charging Pad",          description: "Multi-device simultaneous wireless charging, 20W output.",              price: 85,   category: "Electronics", image_url: "/images/products/13.jpeg" },
    { id: "13", title: "ASUS Gaming Laptop",             description: "RTX 4060, 144Hz IPS display, 16GB RAM, 512GB NVMe SSD.",               price: 5500, category: "Electronics", image_url: "/images/products/asus.jpg" },
    { id: "14", title: "Oversized Premium Hoodie",       description: "Heavyweight cotton blend, dropped shoulders, embroidered logo.",        price: 180,  category: "Clothing",    image_url: "/images/clothing/1.jpg"   },
    { id: "15", title: "Graphic Tee Collection",         description: "Limited-run screen-print tees, 100% organic cotton, unisex sizing.",   price: 75,   category: "Clothing",    image_url: "/images/clothing/2.png"   },
    { id: "16", title: "Cargo Pants — Street Edition",  description: "Multi-pocket utility cargo trousers with tapered slim fit.",            price: 160,  category: "Clothing",    image_url: "/images/clothing/3.png"   },
    { id: "17", title: "Streetwear Bomber Jacket",       description: "Satin-finish reversible bomber, minimal branding, relaxed fit.",       price: 280,  category: "Clothing",    image_url: "/images/clothing/4.png"   },
    { id: "18", title: "Monochrome Fit Set",             description: "Matching jogger and crop-top set in muted neutral tones.",             price: 210,  category: "Clothing",    image_url: "/images/clothing/5.png"   },
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
  };

  const stackedImages = useMemo(() => {
    const allImages = [...products, ...placeholders]
      .map((product) => product.image_url)
      .filter((image): image is string => !!image);

    const pool = allImages.length >= 5 ? allImages : [
      ...allImages,
      '/images/products/1.jpg',
      '/images/products/4.jpg',
      '/images/products/7.jpg',
      '/images/clothing/4.png',
      '/images/products/asus.jpg',
    ];

    const unique = Array.from(new Set(pool));
    const start = 0;
    const wrap = (i: number) => unique[(start + i) % unique.length];
    return [wrap(0), wrap(1), wrap(2), wrap(3), wrap(4)];
  }, [products]);

  const openShopPage = () => {
    if (location.pathname !== '/shop') {
      navigate('/shop');
      return;
    }
    document.getElementById('shop-catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const clearActiveTileIfMouse = (pointerType: string) => {
    if (pointerType === 'mouse') {
      setActiveTile(null);
    }
  };

  const showCatalog = location.pathname === '/shop' || location.pathname === '/legacy/shop';

  return (
    <section id="shop" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className={`stitch-panel p-6 md:p-8 mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="text-center mb-6">
            <p className="stitch-chip mb-4">Shop Preview</p>
            <h3 className="text-2xl sm:text-4xl font-bold tracking-tight font-orbitron text-foreground">Curated Product Picks</h3>
            <p className="mt-3 text-sm md:text-base text-white/80 font-rajdhani">Discover standout pieces designed to upgrade your everyday look.</p>
          </div>

          <button
            type="button"
            onClick={openShopPage}
            onPointerLeave={(event) => clearActiveTileIfMouse(event.pointerType)}
            className="group relative mx-auto block w-full max-w-5xl h-[280px] sm:h-[380px] overflow-hidden"
            aria-label="Open shopping page"
          >
            <div
              onPointerEnter={() => setActiveTile(0)}
              onPointerDown={() => setActiveTile(0)}
              onPointerUp={(event) => clearActiveTileIfMouse(event.pointerType)}
              onPointerCancel={(event) => clearActiveTileIfMouse(event.pointerType)}
              className={`absolute left-[6%] sm:left-[12%] top-[54%] -translate-y-1/2 h-32 w-32 sm:h-52 sm:w-52 rounded-[1.1rem] sm:rounded-[1.4rem] overflow-hidden border border-white/20 bg-black/35 backdrop-blur-xl shadow-2xl transition-all duration-400 ${activeTile === 0 ? '-translate-x-1 sm:-translate-x-6 rotate-[-7deg] sm:rotate-[-14deg] scale-[1.04] sm:scale-[1.1]' : 'rotate-[-5deg] sm:rotate-[-8deg] hover:-translate-x-2 sm:hover:-translate-x-5 hover:rotate-[-8deg] sm:hover:rotate-[-12deg] hover:scale-[1.04] sm:hover:scale-[1.07]'}`}
            >
              <LazyImage src={stackedImages[0]} alt="Shop preview left one" className="h-full w-full object-cover" />
            </div>
            <div
              onPointerEnter={() => setActiveTile(1)}
              onPointerDown={() => setActiveTile(1)}
              onPointerUp={(event) => clearActiveTileIfMouse(event.pointerType)}
              onPointerCancel={(event) => clearActiveTileIfMouse(event.pointerType)}
              className={`absolute left-[22%] sm:left-[26%] top-[50%] -translate-y-1/2 h-32 w-32 sm:h-52 sm:w-52 rounded-[1.1rem] sm:rounded-[1.4rem] overflow-hidden border border-white/20 bg-black/35 backdrop-blur-xl shadow-2xl transition-all duration-400 ${activeTile === 1 ? '-translate-x-1 sm:-translate-x-3 rotate-[-5deg] sm:rotate-[-7deg] scale-[1.04] sm:scale-[1.09]' : 'rotate-[-1deg] sm:rotate-[-2deg] hover:-translate-x-1 sm:hover:-translate-x-2 hover:rotate-[-3deg] sm:hover:rotate-[-5deg] hover:scale-[1.03] sm:hover:scale-[1.06]'}`}
            >
              <LazyImage src={stackedImages[1]} alt="Shop preview left two" className="h-full w-full object-cover" />
            </div>
            <div
              onPointerEnter={() => setActiveTile(2)}
              onPointerDown={() => setActiveTile(2)}
              onPointerUp={(event) => clearActiveTileIfMouse(event.pointerType)}
              onPointerCancel={(event) => clearActiveTileIfMouse(event.pointerType)}
              className={`absolute right-[22%] sm:right-[26%] top-[50%] -translate-y-1/2 h-32 w-32 sm:h-52 sm:w-52 rounded-[1.1rem] sm:rounded-[1.4rem] overflow-hidden border border-white/20 bg-black/35 backdrop-blur-xl shadow-2xl transition-all duration-400 ${activeTile === 2 ? 'translate-x-1 sm:translate-x-3 rotate-[5deg] sm:rotate-[7deg] scale-[1.04] sm:scale-[1.09]' : 'rotate-[1deg] sm:rotate-[2deg] hover:translate-x-1 sm:hover:translate-x-2 hover:rotate-[3deg] sm:hover:rotate-[5deg] hover:scale-[1.03] sm:hover:scale-[1.06]'}`}
            >
              <LazyImage src={stackedImages[2]} alt="Shop preview right one" className="h-full w-full object-cover" />
            </div>
            <div
              onPointerEnter={() => setActiveTile(3)}
              onPointerDown={() => setActiveTile(3)}
              onPointerUp={(event) => clearActiveTileIfMouse(event.pointerType)}
              onPointerCancel={(event) => clearActiveTileIfMouse(event.pointerType)}
              className={`absolute right-[6%] sm:right-[12%] top-[54%] -translate-y-1/2 h-32 w-32 sm:h-52 sm:w-52 rounded-[1.1rem] sm:rounded-[1.4rem] overflow-hidden border border-white/20 bg-black/35 backdrop-blur-xl shadow-2xl transition-all duration-400 ${activeTile === 3 ? 'translate-x-1 sm:translate-x-6 rotate-[7deg] sm:rotate-[14deg] scale-[1.04] sm:scale-[1.1]' : 'rotate-[5deg] sm:rotate-[8deg] hover:translate-x-2 sm:hover:translate-x-5 hover:rotate-[8deg] sm:hover:rotate-[12deg] hover:scale-[1.04] sm:hover:scale-[1.07]'}`}
            >
              <LazyImage src={stackedImages[3]} alt="Shop preview right two" className="h-full w-full object-cover" />
            </div>

            <div
              onPointerEnter={() => setActiveTile(4)}
              onPointerDown={() => setActiveTile(4)}
              onPointerUp={(event) => clearActiveTileIfMouse(event.pointerType)}
              onPointerCancel={(event) => clearActiveTileIfMouse(event.pointerType)}
              className={`absolute left-1/2 top-[23%] -translate-x-1/2 h-36 w-36 sm:h-56 sm:w-56 rounded-[1.25rem] sm:rounded-[1.6rem] overflow-hidden border border-primary/40 bg-black/40 backdrop-blur-xl shadow-[0_20px_60px_rgba(249,115,22,0.35)] transition-all duration-400 ${activeTile === 4 ? '-translate-y-2 sm:-translate-y-3 scale-[1.07] sm:scale-[1.14] rotate-0' : 'hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-[1.05] sm:hover:scale-[1.1]'}`}
            >
              <LazyImage src={stackedImages[4]} alt="Shop preview center" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.18em] text-primary font-orbitron">Open Shop</p>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex justify-center">
              <span className="stitch-btn-primary">Go to Shopping Page</span>
            </div>
          </button>
        </div>

        {showCatalog && (
          <>
            <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              <p className="stitch-chip mb-4">Shop</p>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-balance font-orbitron text-foreground">Products</h2>
              <div className="mt-4 flex flex-wrap justify-center items-center gap-3 text-sm">
                <span className="font-rajdhani">Category:</span>
                <div className="flex gap-2">
                  {['All', 'Electronics', 'Clothing'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full border text-xs uppercase tracking-[0.12em] font-orbitron transition-colors ${
                        selectedCategory === cat
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-white/20 bg-black/35 hover:bg-black/50 hover:text-primary'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Showing {displayedCount} of {totalCount} products</p>
            </div>

            <div id="shop-catalog" className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {itemsToShow.map((product, i) => (
                <div
                  key={product.id}
                  className={`group relative flex flex-col overflow-hidden rounded-[10px] border border-slate-200/80 bg-slate-50/95 p-2.5 text-slate-900 shadow-[0px_10px_12px_rgba(15,23,42,0.08),-4px_-4px_12px_rgba(148,163,184,0.18)] transition-all duration-300 hover:-translate-y-2.5 hover:border-primary/40 hover:shadow-[0px_20px_20px_rgba(15,23,42,0.14),-4px_-4px_12px_rgba(148,163,184,0.2)] dark:border-white/10 dark:bg-slate-900/85 dark:text-slate-100 dark:shadow-[0px_10px_12px_rgba(0,0,0,0.35),-4px_-4px_12px_rgba(0,0,0,0.2)] dark:hover:shadow-[0px_20px_20px_rgba(0,0,0,0.45),-4px_-4px_12px_rgba(0,0,0,0.25)] fade-up-stagger ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                  style={{ transitionDelay: `${150 + i * 80}ms`, animationDelay: `${150 + i * 80}ms` }}
                >
                  <div className="mb-3 aspect-square w-full rounded-[10px] bg-slate-200/80 dark:bg-slate-800/80 flex items-center justify-center overflow-hidden relative">
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
                    {product.isNew && (
                      <div className="absolute left-3 top-3 rounded-full bg-green-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-md font-orbitron">
                        New
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-2 flex justify-center px-2 sm:bottom-3 sm:px-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <button
                        onClick={() => handleProductAction(product)}
                        className="w-full max-w-[140px] sm:max-w-[180px] rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary to-orange-400 px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-[11px] sm:text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-[1.02] font-orbitron"
                      >
                        {product.category === 'Clothing' ? 'Choose Size' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                  <div className="relative px-1 pb-1 text-left">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-[11px] sm:text-sm line-clamp-2 font-rajdhani text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors duration-300">{product.title}</h3>
                      <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-medium text-primary">
                        {product.category}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-300 mb-3 sm:mb-4 text-pretty line-clamp-3">{product.description}</p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm sm:text-lg font-bold text-primary tabular-nums font-space-mono">{formatPrice(product.price)}</span>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <button
                          onClick={() => openProductModal(product)}
                          className="rounded-lg sm:rounded-xl border border-slate-300 bg-slate-100 px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs font-medium text-slate-900 transition-all duration-300 hover:border-primary/40 hover:bg-slate-200 hover:text-primary hover:shadow-lg hover:shadow-primary/10 active:scale-95 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:hover:text-primary font-rajdhani"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleProductAction(product)}
                          className="rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-orange-400 px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/40 active:scale-95 font-rajdhani"
                        >
                          {product.category === 'Clothing' ? 'Sizes' : 'Add'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMore}
                  className="stitch-btn-primary"
                >
                  Load More
                  <ChevronDown size={16} />
                </button>
              </div>
            )}

            {cart.length > 0 && (
              <div className="mt-8 flex justify-center animate-fade-up">
                <button
                  onClick={() => window.dispatchEvent(new Event("open-cart"))}
                  className="stitch-btn-ghost"
                >
                  <Eye size={18} />
                  View Cart ({cart.length} items)
                </button>
              </div>
            )}
          </>
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

    </section>
  );
}
