import Reviews from "@/components/Reviews";

export const metadata = {
  title: "آراء العملاء | Adi Tourism",
  description: "اقرأ تجارب وآراء عملائنا الحقيقية مع Adi Tourism.",
};

export default function ReviewsPage() {
  return (
    <main className="pt-20">
      <Reviews />
    </main>
  );
}
