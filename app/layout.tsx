import type { Metadata } from "next";
import Script from "next/script";
import { Cairo, Manrope } from "next/font/google";
import "./globals.css";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  SITE_TITLE_AR,
  SITE_DESCRIPTION_AR,
} from "@/lib/seo";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: SITE_NAME,
  alternateName: "عدي للسياحة",
  url: SITE_URL,
  logo: `${SITE_URL}/newlogo.PNG`,
  image: `${SITE_URL}/newlogo.PNG`,
  description:
    "Oday Tourism is a licensed Egyptian travel agency specializing in hotel bookings, boat trips, safari adventures, and custom travel packages in Sharm El Sheikh and Egypt.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sharm El Sheikh",
    addressRegion: "South Sinai",
    addressCountry: "EG",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+201032549630",
    contactType: "customer service",
    availableLanguage: ["Arabic", "English"],
  },
  sameAs: [
    "https://youtube.com/@odaytourism",
    "https://www.instagram.com/odaytourism",
    "https://www.tiktok.com/@oday_tourism",
  ],
};

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE_AR,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION_AR,
  keywords:
    "سياحة, سفر, حجوزات, فنادق, رحلات, شرم الشيخ, مصر, Oday Tourism, travel egypt, sharm el sheikh",
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE_AR,
    description: SITE_DESCRIPTION_AR,
    locale: "ar_EG",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - شركة سياحة في مصر`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE_AR,
    description: SITE_DESCRIPTION_AR,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${cairo.variable} ${manrope.variable} antialiased`}
      >
        <Script id="tatheer-pixel" strategy="afterInteractive">
          {`(function (w, d, key, name, params) {
  if (w.tatheer) return;
  w.tatheer = function () { (w.tatheer.q = w.tatheer.q || []).push(arguments); };
  var s = d.createElement('script');
  s.async = true;
  s.src = "https://tatheer-tracker-dev.mrmhdcom.workers.dev/p/v2.js";
  s.integrity = "sha384-Fk1GkLp8ntZZCDSs6IttctkbjjBH+WhnWOmI+xONNh1tj9G7OweyGVYSrrosADoj";
  s.crossOrigin = 'anonymous';
  s.setAttribute('data-pixel-key', key);
  s.setAttribute('data-endpoint', "https://tatheer-tracker-dev.mrmhdcom.workers.dev/events_collector");
  s.setAttribute('data-event', name);
  s.setAttribute('data-params', JSON.stringify(params));
  s.onload = function () { w.tatheer.loaded = true; };
  s.onerror = function () { w.tatheer.failed = true; };
  var first = d.getElementsByTagName('script')[0];
  first.parentNode.insertBefore(s, first);
})(window, document, "pk_live_ePa4bLfxts_Ms7atNSKrrhLQ0qbDGDhF", 'page_view', {});`}
        </Script>
        {children}
      </body>
    </html>
  );
}
