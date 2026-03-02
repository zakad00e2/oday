import Hotels from "@/components/Hotels";

export const metadata = {
  title: "الفنادق | Adi Tourism",
  description: "أفخم الفنادق بأفضل الأسعار مع عروض حصرية لأجمل الوجهات السياحية المصرية.",
};

export default function HotelsPage() {
  return (
    <main className="pt-20">
      <Hotels />
    </main>
  );
}
