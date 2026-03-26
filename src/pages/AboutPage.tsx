import { useState, useEffect, useCallback } from "react";
import { useLiveEditorUpdates } from "@/utils/contentLoader";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AboutSection {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

interface AboutData {
  hero_image: string;
  title: string;
  subtitle: string;
  bio: string;
  sections: AboutSection[];
}

const DEFAULT_ABOUT: AboutData = {
  hero_image: "/images/slider/10.jpg",
  title: "About Us",
  subtitle: "Creative. Bold. Authentic.",
  bio: "We are a premium design and tech business based in Ghana.",
  sections: [],
};

function SectionCard({ section, delay = 0 }: { section: AboutSection; delay?: number }) {
  const { ref, isVisible } = useScrollReveal();
  const [imgIdx, setImgIdx] = useState(0);
  const images = section.image_url
    ? [section.image_url, "/images/portfolio/9.jpg"]
    : ["/images/portfolio/9.jpg"];

  return (
    <div
      ref={ref}
      className={`stitch-panel overflow-hidden group transition-all duration-700`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(32px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={images[imgIdx]}
          alt={section.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => {
            if (imgIdx < images.length - 1) setImgIdx((i) => i + 1);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-4">
          <h3 className="text-lg font-bold font-orbitron text-white">{section.title}</h3>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm text-muted-foreground font-rajdhani leading-relaxed">
          {section.description}
        </p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const [about, setAbout] = useState<AboutData>(DEFAULT_ABOUT);
  const [heroImgIdx, setHeroImgIdx] = useState(0);
  const { ref: bioRef, isVisible: bioVisible } = useScrollReveal();
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal();
  const navigate = useNavigate();

  const loadAbout = useCallback(async () => {
    try {
      const liveEditorContent = localStorage.getItem("liveEditorContent");
      const liveEditorLastUpdated = parseInt(
        localStorage.getItem("contentLastUpdated") || "0",
        10
      );
      const isFresh =
        !!liveEditorLastUpdated && Date.now() - liveEditorLastUpdated < 2 * 60 * 1000;

      if (liveEditorContent && isFresh) {
        const parsed = JSON.parse(liveEditorContent);
        if (parsed.about) {
          setAbout({ ...DEFAULT_ABOUT, ...parsed.about });
          return;
        }
      }

      const res = await fetch(`/content.json?v=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });
      const json = await res.json();
      if (json.about) setAbout({ ...DEFAULT_ABOUT, ...json.about });
    } catch (e) {
      console.warn("Could not load about content", e);
    }
  }, []);

  useEffect(() => {
    loadAbout();
  }, [loadAbout]);

  useLiveEditorUpdates(loadAbout);

  useEffect(() => {
    setHeroImgIdx(0);
  }, [about.hero_image]);

  const heroFallbacks = [about.hero_image, "/images/slider/7.jpg", "/images/slider/3.jpg"].filter(
    Boolean
  );

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative min-h-[62vh] flex items-center justify-center overflow-hidden pt-16">
        <img
          src={heroFallbacks[heroImgIdx]}
          alt="About hero"
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => {
            if (heroImgIdx < heroFallbacks.length - 1) setHeroImgIdx((i) => i + 1);
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.22),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(249,115,22,0.14),transparent_35%)]" />
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-20">
          <p className="stitch-chip mb-6">About Us</p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white font-orbitron mb-5 leading-[0.95] tracking-tight">
            {about.title}
          </h1>
          <p className="text-lg md:text-2xl text-white/85 font-rajdhani max-w-2xl mx-auto">
            {about.subtitle}
          </p>
        </div>
      </section>

      {/* ── Bio ── */}
      <section className="aurora-bg section-padding" ref={bioRef}>
        <div
          className="max-w-3xl mx-auto text-center transition-all duration-700"
          style={{
            opacity: bioVisible ? 1 : 0,
            transform: bioVisible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div className="h-1 w-14 bg-gradient-to-r from-primary to-orange-400 mx-auto mb-8 rounded-full" />
          <p className="text-lg md:text-xl text-foreground/80 font-rajdhani leading-relaxed">
            {about.bio}
          </p>
        </div>
      </section>

      {/* ── Services / Sections grid ── */}
      {about.sections && about.sections.length > 0 && (
        <section className="section-padding bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="stitch-chip mb-4">What We Do</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-orbitron tracking-tight">
                Our Services
              </h2>
            </div>
            <div
              className={`grid grid-cols-1 gap-6 ${
                about.sections.length === 2
                  ? "sm:grid-cols-2"
                  : "sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {about.sections.map((section, idx) => (
                <SectionCard key={section.id} section={section} delay={idx * 120} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="aurora-bg section-padding" ref={ctaRef}>
        <div
          className="max-w-2xl mx-auto text-center transition-all duration-700"
          style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold font-orbitron mb-4">
            Ready to Work Together?
          </h2>
          <p className="text-muted-foreground mb-8 font-rajdhani">
            Browse our portfolio, shop our products, or get in touch directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/portfolio")}
              className="stitch-btn-primary gap-2"
            >
              <ArrowRight size={16} />
              View Portfolio
            </button>
            <button onClick={() => navigate("/contact")} className="stitch-btn-ghost">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

