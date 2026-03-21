import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { lazy, Suspense } from "react";

// Lazy load heavier components
const PortfolioSection = lazy(() => import("@/components/PortfolioSection"));
const ShopSection = lazy(() => import("@/components/ShopSection"));
const UpdatesSection = lazy(() => import("@/components/UpdatesSection"));
const VideosSection = lazy(() => import("@/components/VideosSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => (
  <>
    <Navbar />
    <main>
      <HeroSection />
      <Suspense fallback={<div className="py-20 flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div></div>}>
        <PortfolioSection />
      </Suspense>
      <Suspense fallback={<div className="py-20 flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div></div>}>
        <ShopSection />
      </Suspense>
      <Suspense fallback={<div className="py-20 flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div></div>}>
        <UpdatesSection />
      </Suspense>
      <Suspense fallback={<div className="py-20 flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div></div>}>
        <VideosSection />
      </Suspense>
      <ContactSection />
    </main>
    <Suspense fallback={<div className="py-10 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
      <Footer />
    </Suspense>
  </>
);

export default Index;
