"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/dictionary-context";

const socials = [
  {
    label: "YouTube",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    size: 18,
  },
  {
    label: "Facebook",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    size: 18,
  },
  {
    label: "Instagram",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    size: 18,
  },
  {
    label: "X (Twitter)",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    size: 16,
  },
];

export default function Footer() {
  const { dict, lang } = useI18n();
  const [email, setEmail] = useState("");

  const quickLinks = [
    { label: dict.nav.home, href: `/${lang}` },
    { label: dict.nav.hotels, href: `/${lang}/hotels` },
    { label: dict.nav.trips, href: `/${lang}/trips` },
    { label: dict.footer.packageBuilder, href: `/${lang}/package-builder` },
    { label: dict.nav.about, href: `/${lang}/about` },
  ];

  const contactInfo = [
    "hello@odaytourism.com",
    "+20 103 254 9630",
    dict.footer.location,
  ];

  return (
    <footer className="bg-white">
      <div className="max-w-[1200px] mx-auto px-6 pt-20 pb-10">

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-8 lg:gap-x-12 gap-y-10 items-start">

          {/* Col 1 — Brand */}
          <div className="lg:col-span-5">
            <Link href={`/${lang}`} className="flex items-center gap-2 mb-6">
              <img src="/logo.png" alt="Oday Tourism Logo" className="h-16 w-auto object-contain" />
              <div className="flex flex-col pt-1">
                <span className="text-xl font-bold leading-none text-[#111]">Oday Tourism</span>
                <span className="text-[10px] font-medium uppercase tracking-[1.5px] text-[#6B7280]">Travel Services</span>
              </div>
            </Link>
            <p className="text-[#6B7280] text-sm leading-relaxed max-w-[400px]">
              {dict.footer.description}
            </p>
          </div>

          {/* Col 2 — Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-[#111] mb-5">{dict.footer.quickLinks}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#6B7280] hover:text-[#111] transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Contact Info */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-[#111] mb-5">{dict.footer.contactInfo}</h4>
            <ul className="space-y-3">
              {contactInfo.map((line, i) => (
                <li key={i} className="text-sm text-[#6B7280]">{line}</li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Newsletter + Social */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <div className="flex items-center rounded-full border border-[#E5E7EB] bg-white overflow-hidden pe-4 ps-1.5 py-1.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={dict.footer.emailPlaceholder}
                aria-label={dict.footer.subscribeLabel}
                className="flex-1 text-sm bg-transparent outline-none placeholder:text-[#9CA3AF] min-w-0"
              />
              <button
                aria-label={dict.footer.subscribeBtnLabel}
                className="bg-[#111] text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#333] active:scale-95 transition-all whitespace-nowrap flex-shrink-0"
              >
                {dict.footer.subscribe}
              </button>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:border-[#111] hover:text-[#111] transition-colors duration-200"
                >
                  <svg width={s.size} height={s.size} viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="border-t border-[#E5E7EB] mt-14 pt-6 text-center">
          <p className="text-sm text-[#9CA3AF]">
            &copy; {new Date().getFullYear()} {dict.footer.brand}. {dict.footer.copyright}
          </p>
        </div>

      </div>
    </footer>
  );
}
