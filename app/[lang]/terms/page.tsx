import PolicyDocumentView from "@/components/legal/PolicyDocumentView";
import { getLegalContent } from "@/lib/legal-content";
import { i18n, type Locale } from "@/lib/i18n/config";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (i18n.locales.includes(lang as Locale) ? lang : i18n.defaultLocale) as Locale;
  const legal = getLegalContent(locale);

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-28 pb-20">
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <PolicyDocumentView document={legal.terms} />
      </div>
    </main>
  );
}
