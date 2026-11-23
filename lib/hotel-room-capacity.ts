import type { HotelRoomRecord } from "./hotel-service";

type RoomCapacity = Pick<HotelRoomRecord, "capacity" | "adultCapacity" | "childCapacity" |
  "childrenUnder3Capacity" | "childrenUnder6Capacity" | "children6To12Capacity">;

const arabicGuests = {
  adult: ["بالغ واحد", "بالغان", "بالغين", "بالغًا"],
  child: ["طفل واحد", "طفلان", "أطفال", "طفلًا"],
  guest: ["ضيف واحد", "ضيفان", "ضيوف", "ضيفًا"],
};

const englishPlurals = { adult: "adults", child: "children", guest: "guests" };

function guestCount(count: number, guest: keyof typeof arabicGuests, ar: boolean) {
  if (!ar) return `${count} ${count === 1 ? guest : englishPlurals[guest]}`;

  const [one, two, few, many] = arabicGuests[guest];
  if (count === 1) return one;
  if (count === 2) return two;
  const remainder = count % 100;
  return `${count} ${remainder >= 3 && remainder <= 10 ? few : many}`;
}

export function formatHotelRoomCapacity(room: RoomCapacity, ar: boolean) {
  const { capacity, adultCapacity, childCapacity, childrenUnder3Capacity, childrenUnder6Capacity, children6To12Capacity } = room;
  const ageLimits = [
    { limit: childrenUnder3Capacity, label: ar ? "أقل من 3 سنوات" : "under 3 years" },
    { limit: childrenUnder6Capacity, label: ar ? "من 3 إلى 5 سنوات" : "aged 3 to 5" },
    { limit: children6To12Capacity, label: ar ? "من 6 إلى 12 سنة" : "aged 6 to 12" },
  ];
  const childAges = ageLimits.filter(({ limit }) => limit !== undefined && limit > 0);
  const parts: string[] = [];

  if (capacity > 0 && (adultCapacity === undefined || childCapacity === undefined || adultCapacity + childCapacity !== capacity)) {
    parts.push(guestCount(capacity, "guest", ar));
  }
  if (adultCapacity !== undefined && adultCapacity > 0) {
    parts.push(guestCount(adultCapacity, "adult", ar));
  }
  if (childCapacity !== 0) {
    const ageDetails = childAges.map(({ limit, label }) => `${label}: ${limit}`).join(ar ? "، " : ", ");
    if (childCapacity === undefined) {
      if (ageDetails) parts.push(`${ar ? "الأطفال حسب العمر" : "Children by age"} (${ageDetails})`);
    } else {
      const children = guestCount(childCapacity, "child", ar);
      const onlyAge = childAges.length === 1 && childAges[0].limit === childCapacity && ageLimits.every(({ limit }) => limit !== undefined);
      if (onlyAge) {
        parts.push(`${children} ${childAges[0].label}`);
      } else {
        parts.push(ageDetails ? `${children} (${ageDetails})` : children);
      }
    }
  }

  return parts.length ? `${ar ? "السعة" : "Capacity"}: ${parts.join(" · ")}` : null;
}
