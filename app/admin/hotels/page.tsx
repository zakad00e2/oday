"use client";

import { useState } from "react";
import FlexibleImage from "@/components/FlexibleImage";
import FileUpload from "@/components/admin/FileUpload";

interface Room {
  nameAr: string;
  nameEn: string;
  price: number;
  descriptionAr: string;
  descriptionEn: string;
}

interface RoomAddOn {
  nameAr: string;
  nameEn: string;
  price: number;
  descriptionAr: string;
  descriptionEn: string;
}

interface Amenity {
  labelAr: string;
  labelEn: string;
}

interface Hotel {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  cityAr: string;
  cityEn: string;
  descriptionAr: string;
  descriptionEn: string;
  mainImages: string[];
  gallery: string[];
  youtubeUrl: string;
  stars: number;
  price: number;
  filterTag?: "most_booked" | "highest_rated" | "lowest_price" | null;
  discount?: string;
  originalPrice?: number;
  amenities: Amenity[];
  rooms: Room[];
  roomAddOns: RoomAddOn[];
}

const MAX_MAIN_IMAGES = 5;
const MAX_GALLERY_IMAGES = 10;

const mockHotels: Hotel[] = [
  {
    id: "1",
    slug: "rexos-sharm",
    nameAr: "منتجع ريكسوس شرم الشيخ",
    nameEn: "Rixos Sharm El Sheikh Resort",
    cityAr: "شرم الشيخ",
    cityEn: "Sharm El Sheikh",
    descriptionAr:
      "منتجع ريكسوس شرم الشيخ أحد أفخم المنتجعات السياحية على ساحل البحر الأحمر. يتميز بموقعه الاستراتيجي المطل مباشرة على البحر مع شاطئ خاص نظيف وهادئ.",
    descriptionEn:
      "Rixos Sharm El Sheikh is one of the Red Sea coast's standout luxury resorts, offering a prime beachfront setting with a clean private beach and a calm atmosphere.",
    mainImages: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=80",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80",
    ],
    youtubeUrl: "https://www.youtube.com/embed/oQziT2AN8nE",
    stars: 5,
    price: 120,
    filterTag: "most_booked",
    discount: "20%",
    originalPrice: 150,
    amenities: [
      { labelAr: "مسبح لا متناهي", labelEn: "Infinity pool" },
      { labelAr: "شاطئ خاص", labelEn: "Private beach" },
      { labelAr: "سبا ومركز عافية", labelEn: "Spa and wellness center" },
    ],
    rooms: [
      { nameAr: "غرفة مزدوجة فاخرة", nameEn: "Luxury Double Room", price: 120, descriptionAr: "شخصين", descriptionEn: "2 guests" },
      { nameAr: "غرفة بإطلالة بحرية", nameEn: "Sea View Room", price: 160, descriptionAr: "شخصين + طفل", descriptionEn: "2 guests + 1 child" },
    ],
    roomAddOns: [
      { nameAr: "إطلالة بحرية", nameEn: "Sea View", price: 40, descriptionAr: "غرفة بإطلالة مباشرة على البحر", descriptionEn: "Room with a direct sea view" },
      { nameAr: "صف أول على البحر", nameEn: "Front Row by the Sea", price: 60, descriptionAr: "موقع مباشر أمام الشاطئ", descriptionEn: "Prime location directly facing the beach" },
    ],
  },
  {
    id: "2",
    slug: "stella-di-mare-hurghada",
    nameAr: "فندق ستيلا دي ماري الغردقة",
    nameEn: "Stella Di Mare Hurghada Hotel",
    cityAr: "الغردقة",
    cityEn: "Hurghada",
    descriptionAr:
      "فندق ستيلا دي ماري الغردقة وجهة مثالية للعائلات والأزواج الباحثين عن إقامة راقية مع شاطئ خاص وأنشطة مائية متنوعة.",
    descriptionEn:
      "Stella Di Mare Hurghada is ideal for families and couples looking for an upscale stay with a private beach and a wide range of water activities.",
    mainImages: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80"],
    gallery: [],
    youtubeUrl: "",
    stars: 4,
    price: 80,
    filterTag: "lowest_price",
    amenities: [
      { labelAr: "مسابح متعددة", labelEn: "Multiple pools" },
      { labelAr: "شاطئ خاص", labelEn: "Private beach" },
      { labelAr: "نادي أطفال", labelEn: "Kids club" },
    ],
    rooms: [
      { nameAr: "غرفة مزدوجة", nameEn: "Double Room", price: 80, descriptionAr: "شخصين", descriptionEn: "2 guests" },
      { nameAr: "غرفة عائلية", nameEn: "Family Room", price: 120, descriptionAr: "4 أشخاص + طفلين", descriptionEn: "4 guests + 2 children" },
    ],
    roomAddOns: [{ nameAr: "إطلالة مسبح", nameEn: "Pool View", price: 20, descriptionAr: "غرفة بإطلالة على المسبح الخارجي", descriptionEn: "Room overlooking the outdoor pool" }],
  },
  {
    id: "3",
    slug: "movenpick-ain-sokhna",
    nameAr: "فندق موفنبيك العين السخنة",
    nameEn: "Movenpick Ain Sokhna Hotel",
    cityAr: "العين السخنة",
    cityEn: "Ain Sokhna",
    descriptionAr:
      "فندق موفنبيك العين السخنة ملاذ هادئ على ساحل البحر الأحمر على بعد ساعة من القاهرة. مثالي لعطلات نهاية الأسبوع.",
    descriptionEn:
      "Movenpick Ain Sokhna is a peaceful Red Sea escape about an hour from Cairo, making it a great choice for weekend breaks.",
    mainImages: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=80"],
    gallery: [],
    youtubeUrl: "",
    stars: 5,
    price: 100,
    filterTag: "most_booked",
    discount: "20%",
    originalPrice: 125,
    amenities: [
      { labelAr: "مسبح ساخن", labelEn: "Heated pool" },
      { labelAr: "مركز لياقة بدنية", labelEn: "Fitness center" },
      { labelAr: "موقف سيارات مجاني", labelEn: "Free parking" },
    ],
    rooms: [
      { nameAr: "غرفة مزدوجة", nameEn: "Double Room", price: 100, descriptionAr: "شخصين", descriptionEn: "2 guests" },
      { nameAr: "جناح عائلي", nameEn: "Family Suite", price: 180, descriptionAr: "4 أشخاص + طفل", descriptionEn: "4 guests + 1 child" },
    ],
    roomAddOns: [],
  },
  {
    id: "4",
    slug: "kempinski-soma-bay",
    nameAr: "فندق كمبينسكي سوما باي",
    nameEn: "Kempinski Soma Bay Hotel",
    cityAr: "الغردقة",
    cityEn: "Hurghada",
    descriptionAr:
      "فندق كمبينسكي سوما باي تجربة فندقية استثنائية تجمع بين الفخامة والطبيعة الخلابة في منتجع سوما باي.",
    descriptionEn:
      "Kempinski Soma Bay delivers a luxury resort experience that blends high-end hospitality with the natural beauty of Soma Bay.",
    mainImages: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80"],
    gallery: [],
    youtubeUrl: "",
    stars: 5,
    price: 150,
    filterTag: "highest_rated",
    amenities: [
      { labelAr: "مركز غوص متكامل", labelEn: "Full diving center" },
      { labelAr: "ملعب غولف", labelEn: "Golf course" },
      { labelAr: "سبا عالمي", labelEn: "World-class spa" },
    ],
    rooms: [
      { nameAr: "غرفة ديلوكس", nameEn: "Deluxe Room", price: 150, descriptionAr: "شخصين", descriptionEn: "2 guests" },
      { nameAr: "فيلا خاصة", nameEn: "Private Villa", price: 400, descriptionAr: "6 أشخاص", descriptionEn: "6 guests" },
    ],
    roomAddOns: [{ nameAr: "ترقية جناح", nameEn: "Suite Upgrade", price: 90, descriptionAr: "ترقية إلى مساحة وإطلالة أفضل", descriptionEn: "Upgrade to a larger room with a better view" }],
  },
];

const emptyHotel: Omit<Hotel, "id"> = {
  slug: "",
  nameAr: "",
  nameEn: "",
  cityAr: "",
  cityEn: "",
  descriptionAr: "",
  descriptionEn: "",
  mainImages: [],
  gallery: [],
  youtubeUrl: "",
  stars: 5,
  price: 0,
  filterTag: null,
  discount: "",
  originalPrice: undefined,
  amenities: [],
  rooms: [],
  roomAddOns: [],
};

const emptyAmenityInput: Amenity = {
  labelAr: "",
  labelEn: "",
};

const emptyRoomInput: Room = {
  nameAr: "",
  nameEn: "",
  price: 0,
  descriptionAr: "",
  descriptionEn: "",
};

const emptyRoomAddOnInput: RoomAddOn = {
  nameAr: "",
  nameEn: "",
  price: 0,
  descriptionAr: "",
  descriptionEn: "",
};

function makeSlug(value: string) {
  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return normalized || `hotel-${Date.now()}`;
}

function cloneHotel(hotel: Omit<Hotel, "id"> | Hotel): Omit<Hotel, "id"> {
  const rest = { ...hotel } as Partial<Hotel>;
  delete rest.id;

  return {
    ...(rest as Omit<Hotel, "id">),
    mainImages: [...(rest.mainImages ?? [])],
    gallery: [...(rest.gallery ?? [])],
    amenities: (rest.amenities ?? []).map((amenity) => ({ ...amenity })),
    rooms: (rest.rooms ?? []).map((room) => ({ ...room })),
    roomAddOns: (rest.roomAddOns ?? []).map((addOn) => ({ ...addOn })),
  };
}

function getCoverImage(hotel: Pick<Hotel, "mainImages" | "gallery">) {
  return hotel.mainImages[0] || hotel.gallery[0] || "";
}

export default function AdminHotels() {
  const [hotels, setHotels] = useState<Hotel[]>(mockHotels);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Hotel | null>(null);
  const [form, setForm] = useState<Omit<Hotel, "id">>(cloneHotel(emptyHotel));
  const [amenityInput, setAmenityInput] = useState<Amenity>(emptyAmenityInput);
  const [roomInput, setRoomInput] = useState<Room>(emptyRoomInput);
  const [roomAddOnInput, setRoomAddOnInput] = useState<RoomAddOn>(emptyRoomAddOnInput);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [mainImagesKey, setMainImagesKey] = useState(0);
  const [galleryKey, setGalleryKey] = useState(0);

  const localizedHotels = hotels.filter((hotel) => hotel.nameEn.trim() && hotel.descriptionEn.trim()).length;
  const totalRooms = hotels.reduce((sum, hotel) => sum + hotel.rooms.length, 0);
  const totalAmenities = hotels.reduce((sum, hotel) => sum + hotel.amenities.length, 0);
  const totalRoomAddOns = hotels.reduce((sum, hotel) => sum + hotel.roomAddOns.length, 0);

  const resetFormState = () => {
    setForm(cloneHotel(emptyHotel));
    setAmenityInput(emptyAmenityInput);
    setRoomInput(emptyRoomInput);
    setRoomAddOnInput(emptyRoomAddOnInput);
    setMainImagesKey((value) => value + 1);
    setGalleryKey((value) => value + 1);
  };

  const openAdd = () => {
    setEditing(null);
    resetFormState();
    setShowModal(true);
  };

  const openEdit = (hotel: Hotel) => {
    setEditing(hotel);
    setForm(cloneHotel(hotel));
    setAmenityInput(emptyAmenityInput);
    setRoomInput(emptyRoomInput);
    setRoomAddOnInput(emptyRoomAddOnInput);
    setMainImagesKey((value) => value + 1);
    setGalleryKey((value) => value + 1);
    setShowModal(true);
  };

  const addAmenity = () => {
    if (!amenityInput.labelAr.trim()) return;

    setForm((current) => ({
      ...current,
      amenities: [
        ...current.amenities,
        {
          labelAr: amenityInput.labelAr.trim(),
          labelEn: amenityInput.labelEn.trim(),
        },
      ],
    }));
    setAmenityInput(emptyAmenityInput);
  };

  const addRoom = () => {
    if (!roomInput.nameAr.trim()) return;

    setForm((current) => ({
      ...current,
      rooms: [
        ...current.rooms,
        {
          nameAr: roomInput.nameAr.trim(),
          nameEn: roomInput.nameEn.trim(),
          price: roomInput.price,
          descriptionAr: roomInput.descriptionAr.trim(),
          descriptionEn: roomInput.descriptionEn.trim(),
        },
      ],
    }));
    setRoomInput(emptyRoomInput);
  };

  const addRoomAddOn = () => {
    if (!roomAddOnInput.nameAr.trim()) return;

    setForm((current) => ({
      ...current,
      roomAddOns: [
        ...current.roomAddOns,
        {
          nameAr: roomAddOnInput.nameAr.trim(),
          nameEn: roomAddOnInput.nameEn.trim(),
          price: roomAddOnInput.price,
          descriptionAr: roomAddOnInput.descriptionAr.trim(),
          descriptionEn: roomAddOnInput.descriptionEn.trim(),
        },
      ],
    }));
    setRoomAddOnInput(emptyRoomAddOnInput);
  };

  const handleSave = () => {
    if (!form.nameAr.trim()) return;

    const payload: Omit<Hotel, "id"> = {
      ...form,
      slug: form.slug.trim() || makeSlug(form.nameEn || form.nameAr),
      nameAr: form.nameAr.trim(),
      nameEn: form.nameEn.trim(),
      cityAr: form.cityAr.trim(),
      cityEn: form.cityEn.trim(),
      descriptionAr: form.descriptionAr.trim(),
      descriptionEn: form.descriptionEn.trim(),
      youtubeUrl: form.youtubeUrl.trim(),
      mainImages: form.mainImages.slice(0, MAX_MAIN_IMAGES),
      gallery: form.gallery.slice(0, MAX_GALLERY_IMAGES),
      amenities: form.amenities.map((amenity) => ({
        labelAr: amenity.labelAr.trim(),
        labelEn: amenity.labelEn.trim(),
      })),
      rooms: form.rooms.map((room) => ({
        nameAr: room.nameAr.trim(),
        nameEn: room.nameEn.trim(),
        price: room.price,
        descriptionAr: room.descriptionAr.trim(),
        descriptionEn: room.descriptionEn.trim(),
      })),
      roomAddOns: form.roomAddOns.map((addOn) => ({
        nameAr: addOn.nameAr.trim(),
        nameEn: addOn.nameEn.trim(),
        price: addOn.price,
        descriptionAr: addOn.descriptionAr.trim(),
        descriptionEn: addOn.descriptionEn.trim(),
      })),
    };

    if (editing) {
      setHotels((current) => current.map((hotel) => (hotel.id === editing.id ? { ...hotel, ...payload } : hotel)));
    } else {
      setHotels((current) => [...current, { id: String(Date.now()), ...payload }]);
    }

    setShowModal(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setHotels((current) => current.filter((hotel) => hotel.id !== deleteId));
    setDeleteId(null);
  };

  const renderStars = (count: number) => "★".repeat(count) + "☆".repeat(5 - count);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">الفنادق</h1>
          <p className="text-sm text-[#6B7280] mt-1">إدارة الفنادق والمنتجعات مع محتوى عربي وإنجليزي وصور متعددة وإضافات الغرف.</p>
        </div>
        <button onClick={openAdd} className="flex items-center justify-center gap-2 bg-[#111] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          إضافة فندق
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5">
          <p className="text-sm text-[#6B7280]">إجمالي الفنادق</p>
          <p className="text-3xl font-bold text-[#111] mt-2">{hotels.length}</p>
          <p className="text-xs text-[#9CA3AF] mt-2">فنادق قابلة للتحرير من لوحة التحكم</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5">
          <p className="text-sm text-[#6B7280]">محتوى مترجم</p>
          <p className="text-3xl font-bold text-[#111] mt-2">{localizedHotels}</p>
          <p className="text-xs text-[#9CA3AF] mt-2">فنادق تحتوي على اسم ووصف بالإنجليزية</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5">
          <p className="text-sm text-[#6B7280]">التهيئات</p>
          <p className="text-3xl font-bold text-[#111] mt-2">{totalRooms + totalAmenities + totalRoomAddOns}</p>
          <p className="text-xs text-[#9CA3AF] mt-2">{totalRooms} غرفة + {totalAmenities} مرفق + {totalRoomAddOns} إضافة</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {hotels.map((hotel) => {
          const coverImage = getCoverImage(hotel);

          return (
            <div key={hotel.id} className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="relative h-44 overflow-hidden bg-[#F3F4F6]">
                {coverImage ? (
                  <FlexibleImage src={coverImage} alt={hotel.nameAr} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-[#9CA3AF]">لا توجد صورة</div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-xs font-medium text-[#F59E0B]">
                  {renderStars(hotel.stars)}
                </div>
                {hotel.cityAr && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-xs font-medium text-[#374151]">
                    {hotel.cityAr}
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div>
                    <h3 className="font-bold text-[#111] leading-snug">{hotel.nameAr}</h3>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5" dir="ltr">{hotel.nameEn || "—"}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#111] shrink-0">
                    ${hotel.price}<span className="text-[10px] text-[#9CA3AF] font-normal">/ليلة</span>
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] mb-3 line-clamp-2">{hotel.descriptionAr}</p>
                <p className="text-[11px] text-[#9CA3AF] mb-3 line-clamp-2" dir="ltr">{hotel.descriptionEn || "No English description yet"}</p>
                <div className="flex flex-wrap gap-2 text-[11px] text-[#6B7280] mb-4">
                  <span>{hotel.mainImages.length} صور رئيسية</span>
                  <span>·</span>
                  <span>{hotel.gallery.length} صور معرض</span>
                  <span>·</span>
                  <span>{hotel.roomAddOns.length} إضافات غرف</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {hotel.filterTag && (() => {
                    const tagMap = {
                      most_booked: { label: "🔥 الأكثر حجزاً", cls: "bg-orange-100 text-orange-700" },
                      highest_rated: { label: "⭐ الأعلى تقييماً", cls: "bg-yellow-100 text-yellow-700" },
                      lowest_price: { label: "💰 الأقل سعراً", cls: "bg-emerald-100 text-emerald-700" },
                    };
                    const tag = tagMap[hotel.filterTag];
                    return tag ? <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${tag.cls}`}>{tag.label}</span> : null;
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
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#111]">{editing ? "تعديل الفندق" : "إضافة فندق جديد"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-6">
              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">المعلومات الأساسية</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">اسم الفندق بالعربي *</label>
                    <input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Hotel name in English</label>
                    <input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">المدينة بالعربي</label>
                    <input value={form.cityAr} onChange={(e) => setForm({ ...form, cityAr: e.target.value })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">City in English</label>
                    <input value={form.cityEn} onChange={(e) => setForm({ ...form, cityEn: e.target.value })} dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Slug (رابط)</label>
                    <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="hotel-name-slug" dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">السعر الابتدائي ($/ليلة)</label>
                    <input type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">الوصف بالعربي</label>
                    <textarea value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} rows={5} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Description in English</label>
                    <textarea value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} dir="ltr" rows={5} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">التقييم (نجوم)</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((count) => (
                        <button key={count} type="button" onClick={() => setForm({ ...form, stars: count })} className={`text-2xl transition-colors ${count <= form.stars ? "text-[#F59E0B]" : "text-[#E5E7EB]"}`}>
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">التصنيف والخصم</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-2">تصنيف الفندق في الفلتر</label>
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        { value: null, label: "بدون تصنيف", color: "bg-[#F3F4F6]", activeColor: "bg-[#111] text-white", textColor: "text-[#6B7280]" },
                        { value: "most_booked", label: "🔥 الأكثر حجزاً", color: "bg-orange-50 border-orange-200", activeColor: "bg-orange-500 text-white border-orange-500", textColor: "text-orange-700" },
                        { value: "highest_rated", label: "⭐ الأعلى تقييماً", color: "bg-yellow-50 border-yellow-200", activeColor: "bg-yellow-500 text-white border-yellow-500", textColor: "text-yellow-700" },
                        { value: "lowest_price", label: "💰 الأقل سعراً", color: "bg-emerald-50 border-emerald-200", activeColor: "bg-emerald-500 text-white border-emerald-500", textColor: "text-emerald-700" },
                      ] as const).map((option) => {
                        const isActive = form.filterTag === option.value;

                        return (
                          <button
                            key={String(option.value)}
                            type="button"
                            onClick={() => setForm({ ...form, filterTag: option.value })}
                            className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${isActive ? `${option.activeColor} border-transparent` : `${option.color} ${option.textColor} border`}`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

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
                    {form.discount && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-[#9CA3AF] mb-1">نسبة الخصم (مثال: 20%)</label>
                          <input value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} placeholder="20%" dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#9CA3AF] mb-1">السعر الأصلي (قبل الخصم $)</label>
                          <input type="number" value={form.originalPrice || ""} onChange={(e) => setForm({ ...form, originalPrice: e.target.value ? Number(e.target.value) : undefined })} placeholder="150" dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">الوسائط</p>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-[#374151]">الصور الرئيسية</label>
                      <span className="text-[11px] text-[#9CA3AF]">{form.mainImages.length}/{MAX_MAIN_IMAGES}</span>
                    </div>
                    {form.mainImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
                        {form.mainImages.map((image, index) => (
                          <div key={`${image}-${index}`} className="relative h-24 rounded-xl overflow-hidden bg-[#F3F4F6]">
                            <FlexibleImage src={image} alt={`main-${index}`} fill sizes="96px" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => setForm((current) => ({ ...current, mainImages: current.mainImages.filter((_, itemIndex) => itemIndex !== index) }))} className="absolute top-1 left-1 w-5 h-5 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-xs transition-colors">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                    {form.mainImages.length < MAX_MAIN_IMAGES ? (
                      <FileUpload
                        key={mainImagesKey}
                        label="إضافة صورة رئيسية"
                        accept="image"
                        previewHeight="h-24"
                        onChange={(url) => {
                          setForm((current) => ({
                            ...current,
                            mainImages: current.mainImages.length >= MAX_MAIN_IMAGES ? current.mainImages : [...current.mainImages, url],
                          }));
                          setMainImagesKey((value) => value + 1);
                        }}
                      />
                    ) : (
                      <p className="text-xs text-[#9CA3AF]">تم الوصول للحد الأقصى للصور الرئيسية.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">رابط يوتيوب (اختياري)</label>
                    <input value={form.youtubeUrl} onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })} placeholder="https://www.youtube.com/embed/..." dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-[#374151]">معرض الصور</label>
                      <span className="text-[11px] text-[#9CA3AF]">{form.gallery.length}/{MAX_GALLERY_IMAGES}</span>
                    </div>
                    {form.gallery.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
                        {form.gallery.map((image, index) => (
                          <div key={`${image}-${index}`} className="relative h-24 rounded-xl overflow-hidden bg-[#F3F4F6]">
                            <FlexibleImage src={image} alt={`gallery-${index}`} fill sizes="96px" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => setForm((current) => ({ ...current, gallery: current.gallery.filter((_, itemIndex) => itemIndex !== index) }))} className="absolute top-1 left-1 w-5 h-5 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-xs transition-colors">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                    {form.gallery.length < MAX_GALLERY_IMAGES ? (
                      <FileUpload
                        key={galleryKey}
                        label="إضافة صورة للمعرض"
                        accept="image"
                        previewHeight="h-24"
                        onChange={(url) => {
                          setForm((current) => ({
                            ...current,
                            gallery: current.gallery.length >= MAX_GALLERY_IMAGES ? current.gallery : [...current.gallery, url],
                          }));
                          setGalleryKey((value) => value + 1);
                        }}
                      />
                    ) : (
                      <p className="text-xs text-[#9CA3AF]">تم الوصول للحد الأقصى لصور المعرض.</p>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">المرافق</p>
                <div className="space-y-2 mb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input value={amenityInput.labelAr} onChange={(e) => setAmenityInput({ ...amenityInput, labelAr: e.target.value })} placeholder="اسم المرفق بالعربي" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    <input value={amenityInput.labelEn} onChange={(e) => setAmenityInput({ ...amenityInput, labelEn: e.target.value })} placeholder="Amenity name in English" dir="ltr" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <button type="button" onClick={addAmenity} className="w-full md:w-auto px-4 py-2.5 bg-[#F3F4F6] rounded-xl text-sm font-medium hover:bg-[#E5E7EB] transition-colors">+ إضافة مرفق</button>
                </div>
                <div className="space-y-2">
                  {form.amenities.map((amenity, index) => (
                    <div key={`${amenity.labelAr}-${index}`} className="flex flex-col gap-2 bg-[#F9FAFB] rounded-xl px-4 py-3 text-sm md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium text-[#111]">{amenity.labelAr}</p>
                        <p className="text-xs text-[#9CA3AF] mt-1" dir="ltr">{amenity.labelEn || "—"}</p>
                      </div>
                      <button type="button" onClick={() => setForm((current) => ({ ...current, amenities: current.amenities.filter((_, itemIndex) => itemIndex !== index) }))} className="text-[#9CA3AF] hover:text-[#EF4444]">×</button>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">أنواع الغرف</p>
                <div className="space-y-2 mb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input value={roomInput.nameAr} onChange={(e) => setRoomInput({ ...roomInput, nameAr: e.target.value })} placeholder="اسم الغرفة بالعربي" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    <input value={roomInput.nameEn} onChange={(e) => setRoomInput({ ...roomInput, nameEn: e.target.value })} placeholder="Room name in English" dir="ltr" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input value={roomInput.descriptionAr} onChange={(e) => setRoomInput({ ...roomInput, descriptionAr: e.target.value })} placeholder="الوصف بالعربي مثل: شخصين" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    <input value={roomInput.descriptionEn} onChange={(e) => setRoomInput({ ...roomInput, descriptionEn: e.target.value })} placeholder="Description in English" dir="ltr" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input type="number" value={roomInput.price || ""} onChange={(e) => setRoomInput({ ...roomInput, price: Number(e.target.value) })} placeholder="السعر $" dir="ltr" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    <button type="button" onClick={addRoom} className="bg-[#F3F4F6] rounded-xl text-sm font-medium hover:bg-[#E5E7EB] transition-colors">+ إضافة غرفة</button>
                  </div>
                </div>
                <div className="space-y-2">
                  {form.rooms.map((room, index) => (
                    <div key={`${room.nameAr}-${index}`} className="flex flex-col gap-2 bg-[#F9FAFB] rounded-xl px-4 py-3 text-sm md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium text-[#111]">{room.nameAr}</p>
                        <p className="text-xs text-[#9CA3AF] mt-1" dir="ltr">{room.nameEn || "—"}</p>
                        <p className="text-xs text-[#6B7280] mt-1">{room.descriptionAr}</p>
                        <p className="text-[11px] text-[#9CA3AF] mt-1" dir="ltr">{room.descriptionEn || "—"}</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                        <span className="font-semibold text-[#111]">${room.price}</span>
                        <button type="button" onClick={() => setForm((current) => ({ ...current, rooms: current.rooms.filter((_, itemIndex) => itemIndex !== index) }))} className="text-[#9CA3AF] hover:text-[#EF4444]">×</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">إضافات الغرف</p>
                <div className="space-y-2 mb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input value={roomAddOnInput.nameAr} onChange={(e) => setRoomAddOnInput({ ...roomAddOnInput, nameAr: e.target.value })} placeholder="اسم الإضافة بالعربي" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    <input value={roomAddOnInput.nameEn} onChange={(e) => setRoomAddOnInput({ ...roomAddOnInput, nameEn: e.target.value })} placeholder="Add-on name in English" dir="ltr" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input value={roomAddOnInput.descriptionAr} onChange={(e) => setRoomAddOnInput({ ...roomAddOnInput, descriptionAr: e.target.value })} placeholder="وصف الإضافة بالعربي" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    <input value={roomAddOnInput.descriptionEn} onChange={(e) => setRoomAddOnInput({ ...roomAddOnInput, descriptionEn: e.target.value })} placeholder="Add-on description in English" dir="ltr" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input type="number" value={roomAddOnInput.price || ""} onChange={(e) => setRoomAddOnInput({ ...roomAddOnInput, price: Number(e.target.value) })} placeholder="السعر $" dir="ltr" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    <button type="button" onClick={addRoomAddOn} className="bg-[#F3F4F6] rounded-xl text-sm font-medium hover:bg-[#E5E7EB] transition-colors">+ إضافة إضافة غرفة</button>
                  </div>
                </div>
                <div className="space-y-2">
                  {form.roomAddOns.map((addOn, index) => (
                    <div key={`${addOn.nameAr}-${index}`} className="flex flex-col gap-2 bg-[#F9FAFB] rounded-xl px-4 py-3 text-sm md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium text-[#111]">{addOn.nameAr}</p>
                        <p className="text-xs text-[#9CA3AF] mt-1" dir="ltr">{addOn.nameEn || "—"}</p>
                        <p className="text-xs text-[#6B7280] mt-1">{addOn.descriptionAr}</p>
                        <p className="text-[11px] text-[#9CA3AF] mt-1" dir="ltr">{addOn.descriptionEn || "—"}</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                        <span className="font-semibold text-[#111]">${addOn.price}</span>
                        <button type="button" onClick={() => setForm((current) => ({ ...current, roomAddOns: current.roomAddOns.filter((_, itemIndex) => itemIndex !== index) }))} className="text-[#9CA3AF] hover:text-[#EF4444]">×</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-[#F3F4F6]">
              <button onClick={handleSave} className="flex-1 bg-[#111] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors">{editing ? "حفظ التعديلات" : "إضافة الفندق"}</button>
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
