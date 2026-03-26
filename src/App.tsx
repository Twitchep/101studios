import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import { lazy, Suspense, useEffect, useState } from "react";

// Lazy load the main page component
const Index = lazy(() => import("./pages/Index"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const StitchPage = lazy(() => import("./pages/StitchPage"));
const SectionPage = lazy(() => import("./pages/SectionPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AIAssistant = lazy(() => import("@/components/AIAssistant"));
const FloatingCartButton = lazy(() => import("@/components/FloatingCartButton"));
const CartNotification = lazy(() => import("@/components/CartNotification"));
const AnnouncementPopup = lazy(() =>
  import("@/components/AnnouncementPopup").then((module) => ({
    default: module.AnnouncementPopup,
  }))
);

const queryClient = new QueryClient();

function DeferredGlobalWidgets() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const idleCallback = (window as Window & {
      requestIdleCallback?: (callback: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    }).requestIdleCallback;

    const cancelIdleCallback = (window as Window & {
      requestIdleCallback?: (callback: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    }).cancelIdleCallback;

    if (idleCallback) {
      const id = idleCallback(() => setShouldRender(true));
      return () => {
        if (cancelIdleCallback) cancelIdleCallback(id);
      };
    }

    const timeoutId = window.setTimeout(() => setShouldRender(true), 120);
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!shouldRender) return null;

  return (
    <Suspense fallback={null}>
      <AnnouncementPopup />
      <CartNotification />
      <AIAssistant />
      <FloatingCartButton />
    </Suspense>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/shop" element={<SectionPage section="shop" />} />
              <Route path="/contact" element={<SectionPage section="contact" />} />

              <Route path="/legacy" element={<Index />} />
              <Route path="/stitch" element={<StitchPage />} />
              <Route path="/stitch/0" element={<StitchPage src="/stitch/page-0.html" />} />
              <Route path="/stitch/1" element={<StitchPage src="/stitch/page-1.html" />} />
              <Route path="/stitch/2" element={<StitchPage src="/stitch/page-2.html" />} />
              <Route path="/stitch/3" element={<StitchPage src="/stitch/page-3.html" />} />
              <Route path="/stitch/6" element={<StitchPage src="/stitch/page-6.html" />} />
              <Route path="/stitch/7" element={<StitchPage src="/stitch/page-7.html" />} />

              <Route path="/legacy/shop" element={<SectionPage section="shop" />} />
              <Route path="/legacy/portfolio" element={<SectionPage section="portfolio" />} />
              <Route path="/legacy/updates" element={<SectionPage section="updates" />} />
              <Route path="/legacy/videos" element={<SectionPage section="videos" />} />
              <Route path="/legacy/contact" element={<SectionPage section="contact" />} />

              <Route path="/portfolio" element={<SectionPage section="portfolio" />} />
              <Route path="/updates" element={<SectionPage section="updates" />} />
              <Route path="/videos" element={<SectionPage section="videos" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <DeferredGlobalWidgets />
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
