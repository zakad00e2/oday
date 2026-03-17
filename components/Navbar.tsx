"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n/dictionary-context";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar() {
  const { dict, lang, dir } = useI18n();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, openCart } = useCart();

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // The home path in the locale-prefixed routing is /{lang}
  const homePath = `/${lang}`;
  const isHome = pathname === homePath || pathname === `/${lang}/`;
  const isDarkHero = isHome;
  const showBg = scrolled;
  const useDark = scrolled || !isDarkHero;

  const navLinks = [
    { label: dict.nav.home, href: `/${lang}` },
    { label: dict.nav.hotels, href: `/${lang}/hotels` },
    { label: dict.nav.trips, href: `/${lang}/trips` },
    { label: dict.nav.airportCoordination, href: `/${lang}/airport-coordination` },
    { label: dict.nav.about, href: `/${lang}/about` },
  ];

  useEffect(() => {
    const onScroll = () => {
      if (isHome) {
        const hero = document.getElementById("hero");
        if (hero) {
          setScrolled(window.scrollY >= hero.offsetHeight - 80);
        } else {
          setScrolled(window.scrollY > 50);
        }
      } else {
        setScrolled(window.scrollY > 10);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome, pathname]);

  const switcherClass = useDark
    ? "border-[#E2E8F0] text-[#444] hover:bg-black/6"
    : "border-white/20 text-white/90 hover:bg-white/15";

  return (
    <nav
      dir={dir}
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 md:px-8 xl:px-20 transition-all duration-300 ${
        showBg ? "py-3 bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)]" : "py-4"
      }`}
    >
      {/* ── Logo ─────────────────────────────────────── */}
      <Link href={`/${lang}`} className="flex items-center gap-2 group">
        <img
          src="/logo.png"
          alt="Oday Tourism Logo"
          className="h-15 w-auto object-contain drop-shadow-sm"
        />
      </Link>

      {/* ── Center Nav Pill (desktop) ─────────────────── */}
      <div
        className={`hidden lg:flex items-center gap-0.5 rounded-full px-1.5 py-1.5 border transition-all duration-300 ${
          useDark
            ? "border-transparent bg-transparent shadow-none"
            : "border-white/20 bg-white/10 backdrop-blur-sm backdrop-saturate-150 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
        }`}
      >
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-5 py-2 rounded-full text-[13.5px] font-medium transition-all duration-300 ${
                isActive
                  ? useDark
                    ? "bg-[#111] text-white shadow-sm"
                    : "bg-white text-[#111] shadow-sm"
                  : useDark
                  ? "text-[#555] hover:text-[#111] hover:bg-black/6"
                  : "text-white/90 hover:text-white hover:bg-white/15"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* ── Cart + Language Switcher (desktop) ──────── */}
      <div className="hidden lg:flex items-center gap-2">
        <LanguageSwitcher className={switcherClass} />
        <button
          onClick={openCart}
          aria-label={dict.nav.cartLabel}
          className={`relative flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 hover:scale-105 ${
            useDark
              ? "border-[#E2E8F0] bg-white text-[#0F172A] shadow-sm hover:border-[#CBD5E1]"
              : "border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-1 -end-1 w-5 h-5 bg-[#0EA5E9] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </button>
      </div>

      {/* ── Mobile: Cart + Language + Hamburger ──────── */}
      <div className="lg:hidden flex items-center gap-1.5">
        <LanguageSwitcher className={`text-xs px-2.5 py-1 ${switcherClass}`} />
        <button
          onClick={openCart}
          aria-label={dict.nav.cartLabel}
          className={`relative flex items-center justify-center w-9 h-9 rounded-full border transition-all ${
            useDark ? "border-[#E2E8F0] bg-white text-[#0F172A]" : "border-white/20 bg-white/10 text-white"
          }`}
        >
          <svg style={{ width: "1.125rem", height: "1.125rem" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-1 -end-1 w-4 h-4 bg-[#0EA5E9] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </button>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1.5 p-2"
          aria-label={dict.nav.menu}
        >
          <span className={`w-6 h-0.5 transition-all duration-300 ${useDark ? "bg-[#111]" : "bg-white"} ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-0.5 transition-all duration-300 ${useDark ? "bg-[#111]" : "bg-white"} ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-0.5 transition-all duration-300 ${useDark ? "bg-[#111]" : "bg-white"} ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* ── Mobile Menu ───────────────────────────────── */}
      {mobileOpen && (
        <div
          className="absolute top-full inset-x-4 mt-2 rounded-3xl p-5 shadow-xl"
          style={
            useDark
              ? { background: "#fff", border: "1px solid rgba(0,0,0,0.08)" }
              : { background: "rgba(0,0,0,0.55)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.18)" }
          }
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  pathname === link.href
                    ? useDark ? "bg-[#111] text-white" : "bg-white text-[#111]"
                    : useDark ? "text-[#555] hover:text-[#111] hover:bg-black/5" : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href={`/${lang}/package-builder`}
            onClick={closeMobile}
            className={`mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold ${
              useDark ? "bg-[#111] text-white" : "bg-white text-[#111]"
            }`}
          >
            {dict.nav.bookNow}
          </Link>
        </div>
      )}
    </nav>
  );
}
