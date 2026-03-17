"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart-context";
import CartDrawer from "@/components/CartDrawer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // Extract lang from the URL pathname (e.g. /ar/hotels → "ar")
  const segments = pathname.split("/").filter(Boolean);
  const lang = segments[0] === "ar" || segments[0] === "en" ? segments[0] : "ar";
  const dir = lang === "ar" ? "rtl" : "ltr";
  const fontFamily = lang === "ar" ? "'Cairo', sans-serif" : "'Urbanist', sans-serif";

  // Dynamically set html attributes for lang, dir, and font
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.body.style.fontFamily = fontFamily;
  }, [lang, dir, fontFamily]);

  if (isAdmin) return <>{children}</>;

  return (
    <CartProvider>
      <Navbar />
      <CartDrawer />
      {children}
      <Footer />
    </CartProvider>
  );
}
