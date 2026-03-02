"use client";

import { useState } from "react";

interface Review {
  id: string;
  name: string;
  profileImage: string;
  rating: number;
  text: string;
  tripName: string;
  isVisible: boolean;
  createdAt: string;
}

const mockReviews: Review[] = [
  { id: "1", name: "أحمد محمد", profileImage: "", rating: 5, text: "تجربة رائعة جداً! الفندق كان ممتاز والخدمة لا مثيل لها. فريق عدي للسياحة كان متعاون في كل التفاصيل.", tripName: "شرم الشيخ", isVisible: true, createdAt: "2026-02-28" },
  { id: "2", name: "سارة علي", profileImage: "", rating: 5, text: "أحلى رحلة عائلية! كل شيء كان منظم من الألف للياء. أنصح الجميع بالتعامل معهم.", tripName: "الأقصر وأسوان", isVisible: true, createdAt: "2026-02-25" },
  { id: "3", name: "محمود حسن", profileImage: "", rating: 4, text: "رحلة ممتعة والبرنامج كان متنوع. الوجبات كانت جيدة والفندق نظيف. أتمنى زيادة وقت الجولات السياحية.", tripName: "الغردقة", isVisible: true, createdAt: "2026-02-20" },
  { id: "4", name: "نورا إبراهيم", profileImage: "", rating: 5, text: "تعاملت مع كثير من شركات السياحة لكن عدي أفضلهم بمراحل. سعر مناسب وخدمة 5 نجوم.", tripName: "العين السخنة", isVisible: true, createdAt: "2026-02-15" },
  { id: "5", name: "يوسف كمال", profileImage: "", rating: 3, text: "الرحلة كانت كويسة لكن الفندق مكانش بالمستوى المتوقع.", tripName: "مرسى مطروح", isVisible: false, createdAt: "2026-02-10" },
  { id: "6", name: "فاطمة أحمد", profileImage: "", rating: 5, text: "شهر عسل لا يُنسى! التنظيم كان مثالي وكل التفاصيل كانت مدروسة. شكراً عدي!", tripName: "شرم الشيخ", isVisible: true, createdAt: "2026-02-05" },
  { id: "7", name: "عمر خالد", profileImage: "", rating: 4, text: "رحلة سفاري ممتازة وتجربة فريدة. التخييم في الصحراء كان أجمل شيء.", tripName: "دهب", isVisible: true, createdAt: "2026-01-28" },
];

const emptyReview: Omit<Review, "id"> = { name: "", profileImage: "", rating: 5, text: "", tripName: "", isVisible: true, createdAt: new Date().toISOString().slice(0, 10) };

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);
  const [form, setForm] = useState<Omit<Review, "id">>(emptyReview);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterVisible, setFilterVisible] = useState<"all" | "visible" | "hidden">("all");

  const openAdd = () => { setEditing(null); setForm(emptyReview); setShowModal(true); };
  const openEdit = (r: Review) => { setEditing(r); setForm({ name: r.name, profileImage: r.profileImage, rating: r.rating, text: r.text, tripName: r.tripName, isVisible: r.isVisible, createdAt: r.createdAt }); setShowModal(true); };

  const toggleVisibility = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, isVisible: !r.isVisible } : r)));
  };

  const handleSave = () => {
    if (!form.name || !form.text) return;
    if (editing) {
      setReviews(reviews.map((r) => (r.id === editing.id ? { ...r, ...form } : r)));
    } else {
      setReviews([...reviews, { id: Date.now().toString(), ...form }]);
    }
    setShowModal(false);
  };

  const handleDelete = () => { if (deleteId) { setReviews(reviews.filter((r) => r.id !== deleteId)); setDeleteId(null); } };

  const filtered = filterVisible === "all" ? reviews : filterVisible === "visible" ? reviews.filter((r) => r.isVisible) : reviews.filter((r) => !r.isVisible);

  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">آراء العملاء</h1>
          <p className="text-sm text-[#6B7280] mt-1">إدارة تقييمات ومراجعات العملاء</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#111] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          إضافة مراجعة
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5 text-center">
          <p className="text-3xl font-bold text-[#111]">{reviews.length}</p>
          <p className="text-xs text-[#6B7280] mt-1">إجمالي المراجعات</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5 text-center">
          <p className="text-3xl font-bold text-[#F59E0B]">★ {avgRating}</p>
          <p className="text-xs text-[#6B7280] mt-1">متوسط التقييم</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5 text-center">
          <p className="text-3xl font-bold text-[#10B981]">{reviews.filter((r) => r.isVisible).length}</p>
          <p className="text-xs text-[#6B7280] mt-1">مراجعات منشورة</p>
        </div>
      </div>

      {/* Filter */}
      <div className="inline-flex bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-1">
        {([["all", "الكل"], ["visible", "منشورة"], ["hidden", "مخفية"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setFilterVisible(key)} className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${filterVisible === key ? "bg-white text-[#111] shadow-sm" : "text-[#6B7280] hover:text-[#111]"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filtered.map((review) => (
          <div key={review.id} className={`bg-white rounded-2xl border p-5 transition-all ${review.isVisible ? "border-[#F3F4F6]" : "border-[#FDE68A] bg-[#FFFBEB]/30"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#6366F1] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {review.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-sm text-[#111]">{review.name}</span>
                    <span className="text-[#F59E0B] text-xs">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                    {review.tripName && (
                      <span className="bg-[#F3F4F6] rounded-full px-2 py-0.5 text-[10px] text-[#6B7280]">{review.tripName}</span>
                    )}
                    {!review.isVisible && (
                      <span className="bg-[#FEF3C7] text-[#92400E] rounded-full px-2 py-0.5 text-[10px] font-medium">مخفية</span>
                    )}
                  </div>
                  <p className="text-sm text-[#374151] leading-relaxed">{review.text}</p>
                  <p className="text-[10px] text-[#9CA3AF] mt-2">{review.createdAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggleVisibility(review.id)} className={`p-1.5 rounded-lg transition-colors ${review.isVisible ? "text-[#10B981] hover:bg-[#ECFDF5]" : "text-[#9CA3AF] hover:bg-[#F3F4F6]"}`} title={review.isVisible ? "إخفاء" : "إظهار"}>
                  {review.isVisible ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  )}
                </button>
                <button onClick={() => openEdit(review)} className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" /></svg>
                </button>
                <button onClick={() => setDeleteId(review.id)} className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#111]">{editing ? "تعديل المراجعة" : "إضافة مراجعة جديدة"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">اسم العميل *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">التقييم</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setForm({ ...form, rating: n })} className={`text-3xl transition-colors ${n <= form.rating ? "text-[#F59E0B]" : "text-[#E5E7EB]"}`}>★</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">نص المراجعة *</label>
                <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={4} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">اسم الرحلة</label>
                <input value={form.tripName} onChange={(e) => setForm({ ...form, tripName: e.target.value })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" placeholder="شرم الشيخ، الأقصر..." />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isVisible} onChange={(e) => setForm({ ...form, isVisible: e.target.checked })} className="w-4 h-4 rounded border-[#D1D5DB] accent-[#10B981]" />
                <span className="text-sm text-[#374151]">منشورة (ظاهرة في الموقع)</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6 pt-4 border-t border-[#F3F4F6]">
              <button onClick={handleSave} className="flex-1 bg-[#111] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors">{editing ? "حفظ التعديلات" : "إضافة المراجعة"}</button>
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
            <h3 className="text-lg font-bold text-[#111] mb-2">حذف المراجعة؟</h3>
            <p className="text-sm text-[#6B7280] mb-6">سيتم حذف هذه المراجعة نهائياً.</p>
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
