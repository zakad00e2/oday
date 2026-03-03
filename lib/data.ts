import { Hotel, Trip, AddOn, PromoCode } from "./types";

// ─── Hotels ─────────────────────────────────────────────────────────────────

export const hotels: Hotel[] = [
  {
    id: "hotel-1",
    name: "منتجع ريكسوس شرم الشيخ",
    location: "شرم الشيخ",
    stars: 5,
    basePricePerNight: 850,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    ],
    features: ["إطلالة بحرية", "سبا وعافية", "مسبح لا متناهي", "مطاعم عالمية"],
    description: "منتجع فاخر على شاطئ البحر الأحمر مع خدمة شاملة وإطلالات ساحرة.",
  },
  {
    id: "hotel-2",
    name: "فندق ستيلا دي ماري الغردقة",
    location: "الغردقة",
    stars: 4,
    basePricePerNight: 620,
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80",
    ],
    features: ["شاطئ خاص", "أنشطة مائية", "نادي أطفال", "Wi-Fi مجاني"],
    description: "إقامة راقية مع شاطئ خاص وأنشطة مائية متنوعة للعائلات والأزواج.",
  },
  {
    id: "hotel-3",
    name: "فندق موفنبيك العين السخنة",
    location: "العين السخنة",
    stars: 5,
    basePricePerNight: 750,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
    ],
    features: ["حمام سباحة ساخن", "مركز لياقة", "مطعم بوفيه", "موقف سيارات"],
    description: "ملاذ هادئ على ساحل البحر الأحمر مع مرافق عصرية وخدمة متميزة.",
  },
  {
    id: "hotel-4",
    name: "فندق كمبينسكي سوما باي",
    location: "الغردقة",
    stars: 5,
    basePricePerNight: 980,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    ],
    features: ["غوص وسنوركل", "ملعب غولف", "مسبح خاص", "خدمة غرف 24/7"],
    description: "تجربة فندقية استثنائية تجمع بين الفخامة والطبيعة الخلابة.",
  },
  {
    id: "hotel-5",
    name: "فندق هيلتون مرسى مطروح",
    location: "مرسى مطروح",
    stars: 4,
    basePricePerNight: 550,
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    ],
    features: ["شاطئ رملي", "مطعم بحري", "ملعب تنس", "خدمة نقل"],
    description: "فندق أنيق يطل على أجمل شواطئ البحر المتوسط في مرسى مطروح.",
  },
  {
    id: "hotel-6",
    name: "فندق سوفيتل الأقصر",
    location: "الأقصر",
    stars: 5,
    basePricePerNight: 700,
    images: [
      "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
    ],
    features: ["إطلالة على النيل", "سبا فاخر", "حديقة استوائية", "مسبح أوليمبي"],
    description: "فندق فاخر على ضفاف النيل بالقرب من المعابد الأثرية.",
  },
];

// ─── Trips ──────────────────────────────────────────────────────────────────

export const trips: Trip[] = [
  {
    id: "trip-1",
    title: "رحلة سفاري الصحراء البيضاء",
    city: "الواحات",
    pricePerPerson: 450,
    duration: "يومان",
    images: [
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80",
    ],
    included: ["نقل بسيارات 4×4", "تخييم", "وجبات", "مرشد سياحي"],
    description: "استكشف جمال الصحراء البيضاء مع تخييم تحت النجوم ورحلة جيب مثيرة.",
  },
  {
    id: "trip-2",
    title: "جولة في واحة سيوة",
    city: "سيوة",
    pricePerPerson: 600,
    duration: "3 أيام",
    images: [
      "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=800&q=80",
    ],
    included: ["نقل", "إقامة", "وجبات", "جولة معبد آمون"],
    description: "اكتشف سحر سيوة: عيون المياه، بحيرة الملح، ومعبد آمون الشهير.",
  },
  {
    id: "trip-3",
    title: "رحلة نيلية الأقصر - أسوان",
    city: "الأقصر",
    pricePerPerson: 800,
    duration: "4 أيام",
    images: [
      "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80",
    ],
    included: ["رحلة نيلية", "وجبات كاملة", "جولات أثرية", "مرشد سياحي"],
    description: "أبحر في النيل واستمتع بزيارة المعابد الفرعونية والمشاهد الخلابة.",
  },
  {
    id: "trip-4",
    title: "رحلة الفيوم وبحيرة قارون",
    city: "الفيوم",
    pricePerPerson: 250,
    duration: "يوم واحد",
    images: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
    ],
    included: ["نقل", "غداء", "دليل سياحي"],
    description: "زيارة وادي الريان وشلالاته، مع جولة في بحيرة قارون والمناطق المحيطة.",
  },
  {
    id: "trip-5",
    title: "رحلة إلى جبل موسى وسانت كاترين",
    city: "سيناء",
    pricePerPerson: 500,
    duration: "يومان",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    ],
    included: ["نقل", "إقامة", "إفطار", "مرشد جبلي"],
    description: "تسلق جبل موسى لمشاهدة شروق الشمس وزيارة دير سانت كاترين التاريخي.",
  },
  {
    id: "trip-6",
    title: "جولة الإسكندرية الساحلية",
    city: "الإسكندرية",
    pricePerPerson: 200,
    duration: "يوم واحد",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    ],
    included: ["نقل", "غداء بحري", "دليل سياحي"],
    description: "زيارة قلعة قايتباي، مكتبة الإسكندرية، كورنيش البحر والمطاعم البحرية.",
  },
  {
    id: "trip-7",
    title: "رحلة غوص في دهب",
    city: "دهب",
    pricePerPerson: 350,
    duration: "يوم واحد",
    images: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
    ],
    included: ["معدات غوص", "مدرب محترف", "غداء", "نقل"],
    description: "تجربة غوص مذهلة في البلو هول وأجمل مواقع الغوص في دهب.",
  },
  {
    id: "trip-8",
    title: "جولة أهرامات الجيزة والمتحف المصري",
    city: "القاهرة",
    pricePerPerson: 300,
    duration: "يوم واحد",
    images: [
      "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=80",
    ],
    included: ["نقل", "تذاكر دخول", "مرشد أثري", "غداء"],
    description: "زيارة أهرامات الجيزة وأبو الهول والمتحف المصري الكبير.",
  },
];

// ─── Add-ons ────────────────────────────────────────────────────────────────

export const addOns: AddOn[] = [
  {
    id: "addon-1",
    name: "تذكرة طيران داخلي",
    type: "flight",
    pricingModel: "perPerson",
    price: 1200,
    description: "تذكرة طيران ذهاب وعودة داخل مصر",
    icon: "✈️",
  },
  {
    id: "addon-2",
    name: "نقل من المطار",
    type: "transfer",
    pricingModel: "fixed",
    price: 350,
    description: "نقل خاص من وإلى المطار بسيارة مكيفة",
    icon: "🚗",
  },
  {
    id: "addon-3",
    name: "تأمين سفر شامل",
    type: "insurance",
    pricingModel: "perPerson",
    price: 150,
    description: "تأمين صحي وسفر شامل لمدة الرحلة",
    icon: "🛡️",
  },
  {
    id: "addon-4",
    name: "إفطار يومي",
    type: "other",
    pricingModel: "perNight",
    price: 120,
    description: "بوفيه إفطار مفتوح يومياً في الفندق",
    icon: "🍳",
  },
  {
    id: "addon-5",
    name: "جلسة سبا وتدليك",
    type: "other",
    pricingModel: "perPerson",
    price: 400,
    description: "جلسة سبا وتدليك فاخرة لكل شخص",
    icon: "💆",
  },
  {
    id: "addon-6",
    name: "تصوير احترافي",
    type: "other",
    pricingModel: "fixed",
    price: 800,
    description: "مصور محترف لتوثيق أجمل لحظات رحلتك",
    icon: "📸",
  },
];

// ─── Promo Codes ────────────────────────────────────────────────────────────

export const promoCodes: PromoCode[] = [
  { code: "ODAY10", type: "percentage", value: 10 },
  { code: "ODAY20", type: "percentage", value: 20 },
  { code: "SAVE500", type: "fixed", value: 500 },
  { code: "WELCOME", type: "percentage", value: 15 },
];
