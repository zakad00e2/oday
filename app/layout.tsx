import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "Oday Tourism | عدي للسياحة",
  description:
    "حجوزات فنادق • إدارة الجولات • تجارب سفر مصممة خصيصًا لك — Oday Tourism",
  keywords: "سياحة, سفر, حجوزات, فنادق, جولات, Oday Tourism",
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
