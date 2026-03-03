import Hero from "@/components/Hero";
import ShowcaseGallery from "@/components/ShowcaseGallery";
import HowItWorks from "@/components/HowItWorks";
import ExclusiveOffers from "@/components/ExclusiveOffers";
import CTAHeroBanner from "@/components/CTAHeroBanner";
import Packages from "@/components/Packages";

export default function Home() {
  return (
    <main>
      <Hero />
      <ExclusiveOffers />
       <Packages />
      <ShowcaseGallery />
            

      <HowItWorks />
      <CTAHeroBanner />
    </main>
  );
}
