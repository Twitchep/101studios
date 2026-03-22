import { ArrowDown, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { loadContentWithLiveEditor, useLiveEditorUpdates } from "@/utils/contentLoader";

interface SliderItem {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
}

export default function HeroSection() {
  const [slides, setSlides] = useState<SliderItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  // Particle customization settings
  const particleCount = 20; // Number of particles
  const particleSizeMin = 10; // Minimum particle size in px
  const particleSizeMax = 40; // Maximum particle size in px
  const animationDurationMin = 8; // Minimum animation duration in seconds
  const animationDurationMax = 18; // Maximum animation duration in seconds
  const particleOpacity = 0.4; // Particle opacity (0-1)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchSlider = useCallback(async () => {
    const data = await loadContentWithLiveEditor('hero_slider');
    if (Array.isArray(data) && data.length > 0) {
      setSlides(data as SliderItem[]);
    } else {
      setSlides([
        { id: 'default1', title: 'Welcome to Our Brand', subtitle: 'Black, white and orange style + powered by your content', image_url: '/images/portfolio/9.jpg' }
      ]);
    }
  }, []);

  useEffect(() => {
    fetchSlider();
  }, [fetchSlider]);

  useLiveEditorUpdates(fetchSlider);

  useEffect(() => {
    if (!slides.length) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [slides]);

  const currentSlide = slides[activeIndex] || slides[0] || { title: '', subtitle: '', image_url: '' };

  const getHeroImageCandidates = (rawUrl: string) => {
    const cleaned = (rawUrl || '').split(',')[0].trim();
    if (!cleaned) return [];

    const normalized = cleaned.startsWith('/') || cleaned.startsWith('http') ? cleaned : `/${cleaned}`;
    const filename = normalized.split('/').pop() || '';
    const baseName = filename.includes('.') ? filename.slice(0, filename.lastIndexOf('.')) : filename;
    const dirs = ['/images/slider', '/images/portfolio', '/images/products', '/images/clothing', '/images/liveupdates', '/images/announce', '/images'];
    const exts = ['.jpg', '.jpeg', '.png', '.jfif', '.webp'];

    const candidates = [normalized];

    if (filename) {
      dirs.forEach((dir) => {
        candidates.push(`${dir}/${filename}`);
      });
      if (baseName) {
        dirs.forEach((dir) => {
          exts.forEach((ext) => {
            candidates.push(`${dir}/${baseName}${ext}`);
          });
        });
      }
    }

    return Array.from(new Set(candidates));
  };

  const heroCandidates = getHeroImageCandidates(currentSlide.image_url);
  const currentHeroImage = heroCandidates[heroImageIndex] || currentSlide.image_url;

  useEffect(() => {
    setHeroImageIndex(0);
  }, [activeIndex, currentSlide.image_url]);

  const nextSlide = () => {
    if (!slides.length) return;
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (!slides.length) return;
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden section-padding pt-24" aria-label="Homepage hero">
      <img
        src={currentHeroImage}
        alt={currentSlide.title || "Hero slide"}
        className="absolute inset-0 w-full h-full object-cover"
        onError={() => {
          if (heroImageIndex < heroCandidates.length - 1) {
            setHeroImageIndex((prev) => prev + 1);
          }
        }}
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-white/15 dark:bg-black/45 backdrop-blur-sm" />
      <div className="water-effect" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: particleCount }).map((_, idx) => (
          <span
            key={idx}
            className="absolute rounded-full bg-white/40 dark:bg-orange-400/40 blur-sm"
            style={{
              width: `${Math.random() * (particleSizeMax - particleSizeMin) + particleSizeMin}px`,
              height: `${Math.random() * (particleSizeMax - particleSizeMin) + particleSizeMin}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: particleOpacity,
              animation: `float-${idx % 4} ${Math.random() * (animationDurationMax - animationDurationMin) + animationDurationMin}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center py-28 px-4">
        <p className="text-sm font-medium tracking-widest uppercase text-white/80 mb-4 font-orbitron">◆ Dynamic Slider</p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white font-orbitron mb-4">{currentSlide.title}</h1>
        <p className="text-base md:text-xl text-white/85 max-w-3xl mx-auto mb-8 font-rajdhani">{currentSlide.subtitle}</p>

        <div className="flex items-center justify-center gap-3 mb-8">
          <button onClick={prevSlide} className="w-10 h-10 rounded-full border border-white/60 text-white/90 hover:bg-white/10 transition">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextSlide} className="w-10 h-10 rounded-full border border-white/60 text-white/90 hover:bg-white/10 transition">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex justify-center gap-2">
          {slides.map((slide, idx) => (
            <span
              key={slide.id}
              className={`w-2 h-2 rounded-full ${idx === activeIndex ? 'bg-orange-500' : 'bg-white/50'} transition`}
              onClick={() => setActiveIndex(idx)}
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <button
            onClick={() => scrollTo('portfolio')}
            className="px-6 py-3 rounded-lg bg-white text-black font-bold hover:opacity-90 transition"
          >
            View Portfolio
          </button>
          <button
            onClick={() => scrollTo('shop')}
            className="px-6 py-3 rounded-lg border border-orange-400 text-white hover:bg-orange-500 transition"
          >
            View Shop
          </button>
        </div>
      </div>
    </section>
  );
}
