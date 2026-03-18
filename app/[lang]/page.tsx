import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import CTAHeroBanner from "@/components/CTAHeroBanner";
import Packages from "@/components/Packages";

export default function Home() {
  return (
    <main>
      <Hero />
      <Packages />
      <HowItWorks />
      <CTAHeroBanner />
    </main>
  );
}
