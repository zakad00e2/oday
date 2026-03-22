// Airport Coordination Config
// Edit these values to change pricing, WhatsApp target, etc.

/** WhatsApp number for receiving bookings (international format, no + or spaces) */
export const ADMIN_WHATSAPP = "201032549630";

/** Nationality pricing catalog for security approvals */
export const NATIONALITY_OPTIONS = [
      { id: "palestinian", labelAr: "الفلسطيني", labelEn: "Palestinian", price24: 60, price72: 35 },
    {
        id: "palestinian-sharm-only",
        labelAr: "الفلسطيني (دخول شرم الشيخ فقط)",
        labelEn: "Palestinian (Sharm El Sheikh entry only)",
        price24: 50,
        price72: 30,
    },
     {
        id: "palestinian-syrian",
        labelAr: "فلسطيني سوري",
        labelEn: "Palestinian Syrian",
        price24: 100,
        price72: 75,
    },
        { id: "syrian", labelAr: "السوري", labelEn: "Syrian", price24: 95, price72: 70 },
    { id: "lebanese", labelAr: "اللبناني", labelEn: "Lebanese", price24: 90, price72: 65 },
    { id: "iraqi", labelAr: "العراقي", labelEn: "Iraqi", price24: 95, price72: 70 },
    { id: "iraqi-document", labelAr: "وثيقة عراق", labelEn: "Iraqi Document", price24: 100, price72: 75 },
    { id: "libyan", labelAr: "الليبي", labelEn: "Libyan", price24: 75, price72: 50 },
    { id: "yemeni", labelAr: "اليمني", labelEn: "Yemeni", price24: 90, price72: 65 },

    { id: "african", labelAr: "الافريقي", labelEn: "African", price24: 80, price72: 55 },
    { id: "asian", labelAr: "الاسيوي", labelEn: "Asian", price24: 85, price72: 60 },
    {
        id: "stan-group",
        labelAr: "مجموعة ستان (أوزبكستان - قيرغستان - طاجكستان - باكستان)",
        labelEn: "Stan Group (Uzbekistan - Kyrgyzstan - Tajikistan - Pakistan)",
        price24: 95,
        price72: 70,
    },
    { id: "sudanese", labelAr: "السوداني", labelEn: "Sudanese", price24: 85, price72: 60 },
    {
        id: "saint-kitts-dominica-group",
        labelAr: "مجموعة سانت كيتس + دومينيت",
        labelEn: "Saint Kitts + Dominica Group",
        price24: 110,
        price72: 80,
    },
  
   
] as const;

export type NationalityOption = (typeof NATIONALITY_OPTIONS)[number];
export type NationalityId = NationalityOption["id"];

/** Extra fee when using a non-EgyptAir airline (USD) */
export const EXTRA_AIRLINE_FEE = 100;

/** Accepted file types for document upload */
export const ACCEPTED_FILE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
];

/** Accepted file extensions (for the input accept attribute) */
export const ACCEPTED_EXTENSIONS = ".jpg,.jpeg,.png,.pdf";

/** Maximum file size in bytes (10 MB) */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Predefined list of airlines */
export const AIRLINES = [
    { id: "egyptair", labelAr: "مصر للطيران", labelEn: "EgyptAir", isEgyptAir: true },
    { id: "qatar", labelAr: "القطرية", labelEn: "Qatar Airways", isEgyptAir: false },
    { id: "emirates", labelAr: "الإماراتية", labelEn: "Emirates", isEgyptAir: false },
    { id: "aegean", labelAr: "اليونانية", labelEn: "Aegean Airlines", isEgyptAir: false },
    { id: "turkish", labelAr: "التركية", labelEn: "Turkish Airlines", isEgyptAir: false },
    { id: "oman", labelAr: "العمانية", labelEn: "Oman Air", isEgyptAir: false },
    { id: "other", labelAr: "أخرى", labelEn: "Other", isEgyptAir: false },
] as const;

export type AirlineId = (typeof AIRLINES)[number]["id"];
