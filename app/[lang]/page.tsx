import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import CTAHeroBanner from "@/components/CTAHeroBanner";
import PackagesGallery from "@/components/PackagesGallery";
import ShowcaseGallery from "@/components/ShowcaseGallery";
import Packages from "@/components/Packages";

export default function Home() {
  return (
    <main>
      <Hero />
      <PackagesGallery />
            <Packages/>

      <ShowcaseGallery/>
      <HowItWorks />
      <CTAHeroBanner />
    </main>
  );
}
