import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  keywords: string;
  source: string;
};

interface SiteSearchProps {
  className?: string;
  compact?: boolean;
  onNavigate?: () => void;
}

const BASE_ITEMS: SearchItem[] = [
  {
    id: "base-home",
    title: "Home",
    description: "Hero, featured portfolio, shop highlights, updates and contact",
    href: "/",
    keywords: "home hero portfolio shop updates videos contact",
    source: "Navigation",
  },
  {
    id: "base-about",
    title: "About",
    description: "Team, brand story and services",
    href: "/about",
    keywords: "about us services story team",
    source: "Navigation",
  },
  {
    id: "base-portfolio",
    title: "Portfolio",
    description: "Design projects, flyers, logos, banners and brand work",
    href: "/portfolio",
    keywords: "portfolio design graphics logos flyers banners",
    source: "Navigation",
  },
  {
    id: "base-shop",
    title: "Shop",
    description: "Products, gadgets, accessories and clothing",
    href: "/shop",
    keywords: "shop products gadgets clothing electronics prices",
    source: "Navigation",
  },
  {
    id: "base-updates",
    title: "Updates",
    description: "Announcements and latest studio news",
    href: "/updates",
    keywords: "updates announcements news live",
    source: "Navigation",
  },
  {
    id: "base-videos",
    title: "Videos",
    description: "Video content, clips and showcases",
    href: "/videos",
    keywords: "videos reels clips showcase",
    source: "Navigation",
  },
  {
    id: "base-contact",
    title: "Contact",
    description: "Contact details, support and collaboration",
    href: "/contact",
    keywords: "contact support email phone",
    source: "Navigation",
  },
  {
    id: "base-stitch",
    title: "Stitch Hub",
    description: "Legacy stitched pages and static artifacts",
    href: "/stitch",
    keywords: "stitch legacy artifact pages",
    source: "Navigation",
  },
  {
    id: "base-stitch-about",
    title: "Stitch About",
    description: "About page in stitch layout",
    href: "/stitch/0",
    keywords: "stitch about page",
    source: "Navigation",
  },
  {
    id: "base-stitch-contact",
    title: "Stitch Contact",
    description: "Contact page in stitch layout",
    href: "/stitch/1",
    keywords: "stitch contact page",
    source: "Navigation",
  },
  {
    id: "base-stitch-shop",
    title: "Stitch Shop",
    description: "Shop page in stitch layout",
    href: "/stitch/2",
    keywords: "stitch shop products",
    source: "Navigation",
  },
  {
    id: "base-stitch-portfolio",
    title: "Stitch Portfolio",
    description: "Portfolio page in stitch layout",
    href: "/stitch/3",
    keywords: "stitch portfolio showcase",
    source: "Navigation",
  },
  {
    id: "base-stitch-page6",
    title: "Stitch Page 6",
    description: "Additional stitched content page",
    href: "/stitch/6",
    keywords: "stitch page 6 legacy",
    source: "Navigation",
  },
  {
    id: "base-stitch-page7",
    title: "Stitch Page 7",
    description: "Additional stitched content page",
    href: "/stitch/7",
    keywords: "stitch page 7 legacy",
    source: "Navigation",
  },
];

const CONTENT_SECTION_TO_ROUTE: Record<string, string> = {
  hero_slider: "/",
  portfolio: "/portfolio",
  products: "/shop",
  clothing: "/shop",
  updates: "/updates",
  liveupdates: "/updates",
  videos: "/videos",
  about: "/about",
  contact: "/contact",
};

function collectTextValues(value: unknown, bucket: string[]) {
  if (value == null) return;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed) bucket.push(trimmed);
    return;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    bucket.push(String(value));
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry) => collectTextValues(entry, bucket));
    return;
  }

  if (typeof value === "object") {
    Object.values(value as Record<string, unknown>).forEach((entry) => collectTextValues(entry, bucket));
  }
}

function buildItemsFromContent(raw: unknown): SearchItem[] {
  if (!raw || typeof raw !== "object") return [];

  const result: SearchItem[] = [];
  const content = raw as Record<string, unknown>;

  Object.entries(content).forEach(([sectionKey, sectionValue]) => {
    const href = CONTENT_SECTION_TO_ROUTE[sectionKey] ?? "/";

    if (Array.isArray(sectionValue)) {
      sectionValue.forEach((entry, index) => {
        if (!entry || typeof entry !== "object") return;
        const entryObj = entry as Record<string, unknown>;

        const title =
          (typeof entryObj.title === "string" && entryObj.title.trim()) ||
          (typeof entryObj.name === "string" && entryObj.name.trim()) ||
          `${sectionKey} item ${index + 1}`;

        const description =
          (typeof entryObj.description === "string" && entryObj.description.trim()) ||
          (typeof entryObj.subtitle === "string" && entryObj.subtitle.trim()) ||
          (typeof entryObj.category === "string" && entryObj.category.trim()) ||
          `From ${sectionKey}`;

        const keywordsBucket: string[] = [sectionKey];
        collectTextValues(entryObj, keywordsBucket);

        result.push({
          id: `content-${sectionKey}-${String(entryObj.id ?? index)}`,
          title,
          description,
          href,
          keywords: keywordsBucket.join(" "),
          source: `Content: ${sectionKey}`,
        });
      });
      return;
    }

    if (sectionValue && typeof sectionValue === "object") {
      const sectionObj = sectionValue as Record<string, unknown>;
      const title =
        (typeof sectionObj.title === "string" && sectionObj.title.trim()) ||
        sectionKey;
      const description =
        (typeof sectionObj.subtitle === "string" && sectionObj.subtitle.trim()) ||
        (typeof sectionObj.description === "string" && sectionObj.description.trim()) ||
        `Explore ${sectionKey}`;

      const keywordsBucket: string[] = [sectionKey];
      collectTextValues(sectionObj, keywordsBucket);

      result.push({
        id: `content-${sectionKey}`,
        title,
        description,
        href,
        keywords: keywordsBucket.join(" "),
        source: `Content: ${sectionKey}`,
      });
    }
  });

  return result;
}

function scoreItem(item: SearchItem, query: string) {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return 0;

  const title = item.title.toLowerCase();
  const description = item.description.toLowerCase();
  const keywords = item.keywords.toLowerCase();

  let score = 0;

  if (title === normalizedQuery) score += 120;
  if (title.startsWith(normalizedQuery)) score += 70;
  if (title.includes(normalizedQuery)) score += 40;
  if (description.includes(normalizedQuery)) score += 20;
  if (keywords.includes(normalizedQuery)) score += 15;

  normalizedQuery.split(/\s+/).forEach((term) => {
    if (!term) return;
    if (title.includes(term)) score += 8;
    if (description.includes(term)) score += 5;
    if (keywords.includes(term)) score += 3;
  });

  return score;
}

export default function SiteSearch({ className, compact = false, onNavigate }: SiteSearchProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [indexedItems, setIndexedItems] = useState<SearchItem[]>(BASE_ITEMS);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;

    let isCancelled = false;

    const indexContent = async () => {
      const contentCandidates: unknown[] = [];

      const liveEditorRaw = localStorage.getItem("liveEditorContent");
      if (liveEditorRaw) {
        try {
          contentCandidates.push(JSON.parse(liveEditorRaw));
        } catch {
          // Ignore malformed local cache and continue with file content.
        }
      }

      try {
        const response = await fetch(`/content.json?v=${Date.now()}`, { cache: "no-store" });
        if (response.ok) {
          const json = await response.json();
          contentCandidates.push(json);
        }
      } catch {
        // Keep base search entries even if content file is unavailable.
      }

      const dynamicItems = contentCandidates.flatMap((entry) => buildItemsFromContent(entry));

      const currentPageText = (document.querySelector("main")?.textContent ?? "")
        .replace(/\s+/g, " ")
        .trim();

      const pageItem: SearchItem | null = currentPageText
        ? {
            id: `page-${location.pathname}`,
            title: `This page (${location.pathname})`,
            description: currentPageText.slice(0, 240),
            href: location.pathname,
            keywords: currentPageText,
            source: "Current Page",
          }
        : null;

      const merged = [...BASE_ITEMS, ...dynamicItems, ...(pageItem ? [pageItem] : [])];
      const deduped = Array.from(new Map(merged.map((item) => [item.id, item])).values());

      if (!isCancelled) {
        setIndexedItems(deduped);
      }
    };

    indexContent();

    return () => {
      isCancelled = true;
    };
  }, [open, location.pathname]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return indexedItems.slice(0, 12);
    }

    return indexedItems
      .map((item) => ({ item, score: scoreItem(item, query) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map((entry) => entry.item);
  }, [indexedItems, query]);

  const openSearch = () => setOpen(true);

  const goToResult = (item: SearchItem) => {
    setOpen(false);
    setQuery("");
    navigate(item.href);
    onNavigate?.();
  };

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        className={className}
        aria-label="Search website"
      >
        <Search size={18} />
        {!compact && <span>Search</span>}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl border-white/15 bg-black/85 text-white backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="font-orbitron tracking-wide">Search the website</DialogTitle>
            <DialogDescription className="text-white/70">
              Find pages, products, portfolio pieces, updates and more. Shortcut: Ctrl/Cmd + K.
            </DialogDescription>
          </DialogHeader>

          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search anything..."
            autoFocus
            className="border-white/20 bg-black/55 text-white placeholder:text-white/45"
          />

          <div className="max-h-[50vh] overflow-y-auto rounded-xl border border-white/10">
            {results.length === 0 ? (
              <p className="px-4 py-6 text-sm text-white/70">No matching results. Try a different keyword.</p>
            ) : (
              <div className="space-y-1 p-2">
                {results.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => goToResult(item)}
                    className="h-auto w-full justify-start rounded-lg px-3 py-3 text-left hover:bg-white/10"
                  >
                    <div className="w-full">
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-white/70">{item.description}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-primary/90">{item.source}</p>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
