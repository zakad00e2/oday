import Hero from "@/components/Hero";
import ShowcaseGallery from "@/components/ShowcaseGallery";
import HowItWorks from "@/components/HowItWorks";
import ExclusiveOffers from "@/components/ExclusiveOffers";
import CTAHeroBanner from "@/components/CTAHeroBanner";

export default function Home() {
  return (
    <main>
      <Hero />
      <ShowcaseGallery />
            <ExclusiveOffers />

      <HowItWorks />
      <CTAHeroBanner />
    </main>
  );
}
