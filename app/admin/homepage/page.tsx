"use client";

import { useEffect, useRef, useState } from "react";
import FileUpload from "@/components/admin/FileUpload";
import {
  cloneHomeGalleryContent,
  defaultHomeGalleryContent,
  readHomeGalleryContent,
  saveHomeGalleryContent,
  type HomeGalleryContent,
} from "@/lib/home-gallery-content";

const packageSlotLabels = [
  "ملاذ جزر المالديف",
  "مغامرة جبال الألب السويسرية",
  "إقامة فاخرة في دبي",
  "منتجع بالي",
];

function createPackageImage(image = defaultHomeGalleryContent.packagesGallery[0]?.image || "") {
  return {
    id: `package-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    image,
  };
}

function createShowcaseImage(image = "") {
  return {
    id: `showcase-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    image,
  };
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to read file"));
    };

    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

function moveItem<T>(items: T[], fromIndex: number, direction: -1 | 1) {
  const nextIndex = fromIndex + direction;

  if (fromIndex < 0 || nextIndex < 0 || nextIndex >= items.length) {
    return items;
  }

  const nextItems = [...items];
  const [item] = nextItems.splice(fromIndex, 1);
  nextItems.splice(nextIndex, 0, item);
  return nextItems;
}

function ActionButton({
  label,
  onClick,
  disabled = false,
  tone = "default",
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        tone === "danger"
          ? "rounded-lg bg-[#FEF2F2] px-3 py-1.5 text-xs font-medium text-[#DC2626] transition-colors hover:bg-[#FEE2E2] disabled:cursor-not-allowed disabled:opacity-60"
          : "rounded-lg bg-[#F3F4F6] px-3 py-1.5 text-xs font-medium text-[#4B5563] transition-colors hover:bg-[#E5E7EB] disabled:cursor-not-allowed disabled:opacity-60"
      }
    >
      {label}
    </button>
  );
}

export default function AdminHomepagePage() {
  const [content, setContent] = useState<HomeGalleryContent>(() => cloneHomeGalleryContent());
  const [saved, setSaved] = useState(true);
  const packagePickerRef = useRef<HTMLInputElement>(null);
  const showcasePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setContent(readHomeGalleryContent());
      setSaved(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const showcaseItems = content.showcaseGallery;
  const packageItems = content.packagesGallery;

  const updatePackagesGalleryImage = (index: number, image: string) => {
    setContent((current) => ({
      ...current,
      packagesGallery: current.packagesGallery.map((item, itemIndex) =>
        itemIndex === index ? { ...item, image } : item,
      ),
    }));
    setSaved(false);
  };

  const addPackageImage = (image: string) => {
    setContent((current) => ({
      ...current,
      packagesGallery: [createPackageImage(image), ...current.packagesGallery],
    }));
    setSaved(false);
  };

  const movePackageImage = (index: number, direction: -1 | 1) => {
    setContent((current) => ({
      ...current,
      packagesGallery: moveItem(current.packagesGallery, index, direction),
    }));
    setSaved(false);
  };

  const removePackageImage = (index: number) => {
    setContent((current) => ({
      ...current,
      packagesGallery:
        current.packagesGallery.length > 1
          ? current.packagesGallery.filter((_, itemIndex) => itemIndex !== index)
          : current.packagesGallery,
    }));
    setSaved(false);
  };

  const updateShowcaseImage = (id: string, image: string) => {
    setContent((current) => ({
      ...current,
      showcaseGallery: current.showcaseGallery.map((item) => (item.id === id ? { ...item, image } : item)),
    }));
    setSaved(false);
  };

  const addShowcaseImage = (image: string) => {
    setContent((current) => ({
      ...current,
      showcaseGallery: [createShowcaseImage(image), ...current.showcaseGallery],
    }));
    setSaved(false);
  };

  const handlePackagePickerChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const image = await readFileAsDataUrl(file);
    addPackageImage(image);
    event.target.value = "";
  };

  const handleShowcasePickerChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const image = await readFileAsDataUrl(file);
    addShowcaseImage(image);
    event.target.value = "";
  };

  const moveShowcaseImage = (id: string, direction: -1 | 1) => {
    setContent((current) => {
      const currentIndex = current.showcaseGallery.findIndex((item) => item.id === id);

      return {
        ...current,
        showcaseGallery: moveItem(current.showcaseGallery, currentIndex, direction),
      };
    });
    setSaved(false);
  };

  const removeShowcaseImage = (id: string) => {
    setContent((current) => ({
      ...current,
      showcaseGallery:
        current.showcaseGallery.length > 1
          ? current.showcaseGallery.filter((item) => item.id !== id)
          : current.showcaseGallery,
    }));
    setSaved(false);
  };

  const handleSave = () => {
    const nextContent: HomeGalleryContent = {
      packagesGallery: content.packagesGallery.filter((item) => item.image.trim()),
      showcaseGallery: content.showcaseGallery.filter((item) => item.image.trim()),
    };

    if (nextContent.packagesGallery.length === 0) {
      nextContent.packagesGallery = cloneHomeGalleryContent().packagesGallery;
    }

    if (nextContent.showcaseGallery.length === 0) {
      nextContent.showcaseGallery = cloneHomeGalleryContent().showcaseGallery;
    }

    saveHomeGalleryContent(nextContent);
    setContent(nextContent);
    setSaved(true);
  };

  const restoreDefaults = () => {
    const defaults = cloneHomeGalleryContent();
    setContent(defaults);
    saveHomeGalleryContent(defaults);
    setSaved(true);
  };

  return (
    <div className="space-y-8">
      <input ref={packagePickerRef} type="file" accept="image/*" onChange={(event) => void handlePackagePickerChange(event)} className="hidden" />
      <input ref={showcasePickerRef} type="file" accept="image/*" onChange={(event) => void handleShowcasePickerChange(event)} className="hidden" />

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#111]">صور الصفحة الرئيسية</h1>
            <p className="mt-1 text-sm text-[#6B7280]">أضف أو غيّر صور الأقسام، ثم اضغط حفظ التغييرات.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                saved ? "bg-[#ECFDF5] text-[#047857]" : "bg-[#FFF7ED] text-[#B45309]"
              }`}
            >
              {saved ? "كل شيء محفوظ" : "هناك تغييرات غير محفوظة"}
            </span>
            <button
              type="button"
              onClick={restoreDefaults}
              className="rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB]"
            >
              استعادة الافتراضي
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-colors ${
                saved ? "bg-[#10B981]" : "bg-[#111] hover:bg-[#333]"
              }`}
            >
              {saved ? "تم الحفظ" : "حفظ التغييرات"}
            </button>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#111]">PackagesGallery</h2>
            <p className="mt-1 text-sm text-[#6B7280]">صور بطاقات الباقات. يمكنك إضافة أكثر من أربع صور.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-medium text-[#6B7280]">{packageItems.length} صور</span>
            <button
              type="button"
              onClick={() => packagePickerRef.current?.click()}
              className="rounded-xl bg-[#111] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#333]"
            >
              إضافة صورة
            </button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {packageItems.map((item, index) => (
            <div key={item.id} className="rounded-2xl border border-[#F3F4F6] bg-[#FCFCFD] p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#111]">{packageSlotLabels[index] || `باقة ${index + 1}`}</p>
                  <p className="mt-1 text-xs text-[#9CA3AF]">البطاقة {index + 1}</p>
                </div>
              </div>

              <div className="mx-auto max-w-[260px]">
                <FileUpload
                  label="صورة البطاقة"
                  value={item.image}
                  onChange={(url) => updatePackagesGalleryImage(index, url)}
                  onClear={() => updatePackagesGalleryImage(index, defaultHomeGalleryContent.packagesGallery[0]?.image || "")}
                  previewHeight="h-[22rem]"
                  persistMode="data-url"
                  previewFit="contain"
                  compactTrigger
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <ActionButton label="رفع" onClick={() => movePackageImage(index, -1)} disabled={index === 0} />
                <ActionButton
                  label="خفض"
                  onClick={() => movePackageImage(index, 1)}
                  disabled={index === packageItems.length - 1}
                />
                <ActionButton
                  label="حذف"
                  onClick={() => removePackageImage(index)}
                  disabled={packageItems.length === 1}
                  tone="danger"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#111]">ShowcaseGallery</h2>
            <p className="mt-1 text-sm text-[#6B7280]">صور المعرض التي تظهر في الكاروسيل.</p>
          </div>

          <button
            type="button"
            onClick={() => showcasePickerRef.current?.click()}
            className="rounded-xl bg-[#111] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#333]"
          >
            إضافة صورة
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {showcaseItems.map((item, index) => (
            <div key={item.id} className="rounded-2xl border border-[#F3F4F6] bg-[#FCFCFD] p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#111]">صورة المعرض {index + 1}</p>
                  <p className="mt-1 text-xs text-[#9CA3AF]">يمكنك الترتيب أو الحذف من هنا</p>
                </div>
              </div>

              <div className="mx-auto max-w-[260px]">
                <FileUpload
                  label="صورة المعرض"
                  value={item.image || undefined}
                  onChange={(url) => updateShowcaseImage(item.id, url)}
                  onClear={() => updateShowcaseImage(item.id, "")}
                  previewHeight="h-[24rem]"
                  persistMode="data-url"
                  previewFit="contain"
                  compactTrigger
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <ActionButton label="رفع" onClick={() => moveShowcaseImage(item.id, -1)} disabled={index === 0} />
                <ActionButton
                  label="خفض"
                  onClick={() => moveShowcaseImage(item.id, 1)}
                  disabled={index === showcaseItems.length - 1}
                />
                <ActionButton
                  label="حذف"
                  onClick={() => removeShowcaseImage(item.id)}
                  disabled={showcaseItems.length === 1}
                  tone="danger"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
