import { useState, useEffect, useCallback } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLazyLoad } from "@/hooks/useLazyLoad";
import { loadContentWithLiveEditor, useLiveEditorUpdates } from "@/utils/contentLoader";
import LazyImage from "./LazyImage";

interface Update {
  id: string;
  title: string;
  content: string | null;
  image_url?: string | null;
  created_at: string;
}

export default function UpdatesSection() {
  const { ref, isVisible } = useScrollReveal();
  const [updates, setUpdates] = useState<Update[]>([]);
  const { displayedItems, hasMore, loadMore, totalCount, displayedCount } = useLazyLoad(updates, {
    initialCount: 2,
    incrementCount: 2,
  });

  const fetchUpdates = useCallback(async () => {
    const updates = await loadContentWithLiveEditor('updates', 'live_updates');
    setUpdates(updates);
  }, []);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  useLiveEditorUpdates(fetchUpdates);

  const placeholders: Update[] = updates.length > 0 ? updates : [
    { id: "1", title: "New Design Collection Released", content: "Check out the latest brand identity projects added to the portfolio.", created_at: new Date().toISOString() },
    { id: "2", title: "Tech Gadget Sale — 20% Off", content: "Limited time offer on select wireless accessories and keyboards.", created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: "3", title: "YouTube Tutorial Coming Soon", content: "A deep dive into modern UI design principles with Figma.", created_at: new Date(Date.now() - 172800000).toISOString() },
  ];

  const itemsToShow = updates.length > 0 ? displayedItems : placeholders;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <section id="updates" className="section-padding" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3 font-orbitron">◆ Live Updates ◆</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance font-orbitron text-primary">Latest News</h2>
          <p className="text-sm text-muted-foreground mt-2">Showing {displayedCount} of {totalCount} updates</p>
        </div>

        <div className="space-y-6">
          {itemsToShow.map((update, i) => (
            <div
              key={update.id}
              className={`glass-card-hover p-6 sm:p-8 transition-all duration-700 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10 fade-up-stagger ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: `${150 + i * 100}ms`, animationDelay: `${150 + i * 100}ms` }}
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {update.image_url && (
                  <div className="lg:w-1/3">
                    <LazyImage
                      src={update.image_url}
                      alt={update.title}
                      className="w-full h-48 lg:h-32 object-cover rounded-lg shadow-md"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                      <Bell size={20} className="text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-lg text-balance font-rajdhani">{update.title}</h3>
                      <span className="text-sm text-muted-foreground tabular-nums shrink-0 font-space-mono">{formatDate(update.created_at)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-pretty leading-relaxed">{update.content}</p>
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium text-sm shadow-lg shadow-primary/50 hover:shadow-primary/75 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97] font-orbitron btn-neon-glow"
            >
              Load More
              <ChevronDown size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
