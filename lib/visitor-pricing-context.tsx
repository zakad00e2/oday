"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { formatPrice as formatCurrencyPrice, formatPriceWithSign as formatCurrencyPriceWithSign, type CurrencyLang } from "./currency";
import { getVisitorCurrency, parseVisitorCategory, resolveVisitorPrice, visitorCategoryLabel, VISITOR_CATEGORY_KEY, type VisitorCategory } from "./visitor-pricing";

function useVisitorPricingState() {
  const pathname = usePathname();
  const [category, setCategoryState] = useState<VisitorCategory | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isEditingResidence, setIsEditingResidence] = useState(false);
  useEffect(() => {
    const restore = () => {
      try { setCategoryState(parseVisitorCategory(localStorage.getItem(VISITOR_CATEGORY_KEY))); }
      catch { /* The in-memory choice still works when storage is blocked. */ }
      finally { setIsReady(true); }
    };
    restore();
    const onStorage = (event: StorageEvent) => {
      if (event.key === VISITOR_CATEGORY_KEY || event.key === null) restore();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setCategory = useCallback((value: VisitorCategory) => {
    const validCategory = parseVisitorCategory(value);
    if (!validCategory) return;
    setCategoryState(validCategory);
    setIsEditingResidence(false);
    try { localStorage.setItem(VISITOR_CATEGORY_KEY, validCategory); } catch { /* Keep session choice. */ }
  }, []);
  const openResidenceDialog = useCallback(() => setIsEditingResidence(true), []);
  const closeResidenceDialog = useCallback(() => setIsEditingResidence(false), []);
  const isPricingRoute = /^\/(?:ar|en)\/(?:hotels|trips)(?:\/|$)/.test(pathname);
  const isResidenceDialogOpen = isReady && (isEditingResidence || (category === null && isPricingRoute));
  const currency = getVisitorCurrency(category);
  const formatPrice = useCallback((value: number, lang: CurrencyLang) => (
    currency ? formatCurrencyPrice(value, lang, currency)
      : lang === "ar" ? "حدد بيانات إقامتك لعرض السعر" : "Choose residence details for prices"
  ), [currency]);
  const formatPriceWithSign = useCallback((value: number, lang: CurrencyLang) => (
    currency ? formatCurrencyPriceWithSign(value, lang, currency) : formatPrice(value, lang)
  ), [currency, formatPrice]);
  const resolvePrice = useCallback((usd: unknown, egp: unknown) => resolveVisitorPrice(usd, egp, currency), [currency]);
  const inquiryPricing = useCallback((lang: CurrencyLang) => (
    `${lang === "ar" ? "فئة الزائر" : "Visitor category"}: ${visitorCategoryLabel(category, lang)}\n${lang === "ar" ? "عملة التسعير" : "Pricing currency"}: ${currency ?? (lang === "ar" ? "غير محددة" : "Not selected")}\n`
  ), [category, currency]);
  return { category, currency, setCategory, resolvePrice, formatPrice, formatPriceWithSign, inquiryPricing,
    isResidenceDialogOpen, openResidenceDialog, closeResidenceDialog };
}

const VisitorPricingContext = createContext<ReturnType<typeof useVisitorPricingState> | null>(null);

export function VisitorPricingProvider({ children }: { children: ReactNode }) {
  const value = useVisitorPricingState();
  return <VisitorPricingContext.Provider value={value}>{children}</VisitorPricingContext.Provider>;
}

export function useVisitorPricing() {
  const context = useContext(VisitorPricingContext);
  if (!context) throw new Error("useVisitorPricing requires VisitorPricingProvider");
  return context;
}
