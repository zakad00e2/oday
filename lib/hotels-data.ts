export interface HotelDetail {
  slug: string;
  id: number;
  name: string;
  city: string;
  image: string;
  stars: number;
  price: number;
  description: string;
  features: string[];
  gallery: string[];
  youtubeUrl?: string;
  includes: string[];
  essentials: string[];
  amenities: { icon: string; label: string }[];
  rooms: { name: string; price: number; description: string }[];
}

export const allHotels: HotelDetail[] = [
  {
    slug: "rexos-sharm",
    id: 1,
    name: "منتجع ريكسوس شرم الشيخ",
    city: "شرم الشيخ",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80",
    stars: 5,
    price: 120,
    description:
      "منتجع ريكسوس شرم الشيخ أحد أفخم المنتجعات السياحية على ساحل البحر الأحمر. يتميز بموقعه الاستراتيجي المطل مباشرة على البحر مع شاطئ خاص نظيف وهادئ. يقدم المنتجع خدمة شاملة (All Inclusive) بمستوى عالمي تشمل وجبات متعددة في مطاعم متنوعة ومشروبات مجانية على مدار الساعة.",
    features: ["إطلالة بحرية", "سبا وعافية", "مسبح لا متناهي", "مطاعم عالمية"],
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80",
    ],
    youtubeUrl: "https://www.youtube.com/embed/oQziT2AN8nE",
    includes: [
      "إقامة في غرفة مزدوجة فاخرة",
      "خدمة شاملة All Inclusive",
      "وصول مجاني للشاطئ الخاص",
      "استخدام المسابح والمرافق",
      "Wi-Fi مجاني في جميع الأرجاء",
      "خدمة الغرف على مدار الساعة",
    ],
    essentials: [
      "جواز سفر أو هوية وطنية",
      "ملابس مناسبة للمنتجع",
      "واقي شمس",
      "ملابس سباحة",
    ],
    amenities: [
      { icon: "🏊", label: "مسبح لا متناهي" },
      { icon: "🏖️", label: "شاطئ خاص" },
      { icon: "💆", label: "سبا ومركز عافية" },
      { icon: "🍽️", label: "مطاعم متنوعة" },
      { icon: "🎾", label: "ملاعب رياضية" },
      { icon: "🎭", label: "برامج ترفيهية" },
      { icon: "🏋️", label: "نادي صحي" },
      { icon: "🚗", label: "خدمة توصيل" },
    ],
    rooms: [
      { name: "غرفة مزدوجة فاخرة", price: 120, description: "غرفة واسعة مع إطلالة على الحديقة" },
      { name: "غرفة بإطلالة بحرية", price: 160, description: "إطلالة مباشرة على البحر الأحمر" },
      { name: "جناح فاخر", price: 220, description: "جناح واسع مع بلكونة وإطلالة بانورامية" },
    ],
  },
  {
    slug: "stella-di-mare-hurghada",
    id: 2,
    name: "فندق ستيلا دي ماري الغردقة",
    city: "الغردقة",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80",
    stars: 4,
    price: 80,
    description:
      "فندق ستيلا دي ماري الغردقة وجهة مثالية للعائلات والأزواج الباحثين عن إقامة راقية مع شاطئ خاص وأنشطة مائية متنوعة. يقع الفندق على الساحل مباشرة مع إمكانية ممارسة الغوص والسنوركلينج والأنشطة المائية المتعددة.",
    features: ["شاطئ خاص", "أنشطة مائية", "نادي أطفال", "Wi-Fi مجاني"],
    gallery: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1920&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80",
    ],
    includes: [
      "إقامة في غرفة مزدوجة",
      "وجبة إفطار بوفيه",
      "وصول للشاطئ الخاص",
      "استخدام المسابح",
      "Wi-Fi مجاني",
      "نادي الأطفال مجاني",
    ],
    essentials: [
      "جواز سفر أو هوية وطنية",
      "ملابس سباحة",
      "واقي شمس",
      "نظارات شمسية",
    ],
    amenities: [
      { icon: "🏊", label: "مسابح متعددة" },
      { icon: "🏖️", label: "شاطئ خاص" },
      { icon: "🤿", label: "غوص وسنوركلينج" },
      { icon: "🧒", label: "نادي أطفال" },
      { icon: "🎿", label: "رياضات مائية" },
      { icon: "🍽️", label: "مطاعم ومقاهي" },
      { icon: "🎱", label: "ملاعب ترفيهية" },
      { icon: "📶", label: "Wi-Fi مجاني" },
    ],
    rooms: [
      { name: "غرفة مزدوجة", price: 80, description: "غرفة مريحة مع إطلالة على الحديقة" },
      { name: "غرفة عائلية", price: 120, description: "غرفة كبيرة مناسبة للعائلات" },
      { name: "غرفة بإطلالة بحرية", price: 110, description: "إطلالة مباشرة على البحر" },
    ],
  },
  {
    slug: "movenpick-ain-sokhna",
    id: 3,
    name: "فندق موفنبيك العين السخنة",
    city: "عين السخنة",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=80",
    stars: 5,
    price: 100,
    description:
      "فندق موفنبيك العين السخنة ملاذ هادئ على ساحل البحر الأحمر على بعد ساعة من القاهرة. يقدم الفندق مرافق عصرية وخدمة متميزة في بيئة طبيعية خلابة. مثالي لعطلات نهاية الأسبوع والإجازات القصيرة من القاهرة.",
    features: ["حمام سباحة ساخن", "مركز لياقة", "مطعم بوفيه", "موقف سيارات"],
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80",
    ],
    includes: [
      "إقامة في غرفة مزدوجة",
      "وجبة إفطار بوفيه",
      "استخدام المسابح",
      "حمام سباحة مائي ساخن",
      "Wi-Fi مجاني",
      "موقف سيارات مجاني",
    ],
    essentials: [
      "هوية وطنية",
      "ملابس سباحة",
      "واقي شمس",
    ],
    amenities: [
      { icon: "🏊", label: "مسبح ساخن" },
      { icon: "🏋️", label: "مركز لياقة بدنية" },
      { icon: "🍽️", label: "مطعم بوفيه" },
      { icon: "🚗", label: "موقف سيارات مجاني" },
      { icon: "🏖️", label: "شاطئ خاص" },
      { icon: "💆", label: "خدمات سبا" },
      { icon: "📶", label: "Wi-Fi مجاني" },
      { icon: "🎾", label: "ملاعب رياضية" },
    ],
    rooms: [
      { name: "غرفة مزدوجة", price: 100, description: "غرفة مريحة مع إطلالة جميلة" },
      { name: "غرفة بإطلالة بحرية", price: 140, description: "إطلالة مباشرة على البحر الأحمر" },
      { name: "جناح عائلي", price: 180, description: "جناح واسع مناسب للعائلات" },
    ],
  },
  {
    slug: "kempinski-soma-bay",
    id: 4,
    name: "فندق كمبينسكي سوما باي",
    city: "الغردقة",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80",
    stars: 5,
    price: 150,
    description:
      "فندق كمبينسكي سوما باي تجربة فندقية استثنائية تجمع بين الفخامة والطبيعة الخلابة في منتجع سوما باي. يوفر الفندق أرقى مستويات الخدمة مع إمكانية ممارسة الغوص واستكشاف الحياة البحرية الغنية في المنطقة.",
    features: ["غوص وسنوركل", "ملعب غولف", "مسبح خاص", "خدمة غرف 24/7"],
    gallery: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1920&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=80",
    ],
    includes: [
      "إقامة في غرفة فاخرة",
      "إفطار أمريكي كامل",
      "وصول لمركز الغوص",
      "استخدام ملعب الغولف",
      "خدمة الغرف 24 ساعة",
      "Wi-Fi فائق السرعة",
    ],
    essentials: [
      "جواز سفر ساري",
      "ملابس سباحة",
      "واقي شمس",
      "ملابس رياضية",
    ],
    amenities: [
      { icon: "🤿", label: "مركز غوص متكامل" },
      { icon: "⛳", label: "ملعب غولف" },
      { icon: "🏊", label: "مسبح خاص" },
      { icon: "💆", label: "سبا عالمي" },
      { icon: "🍽️", label: "مطاعم فاخرة" },
      { icon: "🏋️", label: "مركز لياقة" },
      { icon: "🎾", label: "ملاعب تنس" },
      { icon: "🚤", label: "رحلات بحرية" },
    ],
    rooms: [
      { name: "غرفة ديلوكس", price: 150, description: "غرفة فاخرة مع إطلالة على البحر" },
      { name: "جناح جونيور", price: 220, description: "جناح واسع مع صالة جلوس مستقلة" },
      { name: "فيلا خاصة", price: 400, description: "فيلا مستقلة مع مسبح خاص" },
    ],
  },
];

export function getHotelBySlug(slug: string): HotelDetail | undefined {
  return allHotels.find((h) => h.slug === slug);
}

export function getHotelById(id: number): HotelDetail | undefined {
  return allHotels.find((h) => h.id === id);
}

