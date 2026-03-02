"use client";

import { useState } from "react";
import FileUpload from "@/components/admin/FileUpload";

interface Hotel {
  id: string;
  name: string;
  description: string;
  mainImage: string;
  gallery: string[];
  videoUrl: string;
  features: string[];
  stars: number;
}

const mockHotels: Hotel[] = [
  { id: "1", name: "فندق ريكسوس شرم الشيخ", description: "منتجع فاخر يطل على البحر الأحمر مع خدمة شاملة وأنشطة ترفيهية متنوعة.", mainImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80", gallery: [], videoUrl: "", features: ["مسبح خاص", "سبا وويلنس", "شاطئ خاص", "مطاعم عالمية", "نادي أطفال", "واي فاي مجاني"], stars: 5 },
  { id: "2", name: "فندق هيلتون الغردقة", description: "إقامة مميزة على شاطئ الغردقة مع إطلالات بانورامية على البحر.", mainImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80", gallery: [], videoUrl: "", features: ["إطلالة بحرية", "بوفيه مفتوح", "أكوا بارك", "غرف عائلية", "مركز لياقة", "خدمة الغرف"], stars: 5 },
  { id: "3", name: "منتجع موفنبيك العين السخنة", description: "منتجع عصري يجمع بين الراحة والرفاهية على ساحل البحر الأحمر.", mainImage: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80", gallery: [], videoUrl: "", features: ["شاطئ رملي", "مسابح متعددة", "مطعم إيطالي", "ملاعب تنس", "جيم حديث", "موقف سيارات"], stars: 4 },
  { id: "4", name: "فندق شتايجنبرجر الأقصر", description: "فندق تاريخي يقع على ضفاف النيل مع إطلالات ساحرة على المعابد.", mainImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80", gallery: [], videoUrl: "", features: ["إطلالة على النيل", "جولات أثرية", "حدائق واسعة", "مسبح خارجي", "بار على السطح", "خدمة كونسيرج"], stars: 5 },
];

const emptyHotel: Omit<Hotel, "id"> = { name: "", description: "", mainImage: "", gallery: [], videoUrl: "", features: [], stars: 5 };

export default function AdminHotels() {
  const [hotels, setHotels] = useState<Hotel[]>(mockHotels);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Hotel | null>(null);
  const [form, setForm] = useState<Omit<Hotel, "id">>(emptyHotel);
  const [featureInput, setFeatureInput] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => { setEditing(null); setForm(emptyHotel); setFeatureInput(""); setShowModal(true); };
  const openEdit = (h: Hotel) => { setEditing(h); setForm({ name: h.name, description: h.description, mainImage: h.mainImage, gallery: [...h.gallery], videoUrl: h.videoUrl, features: [...h.features], stars: h.stars }); setFeatureInput(""); setShowModal(true); };

  const addFeature = () => { if (featureInput.trim()) { setForm({ ...form, features: [...form.features, featureInput.trim()] }); setFeatureInput(""); } };
  const removeFeature = (i: number) => setForm({ ...form, features: form.features.filter((_, idx) => idx !== i) });

  const handleSave = () => {
    if (!form.name) return;
    if (editing) {
      setHotels(hotels.map((h) => (h.id === editing.id ? { ...h, ...form } : h)));
    } else {
      setHotels([...hotels, { id: Date.now().toString(), ...form }]);
    }
    setShowModal(false);
  };

  const handleDelete = () => { if (deleteId) { setHotels(hotels.filter((h) => h.id !== deleteId)); setDeleteId(null); } };

  const renderStars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">الفنادق</h1>
          <p className="text-sm text-[#6B7280] mt-1">إدارة الفنادق والمنتجعات</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#111] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          إضافة فندق
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="relative h-44 overflow-hidden">
              <img src={hotel.mainImage} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-xs font-medium text-[#F59E0B]">
                {renderStars(hotel.stars)}
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-[#111] mb-1">{hotel.name}</h3>
              <p className="text-xs text-[#6B7280] mb-3 line-clamp-2">{hotel.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {hotel.features.slice(0, 3).map((f, i) => (
                  <span key={i} className="bg-[#F3F4F6] rounded-full px-2.5 py-0.5 text-[10px] text-[#6B7280]">{f}</span>
                ))}
                {hotel.features.length > 3 && <span className="bg-[#F3F4F6] rounded-full px-2.5 py-0.5 text-[10px] text-[#6B7280]">+{hotel.features.length - 3}</span>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(hotel)} className="flex-1 py-2 border border-[#E5E7EB] rounded-xl text-xs font-medium text-[#374151] hover:bg-[#F3F4F6] transition-colors">تعديل</button>
                <button onClick={() => setDeleteId(hotel.id)} className="py-2 px-3 border border-[#E5E7EB] rounded-xl text-[#EF4444] hover:bg-[#FEF2F2] hover:border-[#FEF2F2] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                </button>
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
              <h2 className="text-lg font-bold text-[#111]">{editing ? "تعديل الفندق" : "إضافة فندق جديد"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">اسم الفندق *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">الوصف</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">التقييم (نجوم)</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setForm({ ...form, stars: n })} className={`text-2xl transition-colors ${n <= form.stars ? "text-[#F59E0B]" : "text-[#E5E7EB]"}`}>★</button>
                  ))}
                </div>
              </div>
              <div>
                <FileUpload
                  label="الصورة الرئيسية"
                  accept="image"
                  value={form.mainImage || undefined}
                  onChange={(url) => setForm({ ...form, mainImage: url })}
                  onClear={() => setForm({ ...form, mainImage: "" })}
                />
              </div>
              <div>
                <FileUpload
                  label="الفيديو (اختياري)"
                  accept="video"
                  value={form.videoUrl || undefined}
                  onChange={(url) => setForm({ ...form, videoUrl: url })}
                  onClear={() => setForm({ ...form, videoUrl: "" })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">المميزات</label>
                <div className="flex gap-2 mb-2">
                  <input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())} className="flex-1 border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" placeholder="أضف ميزة..." />
                  <button type="button" onClick={addFeature} className="px-4 py-2.5 bg-[#F3F4F6] rounded-xl text-sm font-medium hover:bg-[#E5E7EB] transition-colors">إضافة</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.features.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-[#F3F4F6] rounded-full px-3 py-1 text-xs text-[#374151]">
                      {f}
                      <button onClick={() => removeFeature(i)} className="text-[#9CA3AF] hover:text-[#EF4444]">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6 pt-4 border-t border-[#F3F4F6]">
              <button onClick={handleSave} className="flex-1 bg-[#111] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors">{editing ? "حفظ التعديلات" : "إضافة الفندق"}</button>
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
            <h3 className="text-lg font-bold text-[#111] mb-2">حذف الفندق؟</h3>
            <p className="text-sm text-[#6B7280] mb-6">سيتم حذف هذا الفندق نهائياً.</p>
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
