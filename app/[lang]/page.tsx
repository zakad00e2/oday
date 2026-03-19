import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import CTAHeroBanner from "@/components/CTAHeroBanner";
import PackagesGallery from "@/components/PackagesGallery";

export default function Home() {
  return (
    <main>
      <Hero />
      <PackagesGallery />
      <HowItWorks />
      <CTAHeroBanner />
    </main>
  );
}
