import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/lib/cart-context";
import type { Locale } from "@/lib/i18n/config";

export default function LayoutWrapper({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: Locale;
}) {
  const dir = lang === "ar" ? "rtl" : "ltr";
  const fontClass = lang === "ar" ? "font-arabic" : "font-english";

  return (
    <div lang={lang} dir={dir} className={fontClass}>
      <CartProvider>
        <Navbar />
        <CartDrawer />
        {children}
        <Footer />
      </CartProvider>
    </div>
  );
}
