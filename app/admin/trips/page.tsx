"use client";

import { useState } from "react";
import FlexibleImage from "@/components/FlexibleImage";
import FileUpload from "@/components/admin/FileUpload";
import { allTrips } from "@/lib/trips-data";
import type { TripAddOn, TripDetail, TripOption, TripSchedule } from "@/lib/trips-types";

type AdminTrip = TripDetail & { id: string };

const initialTrips: AdminTrip[] = allTrips.map((trip, index) => ({
  id: String(index + 1),
  ...trip,
}));

const emptySchedule: TripSchedule = {
  startTime: "",
  endTime: "",
  durationAr: "",
  durationEn: "",
};

const emptyTrip: Omit<AdminTrip, "id"> = {
  slug: "",
  titleAr: "",
  titleEn: "",
  taglineAr: "",
  taglineEn: "",
  descriptionAr: "",
  descriptionEn: "",
  heroImage: "",
  galleryImages: [],
  youtubeUrl: "",
  schedule: emptySchedule,
  includesAr: [],
  includesEn: [],
  essentialsAr: [],
  essentialsEn: [],
  options: [],
  addOns: [],
  startingPrice: 0,
  bookingFields: ["name", "guests", "hotel", "date", "notes"],
};

const emptyOptionInput: Omit<TripOption, "id"> = {
  nameAr: "",
  nameEn: "",
  descriptionAr: "",
  descriptionEn: "",
  price: 0,
  maxQuantity: undefined,
};

const emptyAddOnInput: Omit<TripAddOn, "id"> = {
  nameAr: "",
  nameEn: "",
  price: 0,
  descriptionAr: "",
  descriptionEn: "",
};

function cloneTrip(trip: Omit<AdminTrip, "id"> | AdminTrip): Omit<AdminTrip, "id"> {
  const rest = { ...trip } as Partial<AdminTrip>;
  delete rest.id;

  return {
    ...(rest as Omit<AdminTrip, "id">),
    schedule: { ...rest.schedule! },
    galleryImages: [...rest.galleryImages!],
    includesAr: [...rest.includesAr!],
    includesEn: [...rest.includesEn!],
    essentialsAr: [...rest.essentialsAr!],
    essentialsEn: [...rest.essentialsEn!],
    options: rest.options!.map((option) => ({ ...option })),
    addOns: rest.addOns!.map((addOn) => ({ ...addOn })),
    bookingFields: [...rest.bookingFields!],
  };
}

function makeSlug(value: string) {
  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return normalized || `trip-${Date.now()}`;
}

function StringListSection({
  label,
  placeholder,
  items,
  onAdd,
  onRemove,
}: {
  label: string;
  placeholder?: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    if (!input.trim()) return;
    onAdd(input.trim());
    setInput("");
  };

  return (
    <div>
      <label className="block text-xs font-medium text-[#374151] mb-1.5">{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          className="flex-1 border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors"
          placeholder={placeholder || "أضف عنصراً..."}
        />
        <button
          type="button"
          onClick={add}
          className="px-4 py-2.5 bg-[#F3F4F6] rounded-xl text-sm font-medium hover:bg-[#E5E7EB] transition-colors"
        >
          إضافة
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className="inline-flex items-center gap-1 bg-[#F3F4F6] rounded-full px-3 py-1 text-xs text-[#374151]">
            {item}
            <button type="button" onClick={() => onRemove(index)} className="text-[#9CA3AF] hover:text-[#EF4444]">
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AdminTrips() {
  const [trips, setTrips] = useState<AdminTrip[]>(initialTrips);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<AdminTrip | null>(null);
  const [form, setForm] = useState<Omit<AdminTrip, "id">>(cloneTrip(emptyTrip));
  const [optionInput, setOptionInput] = useState<Omit<TripOption, "id">>(emptyOptionInput);
  const [addOnInput, setAddOnInput] = useState<Omit<TripAddOn, "id">>(emptyAddOnInput);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [galleryKey, setGalleryKey] = useState(0);

  const totalOptions = trips.reduce((sum, trip) => sum + trip.options.length, 0);
  const totalAddOns = trips.reduce((sum, trip) => sum + trip.addOns.length, 0);
  const localizedTrips = trips.filter(
    (trip) => trip.titleEn && trip.taglineEn && trip.descriptionEn && trip.includesEn.length > 0 && trip.essentialsEn.length > 0,
  ).length;

  const resetFormState = () => {
    setForm(cloneTrip(emptyTrip));
    setOptionInput(emptyOptionInput);
    setAddOnInput(emptyAddOnInput);
    setGalleryKey((value) => value + 1);
  };

  const openAdd = () => {
    setEditing(null);
    resetFormState();
    setShowModal(true);
  };

  const openEdit = (trip: AdminTrip) => {
    setEditing(trip);
    setForm(cloneTrip(trip));
    setOptionInput(emptyOptionInput);
    setAddOnInput(emptyAddOnInput);
    setGalleryKey((value) => value + 1);
    setShowModal(true);
  };

  const addOption = () => {
    if (!optionInput.nameAr.trim()) return;

    const newOption: TripOption = {
      id: `opt-${Date.now()}`,
      nameAr: optionInput.nameAr.trim(),
      nameEn: optionInput.nameEn.trim(),
      descriptionAr: optionInput.descriptionAr.trim(),
      descriptionEn: optionInput.descriptionEn.trim() || optionInput.descriptionAr.trim(),
      price: optionInput.price,
      maxQuantity: optionInput.maxQuantity,
    };

    setForm((current) => ({ ...current, options: [...current.options, newOption] }));
    setOptionInput(emptyOptionInput);
  };

  const addAddOn = () => {
    if (!addOnInput.nameAr.trim()) return;

    const newAddOn: TripAddOn = {
      id: `addon-${Date.now()}`,
      nameAr: addOnInput.nameAr.trim(),
      nameEn: addOnInput.nameEn.trim(),
      price: addOnInput.price,
      descriptionAr: addOnInput.descriptionAr.trim(),
      descriptionEn: addOnInput.descriptionEn.trim() || addOnInput.descriptionAr.trim(),
    };

    setForm((current) => ({ ...current, addOns: [...current.addOns, newAddOn] }));
    setAddOnInput(emptyAddOnInput);
  };

  const handleSave = () => {
    if (!form.titleAr.trim()) return;

    const slug = form.slug.trim() || makeSlug(form.titleEn || form.titleAr);
    const payload: Omit<AdminTrip, "id"> = {
      ...form,
      slug,
      titleAr: form.titleAr.trim(),
      titleEn: form.titleEn.trim(),
      taglineAr: form.taglineAr.trim(),
      taglineEn: form.taglineEn.trim() || form.taglineAr.trim(),
      descriptionAr: form.descriptionAr.trim(),
      descriptionEn: form.descriptionEn.trim() || form.descriptionAr.trim(),
      youtubeUrl: form.youtubeUrl.trim(),
      schedule: {
        ...form.schedule,
        startTime: form.schedule.startTime.trim(),
        endTime: form.schedule.endTime.trim(),
        durationAr: form.schedule.durationAr.trim(),
        durationEn: form.schedule.durationEn.trim() || form.schedule.durationAr.trim(),
      },
    };

    if (editing) {
      setTrips((current) => current.map((trip) => (trip.id === editing.id ? { ...trip, ...payload } : trip)));
    } else {
      setTrips((current) => [...current, { id: String(Date.now()), ...payload }]);
    }

    setShowModal(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setTrips((current) => current.filter((trip) => trip.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">الرحلات</h1>
          <p className="text-sm text-[#6B7280] mt-1">إدارة الرحلات السياحية بعد تحديثات المحتوى الثنائي، الجدولة، ومعرض الصور.</p>
        </div>
        <button onClick={openAdd} className="flex items-center justify-center gap-2 bg-[#111] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          إضافة رحلة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5">
          <p className="text-sm text-[#6B7280]">إجمالي الرحلات</p>
          <p className="text-3xl font-bold text-[#111] mt-2">{trips.length}</p>
          <p className="text-xs text-[#9CA3AF] mt-2">مستورد من بيانات الموقع الحالية</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5">
          <p className="text-sm text-[#6B7280]">محتوى مترجم</p>
          <p className="text-3xl font-bold text-[#111] mt-2">{localizedTrips}</p>
          <p className="text-xs text-[#9CA3AF] mt-2">رحلات فيها حقول عربية وإنجليزية أساسية</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5">
          <p className="text-sm text-[#6B7280]">التهيئات</p>
          <p className="text-3xl font-bold text-[#111] mt-2">{totalOptions + totalAddOns}</p>
          <p className="text-xs text-[#9CA3AF] mt-2">{totalOptions} خيارات حجز + {totalAddOns} إضافات</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[980px]">
            <thead>
              <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">الصورة</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">الرحلة</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">الجدولة</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">السعر</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">المحتوى</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">التهيئة</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id} className="border-b border-[#F9FAFB] hover:bg-[#FAFBFC] transition-colors align-top">
                  <td className="px-5 py-3">
                    <FlexibleImage src={trip.heroImage} alt={trip.titleAr} width={64} height={48} sizes="64px" className="w-16 h-12 rounded-lg object-cover bg-[#F3F4F6]" />
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-[#111]">{trip.titleAr}</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5" dir="ltr">{trip.titleEn || "—"}</p>
                    <p className="text-[11px] text-[#6B7280] mt-2" dir="ltr">/{trip.slug}</p>
                  </td>
                  <td className="px-5 py-3 text-[#6B7280]">
                    <p>{trip.schedule.durationAr || "—"}</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-1" dir="ltr">{trip.schedule.startTime || "—"} - {trip.schedule.endTime || "—"}</p>
                  </td>
                  <td className="px-5 py-3 font-semibold text-[#111]">${trip.startingPrice}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-[#EFF6FF] text-[#2563EB] text-[10px] font-medium px-2 py-0.5 rounded-full">{trip.galleryImages.length} صور</span>
                      <span className="bg-[#F8FAFC] text-[#475569] text-[10px] font-medium px-2 py-0.5 rounded-full">{trip.includesAr.length} يشمل</span>

                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-2">
                      {trip.options.length > 0 && <span className="bg-[#F0F9FF] text-[#0EA5E9] text-[10px] font-medium px-2 py-0.5 rounded-full">{trip.options.length} خيار</span>}
                      {trip.addOns.length > 0 && <span className="bg-[#F0FDF4] text-[#22C55E] text-[10px] font-medium px-2 py-0.5 rounded-full">{trip.addOns.length} إضافة</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(trip)} className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111] transition-colors" title="تعديل">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" /></svg>
                      </button>
                      <button onClick={() => setDeleteId(trip.id)} className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors" title="حذف">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#111]">{editing ? "تعديل الرحلة" : "إضافة رحلة جديدة"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-6">
              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">المعلومات الأساسية</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">العنوان بالعربي *</label>
                    <input value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">العنوان بالإنجليزي</label>
                    <input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Slug (رابط)</label>
                    <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="trip-name-slug" dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">السعر الابتدائي ($)</label>
                    <input type="number" value={form.startingPrice || ""} onChange={(e) => setForm({ ...form, startingPrice: Number(e.target.value) })} dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">الجملة التعريفية بالعربي</label>
                    <input value={form.taglineAr} onChange={(e) => setForm({ ...form, taglineAr: e.target.value })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Tagline in English</label>
                    <input value={form.taglineEn} onChange={(e) => setForm({ ...form, taglineEn: e.target.value })} dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">الوصف بالعربي</label>
                    <textarea value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} rows={5} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Description in English</label>
                    <textarea value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} dir="ltr" rows={5} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors resize-none" />
                  </div>
                </div>
              </section>

              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">الجدولة</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">وقت البداية</label>
                    <input value={form.schedule.startTime} onChange={(e) => setForm({ ...form, schedule: { ...form.schedule, startTime: e.target.value } })} placeholder="07:00 AM" dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">وقت النهاية</label>
                    <input value={form.schedule.endTime} onChange={(e) => setForm({ ...form, schedule: { ...form.schedule, endTime: e.target.value } })} placeholder="05:00 PM" dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">المدة بالعربي</label>
                    <input value={form.schedule.durationAr} onChange={(e) => setForm({ ...form, schedule: { ...form.schedule, durationAr: e.target.value } })} placeholder="8 ساعات" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Duration in English</label>
                    <input value={form.schedule.durationEn} onChange={(e) => setForm({ ...form, schedule: { ...form.schedule, durationEn: e.target.value } })} placeholder="8 hours" dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                </div>
              </section>

              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">الوسائط</p>
                <div className="space-y-3">
                  <FileUpload label="الصورة الرئيسية" accept="image" value={form.heroImage || undefined} onChange={(url) => setForm({ ...form, heroImage: url })} onClear={() => setForm({ ...form, heroImage: "" })} />
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">رابط يوتيوب (اختياري)</label>
                    <input value={form.youtubeUrl} onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })} placeholder="https://www.youtube.com/embed/..." dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">معرض الصور</label>
                    {form.galleryImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                        {form.galleryImages.map((image, index) => (
                          <div key={`${image}-${index}`} className="relative h-24 rounded-xl overflow-hidden bg-[#F3F4F6]">
                            <FlexibleImage src={image} alt={`gallery-${index}`} fill sizes="96px" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => setForm((current) => ({ ...current, galleryImages: current.galleryImages.filter((_, itemIndex) => itemIndex !== index) }))} className="absolute top-1 left-1 w-5 h-5 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <FileUpload
                      key={galleryKey}
                      label="إضافة صورة للمعرض"
                      accept="image"
                      previewHeight="h-24"
                      onChange={(url) => {
                        setForm((current) => ({ ...current, galleryImages: [...current.galleryImages, url] }));
                        setGalleryKey((value) => value + 1);
                      }}
                    />
                  </div>
                </div>
              </section>

              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">المحتوى</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <StringListSection label="يشمل بالعربي" placeholder="مثال: الانتقالات ذهاب وعودة" items={form.includesAr} onAdd={(value) => setForm((current) => ({ ...current, includesAr: [...current.includesAr, value] }))} onRemove={(index) => setForm((current) => ({ ...current, includesAr: current.includesAr.filter((_, itemIndex) => itemIndex !== index) }))} />
                  <StringListSection label="Includes in English" placeholder="Round-trip hotel transfers" items={form.includesEn} onAdd={(value) => setForm((current) => ({ ...current, includesEn: [...current.includesEn, value] }))} onRemove={(index) => setForm((current) => ({ ...current, includesEn: current.includesEn.filter((_, itemIndex) => itemIndex !== index) }))} />
                </div>
              </section>

              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">خيارات الحجز</p>
                <div className="space-y-2 mb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input value={optionInput.nameAr} onChange={(e) => setOptionInput({ ...optionInput, nameAr: e.target.value })} placeholder="الاسم بالعربي" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    <input value={optionInput.nameEn} onChange={(e) => setOptionInput({ ...optionInput, nameEn: e.target.value })} placeholder="Name in English" dir="ltr" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input value={optionInput.descriptionAr} onChange={(e) => setOptionInput({ ...optionInput, descriptionAr: e.target.value })} placeholder="الوصف بالعربي" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    <input value={optionInput.descriptionEn} onChange={(e) => setOptionInput({ ...optionInput, descriptionEn: e.target.value })} placeholder="Description in English" dir="ltr" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <input type="number" value={optionInput.price || ""} onChange={(e) => setOptionInput({ ...optionInput, price: Number(e.target.value) })} placeholder="السعر $" dir="ltr" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <button type="button" onClick={addOption} className="w-full md:w-auto px-4 py-2.5 bg-[#F3F4F6] rounded-xl text-sm font-medium hover:bg-[#E5E7EB] transition-colors">+ إضافة خيار</button>
                </div>
                {form.options.length > 0 && (
                  <div className="space-y-2">
                    {form.options.map((option, index) => (
                      <div key={option.id} className="flex flex-col gap-2 bg-[#F9FAFB] rounded-xl px-4 py-3 text-sm md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-medium text-[#111]">{option.nameAr} <span className="text-[#9CA3AF]" dir="ltr">/ {option.nameEn || "—"}</span></p>
                          <p className="text-xs text-[#6B7280] mt-1">{option.descriptionAr}</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                          <span className="font-semibold text-[#111]">${option.price}</span>
                          <button type="button" onClick={() => setForm((current) => ({ ...current, options: current.options.filter((_, itemIndex) => itemIndex !== index) }))} className="text-[#9CA3AF] hover:text-[#EF4444]">×</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">الإضافات</p>
                <div className="space-y-2 mb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input value={addOnInput.nameAr} onChange={(e) => setAddOnInput({ ...addOnInput, nameAr: e.target.value })} placeholder="الاسم بالعربي" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    <input value={addOnInput.nameEn} onChange={(e) => setAddOnInput({ ...addOnInput, nameEn: e.target.value })} placeholder="Name in English" dir="ltr" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input value={addOnInput.descriptionAr} onChange={(e) => setAddOnInput({ ...addOnInput, descriptionAr: e.target.value })} placeholder="الوصف بالعربي" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    <input value={addOnInput.descriptionEn} onChange={(e) => setAddOnInput({ ...addOnInput, descriptionEn: e.target.value })} placeholder="Description in English" dir="ltr" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input type="number" value={addOnInput.price || ""} onChange={(e) => setAddOnInput({ ...addOnInput, price: Number(e.target.value) })} placeholder="السعر $" dir="ltr" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    <button type="button" onClick={addAddOn} className="bg-[#F3F4F6] rounded-xl text-sm font-medium hover:bg-[#E5E7EB] transition-colors">+ إضافة</button>
                  </div>
                </div>
                {form.addOns.length > 0 && (
                  <div className="space-y-2">
                    {form.addOns.map((addOn, index) => (
                      <div key={addOn.id} className="flex items-center justify-between bg-[#F9FAFB] rounded-xl px-4 py-3 text-sm">
                        <div>
                            <p className="font-medium text-[#111]">{addOn.nameAr} <span className="text-[#9CA3AF]" dir="ltr">/ {addOn.nameEn || "—"}</span></p>
                          <p className="text-xs text-[#6B7280] mt-1">{addOn.descriptionAr}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-[#111]">${addOn.price}</span>
                          <button type="button" onClick={() => setForm((current) => ({ ...current, addOns: current.addOns.filter((_, itemIndex) => itemIndex !== index) }))} className="text-[#9CA3AF] hover:text-[#EF4444]">×</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-[#F3F4F6]">
              <button onClick={handleSave} className="flex-1 bg-[#111] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors">{editing ? "حفظ التعديلات" : "إضافة الرحلة"}</button>
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-[#6B7280] hover:bg-[#F3F4F6] transition-colors">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#EF4444]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-[#111] mb-2">حذف الرحلة؟</h3>
            <p className="text-sm text-[#6B7280] mb-6">سيتم حذف هذه الرحلة نهائياً.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 bg-[#EF4444] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#DC2626] transition-colors">نعم، احذف</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-[#E5E7EB] py-2.5 rounded-xl text-sm text-[#6B7280] hover:bg-[#F3F4F6] transition-colors">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
