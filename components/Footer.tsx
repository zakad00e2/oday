"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/dictionary-context";

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/17MN4Fidh1/?mibextid=wwXIfr",
    path: "M22.675 0h-21.35C.595 0 0 .595 0 1.326v21.348C0 23.405.595 24 1.326 24H12.82v-9.294H9.692V11.08h3.128V8.41c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.796.143v3.24h-1.92c-1.506 0-1.797.716-1.797 1.765v2.313h3.587l-.467 3.626h-3.12V24h6.117C23.405 24 24 23.405 24 22.674V1.326C24 .595 23.405 0 22.675 0z",
    size: 18,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@odaytourism?si=8rmXGqaGsUl_2cjf",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    size: 18,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/odaytourism?igsh=MXNvanphcmc0Mzhsaw%3D%3D&utm_source=qr",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    size: 18,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@oday_tourism?_r=1&_t=ZS-95P74MCkJFJ",
    path: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.89 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z",
    size: 18,
  },
];

type PaymentMethodId = "visa" | "mastercard" | "additional-payment" | "banque-misr" | "cib";

function PaymentMethodLogo({ method }: { method: PaymentMethodId }) {
  switch (method) {
    case "visa":
      return (
        <img
          src="https://logos-world.net/wp-content/uploads/2020/05/Visa-Logo.png"
          alt="Visa"
          loading="lazy"
          className="h-6 w-auto max-w-[88px] object-contain"
        />
      );
    case "mastercard":
      return (
        <img
          src="https://logos-world.net/wp-content/uploads/2020/09/Mastercard-Logo.png"
          alt="Mastercard"
          loading="lazy"
          className="h-7 w-auto max-w-[96px] object-contain"
        />
      );
    case "additional-payment":
      return (
        <img
          src="https://bopwebsitestorage.blob.core.windows.net/assets/images/news/logo.png"
          alt="Additional Payment Method"
          loading="lazy"
          className="h-14 w-auto max-w-[170px] object-contain"
        />
      );
    case "banque-misr":
      return (
        <img
          src="https://images.seeklogo.com/logo-png/54/2/banque-misr-logo-png_seeklogo-545884.png"
          alt="Banque Misr"
          loading="lazy"
          className="h-14 w-auto max-w-[156px] object-contain"
        />
      );
    case "cib":
      return (
        <img
          src="/images/cib.png"
          alt="CIB"
          loading="lazy"
          className="h-12 w-auto max-w-[122px] object-contain"
        />
      );
    default:
      return null;
  }
}

export default function Footer() {
  const { dict, lang } = useI18n();
  const isArabic = lang === "ar";
  const phoneNumber = "+201032549630";

  const quickLinks = [
    { label: dict.nav.home, href: `/${lang}` },
    { label: dict.nav.hotels, href: `/${lang}/hotels` },
    { label: dict.nav.trips, href: `/${lang}/trips` },
    { label: dict.nav.airportCoordination, href: `/${lang}/airport-coordination` },
    { label: dict.nav.about, href: `/${lang}/about` },
  ];

  const policyLinks = [
    { label: isArabic ? "الشروط والأحكام" : "Terms & Conditions", href: `/${lang}/terms` },
    { label: isArabic ? "سياسة الاسترداد" : "Refund Policy", href: `/${lang}/refund-policy` },
  ];

  const contactInfo = [
    "OdayTourism@outlook.com",
    phoneNumber,
    dict.footer.location,
  ];

  const paymentMethods: Array<{ id: PaymentMethodId; label: string }> = [
    { id: "visa", label: "Visa" },
    { id: "mastercard", label: isArabic ? "ماستر كارد" : "Mastercard" },
    { id: "additional-payment", label: isArabic ? "وسيلة دفع إضافية" : "Additional Payment Method" },
    { id: "banque-misr", label: isArabic ? "بنك مصر" : "Banque Misr" },
    { id: "cib", label: "CIB" },
  ];

  return (
    <footer className="relative isolate z-10 bg-white">
      <div className="mx-auto max-w-[1200px] px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 items-start gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-12">
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Link href={`/${lang}`} className="mb-6 flex items-center gap-1">
              <Image
                src="/optimized/logo.webp"
                alt="Oday Tourism Logo"
                width={200}
                height={80}
                sizes="(max-width: 768px) 140px, 200px"
                quality={75}
                className="h-16 w-auto object-contain"
              />
              <div className="flex flex-col pt-1">
                <span className="text-xl font-bold leading-none text-[#111]">Oday Tourism</span>
                <span className="text-[10px] font-medium uppercase tracking-[2.7px] text-[#6B7280]">
                  Travel Services
                </span>
              </div>
            </Link>
            <p className="max-w-[400px] text-sm leading-relaxed text-[#6B7280]">
              {dict.footer.description}
            </p>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-[#111]">
                {isArabic ? "طرق الدفع" : "Payment Methods"}
              </h4>
              <div className="flex max-w-[420px] flex-wrap items-center gap-x-5 gap-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex h-10 items-center justify-center"
                    role="img"
                    aria-label={method.label}
                  >
                    <PaymentMethodLogo method={method.id} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-5 text-sm font-semibold text-[#111]">{dict.footer.quickLinks}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#6B7280] transition-colors duration-200 hover:text-[#111]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-5 text-sm font-semibold text-[#111]">
              {isArabic ? "السياسات" : "Policies"}
            </h4>
            <ul className="space-y-3">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#6B7280] transition-colors duration-200 hover:text-[#111]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-5 text-sm font-semibold text-[#111]">{dict.footer.contactInfo}</h4>
            <ul className="space-y-3">
              {contactInfo.map((line, index) => (
                <li
                  key={index}
                  className={`text-sm text-[#6B7280] ${line === phoneNumber && isArabic ? "text-right" : ""}`}
                  dir={line === phoneNumber ? "ltr" : undefined}
                  style={line === phoneNumber ? { unicodeBidi: "isolate" } : undefined}
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-5 lg:col-span-2">
            <div className="relative z-10 flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] text-[#6B7280] transition-colors duration-200 hover:border-[#111] hover:text-[#111]"
                >
                  <svg width={social.size} height={social.size} viewBox="0 0 24 24" fill="currentColor">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-[#E5E7EB] pt-6 text-center">
          <p className="text-sm text-[#9CA3AF]">
            &copy; {new Date().getFullYear()} {dict.footer.brand}. {dict.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
