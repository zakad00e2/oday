"use client";

import { useState } from "react";
import ScrollReveal from "./ScrollReveal";

const offers = [
  {
    id: 1,
    destination: "شرم الشيخ",
    price: "٢,٤٩٩",
    currency: "جنيه",
    duration: "3 ليالي / 4 أيام",
    highlight: true,
    services: ["إقامة فندق 5 نجوم", "إفطار يومي", "نقل من المطار", "جولة بحرية مجانية"],
    image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=80",
  },
  {
    id: 2,
    destination: "الغردقة",
    price: "١,٩٩٩",
    currency: "جنيه",
    duration: "3 ليالي / 4 أيام",
    highlight: false,
    services: ["إقامة فندق 4 نجوم", "إفطار وعشاء", "نقل من المطار", "سنوركلينج مجاني"],
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
  },
  {
    id: 3,
    destination: "العين السخنة",
    price: "١,٢٩٩",
    currency: "جنيه",
    duration: "2 ليلة / 3 أيام",
    highlight: false,
    services: ["إقامة فندق 4 نجوم", "إفطار يومي", "استخدام حمام السباحة", "Wi-Fi مجاني"],
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  },
  {
    id: 4,
    destination: "مرسى مطروح",
    price: "١,٧٩٩",
    currency: "جنيه",
    duration: "3 ليالي / 4 أيام",
    highlight: false,
    services: ["إقامة فندق 4 نجوم", "إفطار يومي", "جولة سياحية", "نقل داخلي"],
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
  },
  {
    id: 5,
    destination: "الأقصر وأسوان",
    price: "٣,٤٩٩",
    currency: "جنيه",
    duration: "4 ليالي / 5 أيام",
    highlight: true,
    services: ["رحلة نيلية فاخرة", "وجبات كاملة", "جولات أثرية", "مرشد سياحي"],
    image: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80",
  },
  {
    id: 6,
    destination: "دهب",
    price: "١,٥٩٩",
    currency: "جنيه",
    duration: "3 ليالي / 4 أيام",
    highlight: false,
    services: ["إقامة بوتيك مميزة", "إفطار يومي", "رحلة سفاري", "غوص مجاني"],
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
  },
];

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-[#0EA5E9] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

export default function ExclusiveOffers() {
  const [activeTab, setActiveTab] = useState<"all" | "highlighted">("all");
  const filtered = activeTab === "all" ? offers : offers.filter((o) => o.highlight);

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
            <span className="text-xs font-medium text-[#92400E]">عروض حصرية</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-medium text-[#111] leading-tight mb-4">
 عروض <span className="font-semibold">لأجمل الوجهات</span>
          </h2>
          <p className="text-[#6B7280] text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-8">
            استفد من أقوى العروض على أفضل الوجهات السياحية المصرية بأسعار مميزة تشمل الإقامة والخدمات.
          </p>

          {/* Filter tabs */}
          <div className="inline-flex bg-[#F9FAFB] border border-[#E5E7EB] rounded-full p-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "all" ? "bg-[#111] text-white shadow-sm" : "text-[#6B7280] hover:text-[#111]"
              }`}
            >
              جميع العروض
            </button>
            <button
              onClick={() => setActiveTab("highlighted")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "highlighted" ? "bg-[#111] text-white shadow-sm" : "text-[#6B7280] hover:text-[#111]"
              }`}
            >
              الأكثر طلباً
            </button>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((offer) => (
            <div
              key={offer.id}
              className={`relative group rounded-[24px] overflow-hidden border transition-all duration-500 hover:shadow-xl ${
                offer.highlight
                  ? "border-[#0EA5E9]/30 bg-gradient-to-b from-[#F0F9FF] to-white shadow-md"
                  : "border-[#F3F4F6] bg-white shadow-sm"
              }`}
            >
              {/* Highlight badge */}
              {offer.highlight && (
                <div className="absolute top-4 left-4 z-10 bg-[#0EA5E9] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
                  الأكثر طلباً
                </div>
              )}

              {/* Image */}
              <div className="relative overflow-hidden aspect-[16/9]">
                <img
                  src={offer.image}
                  alt={offer.destination}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-[#111]">
                    {offer.duration}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#111] mb-1">{offer.destination}</h3>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-3xl font-bold text-[#0EA5E9]">{offer.price}</span>
                  <span className="text-sm text-[#6B7280]">{offer.currency} / للشخص</span>
                </div>

                {/* Services */}
                <ul className="space-y-2.5 mb-6">
                  {offer.services.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#374151]">
                      <CheckIcon />
                      {s}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="https://wa.me/201032549630"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all duration-300 active:scale-[0.97] ${
                    offer.highlight
                      ? "bg-[#0EA5E9] text-white hover:bg-[#0284C7] shadow-md shadow-[#0EA5E9]/20"
                      : "bg-[#111] text-white hover:bg-[#333] shadow-sm"
                  }`}
                >
                  احجز الآن
                  <svg className="w-4 h-4 scale-x-[-1]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      </ScrollReveal>
    </section>
  );
}
