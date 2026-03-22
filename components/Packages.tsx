"use client";

import ScrollReveal from "./ScrollReveal";
import { useI18n } from "@/lib/i18n/dictionary-context";

const packageHrefs = ["/hotels", "/trips", "/airport-coordination", "/contact"];
const packageImages = [
  "/WhatsApp Image 2026-02-27 at 8.28.20 PM.jpeg",
  "/WhatsApp%20Image%202026-02-27%20at%208.28.19%20PM%20(2).jpeg",
  "/fpi.jpg",
  "/contact-us.jpg",
];
const featuredImage = "/WhatsApp%20Image%202026-02-27%20at%208.28.19%20PM.jpeg";

export default function Packages() {
  const { dict, lang } = useI18n();
  const d = dict.packages;

  return (
    <section id="packages" className="py-14 bg-white">
      <ScrollReveal>
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-4xl font-semibold text-[#111] leading-tight mb-3">
              {d.sectionTitle}
              <span className="font-semibold"> {d.sectionTitleBold}</span>
            </h2>
            <p className="text-[#6B7280] text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              {d.sectionSubtitle}
            </p>
          </div>

          {/* Layout: Featured card + 2x2 grid */}
          <div className="grid lg:grid-cols-[1fr_2fr] gap-4 items-stretch">
            {/* Featured Card */}
            <div className="relative hidden sm:block rounded-[20px] overflow-hidden min-h-[380px] lg:min-h-0 cursor-pointer group border border-[#F3F4F6] shadow-sm hover:shadow-lg transition-all duration-500">
              <img
                src={featuredImage}
                alt={d.featured.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 start-0 end-0 p-5">
                <h3 className="text-white text-xl font-semibold leading-snug">{d.featured.title}</h3>
              </div>
            </div>

            {/* 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {d.items.map((pkg, i) => {
                const href = packageHrefs[i];
                const isContact = i === 3;
                return (
                  <a
                    key={i}
                    href={isContact ? "https://wa.me/201032549630" : `/${lang}${href}`}
                    {...(isContact ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group bg-white rounded-[20px] overflow-hidden border border-[#F3F4F6] shadow-sm hover:shadow-lg transition-all duration-500 cursor-pointer flex flex-col"
                  >
                    <div className="relative overflow-hidden aspect-[4/3] rounded-b-[16px]">
                      <img
                        src={packageImages[i]}
                        alt={pkg.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-b-[16px]"
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
