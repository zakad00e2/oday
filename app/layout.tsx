import type { Metadata } from "next";
import { Cairo, Manrope } from "next/font/google";
import "./globals.css";

const siteUrl = "https://odaytourism.com";
const socialImage = "/newlogo.PNG";
const siteTitle = "Oday Tourism | عدي للسياحة";
const siteDescription =
  "حجوزات فنادق • إدارة الجولات • تجارب سفر مخصصة خصيصًا لك - Oday Tourism";

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
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  keywords: "سياحة, سفر, حجوزات, فنادق, جولات, Oday Tourism",
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Oday Tourism",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: socialImage,
        width: 626,
        height: 626,
        alt: "Oday Tourism company logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [socialImage],
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
