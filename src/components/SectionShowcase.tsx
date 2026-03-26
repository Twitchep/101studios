import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

export type SectionKey = "portfolio" | "shop" | "updates" | "videos" | "contact";

interface ShowcaseCard {
  key: SectionKey;
  title: string;
  href: string;
  subtitle: string;
  detail: string;
  images: string[];
}

const showcaseCards: ShowcaseCard[] = [
  {
    key: "portfolio",
    title: "Portfolio",
    href: "/portfolio",
    subtitle: "Graphic design projects",
    detail: "Brand visuals, flyers, logos and premium creative direction.",
    images: ["/images/portfolio/1.jpg", "/images/portfolio/5.png", "/images/portfolio/9.jpg", "/images/portfolio/11.jpg"],
  },
  {
    key: "shop",
    title: "Shop",
    href: "/shop",
    subtitle: "Products and clothing",
    detail: "Modern product cards, quick cart flow and stylish product previews.",
    images: ["/images/products/1.jpg", "/images/products/5.png", "/images/products/10.jpg", "/images/clothing/4.png"],
  },
  {
    key: "updates",
    title: "Updates",
    href: "/updates",
    subtitle: "Live announcements",
    detail: "Keep visitors informed with polished news blocks and visual updates.",
    images: ["/images/liveupdates/1.jpg", "/images/liveupdates/2.jpg", "/images/liveupdates/3.png", "/images/announce/Ann.jpg"],
  },
  {
    key: "videos",
    title: "Videos",
    href: "/videos",
    subtitle: "Video showcase",
    detail: "Feature tutorials, reels and product videos in a cinematic layout.",
    images: ["/images/portfolio/10.jpg", "/images/portfolio/11.jpg", "/images/portfolio/12.jpg", "/images/products/asus.jpg"],
  },
  {
    key: "contact",
    title: "Contact",
    href: "/contact",
    subtitle: "Work with us",
    detail: "Clear conversion path with direct messaging and complaint handling.",
    images: ["/images/announce/ad.jpg", "/images/announce/Ann.jpg", "/images/announce/BIRTHDAY DESIGN 1.png", "/images/portfolio/8.png"],
  },
];

interface SectionShowcaseProps {
  currentSection?: SectionKey;
}

export default function SectionShowcase({ currentSection }: SectionShowcaseProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((prev) => prev + 1), 3200);
    return () => clearInterval(interval);
  }, []);

  const cards = useMemo(
    () => (currentSection ? showcaseCards.filter((card) => card.key !== currentSection) : showcaseCards),
    [currentSection]
  );

  const getImageAt = (images: string[], index: number) => {
    const len = images.length;
    const safeIndex = ((index % len) + len) % len;
    return images[safeIndex];
  };

  return (
    <section id="discover-pages" className="section-padding-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="stitch-chip mb-4">Explore Pages</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground font-orbitron">Liquid Glass Navigation</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto font-rajdhani text-base">
            Apart from the navbar, visitors can discover every section through animated glass cards with auto-switching visuals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {cards.map((card, cardIndex) => {
            const current = getImageAt(card.images, tick + cardIndex);
            const leftTop = getImageAt(card.images, tick + cardIndex - 1);
            const leftBottom = getImageAt(card.images, tick + cardIndex - 2);
            const rightTop = getImageAt(card.images, tick + cardIndex + 1);
            const rightBottom = getImageAt(card.images, tick + cardIndex + 2);

            return (
              <Link
                key={card.key}
                to={card.href}
                className="group stitch-panel min-h-[420px] p-5 sm:p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.35)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-white/10 to-black/30 dark:from-white/15 dark:to-black/45" />
                <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute -bottom-12 -right-8 h-44 w-44 rounded-full bg-orange-400/20 blur-3xl" />

                <div className="relative z-10 h-full">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-3 py-1.5 text-xs uppercase tracking-wide text-white/90 font-orbitron">
                      <Sparkles size={14} />
                      {card.subtitle}
                    </span>
                    <span className="text-xs font-space-mono text-white/80">Auto switch</span>
                  </div>

                  <div className="relative mt-6 h-[220px]">
                    <div className="absolute left-0 top-3 hidden sm:flex flex-col gap-3">
                      <img src={leftTop} alt="" className="h-20 w-16 rounded-xl object-cover border border-white/40 rotate-[-8deg] opacity-90 shadow-lg" />
                      <img src={leftBottom} alt="" className="h-20 w-16 rounded-xl object-cover border border-white/30 rotate-[-12deg] opacity-70 shadow-lg" />
                    </div>

                    <div className="absolute right-0 top-3 hidden sm:flex flex-col gap-3">
                      <img src={rightTop} alt="" className="h-20 w-16 rounded-xl object-cover border border-white/40 rotate-[8deg] opacity-90 shadow-lg" />
                      <img src={rightBottom} alt="" className="h-20 w-16 rounded-xl object-cover border border-white/30 rotate-[12deg] opacity-70 shadow-lg" />
                    </div>

                    <div className="mx-auto w-[220px] sm:w-[250px] h-full rounded-3xl border border-white/40 bg-black/20 p-2 backdrop-blur-xl shadow-2xl">
                      <img
                        src={current}
                        alt={`${card.title} preview`}
                        className="h-full w-full rounded-[1.25rem] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <div className="rounded-2xl border border-white/20 bg-black/45 backdrop-blur-md p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-white font-orbitron">{card.title}</h3>
                          <p className="mt-1 text-sm text-white/85 font-rajdhani">{card.detail}</p>
                        </div>
                        <ArrowRight className="shrink-0 text-white/90 transition-transform duration-300 group-hover:translate-x-1" size={22} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
