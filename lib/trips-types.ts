// ─── Trips System Data Models ───────────────────────────────────────────────

export interface TripOption {
    id: string;
    nameAr: string;
    nameEn: string;
    descriptionAr: string;
    price: number;           // 0 = placeholder / TBD
    maxQuantity?: number;    // if user can select quantity (e.g. buggy count)
    capacityLabel?: string;  // e.g. "شخص واحد" or "شخصين"
}

export interface TripAddOn {
    id: string;
    nameAr: string;
    nameEn: string;
    price: number;           // 0 = placeholder / TBD
    descriptionAr: string;
    icon?: string;           // emoji
}

export interface TripSchedule {
    startTime: string;       // e.g. "08:00 AM"
    endTime: string;         // e.g. "04:00 PM"
    duration: string;        // e.g. "8 ساعات"
    frequency: string;       // e.g. "يومياً" or "حسب الجدول"
}

export interface TripDetail {
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
    startingPrice: number;   // 0 = placeholder / TBD
    bookingFields: string[]; // fields to show in the booking form
}
