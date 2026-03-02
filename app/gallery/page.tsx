import GalleryCarousel from "@/components/GalleryCarousel";
import TravelGallery from "@/components/TravelGallery";

export const metadata = {
  title: "معرض الصور | Oday Tourism",
  description: "صور حقيقية من رحلات عملائنا وفريقنا في أجمل الوجهات السياحية.",
};

export default function GalleryPage() {
  return (
    <main className="pt-20">
      <GalleryCarousel />
      <TravelGallery />
    </main>
  );
}
