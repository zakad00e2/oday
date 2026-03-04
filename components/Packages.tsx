"use client";

import ScrollReveal from "./ScrollReveal";

const featured = {
  title: "استمتع بأفخم الفنادق",
  description: "رحلات مصممة بعناية لكل نوع من المسافرين",
  image: "/WhatsApp%20Image%202026-02-27%20at%208.28.19%20PM.jpeg",
};

const packages = [
  {
    title: "باقة الفنادق الفاخرة",
    description: "أفضل الفنادق بأسعار تنافسية في أشهر الوجهات السياحية.",
    image: "/WhatsApp Image 2026-02-27 at 8.28.20 PM.jpeg",
    price: "٢٩٩",
    href: "/hotels",
    label: "عرض الفنادق",
  },
  {
    title: "رحلات سياحية مغامرة",
    description: "استكشف المسارات الجبلية والطبيعة البرية مع مرشدين محترفين.",
    image: "/WhatsApp%20Image%202026-02-27%20at%208.28.19%20PM%20(2).jpeg",
    price: "٤٩٩",
    href: "/trips",
    label: "عرض الرحلات",
  },
  {
    title: "رحلة خاصة مخصصة",
    description: "صمم رحلتك بالكامل وفق رغباتك مع مرافق خاص ووسائل نقل مريحة.",
    image: "/WhatsApp%20Image%202026-02-27%20at%208.28.19%20PM%20(4).jpeg",
    price: "١٢٩٩",
    href: "/package-builder",
    label: "صمّم باقتك",
  },
  {
    title: "تواصل معنا",
    description: "فريقنا متاح دائماً للإجابة على استفساراتك وتصميم رحلتك المثالية.",
    image: "/contact-us.jpg",
    price: "٨٩٩",
    href: "/contact",
    label: "تواصل معنا",
  },

];

export default function Packages() {
  return (
    <section id="packages" className="py-14 bg-white">
      <ScrollReveal>
        <div className="max-w-5xl mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-8">
            {/* <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <span className="text-xs font-medium text-[#111]">عدي للسياحة</span>
          </div> */}
            <h2 className="text-2xl md:text-4xl font-medium text-[#111] leading-tight mb-3">
              اكتشف أفضل باقات السفر
              {/* <br className="hidden md:block" /> */}
              <span className="font-semibold"> لكل نوع من المسافرين </span>
            </h2>
            <p className="text-[#6B7280] text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              باقات مصممة بعناية تناسب أسلوبك وميزانيتك، سواء كنت تبحث عن المغامرة أو الراحة.
            </p>
          </div>

          {/* Layout: Featured card + 2x2 grid */}
          <div className="grid lg:grid-cols-[1fr_2fr] gap-4 items-stretch">

            {/* Featured Card */}
            <div
              className="relative rounded-[20px] overflow-hidden min-h-[380px] lg:min-h-0 cursor-pointer group"
            >
              <img
                src={featured.image}
                alt={featured.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white text-xl font-semibold leading-snug">
                  {featured.title}
                </h3>
              </div>
            </div>

            {/* 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packages.map((pkg, i) => {
                const Wrapper = pkg.href ? "a" : "div";
                return (
                  <Wrapper
                    key={i}
                    {...(pkg.href ? { href: pkg.href } : {})}
                    className="group bg-white rounded-[20px] overflow-hidden transition-all duration-300 cursor-pointer flex flex-col hover:shadow-sm"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-[4/3] rounded-b-[16px]">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-b-[16px]"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-sm font-semibold text-[#111] mb-1">
                        {pkg.title}
                      </h3>
                      <p className="text-xs text-[#6B7280] leading-relaxed mb-3">
                        {pkg.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto mr-auto gap-2">
                        {/* <span className="text-[#111] font-semibold text-sm">
                      {pkg.price} $ <span className="font-normal text-[#6B7280] text-xs">/ شخص</span>
                    </span> */}
                        {pkg.href ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#111]">
                            {pkg.label}
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                            </svg>
                          </span>
                        ) : (
                          <a
                            href="https://wa.me/201032549630"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#111] hover:text-[#6B7280] transition-colors"
                          >
                            احجز الآن
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </Wrapper>
                );
              })}
            </div>

          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
