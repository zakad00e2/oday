import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import type { Dictionary } from "@/lib/i18n/dictionary-context";
import type { Locale } from "@/lib/i18n/config";

const packageHrefs = ["/hotels", "/trips", "/airport-coordination", "/contact"];
const packageImages = [
  "/optimized/package-card.webp",
  "/optimized/gallery-6.webp",
  "/optimized/airport-card.webp",
  "/optimized/contact-card.webp",
];
const featuredImage = "/optimized/gallery-4.webp";

export default function Packages({
  packages,
  lang,
}: {
  packages: Dictionary["packages"];
  lang: Locale;
}) {
  return (
    <section id="packages" className="py-14 bg-white">
      <ScrollReveal>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-4 py-1.5 mb-6">
              <span className="text-xs font-medium text-[#111]">{packages.badge}</span>
              <svg className="w-4 h-4 text-[#111]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>
            </div>
            <h2 className="text-2xl md:text-4xl font-semibold text-[#111] leading-tight mb-3">
              {packages.sectionTitle}
              <span className="font-semibold"> {packages.sectionTitleBold}</span>
            </h2>
            <p className="text-[#6B7280] text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              {packages.sectionSubtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_2fr] gap-4 items-stretch">
            <div className="relative hidden sm:block rounded-[20px] overflow-hidden min-h-[380px] lg:min-h-0 cursor-pointer group border border-[#F3F4F6] shadow-sm hover:shadow-lg transition-all duration-500">
              <Image
                src={featuredImage}
                alt={packages.featured.title}
                fill
                sizes="(max-width: 1024px) 0px, 33vw"
                quality={60}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 start-0 end-0 p-5">
                <h3 className="text-white text-xl font-semibold leading-snug">{packages.featured.title}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packages.items.map((pkg, i) => {
                const href = packageHrefs[i];
                const isContact = i === 3;

                return (
                  <a
                    key={pkg.title}
                    href={isContact ? "https://wa.me/201032549630" : `/${lang}${href}`}
                    {...(isContact ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group bg-white rounded-[20px] overflow-hidden border border-[#F3F4F6] shadow-sm hover:shadow-lg transition-all duration-500 cursor-pointer flex flex-col"
                  >
                    <div className="relative overflow-hidden aspect-[4/3] rounded-b-[16px]">
                      <Image
                        src={packageImages[i]}
                        alt={pkg.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        quality={60}
                        className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-b-[16px]"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-sm font-semibold text-[#111] mb-1">{pkg.title}</h3>
                      <p className="text-xs text-[#6B7280] leading-relaxed mb-3">{pkg.description}</p>
                      <div className="flex items-center justify-between mt-auto ms-auto gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#111]">
                          {pkg.label}
                          <svg
                            className={`w-3.5 h-3.5 transition-transform duration-300 ${
                              lang === "ar"
                                ? "scale-x-[-1] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
                                : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
