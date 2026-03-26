import { ArrowDown, ShoppingBag } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { loadContentWithLiveEditor, useLiveEditorUpdates } from "@/utils/contentLoader";
import Card from "@/components/card";

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
        { id: 'slide1',  title: 'Where Bold Brands Come Alive',      subtitle: 'We craft striking visuals and memorable experiences that move people.',               image_url: '/images/slider/1.jfif' },
        { id: 'slide2',  title: 'Design That Speaks First',           subtitle: 'Before a word is read, your brand has already made its impression.',                  image_url: '/images/slider/2.png'  },
        { id: 'slide3',  title: 'Your Vision, Amplified',             subtitle: 'From concepts to campaigns — we make every brand story unforgettable.',               image_url: '/images/slider/3.jpg'  },
        { id: 'slide4',  title: 'Built for Growth',                   subtitle: 'Proven design solutions that elevate every brand touchpoint.',                         image_url: '/images/slider/4.jpg'  },
        { id: 'slide5',  title: 'Elevate Your Brand Identity',        subtitle: 'Logos, flyers, and visuals that set you apart from the crowd.',                       image_url: '/images/slider/5.jfif' },
        { id: 'slide6',  title: 'Branded Content That Converts',      subtitle: 'Purposeful design crafted to turn attention into action.',                            image_url: '/images/slider/6.jpg'  },
        { id: 'slide7',  title: 'The Art of Bold Expression',         subtitle: 'We bring your brand narrative to life with every pixel.',                             image_url: '/images/slider/7.jpg'  },
        { id: 'slide8',  title: 'Stand Out. Stay Relevant.',          subtitle: 'Timeless design meets modern aesthetics for lasting impact.',                         image_url: '/images/slider/8.jfif' },
        { id: 'slide9',  title: 'Crafted for the Premium Market',     subtitle: 'Luxury-grade visuals for brands that refuse to blend in.',                           image_url: '/images/slider/9.jfif' },
        { id: 'slide10', title: 'From Sketch to Screen',              subtitle: 'End-to-end design services that make your brand shine at every scale.',               image_url: '/images/slider/10.jpg' },
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
    <section id="hero" className="relative min-h-screen overflow-hidden section-padding pt-28" aria-label="Homepage hero">
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
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.22),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(249,115,22,0.14),transparent_35%)]" />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
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

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:gap-16">
        <div className="mx-auto lg:mx-0 lg:justify-self-start">
          <Card
            prompt="Spotlight"
            title={currentSlide.title || "Where Bold Brands Come Alive"}
            subtitle={currentSlide.subtitle || "Designs that make your story unforgettable."}
          />
        </div>

        <div className="hero-slider-panel mx-auto w-full max-w-4xl lg:mx-0 lg:justify-self-end">
          <div className="hero-slider-panel__dot" />
          <div className="hero-slider-panel__inner text-center lg:text-left">
            <div className="hero-slider-panel__ray" />
            <div className="hero-slider-panel__line hero-slider-panel__line--top" />
            <div className="hero-slider-panel__line hero-slider-panel__line--left" />
            <div className="hero-slider-panel__line hero-slider-panel__line--bottom" />
            <div className="hero-slider-panel__line hero-slider-panel__line--right" />

            <p className="hero-slider-panel__chip mb-5">
              <span className="hero-slider-panel__chip-indicator" aria-hidden="true" />
              <span>Built for Bold Brands</span>
            </p>
            <h1 className="hero-slider-panel__title text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-orbitron mb-5 leading-[0.92] tracking-tight">
              {currentSlide.title}
            </h1>
            <p className="text-base md:text-2xl text-white/85 max-w-3xl lg:max-w-2xl lg:mx-0 mx-auto mb-9 font-rajdhani">{currentSlide.subtitle}</p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-10">
              <button onClick={() => scrollTo('portfolio')} className="stitch-btn-primary">
                See Our Work
              </button>
              <button onClick={() => scrollTo('shop')} className="stitch-btn-ghost">
                Shop Collections
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
