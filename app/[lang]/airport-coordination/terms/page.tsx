import PolicyDocumentView from "@/components/legal/PolicyDocumentView";
import { i18n, type Locale } from "@/lib/i18n/config";
import { getSecurityApprovalLegalContent } from "@/lib/security-approval-legal-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (i18n.locales.includes(lang as Locale) ? lang : i18n.defaultLocale) as Locale;
  const isAr = locale === "ar";

  return {
    title: isAr
      ? "الشروط والأحكام | التنسيق الأمني | Oday Tourism"
      : "Terms & Conditions | Security Coordination | Oday Tourism",
    description: isAr
      ? "الشروط والأحكام الخاصة بخدمة التنسيق الأمني من Oday Tourism."
      : "Terms and conditions for Oday Tourism's security coordination service.",
  };
}

export default async function SecurityApprovalTermsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (i18n.locales.includes(lang as Locale) ? lang : i18n.defaultLocale) as Locale;
  const legal = getSecurityApprovalLegalContent(locale);

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-28 pb-20">
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <PolicyDocumentView document={legal.terms} />
      </div>
    </main>
  );
}
