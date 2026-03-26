import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioSection from "@/components/PortfolioSection";
import ShopSection from "@/components/ShopSection";
import UpdatesSection from "@/components/UpdatesSection";
import VideosSection from "@/components/VideosSection";
import ContactSection from "@/components/ContactSection";

type SectionKey = "portfolio" | "shop" | "updates" | "videos" | "contact";

interface SectionPageProps {
  section: SectionKey;
}

const sectionMeta: Record<SectionKey, { title: string; subtitle: string; badge: string }> = {
  portfolio: {
    title: "Portfolio Gallery",
    subtitle: "Explore the full collection of premium creative work.",
    badge: "Creative Works",
  },
  shop: {
    title: "Shop Collection",
    subtitle: "Discover products and clothing with a clean buying flow.",
    badge: "Storefront",
  },
  updates: {
    title: "Live Updates",
    subtitle: "Stay informed with recent announcements and studio news.",
    badge: "News Feed",
  },
  videos: {
    title: "Video Showcase",
    subtitle: "Watch curated content, tutorials and featured clips.",
    badge: "Visual Stories",
  },
  contact: {
    title: "Contact & Support",
    subtitle: "Reach out, collaborate, or send your feedback instantly.",
    badge: "Get In Touch",
  },
};

const sectionComponents: Record<SectionKey, () => JSX.Element> = {
  portfolio: PortfolioSection,
  shop: ShopSection,
  updates: UpdatesSection,
  videos: VideosSection,
  contact: ContactSection,
};

export default function SectionPage({ section }: SectionPageProps) {
  const meta = sectionMeta[section];
  const ActiveSection = sectionComponents[section];

  return (
    <div className="aurora-bg min-h-screen">
      <Navbar />
      <main className="pt-24">
        <section className="relative section-padding-sm overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="glass-card rounded-[2.25rem] border border-white/15 p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[420px] h-[180px] bg-primary/20 blur-3xl pointer-events-none" />
              <p className="relative text-xs md:text-sm font-medium tracking-[0.24em] uppercase text-primary mb-4 font-orbitron">{meta.badge}</p>
              <h1 className="relative text-4xl md:text-6xl font-bold tracking-tight font-orbitron text-foreground">{meta.title}</h1>
              <p className="relative mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-rajdhani">{meta.subtitle}</p>
            </div>
          </div>
        </section>

        <ActiveSection />
      </main>
      <Footer />
    </div>
  );
}
