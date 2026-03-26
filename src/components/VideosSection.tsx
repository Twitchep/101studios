import { useState, useEffect, useCallback } from "react";
import { Play, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLazyLoad } from "@/hooks/useLazyLoad";
import { loadContentWithLiveEditor, useLiveEditorUpdates } from "@/utils/contentLoader";

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

function getAutoplayLoopEmbedUrl(url: string): string | null {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) {
    const id = ytMatch[1];
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&rel=0`;
  }

  const ttMatch = url.match(/tiktok\.com\/@[\w.]+\/video\/(\d+)/);
  if (ttMatch) {
    return `https://www.tiktok.com/embed/v2/${ttMatch[1]}`;
  }

  return null;
}

export default function VideosSection() {
  const location = useLocation();
  const { ref, isVisible } = useScrollReveal();
  const [videos, setVideos] = useState<Video[]>([]);
  const [videoGlow, setVideoGlow] = useState({ x: 50, y: 50 });
  const { displayedItems, hasMore, loadMore, totalCount, displayedCount } = useLazyLoad(videos, {
    initialCount: 2,
    incrementCount: 2,
  });

  const fetchVideos = useCallback(async () => {
    const videos = await loadContentWithLiveEditor('videos', 'videos');
    setVideos(videos);
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  useLiveEditorUpdates(fetchVideos);

  const placeholders: Video[] = videos.length > 0 ? videos : [
    { id: "1", title: "Design Process Breakdown", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", platform: "youtube" },
    { id: "2", title: "Tech Gadget Review", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", platform: "youtube" },
  ];

  const itemsToShow = videos.length > 0 ? displayedItems : placeholders;
  const heroVideo = (videos.length > 0 ? videos[0] : placeholders[0]);
  const featuredLocalVideo = "/video.mp4";
  const isLandingPage = location.pathname === "/";

  return (
    <section id="videos" className="section-padding" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="stitch-chip mb-4">Videos</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-balance font-orbitron text-foreground">Video Showcase</h2>
          <p className="text-sm text-muted-foreground mt-2">Showing {displayedCount} of {totalCount} videos</p>
        </div>

        <div className={`mb-10 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div
            className={`stitch-panel overflow-hidden group ${isLandingPage ? "rounded-none border-x-0" : ""}`}
            onMouseMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              const x = ((event.clientX - rect.left) / rect.width) * 100;
              const y = ((event.clientY - rect.top) / rect.height) * 100;
              setVideoGlow({ x, y });
            }}
            onMouseLeave={() => setVideoGlow({ x: 50, y: 50 })}
          >
            <div className={`${isLandingPage ? "aspect-[16/9] min-h-[220px] sm:aspect-[21/9] sm:min-h-[42vh] lg:aspect-[23/9]" : "aspect-[16/9] sm:aspect-[21/9]"} relative bg-black overflow-hidden`}>
              <video
                src={featuredLocalVideo}
                className={`w-full h-full transition-transform duration-700 group-hover:scale-[1.045] ${isLandingPage ? "object-contain sm:object-cover" : "object-cover"}`}
                autoPlay
                controls
                loop
                playsInline
                preload="auto"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/30" />
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at ${videoGlow.x}% ${videoGlow.y}%, rgba(249,115,22,0.3), rgba(249,115,22,0.12) 16%, transparent 40%)`,
                }}
              />
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[linear-gradient(120deg,transparent_25%,rgba(255,255,255,0.16)_48%,transparent_70%)]" />
            </div>

            <div className="p-4 sm:p-5 border-t border-white/10">
              <p className="text-[11px] uppercase tracking-[0.16em] text-primary font-orbitron">Featured Loop</p>
              <h3 className="mt-1 text-base sm:text-lg font-semibold font-rajdhani text-foreground">Studio Featured Video</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {itemsToShow.map((video, i) => {
            const embedUrl = getEmbedUrl(video.url);
            return (
              <div
                key={video.id}
                className={`stitch-panel overflow-hidden transition-all duration-700 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20 fade-up-stagger ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: `${150 + i * 100}ms`, animationDelay: `${150 + i * 100}ms` }}
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
                  <a href={video.url} target="_blank" rel="noopener noreferrer" className="aspect-video bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center group">
                    <Play size={48} className="text-primary/40 group-hover:text-primary/70 transition-colors" />
                  </a>
                )}
                <div className="relative p-4">
                  <h3 className="font-semibold text-sm font-rajdhani text-foreground">{video.title}</h3>
                  {video.platform && (
                    <span className="text-xs text-muted-foreground capitalize font-space-mono">{video.platform}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
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
      </div>
    </section>
  );
}
