"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import FlexibleImage from "@/components/FlexibleImage";
import {
  listPhotoGallery,
  createPhotoGalleryItem,
  deletePhotoGalleryItem,
  type PhotoGalleryItem,
} from "@/lib/photo-gallery-service";
import {
  listOffers,
  createOffer,
  deleteOffer,
  type OfferItem,
} from "@/lib/offer-service";

type Tab = "packages" | "showcase";
type LoadState = "idle" | "loading" | "loaded" | "error";

export default function AdminHomepagePage() {
  const [activeTab, setActiveTab] = useState<Tab>("packages");

  const [showcaseItems, setShowcaseItems] = useState<PhotoGalleryItem[]>([]);
  const [showcaseLoadState, setShowcaseLoadState] = useState<LoadState>("idle");
  const [showcaseError, setShowcaseError] = useState("");

  const [packageItems, setPackageItems] = useState<OfferItem[]>([]);
  const [packageLoadState, setPackageLoadState] = useState<LoadState>("idle");
  const [packageError, setPackageError] = useState("");

  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const packagePickerRef = useRef<HTMLInputElement>(null);
  const showcasePickerRef = useRef<HTMLInputElement>(null);

  const fetchShowcase = useCallback(async (signal?: AbortSignal) => {
    setShowcaseLoadState("loading");
    setShowcaseError("");
    try {
      const items = await listPhotoGallery(signal);
      setShowcaseItems(items);
      setShowcaseLoadState("loaded");
    } catch (err) {
      if (signal?.aborted) return;
      console.error("Failed to load gallery:", err);
      setShowcaseError(err instanceof Error ? err.message : "فشل في تحميل معرض الصور");
      setShowcaseLoadState("error");
    }
  }, []);

  const fetchPackages = useCallback(async (signal?: AbortSignal) => {
    setPackageLoadState("loading");
    setPackageError("");
    try {
      const items = await listOffers(signal);
      setPackageItems(items);
      setPackageLoadState("loaded");
    } catch (err) {
      if (signal?.aborted) return;
      console.error("Failed to load offers:", err);
      setPackageError(err instanceof Error ? err.message : "فشل في تحميل الباقات");
      setPackageLoadState("error");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchShowcase(controller.signal);
    void fetchPackages(controller.signal);
    return () => controller.abort();
  }, [fetchShowcase, fetchPackages]);

  const handlePackageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const item = await createOffer(file);
      setPackageItems((prev) => [item, ...prev]);
    } catch (err) {
      console.error("Failed to create offer:", err);
      alert(err instanceof Error ? err.message : "فشل في رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  const handleShowcaseUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const item = await createPhotoGalleryItem(file);
      setShowcaseItems((prev) => [item, ...prev]);
    } catch (err) {
      console.error("Failed to create gallery item:", err);
      alert(err instanceof Error ? err.message : "فشل في رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الصورة؟")) return;

    setDeleting(id);
    try {
      await deleteOffer(id);
      setPackageItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete offer:", err);
      alert(err instanceof Error ? err.message : "فشل في حذف الصورة");
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteShowcase = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الصورة؟")) return;

    setDeleting(id);
    try {
      await deletePhotoGalleryItem(id);
      setShowcaseItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete gallery item:", err);
      alert(err instanceof Error ? err.message : "فشل في حذف الصورة");
    } finally {
      setDeleting(null);
    }
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "packages", label: "الباقات", count: packageItems.length },
    { key: "showcase", label: "معرض الصور", count: showcaseItems.length },
  ];

  const currentLoadState = activeTab === "packages" ? packageLoadState : showcaseLoadState;
  const currentError = activeTab === "packages" ? packageError : showcaseError;
  const currentRefetch = activeTab === "packages" ? fetchPackages : fetchShowcase;

  return (
    <div className="space-y-6">
      <input ref={packagePickerRef} type="file" accept="image/*" onChange={(event) => void handlePackageUpload(event)} className="hidden" />
      <input ref={showcasePickerRef} type="file" accept="image/*" onChange={(event) => void handleShowcaseUpload(event)} className="hidden" />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111]">صور الصفحة الرئيسية</h1>
          <p className="mt-0.5 text-sm text-[#9CA3AF]">إدارة صور الباقات ومعرض الصور</p>
        </div>
      </div>

      {/* Tabs + Add Button */}
      <div className="flex items-center justify-between border-b border-[#F3F4F6]">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "text-[#111]"
                  : "text-[#9CA3AF] hover:text-muted"
              }`}
            >
              {tab.label}
              <span className={`mr-1.5 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                activeTab === tab.key
                  ? "bg-[#111] text-white"
                  : "bg-[#F3F4F6] text-[#9CA3AF]"
              }`}>
                {tab.count}
              </span>
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#111] rounded-full" />
              )}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={uploading}
          onClick={() =>
            activeTab === "packages"
              ? packagePickerRef.current?.click()
              : showcasePickerRef.current?.click()
          }
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              جاري الرفع...
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              إضافة صورة
            </>
          )}
        </button>
      </div>

      {/* Error state */}
      {currentLoadState === "error" && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FEF2F2] flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-[#DC2626]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[#DC2626] mb-1">{currentError || "حدث خطأ"}</p>
          <button
            type="button"
            onClick={() => void currentRefetch()}
            className="mt-3 text-xs font-medium text-[#111] underline hover:no-underline"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Loading state */}
      {currentLoadState === "loading" && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-[#F3F4F6] bg-white overflow-hidden">
              <div className="p-3">
                <div className="h-[20rem] rounded-xl bg-[#F3F4F6] animate-pulse" />
              </div>
              <div className="flex items-center justify-between border-t border-[#F9FAFB] px-3 py-2">
                <div className="w-8 h-3 bg-[#F3F4F6] rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Packages Grid */}
      {activeTab === "packages" && packageLoadState === "loaded" && packageItems.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {packageItems.map((item, index) => (
            <div key={item.id} className="group relative rounded-2xl border border-[#F3F4F6] bg-white overflow-hidden">
              <div className="p-3">
                <div className="relative h-[20rem] rounded-xl overflow-hidden bg-[#F3F4F6]">
                  <FlexibleImage
                    src={item.imageUrl}
                    alt={`باقة ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="w-full h-full object-contain p-2 bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#F9FAFB] px-3 py-2">
                <span className="text-[11px] text-[#9CA3AF]">#{index + 1}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => void handleDeletePackage(item.id)}
                    disabled={deleting === item.id}
                    className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="حذف"
                  >
                    {deleting === item.id ? (
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Showcase Grid */}
      {activeTab === "showcase" && showcaseLoadState === "loaded" && showcaseItems.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {showcaseItems.map((item, index) => (
            <div key={item.id} className="group relative rounded-2xl border border-[#F3F4F6] bg-white overflow-hidden">
              <div className="p-3">
                <div className="relative h-[20rem] rounded-xl overflow-hidden bg-[#F3F4F6]">
                  <FlexibleImage
                    src={item.imageUrl}
                    alt={`صورة المعرض ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="w-full h-full object-contain p-2 bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#F9FAFB] px-3 py-2">
                <span className="text-[11px] text-[#9CA3AF]">#{index + 1}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => void handleDeleteShowcase(item.id)}
                    disabled={deleting === item.id}
                    className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="حذف"
                  >
                    {deleting === item.id ? (
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {((activeTab === "packages" && packageLoadState === "loaded" && packageItems.length === 0) ||
        (activeTab === "showcase" && showcaseLoadState === "loaded" && showcaseItems.length === 0)) && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-[#D1D5DB]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-muted">لا توجد صور</p>
          <p className="text-xs text-[#9CA3AF] mt-1">اضغط &quot;إضافة صورة&quot; لإضافة صور جديدة</p>
        </div>
      )}
    </div>
  );
}
