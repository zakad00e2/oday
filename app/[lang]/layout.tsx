import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, isValidLocale, type Locale } from "@/lib/i18n/config";
import { DictionaryProvider } from "@/lib/i18n/dictionary-context";
import { notFound } from "next/navigation";
import LayoutWrapper from "@/components/LayoutWrapper";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
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
      <LayoutWrapper>{children}</LayoutWrapper>
    </DictionaryProvider>
  );
}
