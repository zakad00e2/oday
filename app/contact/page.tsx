import BookingSteps from "@/components/BookingSteps";
import ContactCTA from "@/components/ContactCTA";

export const metadata = {
  title: "تواصل معنا | Oday Tourism",
  description: "تواصل معنا واحجز رحلتك القادمة بسهولة عبر نموذج الحجز أو واتساب.",
};

export default function ContactPage() {
  return (
    <main className="pt-20">
      <BookingSteps />
      <ContactCTA />
    </main>
  );
}
