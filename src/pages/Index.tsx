import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LoadingSpinner from "@/components/LoadingSpinner";
import { lazy, Suspense } from "react";

// Lazy load heavier components
const PortfolioSection = lazy(() => import("@/components/PortfolioSection"));
const ShopSection = lazy(() => import("@/components/ShopSection"));
const UpdatesSection = lazy(() => import("@/components/UpdatesSection"));
const VideosSection = lazy(() => import("@/components/VideosSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => (
  <div className="aurora-bg min-h-screen">
    <Navbar />
    <main>
      <HeroSection />
      <Suspense fallback={<div className="py-20 flex items-center justify-center"><LoadingSpinner /></div>}>
        <PortfolioSection />
      </Suspense>
      <div className="-mt-8 sm:-mt-10 lg:-mt-12">
        <Suspense fallback={<div className="py-20 flex items-center justify-center"><LoadingSpinner /></div>}>
          <ShopSection />
        </Suspense>
      </div>
      <Suspense fallback={<div className="py-20 flex items-center justify-center"><LoadingSpinner /></div>}>
        <UpdatesSection />
      </Suspense>
      <Suspense fallback={<div className="py-20 flex items-center justify-center"><LoadingSpinner /></div>}>
        <VideosSection />
      </Suspense>
      <ContactSection />
    </main>
    <Suspense fallback={<div className="py-10 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
      <Footer />
    </Suspense>
  </div>
);

export default Index;
