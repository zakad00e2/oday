// ─── Trips System Data Models ───────────────────────────────────────────────

export interface TripOption {
    id: string;
    nameAr: string;
    nameEn: string;
    descriptionAr: string;
    descriptionEn: string;
    price: number;           // 0 = placeholder / TBD
    maxQuantity?: number;    // if user can select quantity (e.g. buggy count)
    capacityLabelAr?: string;  // e.g. "شخص واحد"
    capacityLabelEn?: string;  // e.g. "1 person"
}

export interface TripAddOn {
    id: string;
    nameAr: string;
    nameEn: string;
    price: number;           // 0 = placeholder / TBD
    descriptionAr: string;
    descriptionEn: string;
    icon?: string;           // emoji
}

export interface TripSchedule {
    startTime: string;       // e.g. "08:00 AM"
    endTime: string;         // e.g. "04:00 PM"
    durationAr: string;      // e.g. "8 ساعات"
    durationEn: string;      // e.g. "8 hours"
    frequencyAr: string;     // e.g. "يومياً"
    frequencyEn: string;     // e.g. "Daily"
}

export interface TripDetail {
    slug: string;
    titleAr: string;
    titleEn: string;
    taglineAr: string;
    taglineEn: string;
    descriptionAr: string;
    descriptionEn: string;
    heroImage: string;
    galleryImages: string[];
    youtubeUrl: string;
    schedule: TripSchedule;
    includesAr: string[];
    includesEn: string[];
    essentialsAr: string[];
    essentialsEn: string[];
    options: TripOption[];
    addOns: TripAddOn[];
    startingPrice: number;   // 0 = placeholder / TBD
    bookingFields: string[]; // fields to show in the booking form
}
