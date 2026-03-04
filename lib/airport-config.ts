// ─── Airport Coordination Config ────────────────────────────────
// Edit these values to change pricing, WhatsApp target, etc.

/** WhatsApp number for receiving bookings (international format, no + or spaces) */
export const ADMIN_WHATSAPP = "201032549630";

/** Base price for 24-hour visa service (USD) */
export const price24 = 60;

/** Base price for 72-hour visa service (USD) */
export const price72 = 35;

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
