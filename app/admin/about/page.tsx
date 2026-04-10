"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import {
  listFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  type FaqRecord,
  type FaqMutationInput,
} from "@/lib/faq-service";
import {
  listComments,
  createComment,
  updateComment,
  deleteComment,
  type CommentRecord,
  type CommentMutationInput,
} from "@/lib/comment-service";

type EditorTab = "faqs" | "comments";

/* ── Toast types ───────────────────────────────────── */

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

let toastCounter = 0;

/* ── Inline SVG icons ──────────────────────────────── */

const ChevronDown = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

/* ── Star Rating ───────────────────────────────────── */

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`transition-colors ${star <= value ? "text-[#F59E0B]" : "text-[#D1D5DB] hover:text-[#FCD34D]"}`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

/* ── Form Field ────────────────────────────────────── */

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#374151] mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-[#DC2626] mt-1">{error}</p>}
    </div>
  );
}

const inputClass = "w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors bg-white";
const inputErrorClass = "w-full border border-[#FCA5A5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#DC2626] transition-colors bg-white";

/* ── Toast Component ──────────────────────────────── */

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-slide-up ${
            toast.type === "success"
              ? "bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]"
              : "bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]"
          }`}
        >
          {toast.type === "success" ? (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          )}
          <span>{toast.message}</span>
          <button onClick={() => onDismiss(toast.id)} className="mr-auto text-current opacity-50 hover:opacity-100">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

/* ── Confirm Dialog ───────────────────────────────── */

function ConfirmDialog({ message, onConfirm, onCancel, loading }: { message: string; onConfirm: () => void; onCancel: () => void; loading?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full space-y-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 rounded-full bg-[#FEF2F2] flex items-center justify-center">
            <svg className="w-5 h-5 text-[#DC2626]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111]">تأكيد الحذف</h3>
            <p className="text-sm text-[#6B7280] mt-1">{message}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors disabled:opacity-50"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#DC2626] text-white text-sm font-medium hover:bg-[#B91C1C] transition-colors disabled:opacity-50"
          >
            {loading && <SpinnerIcon />}
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Loading Skeleton ─────────────────────────────── */

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-48 bg-[#E5E7EB] rounded" />
          <div className="h-3 w-32 bg-[#F3F4F6] rounded" />
        </div>
        <div className="h-4 w-4 bg-[#E5E7EB] rounded" />
      </div>
    </div>
  );
}

/* ── FAQ Admin Card ───────────────────────────────── */

function AdminFaqCard({
  faq,
  isOpen,
  onToggle,
  onSave,
  onDelete,
  saving,
}: {
  faq: FaqRecord;
  isOpen: boolean;
  onToggle: () => void;
  onSave: (input: FaqMutationInput) => Promise<void>;
  onDelete: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<FaqMutationInput>({
    questionAr: faq.questionAr,
    questionEn: faq.questionEn,
    answerAr: faq.answerAr,
    answerEn: faq.answerEn,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FaqMutationInput, string>>>({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setForm({
      questionAr: faq.questionAr,
      questionEn: faq.questionEn,
      answerAr: faq.answerAr,
      answerEn: faq.answerEn,
    });
    setDirty(false);
    setErrors({});
  }, [faq]);

  const set = <K extends keyof FaqMutationInput>(key: K, value: FaqMutationInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FaqMutationInput, string>> = {};
    if (!form.questionAr.trim()) newErrors.questionAr = "السؤال بالعربي مطلوب";
    if (!form.questionEn.trim()) newErrors.questionEn = "السؤال بالإنجليزي مطلوب";
    if (!form.answerAr.trim()) newErrors.answerAr = "الإجابة بالعربي مطلوبة";
    if (!form.answerEn.trim()) newErrors.answerEn = "الإجابة بالإنجليزي مطلوبة";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await onSave(form);
    setDirty(false);
  };

  return (
    <div className={`rounded-2xl border transition-all ${isOpen ? "border-[#111] bg-white shadow-sm" : "border-[#E5E7EB] bg-white hover:border-[#D1D5DB]"}`}>
      <button type="button" onClick={onToggle} className="w-full flex items-center gap-3 p-4 text-right">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#111] truncate">{faq.questionAr || "سؤال جديد"}</p>
          <p className="text-xs text-[#9CA3AF] mt-1 truncate">{faq.questionEn || "New question"}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-[#9CA3AF] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="px-4 pb-5 space-y-4 border-t border-[#F3F4F6]">
          <div className="grid sm:grid-cols-2 gap-3 pt-4">
            <Field label="السؤال (عربي)" error={errors.questionAr}>
              <input value={form.questionAr} onChange={(e) => set("questionAr", e.target.value)} className={errors.questionAr ? inputErrorClass : inputClass} />
            </Field>
            <Field label="السؤال (إنجليزي)" error={errors.questionEn}>
              <input value={form.questionEn} onChange={(e) => set("questionEn", e.target.value)} className={errors.questionEn ? inputErrorClass : inputClass} dir="ltr" />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="الإجابة (عربي)" error={errors.answerAr}>
              <textarea value={form.answerAr} onChange={(e) => set("answerAr", e.target.value)} rows={4} className={`${errors.answerAr ? inputErrorClass : inputClass} resize-none`} />
            </Field>
            <Field label="الإجابة (إنجليزي)" error={errors.answerEn}>
              <textarea value={form.answerEn} onChange={(e) => set("answerEn", e.target.value)} rows={4} className={`${errors.answerEn ? inputErrorClass : inputClass} resize-none`} dir="ltr" />
            </Field>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !dirty}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111] text-white text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-40"
            >
              {saving && <SpinnerIcon />}
              حفظ التغييرات
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="p-2 rounded-xl bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2] transition-colors mr-auto"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Comment Admin Card ───────────────────────────── */

function AdminCommentCard({
  comment,
  isOpen,
  onToggle,
  onSave,
  onDelete,
  saving,
}: {
  comment: CommentRecord;
  isOpen: boolean;
  onToggle: () => void;
  onSave: (input: CommentMutationInput) => Promise<void>;
  onDelete: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<CommentMutationInput>({
    clientNameAr: comment.clientNameAr,
    clientNameEn: comment.clientNameEn,
    stars: comment.rating,
    commentAr: comment.commentAr,
    commentEn: comment.commentEn,
    tripNameAr: comment.tripNameAr,
    tripNameEn: comment.tripNameEn,
    cityAr: comment.cityAr,
    cityEn: comment.cityEn,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CommentMutationInput, string>>>({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setForm({
      clientNameAr: comment.clientNameAr,
      clientNameEn: comment.clientNameEn,
      stars: comment.rating,
      commentAr: comment.commentAr,
      commentEn: comment.commentEn,
      tripNameAr: comment.tripNameAr,
      tripNameEn: comment.tripNameEn,
      cityAr: comment.cityAr,
      cityEn: comment.cityEn,
    });
    setDirty(false);
    setErrors({});
  }, [comment]);

  const set = <K extends keyof CommentMutationInput>(key: K, value: CommentMutationInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CommentMutationInput, string>> = {};
    if (!form.clientNameAr.trim()) newErrors.clientNameAr = "اسم العميل بالعربي مطلوب";
    if (!form.clientNameEn.trim()) newErrors.clientNameEn = "اسم العميل بالإنجليزي مطلوب";
    if (!form.commentAr.trim()) newErrors.commentAr = "نص التعليق بالعربي مطلوب";
    if (!form.commentEn.trim()) newErrors.commentEn = "نص التعليق بالإنجليزي مطلوب";
    if (!form.tripNameAr.trim()) newErrors.tripNameAr = "اسم الرحلة بالعربي مطلوب";
    if (!form.tripNameEn.trim()) newErrors.tripNameEn = "اسم الرحلة بالإنجليزي مطلوب";
    if (!form.cityAr.trim()) newErrors.cityAr = "المدينة بالعربي مطلوبة";
    if (!form.cityEn.trim()) newErrors.cityEn = "المدينة بالإنجليزي مطلوبة";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await onSave(form);
    setDirty(false);
  };

  return (
    <div className={`rounded-2xl border transition-all ${isOpen ? "border-[#111] bg-white shadow-sm" : "border-[#E5E7EB] bg-white hover:border-[#D1D5DB]"}`}>
      <button type="button" onClick={onToggle} className="w-full flex items-center gap-3 p-4 text-right">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-[#111] truncate">{comment.clientNameAr || "تعليق جديد"}</p>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-1 truncate">{[comment.tripNameAr, comment.cityAr].filter(Boolean).join(" - ") || "بدون وصف"}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {[1, 2, 3, 4, 5].map((s) => (
            <svg key={s} className={`w-3 h-3 ${s <= comment.rating ? "text-[#F59E0B]" : "text-[#E5E7EB]"}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <ChevronDown className={`w-4 h-4 text-[#9CA3AF] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="px-4 pb-5 space-y-4 border-t border-[#F3F4F6]">
          <div className="grid sm:grid-cols-2 gap-3 pt-4">
            <Field label="اسم العميل (عربي)" error={errors.clientNameAr}>
              <input value={form.clientNameAr} onChange={(e) => set("clientNameAr", e.target.value)} className={errors.clientNameAr ? inputErrorClass : inputClass} />
            </Field>
            <Field label="اسم العميل (إنجليزي)" error={errors.clientNameEn}>
              <input value={form.clientNameEn} onChange={(e) => set("clientNameEn", e.target.value)} className={errors.clientNameEn ? inputErrorClass : inputClass} dir="ltr" />
            </Field>
          </div>

          <Field label="التقييم">
            <StarRating value={form.stars} onChange={(v) => set("stars", v)} />
          </Field>

          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="اسم الرحلة (عربي)" error={errors.tripNameAr}>
              <input value={form.tripNameAr} onChange={(e) => set("tripNameAr", e.target.value)} className={errors.tripNameAr ? inputErrorClass : inputClass} />
            </Field>
            <Field label="اسم الرحلة (إنجليزي)" error={errors.tripNameEn}>
              <input value={form.tripNameEn} onChange={(e) => set("tripNameEn", e.target.value)} className={errors.tripNameEn ? inputErrorClass : inputClass} dir="ltr" />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="المدينة (عربي)" error={errors.cityAr}>
              <input value={form.cityAr} onChange={(e) => set("cityAr", e.target.value)} className={errors.cityAr ? inputErrorClass : inputClass} />
            </Field>
            <Field label="المدينة (إنجليزي)" error={errors.cityEn}>
              <input value={form.cityEn} onChange={(e) => set("cityEn", e.target.value)} className={errors.cityEn ? inputErrorClass : inputClass} dir="ltr" />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="نص التعليق (عربي)" error={errors.commentAr}>
              <textarea value={form.commentAr} onChange={(e) => set("commentAr", e.target.value)} rows={4} className={`${errors.commentAr ? inputErrorClass : inputClass} resize-none`} />
            </Field>
            <Field label="نص التعليق (إنجليزي)" error={errors.commentEn}>
              <textarea value={form.commentEn} onChange={(e) => set("commentEn", e.target.value)} rows={4} className={`${errors.commentEn ? inputErrorClass : inputClass} resize-none`} dir="ltr" />
            </Field>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !dirty}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111] text-white text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-40"
            >
              {saving && <SpinnerIcon />}
              حفظ التغييرات
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="p-2 rounded-xl bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2] transition-colors mr-auto"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── New FAQ Form ─────────────────────────────────── */

function NewFaqForm({ onSubmit, onCancel, submitting }: { onSubmit: (input: FaqMutationInput) => Promise<void>; onCancel: () => void; submitting: boolean }) {
  const [form, setForm] = useState<FaqMutationInput>({
    questionAr: "",
    questionEn: "",
    answerAr: "",
    answerEn: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FaqMutationInput, string>>>({});

  const set = <K extends keyof FaqMutationInput>(key: K, value: FaqMutationInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FaqMutationInput, string>> = {};
    if (!form.questionAr.trim()) newErrors.questionAr = "السؤال بالعربي مطلوب";
    if (!form.questionEn.trim()) newErrors.questionEn = "السؤال بالإنجليزي مطلوب";
    if (!form.answerAr.trim()) newErrors.answerAr = "الإجابة بالعربي مطلوبة";
    if (!form.answerEn.trim()) newErrors.answerEn = "الإجابة بالإنجليزي مطلوبة";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit(form);
  };

  return (
    <div className="rounded-2xl border-2 border-dashed border-[#0EA5E9]/30 bg-[#F0F9FF] p-5 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center">
          <PlusIcon />
        </div>
        <h3 className="text-sm font-bold text-[#111]">إضافة سؤال جديد</h3>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="السؤال (عربي)" error={errors.questionAr}>
          <input value={form.questionAr} onChange={(e) => set("questionAr", e.target.value)} className={errors.questionAr ? inputErrorClass : inputClass} placeholder="ما هي مدة الرحلة؟" />
        </Field>
        <Field label="السؤال (إنجليزي)" error={errors.questionEn}>
          <input value={form.questionEn} onChange={(e) => set("questionEn", e.target.value)} className={errors.questionEn ? inputErrorClass : inputClass} dir="ltr" placeholder="What is the trip duration?" />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="الإجابة (عربي)" error={errors.answerAr}>
          <textarea value={form.answerAr} onChange={(e) => set("answerAr", e.target.value)} rows={3} className={`${errors.answerAr ? inputErrorClass : inputClass} resize-none`} placeholder="الإجابة بالعربي..." />
        </Field>
        <Field label="الإجابة (إنجليزي)" error={errors.answerEn}>
          <textarea value={form.answerEn} onChange={(e) => set("answerEn", e.target.value)} rows={3} className={`${errors.answerEn ? inputErrorClass : inputClass} resize-none`} dir="ltr" placeholder="Answer in English..." />
        </Field>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111] text-white text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
        >
          {submitting && <SpinnerIcon />}
          إضافة السؤال
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#374151] hover:bg-white transition-colors"
        >
          إلغاء
        </button>
      </div>
    </div>
  );
}

/* ── New Comment Form ─────────────────────────────── */

function NewCommentForm({ onSubmit, onCancel, submitting }: { onSubmit: (input: CommentMutationInput) => Promise<void>; onCancel: () => void; submitting: boolean }) {
  const [form, setForm] = useState<CommentMutationInput>({
    clientNameAr: "",
    clientNameEn: "",
    stars: 5,
    commentAr: "",
    commentEn: "",
    tripNameAr: "",
    tripNameEn: "",
    cityAr: "",
    cityEn: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CommentMutationInput, string>>>({});

  const set = <K extends keyof CommentMutationInput>(key: K, value: CommentMutationInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CommentMutationInput, string>> = {};
    if (!form.clientNameAr.trim()) newErrors.clientNameAr = "اسم العميل بالعربي مطلوب";
    if (!form.clientNameEn.trim()) newErrors.clientNameEn = "اسم العميل بالإنجليزي مطلوب";
    if (!form.commentAr.trim()) newErrors.commentAr = "نص التعليق بالعربي مطلوب";
    if (!form.commentEn.trim()) newErrors.commentEn = "نص التعليق بالإنجليزي مطلوب";
    if (!form.tripNameAr.trim()) newErrors.tripNameAr = "اسم الرحلة بالعربي مطلوب";
    if (!form.tripNameEn.trim()) newErrors.tripNameEn = "اسم الرحلة بالإنجليزي مطلوب";
    if (!form.cityAr.trim()) newErrors.cityAr = "المدينة بالعربي مطلوبة";
    if (!form.cityEn.trim()) newErrors.cityEn = "المدينة بالإنجليزي مطلوبة";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit(form);
  };

  return (
    <div className="rounded-2xl border-2 border-dashed border-[#0EA5E9]/30 bg-[#F0F9FF] p-5 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center">
          <PlusIcon />
        </div>
        <h3 className="text-sm font-bold text-[#111]">إضافة تعليق جديد</h3>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="اسم العميل (عربي)" error={errors.clientNameAr}>
          <input value={form.clientNameAr} onChange={(e) => set("clientNameAr", e.target.value)} className={errors.clientNameAr ? inputErrorClass : inputClass} placeholder="أحمد محمد" />
        </Field>
        <Field label="اسم العميل (إنجليزي)" error={errors.clientNameEn}>
          <input value={form.clientNameEn} onChange={(e) => set("clientNameEn", e.target.value)} className={errors.clientNameEn ? inputErrorClass : inputClass} dir="ltr" placeholder="Ahmed Mohamed" />
        </Field>
      </div>

      <Field label="التقييم">
        <StarRating value={form.stars} onChange={(v) => set("stars", v)} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="اسم الرحلة (عربي)" error={errors.tripNameAr}>
          <input value={form.tripNameAr} onChange={(e) => set("tripNameAr", e.target.value)} className={errors.tripNameAr ? inputErrorClass : inputClass} placeholder="رحلة شرم الشيخ" />
        </Field>
        <Field label="اسم الرحلة (إنجليزي)" error={errors.tripNameEn}>
          <input value={form.tripNameEn} onChange={(e) => set("tripNameEn", e.target.value)} className={errors.tripNameEn ? inputErrorClass : inputClass} dir="ltr" placeholder="Sharm El-Sheikh Trip" />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="المدينة (عربي)" error={errors.cityAr}>
          <input value={form.cityAr} onChange={(e) => set("cityAr", e.target.value)} className={errors.cityAr ? inputErrorClass : inputClass} placeholder="شرم الشيخ" />
        </Field>
        <Field label="المدينة (إنجليزي)" error={errors.cityEn}>
          <input value={form.cityEn} onChange={(e) => set("cityEn", e.target.value)} className={errors.cityEn ? inputErrorClass : inputClass} dir="ltr" placeholder="Sharm El-Sheikh" />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="نص التعليق (عربي)" error={errors.commentAr}>
          <textarea value={form.commentAr} onChange={(e) => set("commentAr", e.target.value)} rows={3} className={`${errors.commentAr ? inputErrorClass : inputClass} resize-none`} placeholder="رحلة رائعة وخدمة ممتازة!" />
        </Field>
        <Field label="نص التعليق (إنجليزي)" error={errors.commentEn}>
          <textarea value={form.commentEn} onChange={(e) => set("commentEn", e.target.value)} rows={3} className={`${errors.commentEn ? inputErrorClass : inputClass} resize-none`} dir="ltr" placeholder="Amazing trip and excellent service!" />
        </Field>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111] text-white text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
        >
          {submitting && <SpinnerIcon />}
          إضافة التعليق
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#374151] hover:bg-white transition-colors"
        >
          إلغاء
        </button>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────── */

export default function AdminAboutPage() {
  const [activeTab, setActiveTab] = useState<EditorTab>("faqs");

  // ── FAQ State ──────────────────────────────────────
  const [faqs, setFaqs] = useState<FaqRecord[]>([]);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [faqsError, setFaqsError] = useState<string | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [showNewFaq, setShowNewFaq] = useState(false);
  const [faqSaving, setFaqSaving] = useState(false);

  // ── Comment State ──────────────────────────────────
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [openCommentId, setOpenCommentId] = useState<string | null>(null);
  const [showNewComment, setShowNewComment] = useState(false);
  const [commentSaving, setCommentSaving] = useState(false);

  // ── Dialog State ───────────────────────────────────
  const [deleteDialog, setDeleteDialog] = useState<{ type: "faq" | "comment"; id: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Toast State ────────────────────────────────────
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: "success" | "error") => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Fetch FAQs ─────────────────────────────────────
  const fetchFaqs = useCallback(async () => {
    try {
      setFaqsLoading(true);
      setFaqsError(null);
      const result = await listFaqs({ limit: 100 });
      setFaqs(result.faqs);
    } catch (err) {
      setFaqsError(err instanceof Error ? err.message : "فشل تحميل الأسئلة");
    } finally {
      setFaqsLoading(false);
    }
  }, []);

  // ── Fetch Comments ─────────────────────────────────
  const fetchComments = useCallback(async () => {
    try {
      setCommentsLoading(true);
      setCommentsError(null);
      const result = await listComments({ limit: 100 });
      setComments(result.comments);
    } catch (err) {
      setCommentsError(err instanceof Error ? err.message : "فشل تحميل التعليقات");
    } finally {
      setCommentsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
    fetchComments();
  }, [fetchFaqs, fetchComments]);

  // ── FAQ Handlers ───────────────────────────────────

  const handleCreateFaq = async (input: FaqMutationInput) => {
    try {
      setFaqSaving(true);
      await createFaq(input);
      await fetchFaqs();
      setShowNewFaq(false);
      addToast("تم إضافة السؤال بنجاح", "success");
    } catch (err) {
      addToast(err instanceof Error ? err.message : "فشل إضافة السؤال", "error");
    } finally {
      setFaqSaving(false);
    }
  };

  const handleUpdateFaq = async (id: string, input: FaqMutationInput) => {
    try {
      setFaqSaving(true);
      await updateFaq(id, input);
      await fetchFaqs();
      addToast("تم تحديث السؤال بنجاح", "success");
    } catch (err) {
      addToast(err instanceof Error ? err.message : "فشل تحديث السؤال", "error");
    } finally {
      setFaqSaving(false);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      setDeleteLoading(true);
      await deleteFaq(id);
      await fetchFaqs();
      setDeleteDialog(null);
      if (openFaqId === id) setOpenFaqId(null);
      addToast("تم حذف السؤال بنجاح", "success");
    } catch (err) {
      addToast(err instanceof Error ? err.message : "فشل حذف السؤال", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Comment Handlers ───────────────────────────────

  const handleCreateComment = async (input: CommentMutationInput) => {
    try {
      setCommentSaving(true);
      await createComment(input);
      await fetchComments();
      setShowNewComment(false);
      addToast("تم إضافة التعليق بنجاح", "success");
    } catch (err) {
      addToast(err instanceof Error ? err.message : "فشل إضافة التعليق", "error");
    } finally {
      setCommentSaving(false);
    }
  };

  const handleUpdateComment = async (id: string, input: CommentMutationInput) => {
    try {
      setCommentSaving(true);
      await updateComment(id, input);
      await fetchComments();
      addToast("تم تحديث التعليق بنجاح", "success");
    } catch (err) {
      addToast(err instanceof Error ? err.message : "فشل تحديث التعليق", "error");
    } finally {
      setCommentSaving(false);
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      setDeleteLoading(true);
      await deleteComment(id);
      await fetchComments();
      setDeleteDialog(null);
      if (openCommentId === id) setOpenCommentId(null);
      addToast("تم حذف التعليق بنجاح", "success");
    } catch (err) {
      addToast(err instanceof Error ? err.message : "فشل حذف التعليق", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ── Render ────────────────────────────────────── */

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Delete Confirmation Dialog */}
      {deleteDialog && (
        <ConfirmDialog
          message={deleteDialog.type === "faq" ? "هل أنت متأكد من حذف هذا السؤال؟ لا يمكن التراجع عن هذا الإجراء." : "هل أنت متأكد من حذف هذا التعليق؟ لا يمكن التراجع عن هذا الإجراء."}
          loading={deleteLoading}
          onConfirm={() => {
            if (deleteDialog.type === "faq") {
              handleDeleteFaq(deleteDialog.id);
            } else {
              handleDeleteComment(deleteDialog.id);
            }
          }}
          onCancel={() => setDeleteDialog(null)}
        />
      )}

      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">صفحة من نحن</h1>
          <p className="text-sm text-[#6B7280] mt-1">إدارة الأسئلة الشائعة والتعليقات عبر API.</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/ar/about"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#374151] hover:bg-white transition-colors"
          >
            معاينة
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-[#F3F4F6] p-1.5 flex gap-1.5 w-fit">
        {(["faqs", "comments"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab ? "bg-[#111] text-white shadow-sm" : "text-[#6B7280] hover:text-[#111] hover:bg-[#F9FAFB]"
            }`}
          >
            {tab === "faqs"
              ? `الأسئلة الشائعة (${faqsLoading ? "..." : faqs.length})`
              : `التعليقات (${commentsLoading ? "..." : comments.length})`}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "faqs" ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#9CA3AF]">
              {faqsLoading ? "جاري التحميل..." : faqsError ? "حدث خطأ" : "اضغط على أي سؤال للتعديل"}
            </p>
            <button
              type="button"
              onClick={() => setShowNewFaq(true)}
              disabled={showNewFaq}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111] text-white text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
            >
              <PlusIcon />
              إضافة سؤال
            </button>
          </div>

          {showNewFaq && (
            <NewFaqForm
              onSubmit={handleCreateFaq}
              onCancel={() => setShowNewFaq(false)}
              submitting={faqSaving}
            />
          )}

          {faqsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : faqsError ? (
            <div className="rounded-2xl border border-dashed border-[#FCA5A5] bg-[#FEF2F2] p-8 text-center space-y-3">
              <p className="text-sm text-[#DC2626]">{faqsError}</p>
              <button
                type="button"
                onClick={fetchFaqs}
                className="px-4 py-2 rounded-xl bg-[#DC2626] text-white text-sm font-medium hover:bg-[#B91C1C] transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : faqs.length === 0 && !showNewFaq ? (
            <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-12 text-center text-sm text-[#6B7280]">
              لا توجد أسئلة بعد. أضف سؤالاً جديداً للبدء.
            </div>
          ) : (
            faqs.map((faq) => (
              <AdminFaqCard
                key={faq.id}
                faq={faq}
                isOpen={openFaqId === faq.id}
                onToggle={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                onSave={(input) => handleUpdateFaq(faq.id, input)}
                onDelete={() => setDeleteDialog({ type: "faq", id: faq.id })}
                saving={faqSaving}
              />
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#9CA3AF]">
              {commentsLoading ? "جاري التحميل..." : commentsError ? "حدث خطأ" : "اضغط على أي تعليق للتعديل"}
            </p>
            <button
              type="button"
              onClick={() => setShowNewComment(true)}
              disabled={showNewComment}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111] text-white text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
            >
              <PlusIcon />
              إضافة تعليق
            </button>
          </div>

          {showNewComment && (
            <NewCommentForm
              onSubmit={handleCreateComment}
              onCancel={() => setShowNewComment(false)}
              submitting={commentSaving}
            />
          )}

          {commentsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : commentsError ? (
            <div className="rounded-2xl border border-dashed border-[#FCA5A5] bg-[#FEF2F2] p-8 text-center space-y-3">
              <p className="text-sm text-[#DC2626]">{commentsError}</p>
              <button
                type="button"
                onClick={fetchComments}
                className="px-4 py-2 rounded-xl bg-[#DC2626] text-white text-sm font-medium hover:bg-[#B91C1C] transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : comments.length === 0 && !showNewComment ? (
            <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-12 text-center text-sm text-[#6B7280]">
              لا توجد تعليقات بعد. أضف تعليقاً جديداً للبدء.
            </div>
          ) : (
            comments.map((comment) => (
              <AdminCommentCard
                key={comment.id}
                comment={comment}
                isOpen={openCommentId === comment.id}
                onToggle={() => setOpenCommentId(openCommentId === comment.id ? null : comment.id)}
                onSave={(input) => handleUpdateComment(comment.id, input)}
                onDelete={() => setDeleteDialog({ type: "comment", id: comment.id })}
                saving={commentSaving}
              />
            ))
          )}
        </div>
      )}

      {/* Custom animation style */}
      <style jsx global>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
