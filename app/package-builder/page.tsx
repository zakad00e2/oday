import PackageBuilder from "@/components/package-builder/PackageBuilder";

export const metadata = {
  title: "صمّم باقتك | Oday Tourism",
  description: "ابنِ باقتك السياحية المخصصة — اختر الفندق، الرحلات، والإضافات بأفضل الأسعار.",
};

export default function PackageBuilderPage() {
  return (
    <main className="pt-20">
      <PackageBuilder />
    </main>
  );
}
