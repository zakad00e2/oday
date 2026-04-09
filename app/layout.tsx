import type { Metadata } from "next";
import { Cairo, Manrope } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Oday Tourism | عدي للسياحة",
  description:
    "حجوزات فنادق • إدارة الجولات • تجارب سفر مصممة خصيصًا لك — Oday Tourism",
  keywords: "سياحة, سفر, حجوزات, فنادق, جولات, Oday Tourism",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${cairo.variable} ${manrope.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
