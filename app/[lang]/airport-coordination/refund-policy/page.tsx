import type { Metadata } from "next";
import PolicyDocumentView from "@/components/legal/PolicyDocumentView";
import { i18n, isValidLocale, type Locale } from "@/lib/i18n/config";
import { getSecurityApprovalLegalContent } from "@/lib/security-approval-legal-content";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = (isValidLocale(lang) ? lang : i18n.defaultLocale) as Locale;
  const isAr = locale === "ar";

  return buildPageMetadata({
    lang: locale,
    title: isAr
      ? "سياسة الاسترداد | التنسيق الأمني"
      : "Refund Policy | Security Coordination",
    description: isAr
      ? "سياسة الاسترداد الخاصة بخدمة التنسيق الأمني وتأشيرات مصر من Oday Tourism."
      : "Refund policy for Oday Tourism's security coordination and Egypt visa service.",
    path: "/airport-coordination/refund-policy",
  });
}

export default async function SecurityApprovalRefundPolicyPage({
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
        <PolicyDocumentView document={legal.refund} />
      </div>
    </main>
  );
}
