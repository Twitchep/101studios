import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PortfolioSection from "@/components/PortfolioSection";
import ShopSection from "@/components/ShopSection";
import UpdatesSection from "@/components/UpdatesSection";
import VideosSection from "@/components/VideosSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => (
  <>
    <Navbar />
    <main>
      <HeroSection />
      <PortfolioSection />
      <ShopSection />
      <UpdatesSection />
      <VideosSection />
      <ContactSection />
    </main>
    <Footer />
  </>
);

export default Index;
