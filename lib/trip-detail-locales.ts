export interface TripDetailLocaleEntry {
  tagline: string;
  description: string;
  duration: string;
  frequency: string;
  includes: string[];
  options?: Record<string, { description: string; capacityLabel?: string }>;
  addOns?: Record<string, { description: string }>;
}

export const tripDetailEn: Record<string, TripDetailLocaleEntry> = {
  "ras-mohammed-yacht": {
    tagline: "Sail across the Red Sea and discover two of Sharm El Sheikh's most beautiful marine spots.",
    description:
      "Start your day with a premium yacht trip from Sharm El Sheikh to Ras Mohammed National Park and White Island. After hotel pickup, you head to the marina and board your boat for a full day on the water. The trip includes three scenic stops for swimming and snorkeling among coral reefs and colorful fish, with optional diving under professional supervision. You'll also visit the famous White Island with its bright sandbanks and clear turquoise water, then enjoy lunch on board before returning to the marina and back to your hotel.",
    duration: "8 hours",
    frequency: "Daily",
    includes: [
      "Round-trip hotel transfers",
      "Lunch on board",
      "Soft drinks and water",
      "Snorkeling equipment",
      "Professional marine guide",
      "Marine insurance",
    ],
    options: {
      "yacht-luxury-3floor": { description: "Spacious three-deck yacht with a sun deck and air-conditioned indoor lounge" },
      "yacht-sina-dream": { description: "Elegant sailing yacht with a calm, romantic atmosphere" },
      "yacht-vip": { description: "Our most premium yacht with private-style service and upscale hospitality" },
    },
    addOns: {
      "diving-addon": { description: "Dive with a professional instructor and explore the Red Sea below the surface" },
    },
  },
  "desert-safari-buggy": {
    tagline: "A thrilling desert ride through open valleys, dunes, and unforgettable sunset views.",
    description:
      "Head into the desert for an action-packed buggy adventure in Sharm El Sheikh. Choose between beach buggy and car buggy options, then drive through sweeping sand trails and mountain valleys with your guide. The trip combines adrenaline, desert scenery, and a glimpse into Bedouin life, making it a great fit for travelers who want a more active experience.",
    duration: "7 hours",
    frequency: "Daily",
    includes: [
      "Round-trip hotel transfers",
      "Camel ride",
      "Drinks (Bedouin tea)",
      "Professional safari guide",
      "Full safety gear",
    ],
    options: {
      "buggy-single": { description: "Single buggy for one rider", capacityLabel: "1 person" },
      "buggy-double": { description: "Double buggy for two riders", capacityLabel: "2 people" },
      "car-buggy-2": { description: "More powerful two-seater buggy car", capacityLabel: "2 people" },
      "car-buggy-4": { description: "Family buggy car for up to four people", capacityLabel: "4 people" },
    },
    addOns: {
      "bedouin-dinner": { description: "Traditional Bedouin dinner with a folklore show under the stars" },
    },
  },
  "water-sports": {
    tagline: "High-energy water fun on the Red Sea, from parasailing to banana boat rides.",
    description:
      "Enjoy some of Sharm El Sheikh's most popular water activities in one exciting experience. Choose from parasailing, banana boat, and tube rides for a mix of speed, views, and fun on the water. Each activity is organized with safety equipment and professional supervision.",
    duration: "Varies by activity",
    frequency: "Daily",
    includes: [
      "Full safety equipment",
      "Professional instructor",
      "Marine insurance",
    ],
    options: {
      "parasail-single": { description: "Solo parasailing flight above the sea" },
      "parasail-double": { description: "Double parasailing flight for two people" },
      "banana-boat": { description: "Fun group ride packed with laughter and splashes" },
      "tuba-ride": { description: "Exciting tube ride across the waves" },
    },
    addOns: {
      "transfers-ws": { description: "Air-conditioned hotel transfer service" },
    },
  },
  "sunset-dinner-cruise": {
    tagline: "An elegant evening on the water with dinner, music, and sunset views.",
    description:
      "Spend a memorable evening aboard a stylish yacht in Sharm El Sheikh. Watch the sunset over the Red Sea while enjoying dinner in a calm and romantic atmosphere. This trip is ideal for couples, families, and anyone looking for a more relaxed premium experience.",
    duration: "4.5 hours",
    frequency: "Daily",
    includes: [
      "Round-trip hotel transfers",
      "Open buffet dinner",
      "Soft drinks and water",
      "Live music on board",
      "Marine insurance",
    ],
    options: {
      "dinner-yacht-luxury": { description: "Spacious yacht with air-conditioned indoor lounge and open deck" },
      "dinner-yacht-sina": { description: "Sina Dream sailing yacht with a quiet romantic vibe" },
    },
  },
  "submarine-experience": {
    tagline: "See the Red Sea below the surface without getting wet.",
    description:
      "Step inside a real submarine-style experience and admire coral reefs and tropical fish through panoramic underwater windows. It's an easy, family-friendly activity for travelers who want to explore marine life without swimming or diving.",
    duration: "1.5 hours",
    frequency: "Several departures daily",
    includes: ["Submarine entry ticket", "Specialist guide", "Insurance"],
  },
  "dolphin-show": {
    tagline: "Watch one of the sea's smartest animals perform a fun family show.",
    description:
      "Enjoy an entertaining dolphin show in Sharm El Sheikh with impressive tricks and a lively atmosphere suitable for all ages. It's a simple, family-friendly outing that mixes fun, learning, and great photo opportunities.",
    duration: "2 hours",
    frequency: "Daily",
    includes: ["Show entry ticket", "Premium seat"],
    addOns: {
      "transfers-dolphin": { description: "Round-trip hotel transfers" },
    },
  },
  "albatros-aqua-park": {
    tagline: "A full day of water slides, pools, and family fun.",
    description:
      "Spend the day at Albatros Aqua Park, one of Sharm El Sheikh's most popular family attractions. Enjoy a wide variety of slides, pools for adults and children, and dedicated splash zones for younger guests. It's an easy all-day option for families and groups.",
    duration: "7 hours",
    frequency: "Daily",
    includes: [
      "Aqua park entry ticket",
      "Access to all water games",
      "Lunch",
    ],
    addOns: {
      "transfers-aqua": { description: "Round-trip hotel transfers" },
    },
  },
  "shore-diving": {
    tagline: "Dive into coral-filled waters straight from the shoreline.",
    description:
      "Experience guided shore diving at some of Sharm El Sheikh's best coastal dive spots. With full equipment and a professional instructor, this trip suits both beginners and experienced divers looking to explore the Red Sea's rich underwater life.",
    duration: "4 hours",
    frequency: "Daily",
    includes: [
      "Full diving equipment",
      "Professional diving instructor",
      "Souvenir diving certificate",
      "Marine insurance",
    ],
    addOns: {
      "transfers-diving": { description: "Round-trip hotel transfers" },
    },
  },
  "sharm-city-tour": {
    tagline: "Discover the landmarks, markets, and local atmosphere of Sharm El Sheikh.",
    description:
      "Take a guided city tour through Sharm El Sheikh's best-known landmarks and neighborhoods. Visit the Old Market, the Heavenly Mosque, the Heavenly Cathedral, Naama Bay, and well-known cafes and restaurants while learning more about the city's culture and character.",
    duration: "8 hours",
    frequency: "Daily",
    includes: ["Round-trip hotel transfers", "Local tour guide", "Entry to attractions"],
  },
};
