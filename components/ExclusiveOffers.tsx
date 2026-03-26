"use client";

import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { useI18n } from "@/lib/i18n/dictionary-context";

// Keep image URLs static (not translatable)
const offerImages = [
  "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=80",
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
  "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
];

const highlightIndices = [0, 4]; // indices of offers that are "most requested"

export default function ExclusiveOffers() {
  const { dict, dir } = useI18n();
  const d = dict.offers;

  return (
    <section id="offers" className="py-20 bg-white">
      <ScrollReveal>
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFF7ED] to-[#FEF3C7] border border-[#FDE68A]/40 rounded-full px-4 py-1.5 mb-5 shadow-sm">
              <svg className="w-4 h-4 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-medium text-[#92400E]">{d.badge}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold text-[#111] leading-tight mb-4">
              {d.title} <span className="font-semibold">{d.titleBold}</span>
            </h2>
            <p className="text-[#6B7280] text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-8">
              {d.subtitle}
            </p>
          </div>

          {/* Offers Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {d.items.map((offer, idx) => {
              const isHighlight = highlightIndices.includes(idx);
              return (
                <div
                  key={idx}
                  className="group relative flex flex-col"
                >
                  {/* Image Section */}
                  <div className="relative h-56 rounded-3xl overflow-hidden shadow-md">
                    <Image
                      src={offerImages[idx]}
                      alt={offer.destination}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={65}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    {/* Subtle dark gradient overlay at top for badges */}
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />

                    {/* Badges container */}
                    <div className="absolute top-4 inset-x-4 flex justify-between items-start">
                      {isHighlight && (
                        <div className="bg-[#0EA5E9]/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-white/20">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {d.mostRequested}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Overlapping Content Box */}
                  <div className="relative -mt-10 z-10 mx-4 bg-white rounded-2xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-[#F1F5F9] transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-10px_rgba(14,165,233,0.15)] flex flex-col flex-grow">

                    {/* Header: Destination & Price */}
                    <div className="flex justify-between items-start mb-4 gap-2">
                      <div>
                        <h3 className="text-[19px] font-bold text-[#0F172A] leading-tight group-hover:text-[#0EA5E9] transition-colors">{offer.destination}</h3>
                        <div className="flex items-center gap-1.5 mt-1.5 text-[#64748B]">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-[12px] font-medium">{offer.duration}</span>
                        </div>
                      </div>
                      <div className={`shrink-0 ${dir === "rtl" ? "text-left" : "text-right"}`}>
                        <div className="flex items-baseline justify-end gap-1">
                          <span className="text-2xl font-black text-[#0F172A] truncate max-w-[120px]">{offer.price}</span>
                          <span className="text-sm font-bold text-[#64748B]">$</span>
                        </div>
                        <span className={`block text-[10px] text-[#94A3B8] font-medium ${dir === "rtl" ? "text-left" : "text-right"}`}>{d.perPerson}</span>
                      </div>
                    </div>

                    {/* Services Summary (Vertical list) */}
                    <div className="flex flex-col gap-2.5 mb-6 flex-grow">
                      {offer.services.map((s, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="mt-[2px] w-4 h-4 rounded-full bg-[#E0F2FE] flex items-center justify-center shrink-0">
                            <svg className="w-2.5 h-2.5 text-[#0EA5E9]" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </div>
                          <span className="text-[13px] font-medium text-[#64748B] leading-tight">{s}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <a
                      href="https://wa.me/201032549630"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-bold transition-all duration-300 active:scale-[0.98] border-2 border-[#E2E8F0] text-[#0F172A] hover:border-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white"
                    >
                      {d.quickBook}
                      <svg className={`w-4 h-4 ${dir === "rtl" ? "scale-x-[-1]" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
