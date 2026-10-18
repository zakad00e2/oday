export const DESTINATION_OPTIONS = [
  { value: "SHARM_EL_SHEIKH", labelAr: "شرم الشيخ", labelEn: "Sharm El Sheikh", aliases: ["شرم الشيخ", "sharm", "sharm el sheikh", "sharm elsheikh"] },
  { value: "EL_GHARDQA", labelAr: "الغردقة", labelEn: "Hurghada", aliases: ["الغردقة", "hurghada", "el ghardqa", "ghardqa"] },
  { value: "EL_AIN_SOKHNA", labelAr: "العين السخنة", labelEn: "Ain Sokhna", aliases: ["العين السخنة", "ain sokhna", "ain el sokhna", "ain elsokhna", "el ain sokhna"] },
  { value: "DAHAB", labelAr: "دهب", labelEn: "Dahab", aliases: ["دهب", "dahab"] },
  { value: "EL_GOUNA", labelAr: "الجونة", labelEn: "El Gouna", aliases: ["الجونة", "el gouna", "elgouna", "gouna"] },
  { value: "NORTH_COAST", labelAr: "الساحل الشمالي", labelEn: "North Coast", aliases: ["الساحل الشمالي", "north coast", "northcoast", "sahel"] },
  { value: "CAIRO", labelAr: "القاهرة", labelEn: "Cairo", aliases: ["القاهرة", "cairo"] },
  { value: "ALEXANDRIA", labelAr: "الإسكندرية", labelEn: "Alexandria", aliases: ["الإسكندرية", "الاسكندرية", "alexandria", "alex"] },
  { value: "SAHL_HASHEESH", labelAr: "سهل حشيش", labelEn: "Sahl Hasheesh", aliases: ["سهل حشيش", "sahl hasheesh", "sahl hesheesh", "sahl hashish"] },
  { value: "MARSA_MATROUH", labelAr: "مرسى مطروح", labelEn: "Marsa Matrouh", aliases: ["مرسى مطروح", "marsa matrouh", "mersa matruh", "matrouh"] },
  { value: "MARSA_ALAM", labelAr: "مرسى علم", labelEn: "Marsa Alam", aliases: ["مرسى علم", "marsa alam", "mersa alam"] },
  { value: "FAYOUM", labelAr: "الفيوم", labelEn: "Fayoum", aliases: ["الفيوم", "fayoum", "faiyum", "el fayoum"] },
  { value: "ASWAN", labelAr: "أسوان", labelEn: "Aswan", aliases: ["أسوان", "اسوان", "aswan", "assuan"] },
  { value: "LUXOR", labelAr: "الأقصر", labelEn: "Luxor", aliases: ["الأقصر", "الاقصر", "luxor", "el oqsor"] },
] as const;

export type Destination = (typeof DESTINATION_OPTIONS)[number]["value"];

export function getDestinationLabels(destination: string) {
  const option = DESTINATION_OPTIONS.find((item) => item.value === destination);
  return { ar: option?.labelAr ?? destination, en: option?.labelEn ?? destination };
}

const fallbackImages: Record<Destination, string> = {
  SHARM_EL_SHEIKH: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=85",
  EL_GHARDQA: "/images/hurghada.jpg",
  EL_AIN_SOKHNA: "/images/ain-sokhna.jpg",
  DAHAB: "/images/dahab-palm.jpg",
  EL_GOUNA: "/images/destinations/el-gouna.jpg",
  NORTH_COAST: "/images/destinations/north-coast.jpg",
  CAIRO: "/images/destinations/cairo.jpg",
  ALEXANDRIA: "/images/destinations/alexandria.jpg",
  SAHL_HASHEESH: "/images/destinations/sahl-hasheesh.jpg",
  MARSA_MATROUH: "/images/destinations/marsa-matrouh.jpg",
  MARSA_ALAM: "/images/destinations/marsa-alam.jpg",
  FAYOUM: "/images/destinations/fayoum.jpg",
  ASWAN: "/images/destinations/default.svg",
  LUXOR: "/images/destinations/default.svg",
};

export function getDestinationFallbackImage(destination: string) {
  return fallbackImages[destination as Destination] ?? "/images/hurghada.jpg";
}
