import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        // Try to load from Supabase first
        const { data, error } = await supabase
          .from("live_updates")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6);

        if (data && data.length > 0) {
          setUpdates(data as Update[]);
        } else {
          // Fallback to local JSON file
          const response = await fetch('/content.json');
          const content = await response.json();
          setUpdates(content.updates || []);
        }
      } catch (error) {
        // Fallback to local JSON file
        try {
          const response = await fetch('/content.json');
          const content = await response.json();
          setUpdates(content.updates || []);
        } catch (fallbackError) {
          console.error("Error loading updates data:", fallbackError);
          setUpdates([]);
        }
      }
    };

    fetchUpdates();

    // Simple polling every 30 seconds
    const interval = setInterval(fetchUpdates, 30000);

    return () => clearInterval(interval);
  }, []);

  const placeholders: Update[] = updates.length > 0 ? updates : [
    { id: "1", title: "New Design Collection Released", content: "Check out the latest brand identity projects added to the portfolio.", created_at: new Date().toISOString() },
    { id: "2", title: "Tech Gadget Sale — 20% Off", content: "Limited time offer on select wireless accessories and keyboards.", created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: "3", title: "YouTube Tutorial Coming Soon", content: "A deep dive into modern UI design principles with Figma.", created_at: new Date(Date.now() - 172800000).toISOString() },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <section id="updates" className="section-padding" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">Live Updates</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">Latest News</h2>
        </div>

        <div className="space-y-6">
          {placeholders.map((update, i) => (
            <div
              key={update.id}
              className={`glass-card-hover p-6 sm:p-8 transition-all duration-700 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: `${150 + i * 100}ms` }}
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {update.image_url && (
                  <div className="lg:w-1/3">
                    <img
                      src={update.image_url}
                      alt={update.title}
                      className="w-full h-48 lg:h-32 object-cover rounded-lg shadow-md"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Bell size={20} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-lg text-balance">{update.title}</h3>
                      <span className="text-sm text-muted-foreground tabular-nums shrink-0">{formatDate(update.created_at)}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-pretty leading-relaxed">{update.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
