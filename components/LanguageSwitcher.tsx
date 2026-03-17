"use client";

import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/dictionary-context";
import { stripLocale } from "@/lib/i18n/localized";
import type { Locale } from "@/lib/i18n/config";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, dict } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  const targetLang: Locale = lang === "ar" ? "en" : "ar";
  const label = lang === "ar" ? dict.langSwitcher.en : dict.langSwitcher.ar;

  const switchLanguage = () => {
    const pathWithoutLocale = stripLocale(pathname);
    const newPath = `/${targetLang}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <button
      onClick={switchLanguage}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-[13px] font-medium transition-all duration-300 ${className}`}
      aria-label={`Switch to ${targetLang === "ar" ? "Arabic" : "English"}`}
    >
      <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
      {label}
    </button>
  );
}
