"use client";

import { useState } from "react";
import FileUpload from "@/components/admin/FileUpload";

interface Offer {
  id: string;
  destination: string;
  price: string;
  currency: string;
  duration: string;
  highlight: boolean;
  services: string[];
  image: string;
}

const mockOffers: Offer[] = [
  { id: "1", destination: "شرم الشيخ", price: "٢,٤٩٩", currency: "جنيه", duration: "3 ليالي / 4 أيام", highlight: true, services: ["إقامة فندق 5 نجوم", "إفطار يومي", "نقل من المطار", "جولة بحرية مجانية"], image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=400&q=80" },
  { id: "2", destination: "الغردقة", price: "١,٩٩٩", currency: "جنيه", duration: "3 ليالي / 4 أيام", highlight: false, services: ["إقامة فندق 4 نجوم", "إفطار وعشاء", "نقل من المطار", "سنوركلينج مجاني"], image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&q=80" },
  { id: "3", destination: "العين السخنة", price: "١,٢٩٩", currency: "جنيه", duration: "2 ليلة / 3 أيام", highlight: false, services: ["إقامة فندق 4 نجوم", "إفطار يومي", "استخدام حمام السباحة", "Wi-Fi مجاني"], image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80" },
  { id: "4", destination: "مرسى مطروح", price: "١,٧٩٩", currency: "جنيه", duration: "3 ليالي / 4 أيام", highlight: false, services: ["إقامة فندق 4 نجوم", "إفطار يومي", "جولة سياحية", "نقل داخلي"], image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80" },
  { id: "5", destination: "الأقصر وأسوان", price: "٣,٤٩٩", currency: "جنيه", duration: "4 ليالي / 5 أيام", highlight: true, services: ["رحلة نيلية فاخرة", "وجبات كاملة", "جولات أثرية", "مرشد سياحي"], image: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=400&q=80" },
  { id: "6", destination: "دهب", price: "١,٥٩٩", currency: "جنيه", duration: "3 ليالي / 4 أيام", highlight: false, services: ["إقامة بوتيك مميزة", "إفطار يومي", "رحلة سفاري", "غوص مجاني"], image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80" },
];

const emptyOffer: Omit<Offer, "id"> = {
  destination: "",
  price: "",
  currency: "$",
  duration: "",
  highlight: false,
  services: [],
  image: "",
};

export default function AdminOffers() {
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Offer | null>(null);
  const [form, setForm] = useState<Omit<Offer, "id">>(emptyOffer);
  const [serviceInput, setServiceInput] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyOffer);
    setServiceInput("");
    setShowModal(true);
  };

  const openEdit = (offer: Offer) => {
    setEditing(offer);
    setForm({ destination: offer.destination, price: offer.price, currency: offer.currency, duration: offer.duration, highlight: offer.highlight, services: [...offer.services], image: offer.image });
    setServiceInput("");
    setShowModal(true);
  };

  const addService = () => {
    if (serviceInput.trim()) {
      setForm({ ...form, services: [...form.services, serviceInput.trim()] });
      setServiceInput("");
    }
  };

  const removeService = (idx: number) => {
    setForm({ ...form, services: form.services.filter((_, i) => i !== idx) });
  };

  const handleSave = () => {
    if (!form.destination || !form.price) return;
    if (editing) {
      setOffers(offers.map((o) => (o.id === editing.id ? { ...o, ...form } : o)));
    } else {
      setOffers([...offers, { id: Date.now().toString(), ...form }]);
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setOffers(offers.filter((o) => o.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">العروض</h1>
          <p className="text-sm text-[#6B7280] mt-1">إدارة العروض الحصرية في الموقع</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#111] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          إضافة عرض
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">الصورة</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">الوجهة</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">السعر</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">المدة</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">الحالة</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">الخدمات</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id} className="border-b border-[#F9FAFB] hover:bg-[#FAFBFC] transition-colors">
                  <td className="px-5 py-3">
                    <img src={offer.image} alt={offer.destination} className="w-14 h-10 rounded-lg object-cover" />
                  </td>
                  <td className="px-5 py-3 font-medium text-[#111]">{offer.destination}</td>
                  <td className="px-5 py-3 text-[#374151]">{offer.price} {offer.currency}</td>
                  <td className="px-5 py-3 text-[#6B7280]">{offer.duration}</td>
                  <td className="px-5 py-3">
                    {offer.highlight ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#DBEAFE] text-[#1D4ED8]">مميز</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F3F4F6] text-[#6B7280]">عادي</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-[#6B7280]">{offer.services.length} خدمات</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(offer)} className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111] transition-colors" title="تعديل">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" /></svg>
                      </button>
                      <button onClick={() => setDeleteId(offer.id)} className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors" title="حذف">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {offers.length === 0 && (
          <div className="py-16 text-center text-[#9CA3AF]">
            <p className="text-lg">لا توجد عروض بعد</p>
            <button onClick={openAdd} className="mt-3 text-sm text-[#0EA5E9] hover:underline">إضافة أول عرض</button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#111]">{editing ? "تعديل العرض" : "إضافة عرض جديد"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">الوجهة *</label>
                <input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" placeholder="مثال: شرم الشيخ" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1.5">السعر *</label>
                  <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" placeholder="٢,٤٩٩" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1.5">العملة</label>
                  <input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" placeholder="$" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">المدة</label>
                <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" placeholder="3 ليالي / 4 أيام" />
              </div>

              <div>
                <FileUpload
                  label="صورة العرض"
                  accept="image"
                  value={form.image || undefined}
                  onChange={(url) => setForm({ ...form, image: url })}
                  onClear={() => setForm({ ...form, image: "" })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">الخدمات</label>
                <div className="flex gap-2 mb-2">
                  <input value={serviceInput} onChange={(e) => setServiceInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addService())} className="flex-1 border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" placeholder="أضف خدمة..." />
                  <button type="button" onClick={addService} className="px-4 py-2.5 bg-[#F3F4F6] rounded-xl text-sm font-medium hover:bg-[#E5E7EB] transition-colors">إضافة</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.services.map((s, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-[#F3F4F6] rounded-full px-3 py-1 text-xs text-[#374151]">
                      {s}
                      <button onClick={() => removeService(i)} className="text-[#9CA3AF] hover:text-[#EF4444]">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.highlight} onChange={(e) => setForm({ ...form, highlight: e.target.checked })} className="w-4 h-4 rounded border-[#D1D5DB] accent-[#0EA5E9]" />
                <span className="text-sm text-[#374151]">عرض مميز (الأكثر طلباً)</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-[#F3F4F6]">
              <button onClick={handleSave} className="flex-1 bg-[#111] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors">
                {editing ? "حفظ التعديلات" : "إضافة العرض"}
              </button>
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-[#6B7280] hover:bg-[#F3F4F6] transition-colors">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#EF4444]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#111] mb-2">حذف العرض؟</h3>
            <p className="text-sm text-[#6B7280] mb-6">سيتم حذف هذا العرض نهائياً. لا يمكن التراجع عن هذا الإجراء.</p>
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
