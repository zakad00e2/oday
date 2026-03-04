import GalleryCarousel from "@/components/GalleryCarousel";
import TravelGallery from "@/components/TravelGallery";
import Reviews from "@/components/Reviews";

export const metadata = {
  title: "المعرض وآراء العملاء | Oday Tourism",
  description: "اطلع على صور رحلات عملائنا وفريقنا في أجمل الوجهات السياحية، واقرأ تجارب وآراء عملائنا الحقيقية.",
};

export default function GalleryPage() {
  return (
    <main className="pt-20">
      <GalleryCarousel />
      <TravelGallery />
      <Reviews />
    </main>
  );
}
