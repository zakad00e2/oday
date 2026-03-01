import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oday Tourism | أوداي للسياحة",
  description:
    "حجوزات فنادق • إدارة الجولات • تجارب سفر مصممة خصيصًا لك — Oday Tourism",
  keywords: "سياحة, سفر, حجوزات, فنادق, جولات, oday tourism",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased font-[var(--font-arabic)]">{children}</body>
    </html>
  );
}
