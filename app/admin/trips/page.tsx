"use client";

import { useState } from "react";
import FileUpload from "@/components/admin/FileUpload";

interface TripOption {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  price: number;
  maxQuantity?: number;
  capacityLabel?: string;
}

interface TripAddOn {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  descriptionAr: string;
  icon?: string;
}

interface TripSchedule {
  startTime: string;
  endTime: string;
  duration: string;
  frequency: string;
}

interface Trip {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  taglineAr: string;
  descriptionAr: string;
  heroImage: string;
  galleryImages: string[];
  youtubeUrl: string;
  schedule: TripSchedule;
  includes: string[];
  essentials: string[];
  options: TripOption[];
  addOns: TripAddOn[];
  startingPrice: number;
  bookingFields: string[];
}

const ALL_BOOKING_FIELDS = [
  { key: "name", label: "الاسم" },
  { key: "guests", label: "عدد الأشخاص" },
  { key: "childrenUnder5", label: "أطفال تحت 5 سنوات" },
  { key: "hotel", label: "الفندق" },
  { key: "date", label: "التاريخ" },
  { key: "time", label: "الوقت" },
  { key: "tripType", label: "نوع الرحلة" },
  { key: "addOns", label: "الإضافات" },
  { key: "notes", label: "ملاحظات" },
];

const mockTrips: Trip[] = [
  {
    id: "1",
    slug: "ras-mohammed-yacht",
    titleAr: "رحلة يخت رأس محمد والجزيرة البيضاء",
    titleEn: "Ras Mohammed & White Island Yacht Trip",
    taglineAr: "أبحر في أجمل مياه البحر الأحمر واستمتع بجنة تحت الماء",
    descriptionAr: "ابدأ يومك برحلة يخت مميزة في البحر الأحمر إلى محمية رأس محمد والجزيرة البيضاء، من أجمل الوجهات الطبيعية في شرم الشيخ.",
    heroImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80",
    galleryImages: [],
    youtubeUrl: "https://www.youtube.com/embed/oQziT2AN8nE",
    schedule: { startTime: "07:00 AM", endTime: "05:00 PM", duration: "8 ساعات", frequency: "يومياً" },
    includes: ["الانتقالات ذهاب وعودة من الفندق", "وجبة غداء على متن اليخت", "معدات السنوركلينج", "مرشد بحري محترف"],
    essentials: ["ملابس سباحة", "منشفة شخصية", "كريم واقي من الشمس", "نظارات شمسية"],
    options: [
      { id: "yacht-luxury-3floor", nameAr: "يخت فاخر 3 أدوار", nameEn: "Luxury 3-Floor Yacht", descriptionAr: "يخت واسع بثلاثة طوابق مع سطح للتشمس", price: 80 },
      { id: "yacht-sina-dream", nameAr: "يخت شراعي Sina Dream", nameEn: "Sina Dream Sailing Yacht", descriptionAr: "يخت شراعي أنيق مع أجواء هادئة ورومانسية", price: 65 },
      { id: "yacht-vip", nameAr: "يخت VIP", nameEn: "VIP Yacht", descriptionAr: "أفخم يخوتنا مع خدمة خاصة وضيافة متميزة", price: 100 },
    ],
    addOns: [
      { id: "diving-addon", nameAr: "تجربة الغوص", nameEn: "Diving Experience", price: 30, descriptionAr: "غوص مع مدرب محترف", icon: "🤿" },
    ],
    startingPrice: 65,
    bookingFields: ["name", "guests", "childrenUnder5", "hotel", "date", "time", "tripType", "addOns", "notes"],
  },
  {
    id: "2",
    slug: "desert-safari-buggy",
    titleAr: "رحلة سفاري بيتش باجي في الصحراء",
    titleEn: "Desert Safari Beach Buggy Adventure",
    taglineAr: "مغامرة مثيرة في قلب الصحراء مع إطلالات خلابة",
    descriptionAr: "عش مغامرة لا مثيل لها في صحراء شرم الشيخ! اختر البيتش باجي أو الكار باجي وانطلق في رحلة مشوقة عبر الكثبان الرملية.",
    heroImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80",
    galleryImages: [],
    youtubeUrl: "https://www.youtube.com/embed/oQziT2AN8nE",
    schedule: { startTime: "02:00 PM", endTime: "09:00 PM", duration: "7 ساعات", frequency: "يومياً" },
    includes: ["الانتقالات ذهاب وعودة من الفندق", "ركوب الجمال", "مشروبات (شاي بدوي)", "مرشد سفاري محترف"],
    essentials: ["ملابس مريحة", "حذاء مغلق", "نظارات شمسية", "بندانة أو غطاء رأس"],
    options: [
      { id: "buggy-single", nameAr: "بيتش باجي سنجل", nameEn: "Single Beach Buggy", descriptionAr: "باجي فردي لشخص واحد", price: 20, maxQuantity: 10, capacityLabel: "شخص واحد" },
      { id: "buggy-double", nameAr: "بيتش باجي دبل", nameEn: "Double Beach Buggy", descriptionAr: "باجي مزدوج لشخصين", price: 25, maxQuantity: 10, capacityLabel: "شخصين" },
      { id: "car-buggy-4", nameAr: "كار باجي رباعي", nameEn: "Car Buggy (4-Seater)", descriptionAr: "كار باجي عائلي يتسع لأربعة أشخاص", price: 70, maxQuantity: 5, capacityLabel: "4 أشخاص" },
    ],
    addOns: [
      { id: "bedouin-dinner", nameAr: "حفلة الجبل والعشاء البدوي", nameEn: "Mountain Party & Bedouin Dinner", price: 25, descriptionAr: "عشاء بدوي تقليدي مع عرض فلكلوري", icon: "🏕️" },
    ],
    startingPrice: 20,
    bookingFields: ["name", "guests", "childrenUnder5", "hotel", "date", "time", "tripType", "addOns", "notes"],
  },
  {
    id: "3",
    slug: "water-sports",
    titleAr: "أنشطة البحر – ووتر سبورت",
    titleEn: "Water Sports Experience",
    taglineAr: "أدرينالين وإثارة فوق أمواج البحر الأحمر",
    descriptionAr: "استمتع بأشهر الرياضات المائية في شرم الشيخ! اختر من بين الباراشوت الطائر، البانانا بوت المرح، والتيوبا المثيرة.",
    heroImage: "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=400&q=80",
    galleryImages: [],
    youtubeUrl: "https://www.youtube.com/embed/oQziT2AN8nE",
    schedule: { startTime: "10:00 AM", endTime: "04:00 PM", duration: "حسب النشاط", frequency: "يومياً" },
    includes: ["معدات السلامة الكاملة", "مدرب محترف", "تأمين بحري"],
    essentials: ["ملابس سباحة", "منشفة", "كريم واقي من الشمس"],
    options: [
      { id: "parasail-single", nameAr: "باراشوت سنجل", nameEn: "Single Parasailing", descriptionAr: "طيران فردي فوق البحر بالمظلة", price: 30 },
      { id: "banana-boat", nameAr: "بانانا بوت", nameEn: "Banana Boat", descriptionAr: "مغامرة جماعية مليئة بالمرح", price: 15 },
      { id: "tuba-ride", nameAr: "تيوبا", nameEn: "Tube Ride", descriptionAr: "ركوب التيوبا المثير فوق الأمواج", price: 15 },
    ],
    addOns: [
      { id: "transfers-ws", nameAr: "خدمة الانتقالات", nameEn: "Transfer Service", price: 10, descriptionAr: "انتقالات من وإلى الفندق بسيارة مكيفة", icon: "🚗" },
    ],
    startingPrice: 15,
    bookingFields: ["name", "guests", "hotel", "date", "time", "tripType", "addOns", "notes"],
  },
  {
    id: "4",
    slug: "sunset-dinner-cruise",
    titleAr: "اليخت المسائي – دينر كروز",
    titleEn: "Sunset Dinner Cruise Yacht",
    taglineAr: "أمسية ساحرة على متن اليخت مع عشاء فاخر وغروب الشمس",
    descriptionAr: "استمتع بأمسية لا تُنسى على متن يخت فاخر في مياه شرم الشيخ. شاهد غروب الشمس الساحر بينما تتناول عشاءً فاخراً مع أجواء موسيقية هادئة.",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80",
    galleryImages: [],
    youtubeUrl: "https://www.youtube.com/embed/oQziT2AN8nE",
    schedule: { startTime: "04:30 PM", endTime: "09:00 PM", duration: "4.5 ساعات", frequency: "يومياً" },
    includes: ["الانتقالات ذهاب وعودة من الفندق", "عشاء بوفيه مفتوح", "حفلة موسيقية على متن اليخت"],
    essentials: ["ملابس أنيقة", "جاكيت خفيف (للأمسيات الباردة)", "كاميرا"],
    options: [
      { id: "dinner-yacht-luxury", nameAr: "يخت فاخر", nameEn: "Luxury Yacht", descriptionAr: "يخت واسع مع صالة داخلية مكيفة وسطح مفتوح", price: 75 },
      { id: "dinner-yacht-sina", nameAr: "يخت شراعي Sina Dream", nameEn: "Sina Dream Sailing Yacht", descriptionAr: "يخت شراعي بأجواء رومانسية هادئة", price: 60 },
    ],
    addOns: [],
    startingPrice: 60,
    bookingFields: ["name", "guests", "childrenUnder5", "hotel", "date", "tripType", "notes"],
  },
  {
    id: "5",
    slug: "submarine-experience",
    titleAr: "رحلة الغواصة",
    titleEn: "Submarine Sea Experience",
    taglineAr: "شاهد عالم ما تحت الماء بدون أن تبتل!",
    descriptionAr: "تجربة فريدة من نوعها! انزل إلى أعماق البحر الأحمر داخل غواصة حقيقية وشاهد الشعاب المرجانية والأسماك الملونة من خلال النوافذ البانورامية.",
    heroImage: "https://images.unsplash.com/photo-1582967788606-a171c7FA6c79?w=400&q=80",
    galleryImages: [],
    youtubeUrl: "https://www.youtube.com/embed/oQziT2AN8nE",
    schedule: { startTime: "حسب الموعد المختار", endTime: "—", duration: "ساعة ونصف", frequency: "عدة مواعيد يومياً" },
    includes: ["تذكرة دخول الغواصة", "مرشد مختص", "تأمين"],
    essentials: ["كاميرا أو هاتف", "ملابس مريحة"],
    options: [],
    addOns: [],
    startingPrice: 50,
    bookingFields: ["name", "guests", "childrenUnder5", "hotel", "date", "time", "notes"],
  },
  {
    id: "6",
    slug: "dolphin-show",
    titleAr: "عرض الدولفين",
    titleEn: "Dolphin Show Experience",
    taglineAr: "استمتع بعروض مذهلة من أذكى كائنات البحر",
    descriptionAr: "شاهد عروض الدلافين الممتعة والمدهشة في شرم الشيخ! عرض تفاعلي رائع يناسب جميع الأعمار.",
    heroImage: "https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=400&q=80",
    galleryImages: [],
    youtubeUrl: "https://www.youtube.com/embed/oQziT2AN8nE",
    schedule: { startTime: "03:00 PM", endTime: "05:00 PM", duration: "ساعتان", frequency: "يومياً" },
    includes: ["تذكرة دخول العرض", "مقعد مميز"],
    essentials: ["كاميرا", "ملابس مريحة", "نظارات شمسية"],
    options: [],
    addOns: [
      { id: "transfers-dolphin", nameAr: "خدمة الانتقالات", nameEn: "Transfer Service", price: 10, descriptionAr: "انتقالات ذهاب وعودة من الفندق", icon: "🚗" },
    ],
    startingPrice: 35,
    bookingFields: ["name", "guests", "childrenUnder5", "hotel", "date", "addOns", "notes"],
  },
  {
    id: "7",
    slug: "albatros-aqua-park",
    titleAr: "أكوا بارك ألباتروس",
    titleEn: "Albatros Aqua Park Experience",
    taglineAr: "يوم كامل من المرح والمغامرة المائية للعائلة",
    descriptionAr: "استمتع بيوم كامل من المرح في أكوا بارك ألباتروس الشهير في شرم الشيخ! زلاقات مائية متنوعة، مسابح للكبار والصغار.",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
    galleryImages: [],
    youtubeUrl: "https://www.youtube.com/embed/oQziT2AN8nE",
    schedule: { startTime: "10:00 AM", endTime: "05:00 PM", duration: "7 ساعات", frequency: "يومياً" },
    includes: ["تذكرة دخول الأكوا بارك", "استخدام جميع الألعاب المائية", "وجبة غداء"],
    essentials: ["ملابس سباحة", "منشفة", "كريم واقي من الشمس", "ملابس بديلة"],
    options: [],
    addOns: [
      { id: "transfers-aqua", nameAr: "خدمة الانتقالات", nameEn: "Transfer Service", price: 10, descriptionAr: "انتقالات ذهاب وعودة من الفندق", icon: "🚗" },
    ],
    startingPrice: 40,
    bookingFields: ["name", "guests", "childrenUnder5", "hotel", "date", "addOns", "notes"],
  },
  {
    id: "8",
    slug: "shore-diving",
    titleAr: "رحلة غطس من الشاطئ",
    titleEn: "Shore Diving Experience",
    taglineAr: "اغطس في عالم الشعاب المرجانية مباشرة من الشاطئ",
    descriptionAr: "تجربة غوص احترافية من شواطئ شرم الشيخ الشهيرة! مع مدرب محترف ومعدات كاملة، ستستكشف أجمل مواقع الغوص في البحر الأحمر.",
    heroImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80",
    galleryImages: [],
    youtubeUrl: "https://www.youtube.com/embed/oQziT2AN8nE",
    schedule: { startTime: "09:00 AM", endTime: "01:00 PM", duration: "4 ساعات", frequency: "يومياً" },
    includes: ["معدات الغوص الكاملة", "مدرب غوص محترف", "شهادة غوص تذكارية", "تأمين بحري"],
    essentials: ["ملابس سباحة", "منشفة", "كريم واقي من الشمس"],
    options: [],
    addOns: [
      { id: "transfers-diving", nameAr: "خدمة الانتقالات", nameEn: "Transfer Service", price: 10, descriptionAr: "انتقالات ذهاب وعودة من الفندق", icon: "🚗" },
    ],
    startingPrice: 45,
    bookingFields: ["name", "guests", "hotel", "date", "time", "addOns", "notes"],
  },
  {
    id: "9",
    slug: "sharm-city-tour",
    titleAr: "جولة مدينة شرم الشيخ",
    titleEn: "Sharm El Sheikh City Tour",
    taglineAr: "اكتشف معالم وأسواق شرم الشيخ مع مرشد محلي",
    descriptionAr: "جولة شاملة في أبرز معالم مدينة شرم الشيخ! زيارة السوق القديم، المسجد السماوي، خليج نعمة، وأشهر المطاعم والمقاهي.",
    heroImage: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=400&q=80",
    galleryImages: [],
    youtubeUrl: "https://www.youtube.com/embed/oQziT2AN8nE",
    schedule: { startTime: "10:00 AM", endTime: "06:00 PM", duration: "8 ساعات", frequency: "يومياً" },
    includes: ["الانتقالات ذهاب وعودة من الفندق", "مرشد سياحي محلي", "دخول المعالم"],
    essentials: ["ملابس مريحة", "حذاء مريح للمشي", "نظارات شمسية", "مبلغ نقدي للتسوق"],
    options: [],
    addOns: [],
    startingPrice: 25,
    bookingFields: ["name", "guests", "hotel", "date", "time", "notes"],
  },
];

const emptySchedule: TripSchedule = { startTime: "", endTime: "", duration: "", frequency: "يومياً" };

const emptyTrip: Omit<Trip, "id"> = {
  slug: "",
  titleAr: "",
  titleEn: "",
  taglineAr: "",
  descriptionAr: "",
  heroImage: "",
  galleryImages: [],
  youtubeUrl: "",
  schedule: emptySchedule,
  includes: [],
  essentials: [],
  options: [],
  addOns: [],
  startingPrice: 0,
  bookingFields: ["name", "guests", "hotel", "date", "notes"],
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
  const add = () => { if (input.trim()) { onAdd(input.trim()); setInput(""); } };
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
        <button type="button" onClick={add} className="px-4 py-2.5 bg-[#F3F4F6] rounded-xl text-sm font-medium hover:bg-[#E5E7EB] transition-colors">إضافة</button>
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

export default function AdminTrips() {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Trip | null>(null);
  const [form, setForm] = useState<Omit<Trip, "id">>(emptyTrip);
  const [optionInput, setOptionInput] = useState<Omit<TripOption, "id">>({ nameAr: "", nameEn: "", descriptionAr: "", price: 0, maxQuantity: undefined, capacityLabel: "" });
  const [addOnInput, setAddOnInput] = useState<Omit<TripAddOn, "id">>({ nameAr: "", nameEn: "", price: 0, descriptionAr: "", icon: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyTrip);
    setOptionInput({ nameAr: "", nameEn: "", descriptionAr: "", price: 0, maxQuantity: undefined, capacityLabel: "" });
    setAddOnInput({ nameAr: "", nameEn: "", price: 0, descriptionAr: "", icon: "" });
    setShowModal(true);
  };

  const openEdit = (t: Trip) => {
    setEditing(t);
    setForm({
      slug: t.slug,
      titleAr: t.titleAr,
      titleEn: t.titleEn,
      taglineAr: t.taglineAr,
      descriptionAr: t.descriptionAr,
      heroImage: t.heroImage,
      galleryImages: [...t.galleryImages],
      youtubeUrl: t.youtubeUrl,
      schedule: { ...t.schedule },
      includes: [...t.includes],
      essentials: [...t.essentials],
      options: t.options.map((o) => ({ ...o })),
      addOns: t.addOns.map((a) => ({ ...a })),
      startingPrice: t.startingPrice,
      bookingFields: [...t.bookingFields],
    });
    setOptionInput({ nameAr: "", nameEn: "", descriptionAr: "", price: 0, maxQuantity: undefined, capacityLabel: "" });
    setAddOnInput({ nameAr: "", nameEn: "", price: 0, descriptionAr: "", icon: "" });
    setShowModal(true);
  };

  const addOption = () => {
    if (optionInput.nameAr.trim()) {
      const newOption: TripOption = {
        id: `opt-${Date.now()}`,
        ...optionInput,
        maxQuantity: optionInput.maxQuantity || undefined,
        capacityLabel: optionInput.capacityLabel || undefined,
      };
      setForm((f) => ({ ...f, options: [...f.options, newOption] }));
      setOptionInput({ nameAr: "", nameEn: "", descriptionAr: "", price: 0, maxQuantity: undefined, capacityLabel: "" });
    }
  };

  const addAddOn = () => {
    if (addOnInput.nameAr.trim()) {
      const newAddOn: TripAddOn = { id: `addon-${Date.now()}`, ...addOnInput };
      setForm((f) => ({ ...f, addOns: [...f.addOns, newAddOn] }));
      setAddOnInput({ nameAr: "", nameEn: "", price: 0, descriptionAr: "", icon: "" });
    }
  };

  const toggleBookingField = (key: string) => {
    setForm((f) => ({
      ...f,
      bookingFields: f.bookingFields.includes(key)
        ? f.bookingFields.filter((k) => k !== key)
        : [...f.bookingFields, key],
    }));
  };

  const handleSave = () => {
    if (!form.titleAr) return;
    if (editing) {
      setTrips(trips.map((t) => (t.id === editing.id ? { ...t, ...form } : t)));
    } else {
      setTrips([...trips, { id: Date.now().toString(), ...form }]);
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (deleteId) { setTrips(trips.filter((t) => t.id !== deleteId)); setDeleteId(null); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">الرحلات</h1>
          <p className="text-sm text-[#6B7280] mt-1">إدارة الرحلات السياحية والأنشطة</p>
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
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">يبدأ من</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">الخيارات</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id} className="border-b border-[#F9FAFB] hover:bg-[#FAFBFC] transition-colors">
                  <td className="px-5 py-3">
                    <img src={trip.heroImage} alt={trip.titleAr} className="w-14 h-10 rounded-lg object-cover" />
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-[#111]">{trip.titleAr}</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5">{trip.titleEn}</p>
                  </td>
                  <td className="px-5 py-3 text-[#6B7280]">{trip.schedule.duration}</td>
                  <td className="px-5 py-3 font-semibold text-[#111]">${trip.startingPrice}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {trip.options.length > 0 && (
                        <span className="bg-[#EFF6FF] text-[#3B82F6] text-[10px] font-medium px-2 py-0.5 rounded-full">{trip.options.length} خيار</span>
                      )}
                      {trip.addOns.length > 0 && (
                        <span className="bg-[#F0FDF4] text-[#22C55E] text-[10px] font-medium px-2 py-0.5 rounded-full">{trip.addOns.length} إضافة</span>
                      )}
                    </div>
                  </td>
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

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#111]">{editing ? "تعديل الرحلة" : "إضافة رحلة جديدة"}</h2>
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
                      <label className="block text-xs font-medium text-[#374151] mb-1.5">العنوان بالعربي *</label>
                      <input value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#374151] mb-1.5">العنوان بالإنجليزي</label>
                      <input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#374151] mb-1.5">Slug (رابط)</label>
                      <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="trip-name-slug" dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#374151] mb-1.5">السعر الابتدائي ($)</label>
                      <input type="number" value={form.startingPrice || ""} onChange={(e) => setForm({ ...form, startingPrice: Number(e.target.value) })} dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">الجملة التعريفية (Tagline)</label>
                    <input value={form.taglineAr} onChange={(e) => setForm({ ...form, taglineAr: e.target.value })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">الوصف التفصيلي</label>
                    <textarea value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} rows={4} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors resize-none" />
                  </div>
                </div>
              </section>

              {/* ── Schedule ── */}
              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">الجدول الزمني</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">وقت البداية</label>
                    <input value={form.schedule.startTime} onChange={(e) => setForm({ ...form, schedule: { ...form.schedule, startTime: e.target.value } })} placeholder="07:00 AM" dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">وقت النهاية</label>
                    <input value={form.schedule.endTime} onChange={(e) => setForm({ ...form, schedule: { ...form.schedule, endTime: e.target.value } })} placeholder="05:00 PM" dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">المدة</label>
                    <input value={form.schedule.duration} onChange={(e) => setForm({ ...form, schedule: { ...form.schedule, duration: e.target.value } })} placeholder="8 ساعات" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">التكرار</label>
                    <input value={form.schedule.frequency} onChange={(e) => setForm({ ...form, schedule: { ...form.schedule, frequency: e.target.value } })} placeholder="يومياً" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                </div>
              </section>

              {/* ── Media ── */}
              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">الوسائط</p>
                <div className="space-y-3">
                  <FileUpload label="الصورة الرئيسية" accept="image" value={form.heroImage || undefined} onChange={(url) => setForm({ ...form, heroImage: url })} onClear={() => setForm({ ...form, heroImage: "" })} />
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">رابط يوتيوب (اختياري)</label>
                    <input value={form.youtubeUrl} onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })} placeholder="https://www.youtube.com/embed/..." dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                </div>
              </section>

              {/* ── Content Lists ── */}
              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">المحتوى</p>
                <div className="space-y-4">
                  <StringListSection
                    label="يشمل"
                    placeholder="مثال: الانتقالات ذهاب وعودة"
                    items={form.includes}
                    onAdd={(v) => setForm((f) => ({ ...f, includes: [...f.includes, v] }))}
                    onRemove={(i) => setForm((f) => ({ ...f, includes: f.includes.filter((_, idx) => idx !== i) }))}
                  />
                  <StringListSection
                    label="الضروريات (ماذا يحضر)"
                    placeholder="مثال: ملابس سباحة"
                    items={form.essentials}
                    onAdd={(v) => setForm((f) => ({ ...f, essentials: [...f.essentials, v] }))}
                    onRemove={(i) => setForm((f) => ({ ...f, essentials: f.essentials.filter((_, idx) => idx !== i) }))}
                  />
                </div>
              </section>

              {/* ── Options ── */}
              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">خيارات الحجز</p>
                <div className="space-y-2 mb-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input value={optionInput.nameAr} onChange={(e) => setOptionInput({ ...optionInput, nameAr: e.target.value })} placeholder="الاسم بالعربي" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    <input value={optionInput.nameEn} onChange={(e) => setOptionInput({ ...optionInput, nameEn: e.target.value })} placeholder="Name in English" dir="ltr" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <input value={optionInput.descriptionAr} onChange={(e) => setOptionInput({ ...optionInput, descriptionAr: e.target.value })} placeholder="الوصف..." className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  <div className="grid grid-cols-3 gap-2">
                    <input type="number" value={optionInput.price || ""} onChange={(e) => setOptionInput({ ...optionInput, price: Number(e.target.value) })} placeholder="السعر $" dir="ltr" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    <input value={optionInput.capacityLabel || ""} onChange={(e) => setOptionInput({ ...optionInput, capacityLabel: e.target.value })} placeholder="الطاقة (شخصين)" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    <button type="button" onClick={addOption} className="bg-[#F3F4F6] rounded-xl text-sm font-medium hover:bg-[#E5E7EB] transition-colors">+ إضافة خيار</button>
                  </div>
                </div>
                {form.options.length > 0 && (
                  <div className="space-y-2">
                    {form.options.map((o, i) => (
                      <div key={i} className="flex items-center justify-between bg-[#F9FAFB] rounded-xl px-4 py-2.5 text-sm">
                        <span className="font-medium text-[#111]">{o.nameAr}</span>
                        {o.capacityLabel && <span className="text-[#6B7280]">{o.capacityLabel}</span>}
                        <span className="font-semibold text-[#111]">${o.price}</span>
                        <button onClick={() => setForm((f) => ({ ...f, options: f.options.filter((_, idx) => idx !== i) }))} className="text-[#9CA3AF] hover:text-[#EF4444] mr-1">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* ── Add-ons ── */}
              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">الإضافات (Add-ons)</p>
                <div className="space-y-2 mb-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input value={addOnInput.nameAr} onChange={(e) => setAddOnInput({ ...addOnInput, nameAr: e.target.value })} placeholder="الاسم بالعربي" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    <input value={addOnInput.nameEn} onChange={(e) => setAddOnInput({ ...addOnInput, nameEn: e.target.value })} placeholder="Name in English" dir="ltr" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input value={addOnInput.descriptionAr} onChange={(e) => setAddOnInput({ ...addOnInput, descriptionAr: e.target.value })} placeholder="الوصف..." className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    <div className="flex gap-1">
                      <input value={addOnInput.icon || ""} onChange={(e) => setAddOnInput({ ...addOnInput, icon: e.target.value })} placeholder="🚗" className="w-16 border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors text-center" />
                      <input type="number" value={addOnInput.price || ""} onChange={(e) => setAddOnInput({ ...addOnInput, price: Number(e.target.value) })} placeholder="$ سعر" dir="ltr" className="flex-1 border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    </div>
                    <button type="button" onClick={addAddOn} className="bg-[#F3F4F6] rounded-xl text-sm font-medium hover:bg-[#E5E7EB] transition-colors">+ إضافة</button>
                  </div>
                </div>
                {form.addOns.length > 0 && (
                  <div className="space-y-2">
                    {form.addOns.map((a, i) => (
                      <div key={i} className="flex items-center justify-between bg-[#F9FAFB] rounded-xl px-4 py-2.5 text-sm">
                        <span className="font-medium text-[#111]">{a.icon} {a.nameAr}</span>
                        <span className="font-semibold text-[#111]">${a.price}</span>
                        <button onClick={() => setForm((f) => ({ ...f, addOns: f.addOns.filter((_, idx) => idx !== i) }))} className="text-[#9CA3AF] hover:text-[#EF4444] mr-1">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* ── Booking Fields ── */}
              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">حقول الحجز</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_BOOKING_FIELDS.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleBookingField(key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        form.bookingFields.includes(key)
                          ? "bg-[#111] text-white"
                          : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </section>
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
