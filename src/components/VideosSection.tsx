import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";

interface Video {
  id: string;
  title: string;
  url: string;
  platform: string | null;
}

function getEmbedUrl(url: string): string | null {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // TikTok
  const ttMatch = url.match(/tiktok\.com\/@[\w.]+\/video\/(\d+)/);
  if (ttMatch) return `https://www.tiktok.com/embed/v2/${ttMatch[1]}`;
  return null;
}

export default function VideosSection() {
  const { ref, isVisible } = useScrollReveal();
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Try to load from Supabase first
        const { data, error } = await supabase
          .from("videos")
          .select("*")
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          setVideos(data as Video[]);
        } else {
          // Fallback to local JSON file
          const response = await fetch('/content.json');
          const content = await response.json();
          setVideos(content.videos || []);
        }
      } catch (error) {
        // Fallback to local JSON file
        try {
          const response = await fetch('/content.json');
          const content = await response.json();
          setVideos(content.videos || []);
        } catch (fallbackError) {
          console.error("Error loading videos data:", fallbackError);
          setVideos([]);
        }
      }
    };

    fetchVideos();

    // Simple polling every 30 seconds
    const interval = setInterval(fetchVideos, 30000);

    return () => clearInterval(interval);
  }, []);

  const placeholders: Video[] = videos.length > 0 ? videos : [
    { id: "1", title: "Design Process Breakdown", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", platform: "youtube" },
    { id: "2", title: "Tech Gadget Review", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", platform: "youtube" },
  ];

  return (
    <section id="videos" className="section-padding bg-secondary/30" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">Videos</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">Video Showcase</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {placeholders.map((video, i) => {
            const embedUrl = getEmbedUrl(video.url);
            return (
              <div
                key={video.id}
                className={`glass-card-hover overflow-hidden transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: `${150 + i * 100}ms` }}
              >
                {embedUrl ? (
                  <div className="aspect-video">
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={video.title}
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <a href={video.url} target="_blank" rel="noopener noreferrer" className="aspect-video bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center group">
                    <Play size={48} className="text-primary/40 group-hover:text-primary/70 transition-colors" />
                  </a>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-sm">{video.title}</h3>
                  {video.platform && (
                    <span className="text-xs text-muted-foreground capitalize">{video.platform}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
