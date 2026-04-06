"use client";

import { useEffect, useState } from "react";
import FlexibleImage from "@/components/FlexibleImage";
import FileUpload from "@/components/admin/FileUpload";
import {
  HotelServiceError,
  createHotel,
  deleteHotel,
  getHotelById,
  listHotels,
  slugifyHotel,
  updateHotel,
  type HotelDestination,
  type HotelMutationInput,
  type HotelRecord,
} from "@/lib/hotel-service";

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
  imageAssetIdsByUrl?: Record<string, string[]>;
}

const MAX_MAIN_IMAGES = 5;
const MAX_GALLERY_IMAGES = 10;

const mockHotels: Hotel[] = [
  {
    id: "1",
    slug: "rixos-sharm",
    nameAr: "Rixos Sharm Resort",
    nameEn: "Rixos Sharm Resort",
    cityAr: "Sharm El Sheikh",
    cityEn: "Sharm El Sheikh",
    descriptionAr:
      "Luxury beachfront resort with private beach access, multiple pools, and premium family-friendly amenities.",
    descriptionEn:
      "Luxury beachfront resort with private beach access, multiple pools, and premium family-friendly amenities.",
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
      { labelAr: "Infinity pool", labelEn: "Infinity pool" },
      { labelAr: "Private beach", labelEn: "Private beach" },
      { labelAr: "Spa", labelEn: "Spa" },
    ],
    rooms: [
      { nameAr: "Luxury Double Room", nameEn: "Luxury Double Room", price: 120, descriptionAr: "2 guests", descriptionEn: "2 guests" },
      { nameAr: "Sea View Room", nameEn: "Sea View Room", price: 160, descriptionAr: "2 guests + 1 child", descriptionEn: "2 guests + 1 child" },
    ],
    roomAddOns: [
      { nameAr: "Sea View", nameEn: "Sea View", price: 40, descriptionAr: "Direct sea view", descriptionEn: "Direct sea view" },
      { nameAr: "Front Row", nameEn: "Front Row", price: 60, descriptionAr: "Closer to the beach", descriptionEn: "Closer to the beach" },
    ],
  },
  {
    id: "2",
    slug: "stella-hurghada",
    nameAr: "Stella Hurghada Hotel",
    nameEn: "Stella Hurghada Hotel",
    cityAr: "Hurghada",
    cityEn: "Hurghada",
    descriptionAr:
      "Upscale Red Sea stay with private beach access and a broad range of water activities.",
    descriptionEn:
      "Upscale Red Sea stay with private beach access and a broad range of water activities.",
    mainImages: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80"],
    gallery: [],
    youtubeUrl: "",
    stars: 4,
    price: 80,
    filterTag: "lowest_price",
    amenities: [
      { labelAr: "Multiple pools", labelEn: "Multiple pools" },
      { labelAr: "Private beach", labelEn: "Private beach" },
      { labelAr: "Kids club", labelEn: "Kids club" },
    ],
    rooms: [
      { nameAr: "Double Room", nameEn: "Double Room", price: 80, descriptionAr: "2 guests", descriptionEn: "2 guests" },
      { nameAr: "Family Room", nameEn: "Family Room", price: 120, descriptionAr: "4 guests + 2 children", descriptionEn: "4 guests + 2 children" },
    ],
    roomAddOns: [{ nameAr: "Pool View", nameEn: "Pool View", price: 20, descriptionAr: "Outdoor pool view", descriptionEn: "Outdoor pool view" }],
  },
  {
    id: "3",
    slug: "movenpick-ain-sokhna",
    nameAr: "Movenpick Ain Sokhna Hotel",
    nameEn: "Movenpick Ain Sokhna Hotel",
    cityAr: "Ain Sokhna",
    cityEn: "Ain Sokhna",
    descriptionAr:
      "Peaceful Red Sea escape suited for weekend breaks close to Cairo.",
    descriptionEn:
      "Peaceful Red Sea escape suited for weekend breaks close to Cairo.",
    mainImages: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=80"],
    gallery: [],
    youtubeUrl: "",
    stars: 5,
    price: 100,
    filterTag: "most_booked",
    discount: "20%",
    originalPrice: 125,
    amenities: [
      { labelAr: "Heated pool", labelEn: "Heated pool" },
      { labelAr: "Fitness center", labelEn: "Fitness center" },
      { labelAr: "Free parking", labelEn: "Free parking" },
    ],
    rooms: [
      { nameAr: "Double Room", nameEn: "Double Room", price: 100, descriptionAr: "2 guests", descriptionEn: "2 guests" },
      { nameAr: "Family Suite", nameEn: "Family Suite", price: 180, descriptionAr: "4 guests + 1 child", descriptionEn: "4 guests + 1 child" },
    ],
    roomAddOns: [],
  },
  {
    id: "4",
    slug: "kempinski-soma-bay",
    nameAr: "Kempinski Soma Bay Hotel",
    nameEn: "Kempinski Soma Bay Hotel",
    cityAr: "Hurghada",
    cityEn: "Hurghada",
    descriptionAr:
      "High-end resort experience combining premium hospitality with natural coastal scenery.",
    descriptionEn:
      "High-end resort experience combining premium hospitality with natural coastal scenery.",
    mainImages: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80"],
    gallery: [],
    youtubeUrl: "",
    stars: 5,
    price: 150,
    filterTag: "highest_rated",
    amenities: [
      { labelAr: "Diving center", labelEn: "Diving center" },
      { labelAr: "Golf course", labelEn: "Golf course" },
      { labelAr: "World-class spa", labelEn: "World-class spa" },
    ],
    rooms: [
      { nameAr: "Deluxe Room", nameEn: "Deluxe Room", price: 150, descriptionAr: "2 guests", descriptionEn: "2 guests" },
      { nameAr: "Private Villa", nameEn: "Private Villa", price: 400, descriptionAr: "6 guests", descriptionEn: "6 guests" },
    ],
    roomAddOns: [{ nameAr: "Suite Upgrade", nameEn: "Suite Upgrade", price: 90, descriptionAr: "Larger room with better view", descriptionEn: "Larger room with better view" }],
  },
];

const emptyHotel: Omit<Hotel, "id"> = {
  slug: "",
  nameAr: "",
  nameEn: "",
  cityAr: "شرم الشيخ",
  cityEn: "Sharm El Sheikh",
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
  imageAssetIdsByUrl: {},
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
    imageAssetIdsByUrl: Object.fromEntries(
      Object.entries(rest.imageAssetIdsByUrl ?? {}).map(([url, assetIds]) => [url, [...assetIds]]),
    ),
  };
}

function getCoverImage(hotel: Pick<Hotel, "mainImages" | "gallery">) {
  return hotel.mainImages[0] || hotel.gallery[0] || "";
}

const DESTINATION_OPTIONS: Array<{
  value: HotelDestination;
  aliases: string[];
}> = [
  { value: "SHARM_EL_SHEIKH", aliases: ["شرم الشيخ", "sharm", "sharm el sheikh", "sharm elsheikh"] },
  { value: "EL_GHARDQA", aliases: ["الغردقة", "hurghada", "el ghardqa"] },
  { value: "DAHAB", aliases: ["دهب", "dahab"] },
  { value: "EL_AIN_SOKHNA", aliases: ["العين السخنة", "ain sokhna", "ain el sokhna", "ain elsokhna", "el ain sokhna"] },
];

function normalizeValue(value: string) {
  return value.toLowerCase().trim().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
}

function resolveDestination(cityAr: string, cityEn: string): HotelDestination | null {
  const normalizedValues = [cityAr, cityEn].map(normalizeValue).filter(Boolean);
  const destination = DESTINATION_OPTIONS.find((option) =>
    option.aliases.some((alias) => normalizedValues.includes(normalizeValue(alias))),
  );

  return destination?.value ?? null;
}

const DESTINATION_SELECT_OPTIONS: Array<{
  value: HotelDestination;
  labelAr: string;
  labelEn: string;
}> = [
  { value: "SHARM_EL_SHEIKH", labelAr: "شرم الشيخ", labelEn: "Sharm El Sheikh" },
  { value: "DAHAB", labelAr: "دهب", labelEn: "Dahab" },
  { value: "EL_AIN_SOKHNA", labelAr: "العين السخنة", labelEn: "Ain Sokhna" },
  { value: "EL_GHARDQA", labelAr: "الغردقة", labelEn: "Hurghada" },
];

function getDestinationOption(cityAr: string, cityEn: string) {
  const destination = resolveDestination(cityAr, cityEn);

  return (
    DESTINATION_SELECT_OPTIONS.find((option) => option.value === destination) ??
    DESTINATION_SELECT_OPTIONS[0]
  );
}

function capacityLabel(capacity: number, language: "ar" | "en") {
  return language === "ar" ? `${capacity} أشخاص` : `${capacity} guests`;
}

function extractCapacity(...values: string[]) {
  for (const value of values) {
    const match = value.match(/\d+/);
    if (!match) continue;
    const parsed = Number(match[0]);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }

  return 2;
}

function mapHotelRecordToHotel(hotel: HotelRecord): Hotel {
  return {
    id: hotel.id,
    slug: hotel.slugEn || hotel.slug || hotel.id,
    nameAr: hotel.nameAr,
    nameEn: hotel.nameEn,
    cityAr: hotel.destinationLabelAr,
    cityEn: hotel.destinationLabelEn,
    descriptionAr: hotel.descriptionAr,
    descriptionEn: hotel.descriptionEn,
    mainImages: [...hotel.mainImages],
    gallery: [...hotel.gallery],
    youtubeUrl: hotel.youtubeVideoUrl,
    stars: hotel.stars,
    price: hotel.initialPrice,
    filterTag:
      hotel.ratingValue === "MOST_BOOKED"
        ? "most_booked"
        : hotel.ratingValue === "TOP_RATED"
          ? "highest_rated"
          : hotel.ratingValue === "LOWEST_PRICE"
            ? "lowest_price"
            : null,
    discount: hotel.discountPercentage ? `${hotel.discountPercentage}%` : "",
    originalPrice: hotel.originalPrice ?? undefined,
    amenities: hotel.facilitiesAr.map((labelAr, index) => ({
      labelAr,
      labelEn: hotel.facilitiesEn[index] ?? "",
    })),
    rooms: hotel.rooms.map((room) => ({
      nameAr: room.nameAr,
      nameEn: room.nameEn,
      price: room.price,
      descriptionAr: room.descriptionAr || capacityLabel(room.capacity, "ar"),
      descriptionEn: room.descriptionEn || capacityLabel(room.capacity, "en"),
    })),
    roomAddOns: hotel.addons.map((addon) => ({
      nameAr: addon.nameAr,
      nameEn: addon.nameEn,
      price: addon.price,
      descriptionAr: addon.descriptionAr,
      descriptionEn: addon.descriptionEn,
    })),
    imageAssetIdsByUrl: Object.fromEntries(
      Object.entries(hotel.imageAssetIdsByUrl ?? {}).map(([url, assetIds]) => [url, [...assetIds]]),
    ),
  };
}

function removePendingFile(files: Record<string, File>, url: string): Record<string, File> {
  if (!(url in files)) return files;

  const nextFiles = { ...files };
  delete nextFiles[url];

  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }

  return nextFiles;
}

function collectRemovedAssetIds(
  assetIdsByUrl: Record<string, string[]> | undefined,
  currentUrls: string[],
) {
  const currentUrlSet = new Set(currentUrls);

  return Array.from(
    new Set(
      Object.entries(assetIdsByUrl ?? {})
        .filter(([url]) => !currentUrlSet.has(url))
        .flatMap(([, assetIds]) => assetIds),
    ),
  );
}

function mapHotelToMutationInput(hotel: Omit<Hotel, "id">): HotelMutationInput | null {
  const destination = resolveDestination(hotel.cityAr, hotel.cityEn);
  if (!destination) return null;

  const parsedDiscount = Number.parseInt((hotel.discount ?? "").replace(/[^\d]/g, ""), 10);
  const discountPercentage =
    Number.isFinite(parsedDiscount) && parsedDiscount > 0 ? parsedDiscount : null;
  const mainImage = hotel.mainImages[0] ?? hotel.gallery[0] ?? "";
  const gallery = [
    ...hotel.mainImages.slice(1, MAX_MAIN_IMAGES),
    ...hotel.gallery.slice(0, MAX_GALLERY_IMAGES),
  ].filter(Boolean);

  return {
    destination,
    slug: slugifyHotel(hotel.slug || hotel.nameEn || hotel.nameAr),
    nameAr: hotel.nameAr.trim(),
    nameEn: hotel.nameEn.trim() || hotel.nameAr.trim(),
    descriptionAr: hotel.descriptionAr.trim(),
    descriptionEn: hotel.descriptionEn.trim() || hotel.descriptionAr.trim(),
    facilitiesAr: hotel.amenities.map((amenity) => amenity.labelAr.trim()).filter(Boolean),
    facilitiesEn: hotel.amenities.map((amenity) => amenity.labelEn.trim()).filter(Boolean),
    mainImage,
    gallery,
    initialPrice: Math.max(0, hotel.price),
    originalPrice: hotel.originalPrice && hotel.originalPrice > 0 ? hotel.originalPrice : null,
    isDiscounted: Boolean(discountPercentage),
    discountPercentage,
    stars:
      hotel.stars <= 1
        ? "ONE"
        : hotel.stars === 2
          ? "TWO"
          : hotel.stars === 3
            ? "THREE"
            : hotel.stars === 4
              ? "FOUR"
              : "FIVE",
    rating:
      hotel.filterTag === "most_booked"
        ? "MOST_BOOKED"
        : hotel.filterTag === "highest_rated"
          ? "TOP_RATED"
          : hotel.filterTag === "lowest_price"
            ? "LOWEST_PRICE"
            : "UNRATED",
    youtubeVideoUrl: hotel.youtubeUrl.trim(),
    rooms: hotel.rooms.map((room) => ({
      capacity: extractCapacity(room.descriptionAr, room.descriptionEn),
      price: Math.max(0, room.price),
      nameAr: room.nameAr.trim(),
      nameEn: room.nameEn.trim() || room.nameAr.trim(),
      descriptionAr: room.descriptionAr.trim(),
      descriptionEn: room.descriptionEn.trim() || room.descriptionAr.trim(),
    })),
    addons: hotel.roomAddOns.map((addOn) => ({
      price: Math.max(0, addOn.price),
      nameAr: addOn.nameAr.trim(),
      nameEn: addOn.nameEn.trim() || addOn.nameAr.trim(),
      descriptionAr: addOn.descriptionAr.trim(),
      descriptionEn: addOn.descriptionEn.trim() || addOn.descriptionAr.trim(),
    })),
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof HotelServiceError || error instanceof Error) {
    return error.message;
  }

  return fallback;
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
  const [mainImageFiles, setMainImageFiles] = useState<Record<string, File>>({});
  const [galleryFiles, setGalleryFiles] = useState<Record<string, File>>({});
  const [modalError, setModalError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  const localizedHotels = hotels.filter((hotel) => hotel.nameEn.trim() && hotel.descriptionEn.trim()).length;
  const totalRooms = hotels.reduce((sum, hotel) => sum + hotel.rooms.length, 0);
  const totalAmenities = hotels.reduce((sum, hotel) => sum + hotel.amenities.length, 0);
  const totalRoomAddOns = hotels.reduce((sum, hotel) => sum + hotel.roomAddOns.length, 0);

  useEffect(() => {
    let mounted = true;

    const loadHotels = async () => {
      try {
        const response = await listHotels({ page: 1, limit: 100 });
        if (!mounted) return;
        setHotels(response.hotels.map(mapHotelRecordToHotel));
      } catch (error) {
        if (!mounted) return;
        setNotice({
          tone: "error",
          message: getErrorMessage(error, "تعذر تحميل الفنادق من الخادم."),
        });
      }
    };

    void loadHotels();

    return () => {
      mounted = false;
    };
  }, []);

  const resetFormState = () => {
    setForm(cloneHotel(emptyHotel));
    setAmenityInput(emptyAmenityInput);
    setRoomInput(emptyRoomInput);
    setRoomAddOnInput(emptyRoomAddOnInput);
    setMainImageFiles({});
    setGalleryFiles({});
    setMainImagesKey((value) => value + 1);
    setGalleryKey((value) => value + 1);
    setModalError(null);
  };

  const openAdd = () => {
    setEditing(null);
    resetFormState();
    setForm(cloneHotel(emptyHotel));
    setModalError(null);
    setShowModal(true);
  };

  const openEdit = (hotel: Hotel) => {
    setEditing(hotel);
    setForm(cloneHotel(hotel));
    setAmenityInput(emptyAmenityInput);
    setRoomInput(emptyRoomInput);
    setRoomAddOnInput(emptyRoomAddOnInput);
    setMainImageFiles({});
    setGalleryFiles({});
    setMainImagesKey((value) => value + 1);
    setGalleryKey((value) => value + 1);
    setModalError(null);
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

  const handleSave = async () => {
    setModalError(null);

    if (!form.nameAr.trim()) {
      setModalError("Hotel name is required.");
      return;
    }

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

    const mutationInput = mapHotelToMutationInput(payload);

    if (!mutationInput) {
      setModalError("Selected city is not supported.");
      setNotice({ tone: "error", message: "Unable to resolve the hotel destination." });
      return;
    }

    setIsSaving(true);

    try {
      const currentImageUrls = [...payload.mainImages, ...payload.gallery];
      const removedAssetIds = editing
        ? collectRemovedAssetIds(editing.imageAssetIdsByUrl, currentImageUrls)
        : [];
      const media = {
        mainImageFiles: Object.values(mainImageFiles),
        galleryFiles: Object.values(galleryFiles),
        deleteAssetIds: removedAssetIds,
      };

      const savedHotel = editing
        ? await updateHotel(editing.id, mutationInput, media)
        : await createHotel(mutationInput, media);

      const nextHotel = mapHotelRecordToHotel(
        editing ? await getHotelById(editing.id) : savedHotel,
      );

      setHotels((current) =>
        editing
          ? current.map((hotel) => (hotel.id === editing.id ? nextHotel : hotel))
          : [nextHotel, ...current],
      );

      setNotice({
        tone: "success",
        message: editing ? "Hotel changes saved successfully." : "Hotel added successfully.",
      });
      setShowModal(false);
      resetFormState();
      setEditing(null);
    } catch (error) {
      const fallbackMessage = editing
        ? "Unable to save hotel changes right now."
        : "Unable to add the hotel right now.";
      const message = getErrorMessage(error, fallbackMessage);

      setModalError(
        message === "Internal server error"
          ? editing
            ? "Server rejected the update request. Check the fields and images, then try again."
            : "Server rejected the create request. Check the required fields, then try again."
          : message,
      );
      setNotice({
        tone: "error",
        message: getErrorMessage(error, fallbackMessage),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteHotel(deleteId);
      setHotels((current) => current.filter((hotel) => hotel.id !== deleteId));
      setDeleteId(null);
      setNotice({ tone: "success", message: "Deleted hotel successfully." });
    } catch (error) {
      setNotice({
        tone: "error",
        message: getErrorMessage(error, "Unable to delete the hotel right now."),
      });
    }
  };

  const renderStars = (count: number) =>
    "\u2605".repeat(Math.max(0, Math.min(5, count))) +
    "\u2606".repeat(Math.max(0, 5 - Math.min(5, count)));

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

      {notice && (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${notice.tone === "success" ? "border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]" : "border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]"}`}>
          {notice.message}
        </div>
      )}

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
              {modalError && (
                <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]">
                  {modalError}
                </div>
              )}

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
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">المدينة</label>
                    <select
                      value={getDestinationOption(form.cityAr, form.cityEn).value}
                      onChange={(e) => {
                        const option = DESTINATION_SELECT_OPTIONS.find(
                          (item) => item.value === e.target.value,
                        );
                        if (!option) return;
                        setForm({
                          ...form,
                          cityAr: option.labelAr,
                          cityEn: option.labelEn,
                        });
                      }}
                      className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors bg-white"
                    >
                      {DESTINATION_SELECT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.labelAr}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">City in English</label>
                    <input value={getDestinationOption(form.cityAr, form.cityEn).labelEn} readOnly dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm bg-[#F9FAFB] text-[#6B7280] focus:outline-none" />
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
                            <button type="button" onClick={() => {
                              setForm((current) => ({
                                ...current,
                                mainImages: current.mainImages.filter((_, itemIndex) => itemIndex !== index),
                              }));
                              setMainImageFiles((current) => removePendingFile(current, image));
                            }} className="absolute top-1 left-1 w-5 h-5 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-xs transition-colors">×</button>
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
                        onChange={(url, file) => {
                          setForm((current) => ({
                            ...current,
                            mainImages: current.mainImages.length >= MAX_MAIN_IMAGES ? current.mainImages : [...current.mainImages, url],
                          }));
                          setMainImageFiles((current) => ({
                            ...current,
                            [url]: file,
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
                            <button type="button" onClick={() => {
                              setForm((current) => ({
                                ...current,
                                gallery: current.gallery.filter((_, itemIndex) => itemIndex !== index),
                              }));
                              setGalleryFiles((current) => removePendingFile(current, image));
                            }} className="absolute top-1 left-1 w-5 h-5 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-xs transition-colors">×</button>
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
                        onChange={(url, file) => {
                          setForm((current) => ({
                            ...current,
                            gallery: current.gallery.length >= MAX_GALLERY_IMAGES ? current.gallery : [...current.gallery, url],
                          }));
                          setGalleryFiles((current) => ({
                            ...current,
                            [url]: file,
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
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex flex-1 items-center justify-center gap-2 bg-[#111] py-2.5 rounded-xl text-sm font-medium text-white transition-colors hover:bg-[#333] disabled:cursor-not-allowed disabled:bg-[#6B7280] disabled:hover:bg-[#6B7280]"
              >
                {isSaving ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>{editing ? "جارٍ حفظ التعديلات..." : "جارٍ إضافة الفندق..."}</span>
                  </>
                ) : (
                  <span>{editing ? "حفظ التعديلات" : "إضافة الفندق"}</span>
                )}
              </button>
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
