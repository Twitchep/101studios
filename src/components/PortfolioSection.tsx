import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLazyLoad } from "@/hooks/useLazyLoad";
import { loadContentWithLiveEditor, useLiveEditorUpdates } from "@/utils/contentLoader";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
}

export default function PortfolioSection() {
  const { ref, isVisible } = useScrollReveal();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const { displayedItems, hasMore, loadMore, totalCount, displayedCount } = useLazyLoad(items, {
    initialCount: 3,
    incrementCount: 3,
  });

  useEffect(() => {
    const fetchItems = async () => {
      const data = await loadContentWithLiveEditor('portfolio', 'portfolio_items');
      setItems(data as PortfolioItem[]);
    };

    fetchItems();

    // Set up live editor update listener
    // useLiveEditorUpdates(fetchItems);

    // Simple polling every 30 seconds as backup
    const interval = setInterval(fetchItems, 30000);

    return () => clearInterval(interval);
  }, []);

  const placeholders: PortfolioItem[] = items.length > 0 ? items : [
    { id: "1", title: "Brand Identity Design", description: "Complete brand identity system with logo, typography, and color palette.", image_url: null },
    { id: "2", title: "UI Dashboard Concept", description: "Dark-themed analytics dashboard with glassmorphism elements.", image_url: null },
    { id: "3", title: "Product Packaging", description: "Minimal packaging design for a tech startup product line.", image_url: null },
    { id: "4", title: "Social Media Campaign", description: "Visual campaign designed for cross-platform social engagement.", image_url: null },
    { id: "5", title: "Typography Poster", description: "Experimental typographic poster exploring depth and layering.", image_url: null },
    { id: "6", title: "App Icon Set", description: "Suite of app icons with consistent style and detail.", image_url: null },
  ];

  // Use displayed items from lazy load hook
  const itemsToShow = items.length > 0 ? displayedItems : placeholders;

  return (
    <section id="portfolio" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3 font-orbitron">◆ Portfolio ◆</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance font-orbitron glow-text" style={{ color: "#00ff88" }}>Graphic Design Works</h2>
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
              <div className="aspect-[4/3] bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center overflow-hidden relative">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <span className="text-4xl font-bold text-primary/30 font-orbitron">{item.title.charAt(0)}</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelected(null)}>
          <div className="glass-card max-w-2xl w-full overflow-hidden animate-fade-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-glass-border">
              <h3 className="font-semibold font-rajdhani">{selected.title}</h3>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-secondary/50 text-muted-foreground transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="aspect-[16/10] bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center">
              {selected.image_url ? (
                <img src={selected.image_url} alt={selected.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-6xl font-bold text-primary/20 font-orbitron">{selected.title.charAt(0)}</span>
              )}
            </div>
            <div className="p-5">
              <p className="text-muted-foreground text-pretty">{selected.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
