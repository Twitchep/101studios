import { useState, useEffect, useCallback, useMemo } from "react";
import { X, ChevronDown, Maximize2 } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLazyLoad } from "@/hooks/useLazyLoad";
import { loadContentWithLiveEditor, useLiveEditorUpdates } from "@/utils/contentLoader";
import { useLocation, useNavigate } from "react-router-dom";
import LazyImage from "./LazyImage";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string | null;
}

interface PortfolioSectionProps {
  initialItems?: PortfolioItem[];
}

export default function PortfolioSection({ initialItems = [] }: PortfolioSectionProps) {
  const { ref, isVisible } = useScrollReveal();
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState<PortfolioItem[]>(initialItems);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [hoverGlow, setHoverGlow] = useState({ x: 50, y: 50 });

  const filteredItems = selectedCategory === "All" ? items : items.filter((item) => item.category === selectedCategory);
  const { displayedItems, hasMore, loadMore, totalCount, displayedCount } = useLazyLoad(filteredItems, {
    initialCount: 3,
    incrementCount: 3,
  });

  const fetchItems = useCallback(async () => {
    const data = await loadContentWithLiveEditor("portfolio", "portfolio_items", "created_at", {
      skipSupabase: initialItems.length > 0,
    });
    const normalizedItems = Array.isArray(data) ? [...(data as PortfolioItem[])].reverse() : [];
    setItems(normalizedItems);
  }, [initialItems.length]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useLiveEditorUpdates(fetchItems);

  const placeholders: PortfolioItem[] = [
    { id: "1", title: "Festive Campaign Design", description: "Seasonal graphics built for maximum reach and cultural impact.", category: "Flyers", image_url: "/images/portfolio/9.jpg" },
    { id: "2", title: "Tech Brand Visuals", description: "High-resolution design that positions brands in the modern tech market.", category: "Graphics Design", image_url: "/images/portfolio/5.png" },
    { id: "3", title: "Premium Brand Identity", description: "Elevated clothing-brand visuals that speak confidence and quality.", category: "Graphics Design", image_url: "/images/portfolio/2.jpg" },
    { id: "4", title: "Identity & Logo Design", description: "Logos crafted to tell your brand story at a single glance.", category: "Logos", image_url: "/images/portfolio/7.jpg" },
    { id: "5", title: "Celebration Flyer Design", description: "Birthday and event flyers that capture the moment and spread the word.", category: "Flyers", image_url: "/images/portfolio/8.png" },
    { id: "6", title: "Restaurant & Hospitality", description: "Luxury branding that elevates the dining experience from menu to decor.", category: "Graphics Design", image_url: "/images/portfolio/6.jpg" },
    { id: "7", title: "Large-Format Banner Suite", description: "Engineered for visual impact and banners that stop traffic and demand attention.", category: "Banners", image_url: "/images/portfolio/10.jpg" },
    { id: "8", title: "Bold Typography Showcase", description: "Striking type-led design that commands attention before a word is read.", category: "Graphics Design", image_url: "/images/portfolio/1.jpg" },
    { id: "9", title: "Call-to-Action Flyer", description: "Compelling event flyers that convert viewers into attendees and clients.", category: "Flyers", image_url: "/images/portfolio/3.jpg" },
    { id: "10", title: "Event Graphics Package", description: "Full-suite visuals that create a consistent, memorable event experience.", category: "Flyers", image_url: "/images/portfolio/4.jpg" },
    { id: "11", title: "Social Media Creatives", description: "Scroll-stopping posts and stories designed for maximum engagement.", category: "Graphics Design", image_url: "/images/portfolio/11.jpg" },
    { id: "12", title: "Multi-Platform Campaign", description: "Cohesive branded visuals scaled seamlessly across every touchpoint.", category: "Graphics Design", image_url: "/images/portfolio/12.jpg" },
  ];

  const sourceItems = items.length > 0 ? items : placeholders;
  const itemsToShow = items.length > 0 ? displayedItems : placeholders.slice(0, 6);
  const landingTileAngles = [-15, 5, -25, -8, 12, -18, 9, -12];

  const featuredTiles = useMemo(() => {
    const pool = sourceItems.filter((item) => item.image_url);
    if (pool.length <= 8) return pool.slice(0, 8);
    const wrap = (index: number) => pool[index % pool.length];
    return Array.from({ length: 8 }, (_, index) => wrap(index));
  }, [sourceItems]);

  const showGallery = location.pathname === "/portfolio" || location.pathname === "/legacy/portfolio";
  const isLandingPortfolio = !showGallery;

  const goToPortfolioPage = () => {
    if (location.pathname !== "/portfolio") {
      navigate("/portfolio");
      return;
    }

    document.getElementById("portfolio-gallery")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const updateGlow = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setHoverGlow({ x, y });
  };

  return (
    <section id="portfolio" className={`${isLandingPortfolio ? "px-0" : "px-4 sm:px-6 lg:px-8"} py-20 sm:py-24 lg:py-32`} ref={ref}>
      <div className={`${isLandingPortfolio ? "w-full" : "max-w-6xl mx-auto"}`}>
        <div
          className={`${isLandingPortfolio ? "border-y border-white/15 bg-black/45 px-2 py-4 sm:px-3 sm:py-5 md:px-4 md:py-6" : "stitch-panel p-5 sm:p-7 md:p-8 lg:p-10"} mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          onMouseMove={updateGlow}
          style={{
            backgroundImage: `radial-gradient(circle at ${hoverGlow.x}% ${hoverGlow.y}%, rgba(249,115,22,0.28), transparent 38%)`,
          }}
        >
          <div className={`grid ${isLandingPortfolio ? "portfolio-port-container mx-auto w-full max-w-6xl grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4" : "mx-auto w-full grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"}`}>
            {featuredTiles.map((item, index) => (
              <button
                key={`feature-${item.id}`}
                onClick={goToPortfolioPage}
                className={`porto-card group relative flex flex-col overflow-hidden rounded-[1.2rem] border border-slate-200/80 bg-slate-50/95 p-2.5 text-left text-slate-900 shadow-[0px_10px_12px_rgba(15,23,42,0.08),-4px_-4px_12px_rgba(148,163,184,0.18)] transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0px_20px_20px_rgba(15,23,42,0.14),-4px_-4px_12px_rgba(148,163,184,0.2)] dark:border-white/10 dark:bg-slate-900/85 dark:text-slate-100 dark:shadow-[0px_10px_12px_rgba(0,0,0,0.35),-4px_-4px_12px_rgba(0,0,0,0.2)] dark:hover:shadow-[0px_20px_20px_rgba(0,0,0,0.45),-4px_-4px_12px_rgba(0,0,0,0.25)]`}
                style={isLandingPortfolio ? ({ ["--r" as string]: landingTileAngles[index % landingTileAngles.length] } as React.CSSProperties) : undefined}
                aria-label={`Open portfolio from ${item.title}`}
              >
                <div className={`${isLandingPortfolio ? "aspect-square" : "aspect-[3/2]"} relative mb-3 overflow-hidden rounded-[1rem] bg-slate-200/80 dark:bg-slate-800/80`}>
                  {item.image_url ? (
                    <LazyImage
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-primary/30 font-orbitron">
                      {item.title.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80" />
                  <div className="absolute left-3 right-3 top-3 flex items-center justify-between opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <span className="rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-[11px] text-white backdrop-blur-xl">
                      {item.category}
                    </span>
                    {item.image_url && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-2 text-xs font-medium text-white backdrop-blur-xl transition hover:bg-black/55">
                        <Maximize2 size={14} />
                        Preview
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative px-1 pb-1 text-left">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-[11px] sm:text-sm line-clamp-2 font-rajdhani text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                    <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-medium text-primary">
                      {item.category}
                    </span>
                  </div>
                  {item.description ? (
                    <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-300 text-pretty line-clamp-3">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-base text-white/85 font-rajdhani">Signature visuals crafted to elevate your brand story.</p>
            <button onClick={goToPortfolioPage} className="stitch-btn-primary">See the Gallery</button>
          </div>
        </div>

        {showGallery && (
          <>
            <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              <p className="stitch-chip mb-4">Portfolio</p>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-balance font-orbitron text-foreground">Signature Brand Visuals</h2>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
                <span className="font-rajdhani">Category:</span>
                <div className="flex gap-2">
                  {["All", "Graphics Design", "Flyers", "Logos", "Banners"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full border text-xs uppercase tracking-[0.12em] font-orbitron transition-colors ${
                        selectedCategory === cat
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-white/20 bg-black/35 hover:bg-black/50 hover:text-primary"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Showing {displayedCount} of {totalCount} projects</p>
            </div>

            <div id="portfolio-gallery" className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {itemsToShow.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={`porto-card portfolio-gallery-card group relative flex flex-col overflow-hidden rounded-[1.2rem] border border-slate-200/80 bg-slate-50/95 p-2.5 text-left text-slate-900 shadow-[0px_10px_12px_rgba(15,23,42,0.08),-4px_-4px_12px_rgba(148,163,184,0.18)] transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0px_20px_20px_rgba(15,23,42,0.14),-4px_-4px_12px_rgba(148,163,184,0.2)] dark:border-white/10 dark:bg-slate-900/85 dark:text-slate-100 dark:shadow-[0px_10px_12px_rgba(0,0,0,0.35),-4px_-4px_12px_rgba(0,0,0,0.2)] dark:hover:shadow-[0px_20px_20px_rgba(0,0,0,0.45),-4px_-4px_12px_rgba(0,0,0,0.25)] fade-up-stagger ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                  style={{ transitionDelay: `${150 + index * 80}ms`, animationDelay: `${150 + index * 80}ms` }}
                >
                  <div className="relative mb-3 flex aspect-[3/2] items-center justify-center overflow-hidden rounded-[1rem] bg-slate-200/80 dark:bg-slate-800/80 sm:aspect-[4/3]">
                    {item.image_url ? (
                      <LazyImage
                        src={item.image_url}
                        alt={item.title}
                        className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-primary/30 font-orbitron">
                        {item.title.charAt(0)}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80" />
                    {item.image_url && (
                      <div className="absolute inset-x-0 top-3 flex justify-end px-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            setLightboxImage(item.image_url);
                          }}
                          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-2 text-xs font-medium text-white backdrop-blur-xl transition hover:bg-black/55"
                        >
                          <Maximize2 size={14} />
                          View Image
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="relative px-1 pb-1 text-left">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-[11px] sm:text-sm line-clamp-2 font-rajdhani text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                      <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-medium text-primary">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-300 text-pretty line-clamp-3">{item.description}</p>
                  </div>
                </button>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-12">
                <button onClick={loadMore} className="stitch-btn-primary">
                  Load More
                  <ChevronDown size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in" onClick={() => setSelected(null)}>
          <div className="glass-card max-w-4xl w-full overflow-hidden border border-orange-500/30 bg-[#111] animate-fade-up" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-orange-500/20 p-4">
              <h3 className="font-semibold font-rajdhani text-white">{selected.title}</h3>
              <button onClick={() => setSelected(null)} className="rounded-lg p-1 text-white/90 hover:bg-white/10">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 bg-black/20 p-4 md:grid-cols-2">
              <div>
                <button
                  type="button"
                  onClick={() => selected.image_url && setLightboxImage(selected.image_url)}
                  className="group relative aspect-[16/10] w-full overflow-hidden border border-white/10 bg-black/10 text-left"
                >
                  {selected.image_url ? (
                    <LazyImage src={selected.image_url} alt={selected.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-6xl font-bold text-white/30">{selected.title.charAt(0)}</span>
                  )}
                  {selected.image_url && <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />}
                  {selected.image_url && (
                    <div className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-2 text-xs font-medium text-white backdrop-blur-xl">
                      <Maximize2 size={14} />
                      Full View
                    </div>
                  )}
                </button>
              </div>
              <div className="text-white">
                <p className="mb-4 text-sm text-orange-300">{selected.description}</p>
                <p className="text-xs text-white/70">Category: <strong>{selected.category}</strong></p>
                <p className="mt-2 text-xs text-white/70">Open the image itself in full view or keep using this modal for the project details.</p>
                {selected.image_url && (
                  <button
                    type="button"
                    onClick={() => setLightboxImage(selected.image_url)}
                    className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-2.5 text-sm text-white transition hover:bg-white/10"
                  >
                    <Maximize2 size={16} />
                    View Image
                  </button>
                )}
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
            <img src={lightboxImage} alt="Full portfolio view" className="max-h-[92vh] w-full object-contain" />
          </div>
        </div>
      )}
    </section>
  );
}
