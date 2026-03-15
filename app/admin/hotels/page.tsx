"use client";

import { useState } from "react";
import FileUpload from "@/components/admin/FileUpload";

interface Room {
  name: string;
  price: number;
  description: string;
}

interface Amenity {
  icon?: string;
  label: string;
}

interface Hotel {
  id: string;
  slug: string;
  name: string;
  city: string;
  description: string;
  image: string;
  gallery: string[];
  youtubeUrl: string;
  stars: number;
  price: number;
  filterTag?: "most_booked" | "highest_rated" | "lowest_price" | null;
  discount?: string;
  originalPrice?: number;
  features: string[];
  includes?: string[];
  essentials?: string[];
  amenities: Amenity[];
  rooms: Room[];
}

const mockHotels: Hotel[] = [
  {
    id: "1",
    slug: "rexos-sharm",
    name: "منتجع ريكسوس شرم الشيخ",
    city: "شرم الشيخ",
    description: "منتجع ريكسوس شرم الشيخ أحد أفخم المنتجعات السياحية على ساحل البحر الأحمر. يتميز بموقعه الاستراتيجي المطل مباشرة على البحر مع شاطئ خاص نظيف وهادئ.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80",
    gallery: [],
    youtubeUrl: "https://www.youtube.com/embed/oQziT2AN8nE",
    stars: 5,
    price: 120,
    filterTag: "most_booked",
    discount: "20%",
    originalPrice: 150,
    features: ["إطلالة بحرية", "سبا وعافية", "مسبح لا متناهي", "مطاعم عالمية"],
    includes: ["إقامة في غرفة مزدوجة فاخرة", "خدمة شاملة All Inclusive", "وصول مجاني للشاطئ الخاص", "استخدام المسابح والمرافق", "Wi-Fi مجاني في جميع الأرجاء"],
    essentials: ["جواز سفر أو هوية وطنية", "ملابس مناسبة للمنتجع", "واقي شمس", "ملابس سباحة"],
    amenities: [
      { icon: "🏊", label: "مسبح لا متناهي" },
      { icon: "🏖️", label: "شاطئ خاص" },
      { icon: "💆", label: "سبا ومركز عافية" },
      { icon: "🍽️", label: "مطاعم متنوعة" },
      { icon: "🎾", label: "ملاعب رياضية" },
      { icon: "🚗", label: "خدمة توصيل" },
    ],
    rooms: [
      { name: "غرفة مزدوجة فاخرة", price: 120, description: "شخصين" },
      { name: "غرفة بإطلالة بحرية", price: 160, description: "شخصين + طفل" },
      { name: "جناح فاخر", price: 220, description: "٤ أشخاص" },
    ],
  },
  {
    id: "2",
    slug: "stella-di-mare-hurghada",
    name: "فندق ستيلا دي ماري الغردقة",
    city: "الغردقة",
    description: "فندق ستيلا دي ماري الغردقة وجهة مثالية للعائلات والأزواج الباحثين عن إقامة راقية مع شاطئ خاص وأنشطة مائية متنوعة.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80",
    gallery: [],
    youtubeUrl: "",
    stars: 4,
    price: 80,
    filterTag: "lowest_price",
    features: ["شاطئ خاص", "أنشطة مائية", "نادي أطفال", "Wi-Fi مجاني"],
    includes: ["إقامة في غرفة مزدوجة", "وجبة إفطار بوفيه", "وصول للشاطئ الخاص", "استخدام المسابح", "نادي الأطفال مجاني"],
    essentials: ["جواز سفر أو هوية وطنية", "ملابس سباحة", "واقي شمس", "نظارات شمسية"],
    amenities: [
      { icon: "🏊", label: "مسابح متعددة" },
      { icon: "🏖️", label: "شاطئ خاص" },
      { icon: "🤿", label: "غوص وسنوركلينج" },
      { icon: "🧒", label: "نادي أطفال" },
    ],
    rooms: [
      { name: "غرفة مزدوجة", price: 80, description: "شخصين" },
      { name: "غرفة عائلية", price: 120, description: "٤ أشخاص + طفلين" },
      { name: "غرفة بإطلالة بحرية", price: 110, description: "شخصين + طفل" },
    ],
  },
  {
    id: "3",
    slug: "movenpick-ain-sokhna",
    name: "فندق موفنبيك العين السخنة",
    city: "عين السخنة",
    description: "فندق موفنبيك العين السخنة ملاذ هادئ على ساحل البحر الأحمر على بعد ساعة من القاهرة. مثالي لعطلات نهاية الأسبوع.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=80",
    gallery: [],
    youtubeUrl: "",
    stars: 5,
    price: 100,
    filterTag: "most_booked",
    discount: "20%",
    originalPrice: 125,
    features: ["حمام سباحة ساخن", "مركز لياقة", "مطعم بوفيه", "موقف سيارات"],
    includes: ["إقامة في غرفة مزدوجة", "وجبة إفطار بوفيه", "استخدام المسابح", "حمام سباحة مائي ساخن", "موقف سيارات مجاني"],
    essentials: ["هوية وطنية", "ملابس سباحة", "واقي شمس"],
    amenities: [
      { icon: "🏊", label: "مسبح ساخن" },
      { icon: "🏋️", label: "مركز لياقة بدنية" },
      { icon: "🍽️", label: "مطعم بوفيه" },
      { icon: "🚗", label: "موقف سيارات مجاني" },
    ],
    rooms: [
      { name: "غرفة مزدوجة", price: 100, description: "شخصين" },
      { name: "غرفة بإطلالة بحرية", price: 140, description: "شخصين + طفل" },
      { name: "جناح عائلي", price: 180, description: "٤ أشخاص + طفل" },
    ],
  },
  {
    id: "4",
    slug: "kempinski-soma-bay",
    name: "فندق كمبينسكي سوما باي",
    city: "الغردقة",
    description: "فندق كمبينسكي سوما باي تجربة فندقية استثنائية تجمع بين الفخامة والطبيعة الخلابة في منتجع سوما باي.",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80",
    gallery: [],
    youtubeUrl: "",
    stars: 5,
    price: 150,
    filterTag: "highest_rated",
    features: ["غوص وسنوركل", "ملعب غولف", "مسبح خاص", "خدمة غرف 24/7"],
    includes: ["إقامة في غرفة فاخرة", "إفطار أمريكي كامل", "وصول لمركز الغوص", "استخدام ملعب الغولف", "Wi-Fi فائق السرعة"],
    essentials: ["جواز سفر ساري", "ملابس سباحة", "واقي شمس", "ملابس رياضية"],
    amenities: [
      { icon: "🤿", label: "مركز غوص متكامل" },
      { icon: "⛳", label: "ملعب غولف" },
      { icon: "🏊", label: "مسبح خاص" },
      { icon: "💆", label: "سبا عالمي" },
    ],
    rooms: [
      { name: "غرفة ديلوكس", price: 150, description: "شخصين" },
      { name: "جناح جونيور", price: 220, description: "شخصين + طفلين" },
      { name: "فيلا خاصة", price: 400, description: "٦ أشخاص" },
    ],
  },
];

const emptyHotel: Omit<Hotel, "id"> = {
  slug: "",
  name: "",
  city: "",
  description: "",
  image: "",
  gallery: [],
  youtubeUrl: "",
  stars: 5,
  price: 0,
  filterTag: null,
  discount: "",
  originalPrice: undefined,
  features: [],
  amenities: [],
  rooms: [],
};

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
  onAdd: (v: string) => void;
  onRemove: (i: number) => void;
}) {
  const [input, setInput] = useState("");
  const add = () => {
    if (input.trim()) { onAdd(input.trim()); setInput(""); }
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
        <button type="button" onClick={add} className="px-4 py-2.5 bg-[#F3F4F6] rounded-xl text-sm font-medium hover:bg-[#E5E7EB] transition-colors">
          إضافة
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1 bg-[#F3F4F6] rounded-full px-3 py-1 text-xs text-[#374151]">
            {item}
            <button onClick={() => onRemove(i)} className="text-[#9CA3AF] hover:text-[#EF4444]">×</button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AdminHotels() {
  const [hotels, setHotels] = useState<Hotel[]>(mockHotels);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Hotel | null>(null);
  const [form, setForm] = useState<Omit<Hotel, "id">>(emptyHotel);
  const [amenityInput, setAmenityInput] = useState({ label: "" });
  const [roomInput, setRoomInput] = useState({ name: "", price: 0, description: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [galleryKey, setGalleryKey] = useState(0);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyHotel);
    setAmenityInput({ label: "" });
    setRoomInput({ name: "", price: 0, description: "" });
    setShowModal(true);
  };

  const openEdit = (h: Hotel) => {
    setEditing(h);
    setForm({
      slug: h.slug,
      name: h.name,
      city: h.city,
      description: h.description,
      image: h.image,
      gallery: [...h.gallery],
      youtubeUrl: h.youtubeUrl,
      stars: h.stars,
      price: h.price,
      filterTag: h.filterTag ?? null,
      discount: h.discount ?? "",
      originalPrice: h.originalPrice,
      features: [...h.features],
      amenities: [...h.amenities],
      rooms: [...h.rooms],
    });
    setAmenityInput({ label: "" });
    setRoomInput({ name: "", price: 0, description: "" });
    setShowModal(true);
  };

  const addAmenity = () => {
    if (amenityInput.label.trim()) {
      setForm((f) => ({ ...f, amenities: [...f.amenities, { label: amenityInput.label.trim() }] }));
      setAmenityInput({ label: "" });
    }
  };

  const addRoom = () => {
    if (roomInput.name.trim()) {
      setForm((f) => ({ ...f, rooms: [...f.rooms, { ...roomInput }] }));
      setRoomInput({ name: "", price: 0, description: "" });
    }
  };

  const handleSave = () => {
    if (!form.name) return;
    if (editing) {
      setHotels(hotels.map((h) => (h.id === editing.id ? { ...h, ...form } : h)));
    } else {
      setHotels([...hotels, { id: Date.now().toString(), ...form }]);
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (deleteId) { setHotels(hotels.filter((h) => h.id !== deleteId)); setDeleteId(null); }
  };

  const renderStars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

  return (
    <div className="space-y-6">
      {/* Header */}
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
              <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-xs font-medium text-[#F59E0B]">
                {renderStars(hotel.stars)}
              </div>
              {hotel.city && (
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-xs font-medium text-[#374151]">
                  {hotel.city}
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-bold text-[#111] leading-snug">{hotel.name}</h3>
                <span className="text-sm font-semibold text-[#111] shrink-0 mr-2">
                  ${hotel.price}<span className="text-[10px] text-[#9CA3AF] font-normal">/ليلة</span>
                </span>
              </div>
              <p className="text-xs text-[#6B7280] mb-3 line-clamp-2">{hotel.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {hotel.features.slice(0, 3).map((f, i) => (
                  <span key={i} className="bg-[#F3F4F6] rounded-full px-2.5 py-0.5 text-[10px] text-[#6B7280]">{f}</span>
                ))}
                {hotel.features.length > 3 && <span className="bg-[#F3F4F6] rounded-full px-2.5 py-0.5 text-[10px] text-[#6B7280]">+{hotel.features.length - 3}</span>}
              </div>
              <div className="flex gap-2 text-xs text-[#9CA3AF] mb-4">
                <span>{hotel.rooms.length} أنواع غرف</span>
                <span>·</span>
                <span>{hotel.amenities.length} مرافق</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {hotel.filterTag && (() => {
                  const tagMap = { most_booked: { label: "🔥 الأكثر حجزاً", cls: "bg-orange-100 text-orange-700" }, highest_rated: { label: "⭐ الأعلى تقييماً", cls: "bg-yellow-100 text-yellow-700" }, lowest_price: { label: "💰 الأقل سعراً", cls: "bg-emerald-100 text-emerald-700" } };
                  const t = tagMap[hotel.filterTag];
                  return t ? <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${t.cls}`}>{t.label}</span> : null;
                })()}
                {hotel.discount && (
                  <span className="bg-red-100 text-red-600 rounded-full px-2.5 py-0.5 text-[10px] font-medium">خصم {hotel.discount}</span>
                )}
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

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#111]">{editing ? "تعديل الفندق" : "إضافة فندق جديد"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* ── Basic Info ── */}
              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">المعلومات الأساسية</p>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#374151] mb-1.5">اسم الفندق *</label>
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#374151] mb-1.5">الوجهة</label>
                      <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors bg-white">
                        <option value="">اختر الوجهة...</option>
                        <option value="شرم الشيخ">شرم الشيخ</option>
                        <option value="الغردقة">الغردقة</option>
                        <option value="عين السخنة">عين السخنة</option>
                        <option value="ذهب">ذهب</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#374151] mb-1.5">Slug (رابط)</label>
                      <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="hotel-name-slug" dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#374151] mb-1.5">السعر الابتدائي ($/ليلة)</label>
                      <input type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">الوصف</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">التقييم (نجوم)</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} type="button" onClick={() => setForm({ ...form, stars: n })} className={`text-2xl transition-colors ${n <= form.stars ? "text-[#F59E0B]" : "text-[#E5E7EB]"}`}>★</button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ── Filter & Discount ── */}
              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">التصنيف والخصم</p>
                <div className="space-y-4">

                  {/* Filter Tag */}
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-2">تصنيف الفندق في الفلتر</label>
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        { value: null, label: "بدون تصنيف", color: "bg-[#F3F4F6]", activeColor: "bg-[#111] text-white", textColor: "text-[#6B7280]" },
                        { value: "most_booked", label: "🔥 الأكثر حجزاً", color: "bg-orange-50 border-orange-200", activeColor: "bg-orange-500 text-white border-orange-500", textColor: "text-orange-700" },
                        { value: "highest_rated", label: "⭐ الأعلى تقييماً", color: "bg-yellow-50 border-yellow-200", activeColor: "bg-yellow-500 text-white border-yellow-500", textColor: "text-yellow-700" },
                        { value: "lowest_price", label: "💰 الأقل سعراً", color: "bg-emerald-50 border-emerald-200", activeColor: "bg-emerald-500 text-white border-emerald-500", textColor: "text-emerald-700" },
                      ] as const).map((opt) => {
                        const isActive = form.filterTag === opt.value;
                        return (
                          <button
                            key={String(opt.value)}
                            type="button"
                            onClick={() => setForm({ ...form, filterTag: opt.value })}
                            className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${isActive ? opt.activeColor + " border-transparent" : opt.color + " " + opt.textColor + " border"}`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Discount */}
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-2">الخصم</label>
                    <div className="flex items-center gap-3 mb-2">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, discount: form.discount ? "" : "10%", originalPrice: form.discount ? undefined : (form.price ? Math.round(form.price * 1.2) : undefined) })}
                        className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${form.discount ? "bg-[#111]" : "bg-[#E5E7EB]"}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.discount ? "left-5" : "left-0.5"}`} />
                      </button>
                      <span className="text-xs text-[#6B7280]">{form.discount ? "يوجد خصم" : "لا يوجد خصم"}</span>
                    </div>
                    {form.discount !== undefined && form.discount !== "" && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-[#9CA3AF] mb-1">نسبة الخصم (مثال: 20%)</label>
                          <input
                            value={form.discount}
                            onChange={(e) => setForm({ ...form, discount: e.target.value })}
                            placeholder="20%"
                            dir="ltr"
                            className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#111] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#9CA3AF] mb-1">السعر الأصلي (قبل الخصم $)</label>
                          <input
                            type="number"
                            value={form.originalPrice || ""}
                            onChange={(e) => setForm({ ...form, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                            placeholder="150"
                            dir="ltr"
                            className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#111] transition-colors"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </section>

              {/* ── Media ── */}
              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">الوسائط</p>
                <div className="space-y-3">
                  <FileUpload label="الصورة الرئيسية" accept="image" value={form.image || undefined} onChange={(url) => setForm({ ...form, image: url })} onClear={() => setForm({ ...form, image: "" })} />
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">رابط يوتيوب (اختياري)</label>
                    <input value={form.youtubeUrl} onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })} placeholder="https://www.youtube.com/embed/..." dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">معرض الصور</label>
                    {form.gallery.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {form.gallery.map((img, i) => (
                          <div key={i} className="relative h-20 rounded-xl overflow-hidden bg-[#F3F4F6]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt={`gallery-${i}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setForm((f) => ({ ...f, gallery: f.gallery.filter((_, idx) => idx !== i) }))}
                              className="absolute top-1 left-1 w-5 h-5 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                            >×</button>
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
                        setForm((f) => ({ ...f, gallery: [...f.gallery, url] }));
                        setGalleryKey((k) => k + 1);
                      }}
                    />
                  </div>
                </div>
              </section>

              {/* ── Lists ── */}
              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">التصنيفات والتفاصيل</p>
                <div className="space-y-4">
                  <StringListSection
                    label="المميزات (تاغات)"
                    placeholder="مثال: شاطئ خاص"
                    items={form.features}
                    onAdd={(v) => setForm((f) => ({ ...f, features: [...f.features, v] }))}
                    onRemove={(i) => setForm((f) => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }))}
                  />
                </div>
              </section>

              {/* ── Amenities ── */}
              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">المرافق</p>
                <div className="flex gap-2 mb-3">
                  <input
                    value={amenityInput.label}
                    onChange={(e) => setAmenityInput({ ...amenityInput, label: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
                    className="flex-1 border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors"
                    placeholder="اسم المرفق..."
                  />
                  <button type="button" onClick={addAmenity} className="px-4 py-2.5 bg-[#F3F4F6] rounded-xl text-sm font-medium hover:bg-[#E5E7EB] transition-colors">إضافة</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.amenities.map((a, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 bg-[#F3F4F6] rounded-full px-3 py-1 text-xs text-[#374151]">
                      {a.label}
                      <button onClick={() => setForm((f) => ({ ...f, amenities: f.amenities.filter((_, idx) => idx !== i) }))} className="text-[#9CA3AF] hover:text-[#EF4444]">×</button>
                    </span>
                  ))}
                </div>
              </section>

              {/* ── Rooms ── */}
              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">أنواع الغرف</p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <input
                    value={roomInput.name}
                    onChange={(e) => setRoomInput({ ...roomInput, name: e.target.value })}
                    className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors"
                    placeholder="نوع الغرفة"
                  />
                  <input
                    type="number"
                    value={roomInput.price || ""}
                    onChange={(e) => setRoomInput({ ...roomInput, price: Number(e.target.value) })}
                    className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors"
                    placeholder="السعر $"
                    dir="ltr"
                  />
                  <div className="flex gap-1">
                    <input
                      value={roomInput.description}
                      onChange={(e) => setRoomInput({ ...roomInput, description: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRoom())}
                      className="flex-1 border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors"
                      placeholder="شخصين"
                    />
                    <button type="button" onClick={addRoom} className="px-3 py-2.5 bg-[#F3F4F6] rounded-xl text-sm font-medium hover:bg-[#E5E7EB] transition-colors">+</button>
                  </div>
                </div>
                {form.rooms.length > 0 && (
                  <div className="space-y-2">
                    {form.rooms.map((r, i) => (
                      <div key={i} className="flex items-center justify-between bg-[#F9FAFB] rounded-xl px-4 py-2.5 text-sm">
                        <span className="font-medium text-[#111]">{r.name}</span>
                        <span className="text-[#6B7280]">{r.description}</span>
                        <span className="font-semibold text-[#111]">${r.price}</span>
                        <button onClick={() => setForm((f) => ({ ...f, rooms: f.rooms.filter((_, idx) => idx !== i) }))} className="text-[#9CA3AF] hover:text-[#EF4444] mr-1">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
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
