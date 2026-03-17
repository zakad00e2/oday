"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "./config";

// Import the ar dictionary to derive the type from its shape
import type arDict from "./dictionaries/ar.json";

/** The dictionary type is inferred from the Arabic JSON structure */
export type Dictionary = typeof arDict;

interface I18nContextValue {
  dict: Dictionary;
  lang: Locale;
  dir: "rtl" | "ltr";
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function DictionaryProvider({
  dictionary,
  lang,
  children,
}: {
  dictionary: Dictionary;
  lang: Locale;
  children: ReactNode;
}) {
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <I18nContext.Provider value={{ dict: dictionary, lang, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within a <DictionaryProvider>");
  }
  return ctx;
}
