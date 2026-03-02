import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "Adi Tourism | عدي للسياحة",
  description:
    "حجوزات فنادق • إدارة الجولات • تجارب سفر مصممة خصيصًا لك — Adi Tourism",
  keywords: "سياحة, سفر, حجوزات, فنادق, جولات, Adi Tourism",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased font-[var(--font-arabic)]">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
