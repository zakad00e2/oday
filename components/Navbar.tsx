"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "الفنادق", href: "/hotels" },
  { label: "الرحلات", href: "/trips" },
  { label: "الموافقات الامنية", href: "/airport-coordination" },
  { label: "من نحن", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = pathname === "/";
  const isDarkHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, openCart } = useCart();

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // showBg: show white background only after scrolling
  const showBg = scrolled;
  // useDark: use dark-colored items on non-dark-hero pages even before scrolling
  const useDark = scrolled || !isDarkHero;

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
    // Run once on mount to set correct initial state
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome, pathname]);

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-4 md:px-8 xl:px-20 transition-all duration-300 ${showBg ? "py-3 bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)]" : "py-4"
        }`}
    >

      {/* ── Logo (right in RTL) ───────────────────────── */}
      <Link href="/" className="flex items-center gap-2 group">
        <img
          src="/logo.png"
          alt="Oday Tourism Logo"
          className="h-15 w-auto object-contain drop-shadow-sm"
        />
      </Link>

      {/* ── Center Nav Pill ───────────────────────────── */}
      <div
        className={`hidden lg:flex items-center gap-0.5 rounded-full px-1.5 py-1.5 border transition-all duration-300 ${useDark
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
              className={`relative px-5 py-2 rounded-full text-[13.5px] font-medium transition-all duration-300 ${isActive
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

      {/* ── CTA + Cart (desktop) ─────────────────────── */}
      <div className="hidden lg:flex items-center gap-3">
        {/* Cart Icon */}
        <button
          onClick={openCart}
          aria-label="سلة الحجوزات"
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
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#0EA5E9] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </button>

        {/* <Link
          href="/package-builder"
          className={`flex items-center gap-2.5 pr-5 pl-2 py-2 rounded-full text-[13.5px] font-semibold transition-all duration-300 hover:scale-105 ${useDark
            ? "bg-[#111] text-white shadow-md"
            : "border border-white/20 bg-white/10 backdrop-blur-sm backdrop-saturate-150 shadow-[0_10px_30px_rgba(0,0,0,0.12)] text-white"
            }`}
        >
          احجز الآن
          <span
            className={`inline-flex items-center justify-center w-7 h-7 rounded-full shadow-sm ${useDark ? "bg-white text-[#111]" : "bg-white/90 text-[#111]"
              }`}
          >
            <svg className="w-3.5 h-3.5 scale-x-[-1]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </span>
        </Link> */}
      </div>

      {/* ── Mobile Cart + Hamburger ───────────────────── */}
      <div className="lg:hidden flex items-center gap-2">
        <button
          onClick={openCart}
          aria-label="سلة الحجوزات"
          className={`relative flex items-center justify-center w-9 h-9 rounded-full border transition-all ${
            useDark ? "border-[#E2E8F0] bg-white text-[#0F172A]" : "border-white/20 bg-white/10 text-white"
          }`}
        >
          <svg className="w-4.5 h-4.5" style={{ width: "1.125rem", height: "1.125rem" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#0EA5E9] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </button>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1.5 p-2"
          aria-label="القائمة"
        >
        <span className={`w-6 h-0.5 transition-all duration-300 ${useDark ? "bg-[#111]" : "bg-white"} ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`w-6 h-0.5 transition-all duration-300 ${useDark ? "bg-[#111]" : "bg-white"} ${mobileOpen ? "opacity-0" : ""}`} />
        <span className={`w-6 h-0.5 transition-all duration-300 ${useDark ? "bg-[#111]" : "bg-white"} ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* ── Mobile Menu ───────────────────────────────── */}
      {mobileOpen && (
        <div
          className="absolute top-full right-4 left-4 mt-2 rounded-3xl p-5 shadow-xl"
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
                className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all ${pathname === link.href
                  ? useDark ? "bg-[#111] text-white" : "bg-white text-[#111]"
                  : useDark ? "text-[#555] hover:text-[#111] hover:bg-black/5" : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/package-builder"
            onClick={closeMobile}
            className={`mt-4 flex items-center justify-center  gap-2 px-6 py-3 rounded-full text-sm font-bold ${useDark ? "bg-[#111] text-white" : "bg-white text-[#111]"
              }`}
          >
            احجز الآن
          </Link>
        </div>
      )}
    </nav>
  );
}
