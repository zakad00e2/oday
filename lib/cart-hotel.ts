export interface CartHotelAddOn {
  name: string;
  nameAr?: string;
  nameEn?: string;
  price: number;
}

export interface CartHotelRoomSelection {
  id: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  pricePerNight: number;
  count: number;
}

type CartHotelLike = {
  pricePerNight?: number;
  roomsCount?: number;
  roomName?: string;
  roomNameAr?: string;
  roomNameEn?: string;
  selectedRooms?: CartHotelRoomSelection[];
  selectedAddOns?: CartHotelAddOn[];
} | null | undefined;

function normalizeSelectedRoom(
  room: CartHotelRoomSelection,
): CartHotelRoomSelection | null {
  const count = Math.max(0, room.count || 0);
  if (count === 0) {
    return null;
  }

  return {
    id: room.id,
    name: room.name,
    nameAr: room.nameAr,
    nameEn: room.nameEn,
    pricePerNight: Math.max(0, room.pricePerNight || 0),
    count,
  };
}

export function getCartHotelSelectedRooms(
  hotel: CartHotelLike,
): CartHotelRoomSelection[] {
  if (!hotel) {
    return [];
  }

  const normalizedSelectedRooms = (hotel.selectedRooms ?? [])
    .map(normalizeSelectedRoom)
    .filter((room): room is CartHotelRoomSelection => Boolean(room));

  if (normalizedSelectedRooms.length > 0) {
    return normalizedSelectedRooms;
  }

  const hasLegacyRoomSelection =
    Boolean(hotel.roomName || hotel.roomNameAr || hotel.roomNameEn) ||
    typeof hotel.pricePerNight === "number";

  if (!hasLegacyRoomSelection) {
    return [];
  }

  return [
    {
      id: "legacy-room",
      name: hotel.roomName ?? hotel.roomNameAr ?? hotel.roomNameEn ?? "Room",
      nameAr: hotel.roomNameAr,
      nameEn: hotel.roomNameEn,
      pricePerNight: Math.max(0, hotel.pricePerNight || 0),
      count: Math.max(1, hotel.roomsCount || 1),
    },
  ];
}

export function getCartHotelRoomCount(hotel: CartHotelLike): number {
  return getCartHotelSelectedRooms(hotel).reduce(
    (sum, room) => sum + room.count,
    0,
  );
}

export function getCartHotelSelectedRoomName(
  room: CartHotelRoomSelection,
  language: "ar" | "en",
): string {
  return language === "ar"
    ? room.nameAr ?? room.name
    : room.nameEn ?? room.name;
}

export function getCartHotelBaseCost(
  hotel: CartHotelLike,
  nights: number,
): number {
  const safeNights = Math.max(1, nights || 1);
  return getCartHotelSelectedRooms(hotel).reduce(
    (sum, room) => sum + room.pricePerNight * room.count * safeNights,
    0,
  );
}

export function getCartHotelAddOnsUnitTotal(hotel: CartHotelLike): number {
  return (hotel?.selectedAddOns ?? []).reduce(
    (sum, addOn) => sum + addOn.price,
    0,
  );
}

export function getCartHotelAddOnsCost(
  hotel: CartHotelLike,
  nights: number,
): number {
  const safeNights = Math.max(1, nights || 1);
  return (
    getCartHotelAddOnsUnitTotal(hotel) *
    getCartHotelRoomCount(hotel) *
    safeNights
  );
}
