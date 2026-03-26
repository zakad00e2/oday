import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import type { Dictionary } from "@/lib/i18n/dictionary-context";

export default function CTAHeroBanner({
  cta,
}: {
  cta: Dictionary["cta"];
}) {
  return (
    <ScrollReveal as="section" className="px-4 md:px-8 py-10 md:py-16 bg-white">
      <div className="relative w-full rounded-[28px] md:rounded-[32px] overflow-hidden flex items-center justify-center py-16 md:py-44">
        <Image
          src="/optimized/cover-cta.avif"
          alt={cta.title}
          fill
          sizes="100vw"
          quality={45}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center text-center px-6 gap-6 md:gap-8">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
            {cta.title}
            <br />
            {cta.brandName}
          </h2>
        </div>
      </div>
    </ScrollReveal>
  );
}
