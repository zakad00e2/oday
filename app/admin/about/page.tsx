"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  cloneAboutContent,
  saveAboutContent,
  type AboutContent,
  type AboutFaq,
  type AboutReview,
  readAboutContent,
} from "@/lib/about-content";

type EditorTab = "reviews" | "faqs";

function createReview(): AboutReview {
  const id = `review-${Date.now()}`;

  return {
    id,
    nameAr: "مراجعة جديدة",
    nameEn: "New review",
    locationAr: "",
    locationEn: "",
    serviceAr: "",
    serviceEn: "",
    rating: 5,
    textAr: "",
    textEn: "",
    isPublished: false,
    isFeatured: false,
  };
}

function createFaq(): AboutFaq {
  const id = `faq-${Date.now()}`;

  return {
    id,
    questionAr: "سؤال جديد",
    questionEn: "New question",
    answerAr: "",
    answerEn: "",
    isPublished: false,
  };
}

function moveItem<T>(items: T[], fromIndex: number, direction: -1 | 1) {
  if (fromIndex < 0) {
    return items;
  }

  const nextIndex = fromIndex + direction;

  if (nextIndex < 0 || nextIndex >= items.length) {
    return items;
  }

  const nextItems = [...items];
  const [item] = nextItems.splice(fromIndex, 1);
  nextItems.splice(nextIndex, 0, item);
  return nextItems;
}

function StatCard({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  tone: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5">
      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${tone} text-white flex items-center justify-center shadow-sm mb-4`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3h5.25m-6.375 8.25h11.25A2.25 2.25 0 0019.875 17.25V6.75A2.25 2.25 0 0017.625 4.5H6.375A2.25 2.25 0 004.125 6.75v10.5A2.25 2.25 0 006.375 19.5z" />
        </svg>
      </div>
      <p className="text-sm text-[#6B7280] mb-1">{label}</p>
      <p className="text-3xl font-bold text-[#111]">{value}</p>
      <p className="text-xs text-[#9CA3AF] mt-2">{note}</p>
    </div>
  );
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active ? "bg-[#111] text-white shadow-sm" : "bg-[#F8F9FB] text-[#6B7280] hover:text-[#111]"
      }`}
    >
      {label}
    </button>
  );
}

function ToggleButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        active ? "bg-[#ECFDF5] text-[#047857]" : "bg-[#F3F4F6] text-[#6B7280]"
      }`}
    >
      {label}
    </button>
  );
}

function RatingInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < value;

        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(index + 1)}
            className={filled ? "text-[#F59E0B]" : "text-[#D1D5DB]"}
            aria-label={`تقييم ${index + 1}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        );
      })}
      <span className="text-xs text-[#9CA3AF] mr-2">{value}/5</span>
    </div>
  );
}

export default function AdminAboutPage() {
  const [content, setContent] = useState<AboutContent>(() => cloneAboutContent());
  const [activeTab, setActiveTab] = useState<EditorTab>("reviews");
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [selectedFaqId, setSelectedFaqId] = useState<string | null>(null);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = readAboutContent();
      setContent(stored);
      setSelectedReviewId(stored.reviews[0]?.id ?? null);
      setSelectedFaqId(stored.faqs[0]?.id ?? null);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const publishedReviews = useMemo(
    () => content.reviews.filter((review) => review.isPublished),
    [content.reviews],
  );
  const featuredReviews = useMemo(
    () => content.reviews.filter((review) => review.isPublished && review.isFeatured),
    [content.reviews],
  );
  const publishedFaqs = useMemo(() => content.faqs.filter((faq) => faq.isPublished), [content.faqs]);
  const averageRating = publishedReviews.length
    ? (publishedReviews.reduce((sum, review) => sum + review.rating, 0) / publishedReviews.length).toFixed(1)
    : "0.0";

  const selectedReview = content.reviews.find((review) => review.id === selectedReviewId) ?? null;
  const selectedFaq = content.faqs.find((faq) => faq.id === selectedFaqId) ?? null;

  const updateReviews = (updater: (reviews: AboutReview[]) => AboutReview[]) => {
    setContent((current) => ({ ...current, reviews: updater(current.reviews) }));
    setSaved(false);
  };

  const updateFaqs = (updater: (faqs: AboutFaq[]) => AboutFaq[]) => {
    setContent((current) => ({ ...current, faqs: updater(current.faqs) }));
    setSaved(false);
  };

  const updateReviewField = <K extends keyof AboutReview>(key: K, value: AboutReview[K]) => {
    if (!selectedReviewId) return;

    updateReviews((reviews) =>
      reviews.map((review) => (review.id === selectedReviewId ? { ...review, [key]: value } : review)),
    );
  };

  const updateFaqField = <K extends keyof AboutFaq>(key: K, value: AboutFaq[K]) => {
    if (!selectedFaqId) return;

    updateFaqs((faqs) => faqs.map((faq) => (faq.id === selectedFaqId ? { ...faq, [key]: value } : faq)));
  };

  const addReview = () => {
    const nextReview = createReview();
    updateReviews((reviews) => [nextReview, ...reviews]);
    setActiveTab("reviews");
    setSelectedReviewId(nextReview.id);
  };

  const addFaq = () => {
    const nextFaq = createFaq();
    updateFaqs((faqs) => [nextFaq, ...faqs]);
    setActiveTab("faqs");
    setSelectedFaqId(nextFaq.id);
  };

  const deleteReview = (id: string) => {
    const filtered = content.reviews.filter((review) => review.id !== id);
    updateReviews(() => filtered);

    if (selectedReviewId === id) {
      setSelectedReviewId(filtered[0]?.id ?? null);
    }
  };

  const deleteFaq = (id: string) => {
    const filtered = content.faqs.filter((faq) => faq.id !== id);
    updateFaqs(() => filtered);

    if (selectedFaqId === id) {
      setSelectedFaqId(filtered[0]?.id ?? null);
    }
  };

  const moveReview = (id: string, direction: -1 | 1) => {
    updateReviews((reviews) => {
      const currentIndex = reviews.findIndex((review) => review.id === id);
      return moveItem(reviews, currentIndex, direction);
    });
  };

  const moveFaq = (id: string, direction: -1 | 1) => {
    updateFaqs((faqs) => {
      const currentIndex = faqs.findIndex((faq) => faq.id === id);
      return moveItem(faqs, currentIndex, direction);
    });
  };

  const handleSave = () => {
    saveAboutContent(content);
    setSaved(true);
  };

  const restoreDefaults = () => {
    const defaults = cloneAboutContent();
    setContent(defaults);
    setSelectedReviewId(defaults.reviews[0]?.id ?? null);
    setSelectedFaqId(defaults.faqs[0]?.id ?? null);
    saveAboutContent(defaults);
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">صفحة من نحن</h1>
          <p className="text-sm text-[#6B7280] mt-1">إدارة مراجعات العملاء والأسئلة الشائعة الظاهرة في صفحة من نحن.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/ar/about"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#374151] hover:bg-white transition-colors"
          >
            معاينة الصفحة
          </Link>
          <button
            type="button"
            onClick={restoreDefaults}
            className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#374151] hover:bg-white transition-colors"
          >
            استعادة الافتراضي
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              saved ? "bg-[#10B981] text-white" : "bg-[#111] text-white hover:bg-[#333]"
            }`}
          >
            {saved ? "تم الحفظ" : "حفظ التغييرات"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="مراجعات منشورة" value={String(publishedReviews.length)} note="البطاقات الظاهرة في قسم التقييمات" tone="from-[#0EA5E9] to-[#38BDF8]" />
        <StatCard label="متوسط التقييم" value={averageRating} note="يُحتسب من المراجعات المنشورة فقط" tone="from-[#F59E0B] to-[#FBBF24]" />
        <StatCard label="مراجعات مميزة" value={String(featuredReviews.length)} note="لإبراز أفضل الانطباعات عن الخدمة" tone="from-[#8B5CF6] to-[#A78BFA]" />
        <StatCard label="أسئلة منشورة" value={String(publishedFaqs.length)} note="الأسئلة الظاهرة في الأكورديون العام" tone="from-[#10B981] to-[#34D399]" />
      </div>

      <div className="bg-[#FFF7ED] border border-[#FDE68A]/40 rounded-2xl p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-xs font-bold text-[#92400E]">طريقة الحفظ الحالية</p>
            <p className="text-[11px] text-[#B45309] mt-0.5 leading-relaxed">
              التغييرات تُحفَظ مؤقتاً في <code className="bg-white/60 px-1 rounded font-mono">localStorage</code> لتنعكس مباشرة على صفحة من نحن داخل المتصفح الحالي.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#92400E]">
          <span className={`w-2 h-2 rounded-full ${saved ? "bg-[#10B981]" : "bg-[#F59E0B]"}`} />
          {saved ? "كل شيء محفوظ" : "هناك تغييرات غير محفوظة"}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#F3F4F6] p-2 flex flex-wrap gap-2">
        <TabButton active={activeTab === "reviews"} label="مراجعات العملاء" onClick={() => setActiveTab("reviews")} />
        <TabButton active={activeTab === "faqs"} label="الأسئلة الشائعة" onClick={() => setActiveTab("faqs")} />
      </div>

      {activeTab === "reviews" ? (
        <div className="grid xl:grid-cols-[360px,minmax(0,1fr)] gap-6">
          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5 space-y-4 h-fit">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#111]">المراجعات</h2>
                <p className="text-xs text-[#9CA3AF] mt-1">رتّب، انشر، أو أخفِ أي مراجعة.</p>
              </div>
              <button type="button" onClick={addReview} className="px-3 py-2 rounded-xl bg-[#111] text-white text-sm font-medium hover:bg-[#333] transition-colors">
                إضافة مراجعة
              </button>
            </div>

            <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
              {content.reviews.map((review, index) => (
                <div
                  key={review.id}
                  className={`w-full text-right rounded-2xl border p-4 transition-all ${
                    selectedReviewId === review.id ? "border-[#111] bg-[#F9FAFB] shadow-sm" : "border-[#F3F4F6] hover:border-[#E5E7EB]"
                  }`}
                >
                  <button type="button" onClick={() => setSelectedReviewId(review.id)} className="w-full text-right">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-[#111]">{review.nameAr || "بدون اسم"}</p>
                        <p className="text-[11px] text-[#9CA3AF] mt-1 line-clamp-1">{review.serviceAr || "بدون تصنيف خدمة"}</p>
                      </div>
                      <span className="text-[11px] text-[#9CA3AF]">#{index + 1}</span>
                    </div>

                    <div className="flex items-center gap-1 mt-3 mb-2">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <svg key={starIndex} className={`w-3.5 h-3.5 ${starIndex < review.rating ? "text-[#F59E0B]" : "text-[#E5E7EB]"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2">{review.textAr || "أضف نص المراجعة هنا..."}</p>
                  </button>

                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <ToggleButton active={review.isPublished} label={review.isPublished ? "منشور" : "مخفي"} onClick={() => updateReviews((reviews) => reviews.map((item) => item.id === review.id ? { ...item, isPublished: !item.isPublished } : item))} />
                    <ToggleButton active={review.isFeatured} label={review.isFeatured ? "مميز" : "عادي"} onClick={() => updateReviews((reviews) => reviews.map((item) => item.id === review.id ? { ...item, isFeatured: !item.isFeatured } : item))} />
                    <button type="button" onClick={() => moveReview(review.id, -1)} className="px-2.5 py-1.5 rounded-full bg-[#F3F4F6] text-[#6B7280] text-xs">رفع</button>
                    <button type="button" onClick={() => moveReview(review.id, 1)} className="px-2.5 py-1.5 rounded-full bg-[#F3F4F6] text-[#6B7280] text-xs">خفض</button>
                    <button type="button" onClick={() => deleteReview(review.id)} className="px-2.5 py-1.5 rounded-full bg-[#FEF2F2] text-[#DC2626] text-xs mr-auto">حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-6">
            {selectedReview ? (
              <div className="space-y-6">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#111]">تحرير المراجعة</h2>
                    <p className="text-xs text-[#9CA3AF] mt-1">المحتوى العربي والإنجليزي يُستخدم مباشرة في الواجهة العامة.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <ToggleButton active={selectedReview.isPublished} label={selectedReview.isPublished ? "المراجعة منشورة" : "المراجعة مخفية"} onClick={() => updateReviewField("isPublished", !selectedReview.isPublished)} />
                    <ToggleButton active={selectedReview.isFeatured} label={selectedReview.isFeatured ? "مراجعة مميزة" : "ليست مميزة"} onClick={() => updateReviewField("isFeatured", !selectedReview.isFeatured)} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">اسم العميل (عربي)</label>
                    <input value={selectedReview.nameAr} onChange={(event) => updateReviewField("nameAr", event.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">اسم العميل (إنجليزي)</label>
                    <input value={selectedReview.nameEn} onChange={(event) => updateReviewField("nameEn", event.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">المدينة أو السوق المستهدف (عربي)</label>
                    <input value={selectedReview.locationAr} onChange={(event) => updateReviewField("locationAr", event.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">المدينة أو السوق المستهدف (إنجليزي)</label>
                    <input value={selectedReview.locationEn} onChange={(event) => updateReviewField("locationEn", event.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">الخدمة أو الرحلة (عربي)</label>
                    <input value={selectedReview.serviceAr} onChange={(event) => updateReviewField("serviceAr", event.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">الخدمة أو الرحلة (إنجليزي)</label>
                    <input value={selectedReview.serviceEn} onChange={(event) => updateReviewField("serviceEn", event.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" dir="ltr" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-2">التقييم</label>
                  <RatingInput value={selectedReview.rating} onChange={(value) => updateReviewField("rating", value)} />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">نص المراجعة (عربي)</label>
                    <textarea value={selectedReview.textAr} onChange={(event) => updateReviewField("textAr", event.target.value)} rows={6} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">نص المراجعة (إنجليزي)</label>
                    <textarea value={selectedReview.textEn} onChange={(event) => updateReviewField("textEn", event.target.value)} rows={6} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors resize-none" dir="ltr" />
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] p-5">
                  <p className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-[0.2em] mb-3">معاينة سريعة</p>
                  <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div>
                        <h3 className="text-sm font-bold text-[#111]">{selectedReview.nameAr || "اسم العميل"}</h3>
                        <p className="text-[11px] text-[#9CA3AF] mt-1">{[selectedReview.serviceAr, selectedReview.locationAr].filter(Boolean).join(" - ") || "الخدمة - المدينة"}</p>
                      </div>
                      <RatingInput value={selectedReview.rating} onChange={(value) => updateReviewField("rating", value)} />
                    </div>
                    <p className="text-sm text-[#374151] leading-relaxed mt-4">{selectedReview.textAr || "سيظهر نص المراجعة هنا بعد كتابته."}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-[#F9FAFB] p-10 text-center text-sm text-[#6B7280]">
                اختر مراجعة من القائمة أو أضف مراجعة جديدة للبدء.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid xl:grid-cols-[360px,minmax(0,1fr)] gap-6">
          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5 space-y-4 h-fit">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#111]">الأسئلة الشائعة</h2>
                <p className="text-xs text-[#9CA3AF] mt-1">رتّب الأسئلة المنشورة بحسب الأولوية.</p>
              </div>
              <button type="button" onClick={addFaq} className="px-3 py-2 rounded-xl bg-[#111] text-white text-sm font-medium hover:bg-[#333] transition-colors">
                إضافة سؤال
              </button>
            </div>

            <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
              {content.faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className={`w-full text-right rounded-2xl border p-4 transition-all ${
                    selectedFaqId === faq.id ? "border-[#111] bg-[#F9FAFB] shadow-sm" : "border-[#F3F4F6] hover:border-[#E5E7EB]"
                  }`}
                >
                  <button type="button" onClick={() => setSelectedFaqId(faq.id)} className="w-full text-right">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-bold text-[#111] line-clamp-2">{faq.questionAr || "بدون عنوان"}</p>
                      <span className="text-[11px] text-[#9CA3AF]">#{index + 1}</span>
                    </div>

                    <p className="text-xs text-[#6B7280] leading-relaxed mt-3 line-clamp-3">{faq.answerAr || "أضف إجابة هذا السؤال هنا..."}</p>
                  </button>

                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <ToggleButton active={faq.isPublished} label={faq.isPublished ? "منشور" : "مخفي"} onClick={() => updateFaqs((faqs) => faqs.map((item) => item.id === faq.id ? { ...item, isPublished: !item.isPublished } : item))} />
                    <button type="button" onClick={() => moveFaq(faq.id, -1)} className="px-2.5 py-1.5 rounded-full bg-[#F3F4F6] text-[#6B7280] text-xs">رفع</button>
                    <button type="button" onClick={() => moveFaq(faq.id, 1)} className="px-2.5 py-1.5 rounded-full bg-[#F3F4F6] text-[#6B7280] text-xs">خفض</button>
                    <button type="button" onClick={() => deleteFaq(faq.id)} className="px-2.5 py-1.5 rounded-full bg-[#FEF2F2] text-[#DC2626] text-xs mr-auto">حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-6">
            {selectedFaq ? (
              <div className="space-y-6">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#111]">تحرير السؤال</h2>
                    <p className="text-xs text-[#9CA3AF] mt-1">أضف نسخة واضحة بالعربية والإنجليزية لكل سؤال وجواب.</p>
                  </div>
                  <ToggleButton active={selectedFaq.isPublished} label={selectedFaq.isPublished ? "السؤال منشور" : "السؤال مخفي"} onClick={() => updateFaqField("isPublished", !selectedFaq.isPublished)} />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">السؤال (عربي)</label>
                    <input value={selectedFaq.questionAr} onChange={(event) => updateFaqField("questionAr", event.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">السؤال (إنجليزي)</label>
                    <input value={selectedFaq.questionEn} onChange={(event) => updateFaqField("questionEn", event.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" dir="ltr" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">الإجابة (عربي)</label>
                    <textarea value={selectedFaq.answerAr} onChange={(event) => updateFaqField("answerAr", event.target.value)} rows={7} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">الإجابة (إنجليزي)</label>
                    <textarea value={selectedFaq.answerEn} onChange={(event) => updateFaqField("answerEn", event.target.value)} rows={7} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors resize-none" dir="ltr" />
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] p-5 space-y-4">
                  <p className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-[0.2em]">معاينة الأكورديون</p>
                  <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-bold text-[#111]">{selectedFaq.questionAr || "عنوان السؤال"}</h3>
                      <svg className="w-5 h-5 text-[#9CA3AF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                    <p className="text-sm text-[#6B7280] leading-relaxed mt-4">{selectedFaq.answerAr || "ستظهر الإجابة هنا بعد كتابتها."}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-[#F9FAFB] p-10 text-center text-sm text-[#6B7280]">
                اختر سؤالاً من القائمة أو أضف سؤالاً جديداً للبدء.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
