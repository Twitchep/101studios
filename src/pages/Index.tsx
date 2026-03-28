import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LoadingSpinner from "@/components/LoadingSpinner";
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { loadHomepageContentBundle } from "@/utils/contentLoader";

// Lazy load heavier components
const PortfolioSection = lazy(() => import("@/components/PortfolioSection"));
const ShopSection = lazy(() => import("@/components/ShopSection"));
const UpdatesSection = lazy(() => import("@/components/UpdatesSection"));
const VideosSection = lazy(() => import("@/components/VideosSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const Footer = lazy(() => import("@/components/Footer"));

function DeferredSection({ children, minHeight = "min-h-[220px]" }: { children: ReactNode; minHeight?: string }) {
  const [shouldRender, setShouldRender] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!triggerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px 0px" }
    );

    observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={triggerRef}>
      {shouldRender ? children : <div className={`${minHeight} w-full`} />}
    </div>
  );
}

const Index = () => {
  const [bootstrapContent, setBootstrapContent] = useState<{
    hero_slider: any[];
    portfolio: any[];
    products: any[];
    updates: any[];
    videos: any[];
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    const preloadHomeContent = async () => {
      try {
        const data = await loadHomepageContentBundle();
        if (!cancelled) {
          setBootstrapContent(data);
        }
      } catch {
        // Sections already have internal fallbacks.
      }
    };

    preloadHomeContent();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="aurora-bg min-h-screen">
      <Navbar />
      <main>
        <HeroSection initialSlides={bootstrapContent?.hero_slider} />
        <DeferredSection minHeight="min-h-[340px]">
          <Suspense fallback={<div className="py-20 flex items-center justify-center"><LoadingSpinner /></div>}>
            <PortfolioSection initialItems={bootstrapContent?.portfolio} />
          </Suspense>
        </DeferredSection>
        <DeferredSection minHeight="min-h-[320px]">
          <div className="-mt-8 sm:-mt-10 lg:-mt-12">
            <Suspense fallback={<div className="py-20 flex items-center justify-center"><LoadingSpinner /></div>}>
              <ShopSection initialProducts={bootstrapContent?.products} />
            </Suspense>
          </div>
        </DeferredSection>
        <DeferredSection minHeight="min-h-[280px]">
          <Suspense fallback={<div className="py-20 flex items-center justify-center"><LoadingSpinner /></div>}>
            <UpdatesSection initialUpdates={bootstrapContent?.updates} />
          </Suspense>
        </DeferredSection>
        <DeferredSection minHeight="min-h-[280px]">
          <Suspense fallback={<div className="py-20 flex items-center justify-center"><LoadingSpinner /></div>}>
            <VideosSection initialVideos={bootstrapContent?.videos} />
          </Suspense>
        </DeferredSection>
        <DeferredSection minHeight="min-h-[180px]">
          <ContactSection />
        </DeferredSection>
      </main>
      <DeferredSection minHeight="min-h-[120px]">
        <Suspense fallback={<div className="py-10 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
          <Footer />
        </Suspense>
      </DeferredSection>
    </div>
  );
};

export default Index;
