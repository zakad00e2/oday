export interface HotelDetailLocaleEntry {
  name: string;
  city: string;
  description: string;
  amenities: string[];
  rooms: { name: string; description: string }[];
}

export const hotelDetailEn: Record<string, HotelDetailLocaleEntry> = {
  "rexos-sharm": {
    name: "Rixos Sharm El Sheikh Resort",
    city: "Sharm El Sheikh",
    description:
      "Rixos Sharm El Sheikh is one of the Red Sea coast's standout luxury resorts. It enjoys a prime beachfront setting with a clean private beach and a calm atmosphere. The resort offers a world-class all-inclusive experience with multiple restaurants, premium facilities, and around-the-clock service.",
    amenities: [
      "Infinity pool",
      "Private beach",
      "Spa and wellness center",
      "Multiple restaurants",
      "Sports courts",
      "Entertainment programs",
      "Fitness club",
      "Transfer service",
    ],
    rooms: [
      { name: "Luxury Double Room", description: "2 guests" },
      { name: "Sea View Room", description: "2 guests + 1 child" },
      { name: "Luxury Suite", description: "4 guests" },
    ],
  },
  "stella-di-mare-hurghada": {
    name: "Stella Di Mare Hurghada Hotel",
    city: "Hurghada",
    description:
      "Stella Di Mare Hurghada is a strong choice for families and couples looking for an upscale beach stay with a private shore and plenty of water activities. The hotel sits directly on the coast and offers easy access to snorkeling, diving, and leisure facilities.",
    amenities: [
      "Multiple pools",
      "Private beach",
      "Diving and snorkeling",
      "Kids club",
      "Water sports",
      "Restaurants and cafes",
      "Leisure courts",
      "Free Wi-Fi",
    ],
    rooms: [
      { name: "Double Room", description: "2 guests" },
      { name: "Family Room", description: "4 guests + 2 children" },
      { name: "Sea View Room", description: "2 guests + 1 child" },
    ],
  },
  "movenpick-ain-sokhna": {
    name: "Movenpick Ain Sokhna Hotel",
    city: "Ain Sokhna",
    description:
      "Movenpick Ain Sokhna is a peaceful Red Sea escape just about an hour from Cairo. It combines modern facilities, polished service, and a scenic coastal setting, making it a practical choice for weekend breaks and short getaways.",
    amenities: [
      "Heated pool",
      "Fitness center",
      "Buffet restaurant",
      "Free parking",
      "Private beach",
      "Spa services",
      "Free Wi-Fi",
      "Sports courts",
    ],
    rooms: [
      { name: "Double Room", description: "2 guests" },
      { name: "Sea View Room", description: "2 guests + 1 child" },
      { name: "Family Suite", description: "4 guests + 1 child" },
    ],
  },
  "kempinski-soma-bay": {
    name: "Kempinski Soma Bay Hotel",
    city: "Hurghada",
    description:
      "Kempinski Soma Bay delivers a high-end resort experience that combines luxury service with the natural beauty of Soma Bay. Guests enjoy premium hospitality, easy access to diving, and a setting that suits both relaxation and activity-filled stays.",
    amenities: [
      "Full diving center",
      "Golf course",
      "Private pool",
      "World-class spa",
      "Fine dining restaurants",
      "Fitness center",
      "Tennis courts",
      "Boat excursions",
    ],
    rooms: [
      { name: "Deluxe Room", description: "2 guests" },
      { name: "Junior Suite", description: "2 guests + 2 children" },
      { name: "Private Villa", description: "6 guests" },
    ],
  },
};

export const hotelAddOnsEn = {
  sea_view: { name: "Sea View", description: "Room with a direct sea view" },
  pool_view: { name: "Pool View", description: "Room overlooking the outdoor pool" },
  first_row: { name: "Front Row by the Sea", description: "Prime location directly in the first row facing the beach" },
};
