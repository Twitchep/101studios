import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Try to load from Supabase first
        const { data, error } = await supabase
          .from("portfolio_items")
          .select("*")
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          setItems(data as PortfolioItem[]);
        } else {
          // Fallback to local JSON file
          const response = await fetch('/content.json');
          const content = await response.json();
          setItems(content.portfolio || []);
        }
      } catch (error) {
        // Fallback to local JSON file
        try {
          const response = await fetch('/content.json');
          const content = await response.json();
          setItems(content.portfolio || []);
        } catch (fallbackError) {
          console.error("Error loading portfolio data:", fallbackError);
          setItems([]);
        }
      }
    };

    fetchItems();

    // Simple polling every 30 seconds
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

  return (
    <section id="portfolio" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">Portfolio</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">Graphic Design Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholders.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className={`glass-card-hover text-left overflow-hidden group transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: `${150 + i * 80}ms` }}
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <span className="text-4xl font-bold text-primary/30">{item.title.charAt(0)}</span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-base mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground text-pretty">{item.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelected(null)}>
          <div className="glass-card max-w-2xl w-full overflow-hidden animate-fade-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-glass-border">
              <h3 className="font-semibold">{selected.title}</h3>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-secondary/50 text-muted-foreground transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="aspect-[16/10] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              {selected.image_url ? (
                <img src={selected.image_url} alt={selected.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-6xl font-bold text-primary/20">{selected.title.charAt(0)}</span>
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
