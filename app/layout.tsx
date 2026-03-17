import type { Metadata } from "next";
import "./globals.css";

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
    <html suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
