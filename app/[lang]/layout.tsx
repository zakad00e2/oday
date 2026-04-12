import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, isValidLocale, type Locale } from "@/lib/i18n/config";
import { DictionaryProvider } from "@/lib/i18n/dictionary-context";
import { notFound } from "next/navigation";
import LayoutWrapper from "@/components/LayoutWrapper";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  SITE_TITLE_AR,
  SITE_TITLE_EN,
  SITE_DESCRIPTION_AR,
  SITE_DESCRIPTION_EN,
} from "@/lib/seo";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = isValidLocale(lang) ? (lang as Locale) : i18n.defaultLocale;
  const isAr = locale === "ar";

  const title = isAr ? SITE_TITLE_AR : SITE_TITLE_EN;
  const description = isAr ? SITE_DESCRIPTION_AR : SITE_DESCRIPTION_EN;
  const ogLocale = isAr ? "ar_EG" : "en_US";
  const ogAlternateLocale = isAr ? "en_US" : "ar_EG";

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        ar: `${SITE_URL}/ar`,
        en: `${SITE_URL}/en`,
        "x-default": `${SITE_URL}/ar`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}`,
      siteName: SITE_NAME,
      locale: ogLocale,
      alternateLocale: [ogAlternateLocale],
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang as Locale);

  return (
    <DictionaryProvider dictionary={dictionary} lang={lang as Locale}>
      <LayoutWrapper lang={lang as Locale}>{children}</LayoutWrapper>
    </DictionaryProvider>
  );
}
