"use client";

import { useState } from "react";
import FileUpload from "@/components/admin/FileUpload";

interface Trip {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  price: number;
  details: string;
}

const mockTrips: Trip[] = [
  { id: "1", title: "رحلة سيوة الساحرة", description: "استكشف واحة سيوة الخلابة مع جولات سفاري وسباحة في عيون الماء الطبيعية.", image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=400&q=80", duration: "4 أيام / 3 ليالي", price: 2500, details: "تشمل النقل والإقامة والوجبات" },
  { id: "2", title: "جولة الأقصر التاريخية", description: "زيارة معبد الكرنك ووادي الملوك ومعبد حتشبسوت مع مرشد متخصص.", image: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=400&q=80", duration: "3 أيام / 2 ليلة", price: 3200, details: "تشمل الطيران والفندق والجولات" },
  { id: "3", title: "سفاري الصحراء البيضاء", description: "مغامرة في قلب الصحراء البيضاء مع تخييم تحت النجوم.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80", duration: "3 أيام / 2 ليلة", price: 1800, details: "تشمل المعدات والوجبات" },
  { id: "4", title: "رحلة الفيوم ووادي الحيتان", description: "جولة في محمية وادي الحيتان وبحيرة قارون.", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80", duration: "يوم واحد", price: 850, details: "تشمل النقل والغداء" },
  { id: "5", title: "رحلة نيلية أسوان", description: "رحلة بحرية فاخرة من أسوان إلى الأقصر.", image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&q=80", duration: "5 أيام / 4 ليالي", price: 5500, details: "رحلة شاملة بوجبات كاملة" },
  { id: "6", title: "غوص دهب والبلو هول", description: "تجربة غوص فريدة في أشهر مواقع الغوص بالعالم.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80", duration: "3 أيام / 2 ليلة", price: 2200, details: "تشمل معدات الغوص والإقامة" },
];

const emptyTrip: Omit<Trip, "id"> = { title: "", description: "", image: "", duration: "", price: 0, details: "" };

export default function AdminTrips() {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Trip | null>(null);
  const [form, setForm] = useState<Omit<Trip, "id">>(emptyTrip);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => { setEditing(null); setForm(emptyTrip); setShowModal(true); };
  const openEdit = (t: Trip) => { setEditing(t); setForm({ title: t.title, description: t.description, image: t.image, duration: t.duration, price: t.price, details: t.details }); setShowModal(true); };

  const handleSave = () => {
    if (!form.title) return;
    if (editing) {
      setTrips(trips.map((t) => (t.id === editing.id ? { ...t, ...form } : t)));
    } else {
      setTrips([...trips, { id: Date.now().toString(), ...form }]);
    }
    setShowModal(false);
  };

  const handleDelete = () => { if (deleteId) { setTrips(trips.filter((t) => t.id !== deleteId)); setDeleteId(null); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">الرحلات</h1>
          <p className="text-sm text-[#6B7280] mt-1">إدارة الرحلات السياحية</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#111] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          إضافة رحلة
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">الصورة</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">العنوان</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">المدة</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">السعر</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">الوصف</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id} className="border-b border-[#F9FAFB] hover:bg-[#FAFBFC] transition-colors">
                  <td className="px-5 py-3">
                    <img src={trip.image} alt={trip.title} className="w-14 h-10 rounded-lg object-cover" />
                  </td>
                  <td className="px-5 py-3 font-medium text-[#111]">{trip.title}</td>
                  <td className="px-5 py-3 text-[#6B7280]">{trip.duration}</td>
                  <td className="px-5 py-3 text-[#374151] font-medium">${trip.price.toLocaleString()}</td>
                  <td className="px-5 py-3 text-[#6B7280] max-w-[200px] truncate">{trip.description}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(trip)} className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111] transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" /></svg>
                      </button>
                      <button onClick={() => setDeleteId(trip.id)} className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors">
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#111]">{editing ? "تعديل الرحلة" : "إضافة رحلة جديدة"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">عنوان الرحلة *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">الوصف</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1.5">المدة</label>
                  <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" placeholder="3 أيام / 2 ليلة" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1.5">السعر ($)</label>
                  <input type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" dir="ltr" />
                </div>
              </div>
              <div>
                <FileUpload
                  label="صورة الرحلة"
                  accept="image"
                  value={form.image || undefined}
                  onChange={(url) => setForm({ ...form, image: url })}
                  onClear={() => setForm({ ...form, image: "" })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">تفاصيل إضافية</label>
                <input value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" placeholder="تشمل النقل والإقامة..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6 pt-4 border-t border-[#F3F4F6]">
              <button onClick={handleSave} className="flex-1 bg-[#111] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors">{editing ? "حفظ التعديلات" : "إضافة الرحلة"}</button>
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
