import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/lib/cart-context";
import type { Locale } from "@/lib/i18n/config";
import OdayMascot from "@/components/mascot/OdayMascot";
import SmoothScroll from "@/components/SmoothScroll";
import { VisitorPricingProvider } from "@/lib/visitor-pricing-context";
import VisitorResidenceDialog from "@/components/VisitorResidenceDialog";

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
      <SmoothScroll>
        <VisitorPricingProvider>
        <CartProvider>
          <VisitorResidenceDialog />
          <Navbar />
          <CartDrawer />
          {children}
          <Footer />
          <OdayMascot lang={lang} />
        </CartProvider>
        </VisitorPricingProvider>
      </SmoothScroll>
    </div>
  );
}
