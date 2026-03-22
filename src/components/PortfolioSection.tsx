import { useState, useEffect, useCallback } from "react";
import { X, ChevronDown, Maximize2 } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLazyLoad } from "@/hooks/useLazyLoad";
import { loadContentWithLiveEditor, useLiveEditorUpdates } from "@/utils/contentLoader";
import LazyImage from "./LazyImage";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string | null;
}

export default function PortfolioSection() {
  const { ref, isVisible } = useScrollReveal();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const filteredItems = selectedCategory === 'All' ? items : items.filter(item => item.category === selectedCategory);
  const { displayedItems, hasMore, loadMore, totalCount, displayedCount } = useLazyLoad(filteredItems, {
    initialCount: 3,
    incrementCount: 3,
  });

  const fetchItems = useCallback(async () => {
    const data = await loadContentWithLiveEditor('portfolio', 'portfolio_items');
    setItems(data as PortfolioItem[]);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useLiveEditorUpdates(fetchItems);

  const placeholders: PortfolioItem[] = [
    { id: "1", title: "HAPPY EID", description: "Wishing all muslims a happy Eid-al Fitr celebration ", category: "Flyers", image_url: "/images/portfolio/9.jpg" },
    { id: "2", title: "Hi-Res Tech design Represntation ", description: "Stand out in your selling game", category: "Graphics Design", image_url: "/images/portfolio/5.png" },
    { id: "3", title: "High Quality Designs", description: "Get premium look as a clothing brand ", category: "Graphics Design", image_url: "/images/portfolio/2.jpg" },
    { id: "4", title: "Petronize Us Now!", description: "Logos\nFlyers\nBanners\nEdits and many more", category: "Logos", image_url: "/images/portfolio/7.jpg" },
    { id: "5", title: "Make your Birthdays a Memorable one with Us", description: "We do all sort of birthday flyers that will make your birthday a memorable one", category: "Flyers", image_url: "/images/portfolio/8.png" },
    { id: "6", title: "Make your Resturant Design feel Premium ", description: "Resturant Design feel Premium ", category: "Graphics Design", image_url: "/images/portfolio/6.jpg" },
    { id: "7", title: "Premium Looking Banners ", description: "Just 4 You", category: "Banners", image_url: "/images/portfolio/10.jpg" },
    { id: "8", title: "Why won't you work with Us??", description: "Work with us Today!!", category: "Flyers", image_url: "/images/portfolio/3.jpg" }
  ];

  // Use displayed items from lazy load hook, or placeholders if no items loaded yet
  const itemsToShow = items.length > 0 ? displayedItems : placeholders.slice(0, 3); // Show first 3 placeholders initially

  return (
    <section id="portfolio" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3 font-orbitron">◆ Portfolio ◆</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance font-orbitron text-primary">Graphic Design Works</h2>
          <div className="mt-4 flex flex-wrap justify-center items-center gap-3 text-sm">
            <span className="font-rajdhani">Category:</span>
            <div className="flex gap-2">
              {['All', 'Graphics Design', 'Flyers', 'Logos', 'Banners'].map((cat) => (
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
          <p className="text-sm text-muted-foreground mt-2">Showing {displayedCount} of {totalCount} projects</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {itemsToShow.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className={`glass-card-hover text-left overflow-hidden group transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 fade-up-stagger ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: `${150 + i * 80}ms`, animationDelay: `${150 + i * 80}ms` }}
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center overflow-hidden relative">
                {item.image_url ? (
                  <LazyImage src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <span className="text-4xl font-bold text-primary/30 font-orbitron">{item.title.charAt(0)}</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {item.image_url && (
                  <div className="absolute inset-x-0 top-3 flex justify-end px-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <span
                      onClick={(event) => {
                        event.stopPropagation();
                        setLightboxImage(item.image_url);
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-2 text-xs font-medium text-white backdrop-blur-xl transition hover:bg-black/55"
                    >
                      <Maximize2 size={14} />
                      View Image
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-base mb-1 font-rajdhani">{item.title}</h3>
                <p className="text-sm text-muted-foreground text-pretty">{item.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMore}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium text-sm shadow-lg shadow-primary/50 hover:shadow-primary/75 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97] font-orbitron btn-neon-glow"
            >
              Load More
              <ChevronDown size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setSelected(null)}>
          <div className="glass-card max-w-4xl w-full overflow-hidden animate-fade-up bg-[#111] border border-orange-500/30" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-orange-500/20">
              <h3 className="font-semibold font-rajdhani text-white">{selected.title}</h3>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-white/10 text-white/90">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-black/20">
              <div>
                <button
                  type="button"
                  onClick={() => selected.image_url && setLightboxImage(selected.image_url)}
                  className="group relative aspect-[16/10] w-full overflow-hidden border border-white/10 bg-black/10 text-left"
                >
                  {selected.image_url ? (
                    <LazyImage src={selected.image_url} alt={selected.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <span className="flex items-center justify-center h-full text-6xl font-bold text-white/30">{selected.title.charAt(0)}</span>
                  )}
                  {selected.image_url && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  )}
                  {selected.image_url && (
                    <div className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-2 text-xs font-medium text-white backdrop-blur-xl">
                      <Maximize2 size={14} />
                      Full View
                    </div>
                  )}
                </button>
              </div>
              <div className="text-white">
                <p className="text-sm text-orange-300 mb-4">{selected.description}</p>
                <p className="text-xs text-white/70">Category: <strong>{selected.category}</strong></p>
                <p className="text-xs text-white/70 mt-2">Open the image itself in full view or keep using this modal for the project details.</p>
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
