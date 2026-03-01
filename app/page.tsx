import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ShowcaseGallery from "@/components/ShowcaseGallery";
import HowItWorks from "@/components/HowItWorks";
import Packages from "@/components/Packages";
import GalleryCarousel from "@/components/GalleryCarousel";
import CTAHeroBanner from "@/components/CTAHeroBanner";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ShowcaseGallery />
      <HowItWorks />
      <Packages />
      <GalleryCarousel />
      <CTAHeroBanner />
      <ContactCTA />
      <Footer />
    </main>
  );
}
