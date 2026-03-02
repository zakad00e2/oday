"use client";

import { useState } from "react";
import FileUpload from "@/components/admin/FileUpload";

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  captionTitle: string;
  captionDesc: string;
  category: "company" | "customers";
}

const mockGallery: GalleryItem[] = [
  { id: "1", src: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=400&q=80", alt: "رحلة شرم الشيخ", captionTitle: "رحلة شرم الشيخ", captionDesc: "مجموعة سياحية في رأس محمد", category: "company" },
  { id: "2", src: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&q=80", alt: "شاطئ الغردقة", captionTitle: "شاطئ الغردقة", captionDesc: "أجمل شواطئ البحر الأحمر", category: "company" },
  { id: "3", src: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=400&q=80", alt: "معبد الأقصر", captionTitle: "معبد الأقصر", captionDesc: "جولة أثرية في الأقصر", category: "company" },
  { id: "4", src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80", alt: "عميل مميز", captionTitle: "تجربة أحمد", captionDesc: "رحلة عائلية رائعة", category: "customers" },
  { id: "5", src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80", alt: "دهب", captionTitle: "غوص في دهب", captionDesc: "مغامرة تحت الماء", category: "customers" },
  { id: "6", src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80", alt: "سفاري", captionTitle: "سفاري الصحراء", captionDesc: "تخييم تحت النجوم", category: "company" },
];

const emptyItem: Omit<GalleryItem, "id"> = { src: "", alt: "", captionTitle: "", captionDesc: "", category: "company" };

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>(mockGallery);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState<Omit<GalleryItem, "id">>(emptyItem);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "company" | "customers">("all");

  const openAdd = () => { setEditing(null); setForm(emptyItem); setShowModal(true); };
  const openEdit = (item: GalleryItem) => { setEditing(item); setForm({ src: item.src, alt: item.alt, captionTitle: item.captionTitle, captionDesc: item.captionDesc, category: item.category }); setShowModal(true); };

  const handleSave = () => {
    if (!form.src) return;
    if (editing) {
      setItems(items.map((i) => (i.id === editing.id ? { ...i, ...form } : i)));
    } else {
      setItems([...items, { id: Date.now().toString(), ...form }]);
    }
    setShowModal(false);
  };

  const handleDelete = () => { if (deleteId) { setItems(items.filter((i) => i.id !== deleteId)); setDeleteId(null); } };

  const filtered = filter === "all" ? items : items.filter((i) => i.category === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">المعرض</h1>
          <p className="text-sm text-[#6B7280] mt-1">إدارة صور معرض السفر</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#111] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          رفع صورة
        </button>
      </div>

      {/* Filter */}
      <div className="inline-flex bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-1">
        {([["all", "الكل"], ["company", "الشركة"], ["customers", "العملاء"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)} className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${filter === key ? "bg-white text-[#111] shadow-sm" : "text-[#6B7280] hover:text-[#111]"}`}>
            {label} ({key === "all" ? items.length : items.filter((i) => i.category === key).length})
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="group relative bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="aspect-square overflow-hidden">
              <img src={item.src} alt={item.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <button onClick={() => openEdit(item)} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#111] hover:bg-[#F3F4F6] transition-colors shadow-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" /></svg>
                </button>
                <button onClick={() => setDeleteId(item.id)} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#EF4444] hover:bg-[#FEF2F2] transition-colors shadow-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs font-medium text-[#111] truncate">{item.captionTitle || item.alt}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-[10px] text-[#9CA3AF] truncate">{item.captionDesc}</p>
                <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${item.category === "company" ? "bg-[#EFF6FF] text-[#3B82F6]" : "bg-[#F0FDF4] text-[#16A34A]"}`}>
                  {item.category === "company" ? "الشركة" : "عملاء"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#111]">{editing ? "تعديل الصورة" : "رفع صورة جديدة"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <FileUpload
                  label="الصورة *"
                  accept="image"
                  value={form.src || undefined}
                  onChange={(url) => setForm({ ...form, src: url })}
                  onClear={() => setForm({ ...form, src: "" })}
                  previewHeight="h-44"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">النص البديل (alt)</label>
                <input value={form.alt} onChange={(e) => setForm({ ...form, alt: e.target.value })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1.5">عنوان الصورة</label>
                  <input value={form.captionTitle} onChange={(e) => setForm({ ...form, captionTitle: e.target.value })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1.5">وصف الصورة</label>
                  <input value={form.captionDesc} onChange={(e) => setForm({ ...form, captionDesc: e.target.value })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">التصنيف</label>
                <div className="flex gap-3">
                  {([["company", "صور الشركة"], ["customers", "صور العملاء"]] as const).map(([val, label]) => (
                    <label key={val} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="category" checked={form.category === val} onChange={() => setForm({ ...form, category: val })} className="w-4 h-4 accent-[#111]" />
                      <span className="text-sm text-[#374151]">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6 pt-4 border-t border-[#F3F4F6]">
              <button onClick={handleSave} className="flex-1 bg-[#111] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors">{editing ? "حفظ التعديلات" : "رفع الصورة"}</button>
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-[#6B7280] hover:bg-[#F3F4F6] transition-colors">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#EF4444]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-[#111] mb-2">حذف الصورة؟</h3>
            <p className="text-sm text-[#6B7280] mb-6">سيتم حذف هذه الصورة نهائياً.</p>
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
