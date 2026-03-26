import { useState, useEffect, useCallback, useMemo } from "react";
import { Bell, Newspaper, ExternalLink, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { loadContentWithLiveEditor, useLiveEditorUpdates } from "@/utils/contentLoader";
import LazyImage from "./LazyImage";

interface Update {
  id: string;
  title: string;
  content: string | null;
  image_url?: string | null;
  created_at: string;
}

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  image_url?: string | null;
  published_at: string;
  news_site: string;
}

const NEWS_API_URL = "/api/ghana-news?limit=4";
const FALLBACK_NEWS_IMAGES = [
  "/images/liveupdates/1.jpg",
  "/images/liveupdates/2.jpg",
  "/images/liveupdates/3.png",
  "/images/liveupdates/1.jpg",
];

const FALLBACK_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "fallback-ghanaweb",
    title: "GhanaWeb Top Stories",
    summary: "Browse the latest headlines from GhanaWeb while the live feed reconnects.",
    url: "https://www.ghanaweb.com/GhanaHomePage/NewsArchive/",
    image_url: FALLBACK_NEWS_IMAGES[0],
    published_at: new Date().toISOString(),
    news_site: "GhanaWeb",
  },
  {
    id: "fallback-myjoyonline",
    title: "MyJoyOnline News Desk",
    summary: "Open MyJoyOnline for current Ghana politics, business, and social news coverage.",
    url: "https://www.myjoyonline.com/news/",
    image_url: FALLBACK_NEWS_IMAGES[1],
    published_at: new Date(Date.now() - 3600000).toISOString(),
    news_site: "MyJoyOnline",
  },
  {
    id: "fallback-citinewsroom",
    title: "Citi Newsroom Latest Updates",
    summary: "Follow Citi Newsroom for rolling coverage from across Ghana.",
    url: "https://citinewsroom.com/category/news/",
    image_url: FALLBACK_NEWS_IMAGES[2],
    published_at: new Date(Date.now() - 7200000).toISOString(),
    news_site: "Citi Newsroom",
  },
  {
    id: "fallback-graphic",
    title: "Graphic Online Headlines",
    summary: "Graphic Online remains available as a direct source for national headlines and features.",
    url: "https://www.graphic.com.gh/news.html",
    image_url: FALLBACK_NEWS_IMAGES[3],
    published_at: new Date(Date.now() - 10800000).toISOString(),
    news_site: "Graphic Online",
  },
];

const FALLBACK_UPDATE_IMAGES = [
  "/images/liveupdates/3.png",
  "/images/liveupdates/2.jpg",
  "/images/liveupdates/1.jpg",
  "/images/liveupdates/3.png",
];

const getSourceIcon = (url: string) => {
  try {
    const host = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
  } catch {
    return null;
  }
};

export default function UpdatesSection() {
  const { ref, isVisible } = useScrollReveal();
  const [updates, setUpdates] = useState<Update[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [activeMobileCard, setActiveMobileCard] = useState<"blog" | "news" | "site" | null>(null);

  const fetchUpdates = useCallback(async () => {
    const updateData = await loadContentWithLiveEditor("updates", "live_updates");
    setUpdates(updateData);
  }, []);

  const fetchNews = useCallback(async () => {
    try {
      setNewsLoading(true);
      const response = await fetch(NEWS_API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }

      const payload = await response.json();
      const result = Array.isArray(payload?.results) ? payload.results : [];

      const normalized: NewsArticle[] = result.map((item: any) => ({
        id: String(item.id ?? item.url ?? crypto.randomUUID()),
        title: item.title ?? "News headline",
        summary: item.summary ?? "Live news summary is not available for this item.",
        url: item.url ?? "#",
        image_url: item.image_url ?? null,
        published_at: item.published_at ?? new Date().toISOString(),
        news_site: item.news_site ?? "Live Source",
      }));

      setNews((normalized.length > 0 ? normalized : FALLBACK_NEWS_ARTICLES).slice(0, 4));
    } catch (error) {
      setNews(FALLBACK_NEWS_ARTICLES);
      console.error("News API error:", error);
    } finally {
      setNewsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUpdates();
    fetchNews();
  }, [fetchUpdates, fetchNews]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setActiveMobileCard(null);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useLiveEditorUpdates(fetchUpdates);

  const blogPosts = useMemo(() => {
    const mappedFromUpdates = updates.slice(0, 3).map((item, index) => ({
      id: item.id,
      title: item.title,
      excerpt: item.content || "Fresh creative insight from our design pipeline.",
      tag: index === 0 ? "Featured" : "Editorial",
      date: item.created_at,
    }));

    if (mappedFromUpdates.length > 0) return mappedFromUpdates;

    return [
      {
        id: "blog-1",
        title: "Inside the Neon Workflow",
        excerpt: "How we build high-contrast visuals that stay readable, modern, and conversion-ready.",
        tag: "Featured",
        date: new Date().toISOString(),
      },
      {
        id: "blog-2",
        title: "Color Stacking for Brand Recall",
        excerpt: "A quick strategy for preserving your core palette while moving to futuristic UI patterns.",
        tag: "Editorial",
        date: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "blog-3",
        title: "Motion That Feels Premium",
        excerpt: "Micro-hover timing and elevation techniques that make sections feel interactive and polished.",
        tag: "Editorial",
        date: new Date(Date.now() - 172800000).toISOString(),
      },
    ];
  }, [updates]);

  const websiteUpdates = useMemo(() => {
    if (updates.length > 0) {
      return updates.slice(0, 4);
    }

    return [
      {
        id: "site-1",
        title: "Homepage visual refresh deployed",
        content: "Futuristic panel styling and section rhythm have been improved.",
        created_at: new Date().toISOString(),
      },
      {
        id: "site-2",
        title: "Shop stack interaction upgraded",
        content: "Each tile now expands independently for hover and touch.",
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "site-3",
        title: "Portfolio wall enhanced",
        content: "Asymmetric sci-fi layout tuned with glass overlays and hover depth.",
        created_at: new Date(Date.now() - 172800000).toISOString(),
      },
    ];
  }, [updates]);

  const newsToRender = news;

  const newsWithImages = useMemo(
    () =>
      newsToRender.map((item, index) => ({
        ...item,
        displayImage: item.image_url || FALLBACK_NEWS_IMAGES[index % FALLBACK_NEWS_IMAGES.length],
      })),
    [newsToRender]
  );

  const websiteUpdatesWithImages = useMemo(
    () =>
      websiteUpdates.map((item, index) => ({
        ...item,
        displayImage: item.image_url || FALLBACK_UPDATE_IMAGES[index % FALLBACK_UPDATE_IMAGES.length],
      })),
    [websiteUpdates]
  );

  const headlineThumbs = useMemo(() => {
    const newsThumbs = newsWithImages
      .map((item) => item.displayImage)
      .filter((image): image is string => !!image);

    const updateThumbs = websiteUpdatesWithImages
      .map((item) => item.displayImage)
      .filter((image): image is string => !!image);

    return [...newsThumbs, ...updateThumbs].slice(0, 6);
  }, [newsWithImages, websiteUpdatesWithImages]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const handleMobileCardFocus = (card: "blog" | "news" | "site") => {
    if (window.innerWidth >= 1024) {
      return;
    }

    setActiveMobileCard((previous) => (previous === card ? null : card));
  };

  return (
    <section id="updates" className="section-padding" ref={ref}>
      <div className="w-full">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="stitch-chip mb-4">Editorial</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-balance font-orbitron text-foreground">Stories, Headlines & Moments</h2>
          <p className="text-sm text-white/75 mt-3 font-rajdhani">Fresh inspiration and real-world stories from today.</p>
        </div>

        <div className={`relative mb-10 overflow-hidden rounded-[2rem] border border-white/20 bg-black/40 p-6 sm:p-8 lg:p-10 backdrop-blur-2xl transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="absolute inset-0">
            {headlineThumbs.length > 0 ? (
              <div className="grid h-full grid-cols-2 sm:grid-cols-3 gap-1.5 p-1.5 opacity-40">
                {headlineThumbs.map((thumb, index) => (
                  <div key={`${thumb}-${index}`} className="overflow-hidden rounded-xl border border-white/10">
                    <LazyImage src={thumb} alt={`Headline thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.28),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(249,115,22,0.24),transparent_38%),linear-gradient(145deg,rgba(0,0,0,0.75),rgba(0,0,0,0.55))]" />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/65 to-black/75" />

          <div className="relative z-10 max-w-2xl">
            <p className="stitch-chip mb-4">Daily Edit</p>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-orbitron">What’s Happening Now</h3>
            <p className="mt-3 text-sm sm:text-base text-white/85 font-rajdhani">Curated highlights, press mentions, and community moments.</p>
          </div>
        </div>

        <div className={`updates-hover-cards grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 ${activeMobileCard ? "has-mobile-focus" : ""}`}>
          <article
            className={`updates-hover-card updates-hover-card-red stitch-panel p-6 sm:p-7 transition-all duration-700 hover:-translate-y-1 hover:border-primary/40 ${
              activeMobileCard === "blog" ? "is-mobile-focused" : activeMobileCard ? "is-mobile-dimmed" : ""
            } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            onClick={() => handleMobileCardFocus("blog")}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl border border-primary/35 bg-primary/15 flex items-center justify-center">
                <Sparkles size={19} className="text-primary" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-primary font-orbitron">Studio Journal</p>
                <h3 className="text-lg font-semibold text-foreground font-rajdhani">Inside the Brand</h3>
              </div>
            </div>

            <div className="space-y-4">
              {blogPosts.map((post, index) => (
                <div key={post.id} className={`rounded-2xl border p-4 backdrop-blur-xl transition-all duration-300 ${index === 0 ? "border-primary/35 bg-primary/10" : "border-white/15 bg-black/30 hover:border-white/30"}`}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-primary font-orbitron">{post.tag}</span>
                    <span className="text-[11px] text-white/65 font-space-mono">{formatDate(post.date)}</span>
                  </div>
                  <h4 className="text-base font-semibold text-white font-rajdhani line-clamp-2">{post.title}</h4>
                  <p className="mt-2 text-sm text-white/75 leading-relaxed line-clamp-3">{post.excerpt}</p>
                </div>
              ))}
            </div>
          </article>

          <article
            className={`updates-hover-card updates-hover-card-blue stitch-panel p-6 sm:p-7 transition-all duration-700 hover:-translate-y-1 hover:border-primary/40 ${
              activeMobileCard === "news" ? "is-mobile-focused" : activeMobileCard ? "is-mobile-dimmed" : ""
            } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: "80ms" }}
            onClick={() => handleMobileCardFocus("news")}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl border border-cyan-400/35 bg-cyan-400/10 flex items-center justify-center">
                <Newspaper size={19} className="text-cyan-300" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300 font-orbitron">Top Stories</p>
                <h3 className="text-lg font-semibold text-foreground font-rajdhani">Daily Headlines</h3>
              </div>
            </div>

            <div className="space-y-4">
              {newsLoading ? (
                <div className="new2-feed-card rounded-2xl p-4 text-sm text-white/70">Loading today’s headlines...</div>
              ) : (
                newsWithImages.map((article) => (
                  <a
                    key={article.id}
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="new2-feed-card block rounded-2xl p-4 transition-all duration-300 hover:border-cyan-300/45 hover:bg-black/45"
                  >
                    <div className="mb-3 overflow-hidden rounded-xl border border-white/10 bg-black/35">
                      {article.displayImage ? (
                        <LazyImage
                          src={article.displayImage}
                          alt={article.title}
                          className="h-36 w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="h-36 w-full bg-gradient-to-br from-cyan-500/20 via-black/35 to-blue-500/20 flex items-center justify-center">
                          <Newspaper size={28} className="text-cyan-300/90" />
                        </div>
                      )}
                    </div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-cyan-300 font-orbitron">
                        {getSourceIcon(article.url) ? (
                          <img
                            src={getSourceIcon(article.url) || ""}
                            alt={`${article.news_site} logo`}
                            className="h-4 w-4 rounded-sm border border-white/20 bg-black/40"
                            loading="lazy"
                          />
                        ) : null}
                        {article.news_site}
                      </span>
                      <span className="text-[11px] text-white/65 font-space-mono">{formatDate(article.published_at)}</span>
                    </div>
                    <h4 className="text-base font-semibold text-white font-rajdhani line-clamp-2">{article.title}</h4>
                    <p className="mt-2 text-sm text-white/75 leading-relaxed line-clamp-3">{article.summary}</p>
                    <div className="mt-3 inline-flex items-center gap-2 text-xs text-cyan-300">
                      Read full story
                      <ExternalLink size={13} />
                    </div>
                  </a>
                ))
              )}
              {!newsLoading && newsWithImages.length === 0 && (
                <div className="new2-feed-card rounded-2xl p-4 text-sm text-white/70">
                  Fresh headlines are on the way. Please check back shortly.
                </div>
              )}
            </div>
          </article>

          <article
            className={`updates-hover-card updates-hover-card-green stitch-panel p-6 sm:p-7 transition-all duration-700 hover:-translate-y-1 hover:border-primary/40 ${
              activeMobileCard === "site" ? "is-mobile-focused" : activeMobileCard ? "is-mobile-dimmed" : ""
            } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: "160ms" }}
            onClick={() => handleMobileCardFocus("site")}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl border border-orange-400/35 bg-orange-500/10 flex items-center justify-center">
                <Bell size={19} className="text-orange-300" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-orange-300 font-orbitron">Brand Bulletin</p>
                <h3 className="text-lg font-semibold text-foreground font-rajdhani">Latest Highlights</h3>
              </div>
            </div>

            <div className="space-y-4">
              {websiteUpdatesWithImages.map((update) => (
                <div key={update.id} className="new2-feed-card rounded-2xl p-4 transition-all duration-300 hover:border-orange-300/35 hover:bg-black/45">
                  <div className="mb-3 overflow-hidden rounded-xl border border-white/10 bg-black/35">
                    <LazyImage
                      src={update.displayImage}
                      alt={update.title}
                      className="h-32 w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-orange-300 font-orbitron">Highlight</span>
                    <span className="text-[11px] text-white/65 font-space-mono">{formatDate(update.created_at)}</span>
                  </div>
                  <h4 className="text-base font-semibold text-white font-rajdhani line-clamp-2">{update.title}</h4>
                  <p className="mt-2 text-sm text-white/75 leading-relaxed line-clamp-3">{update.content}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
