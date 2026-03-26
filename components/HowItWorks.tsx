import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import type { Dictionary } from "@/lib/i18n/dictionary-context";

export default function HowItWorks({
  howItWorks,
}: {
  howItWorks: Dictionary["howItWorks"];
}) {
  return (
    <section id="how-it-works" className="py-16 bg-white">
      <ScrollReveal>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-4 py-1.5 mb-6">
              <span className="text-xs font-medium text-[#111]">{howItWorks.badge}</span>
              <svg className="w-4 h-4 text-[#111]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="19" r="3" /><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" /><circle cx="18" cy="5" r="3" /></svg>
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold text-[#111] mb-8 tracking-tight">
              {howItWorks.sectionTitle}
            </h2>

            <div className="flex flex-wrap justify-center items-center gap-x-6 md:gap-x-12 gap-y-3">
              {howItWorks.categories.map((cat, idx) => (
                <div
                  key={cat}
                  className={`flex items-center gap-2 text-[#6B7280] text-sm font-medium ${idx >= 3 ? "hidden md:flex" : ""}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                  </svg>
                  <span>{cat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-0 items-center mt-12">
            <div className="relative rounded-[28px] overflow-hidden aspect-[4/4.5] w-full shadow-sm max-w-md mx-auto lg:max-w-none">
              <Image
                src="/optimized/sharm-activities.webp"
                alt={howItWorks.tripImageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={62}
                className="object-cover"
              />
            </div>

            <div className="lg:ps-6">
              <p className="text-[#6B7280] text-sm mb-2">{howItWorks.subtitle}</p>
              <h3 className="text-2xl md:text-3xl font-semibold text-[#111] mb-8">
                {howItWorks.stepsTitle}
              </h3>

              <div className="space-y-2">
                {howItWorks.steps.map((step) => (
                  <div
                    key={step.number}
                    className="group flex items-start gap-4 p-4 rounded-2xl transition-colors duration-300 hover:bg-[#f5f5f5] bg-transparent"
                  >
                    <span className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg font-medium transition-all duration-300 bg-[#F9FAFB] text-[#111] group-hover:bg-white ">
                      {step.number}
                    </span>
                    <div className="pt-1">
                      <h4 className="text-lg font-medium text-[#111] mb-1">
                        {step.title}
                      </h4>
                      <p className="text-sm text-[#6B7280] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
