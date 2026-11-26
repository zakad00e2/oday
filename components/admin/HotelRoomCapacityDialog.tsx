"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import {
  MAX_HOTEL_ROOM_CAPACITY,
  updateHotelRoomOccupancy,
  type HotelRoomOccupancyChange,
  type HotelRoomRecord,
} from "@/lib/hotel-service";

type CapacityField = keyof HotelRoomOccupancyChange;
type Room = Pick<HotelRoomRecord, "id" | "nameAr" | "nameEn"> &
  Partial<Pick<HotelRoomRecord, CapacityField>>;

const limits = [
  { key: "adultCapacity", label: "أقصى عدد بالغين", min: 1 },
  { key: "childCapacity", label: "أقصى عدد أطفال", min: 0 },
  { key: "childrenUnder3Capacity", label: "أطفال أقل من ٣ سنوات", min: 0, ageBand: true },
  { key: "childrenUnder6Capacity", label: "أطفال من ٣ إلى ٥ سنوات", min: 0, ageBand: true },
  { key: "children6To12Capacity", label: "أطفال من ٦ إلى ١٢ سنة", min: 0, ageBand: true },
] as const;

const field = "min-h-11 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 focus-visible:outline-2 focus-visible:outline-sky-700";

function savedValue(room: Room, key: CapacityField) {
  const value = room[key];
  return value === undefined || (key === "capacity" && value < 1) ? "" : String(value);
}

export default function HotelRoomCapacityDialog({ hotelId, hotelName, rooms, onClose, onSaved }: {
  hotelId: string;
  hotelName: string;
  rooms: [Room, ...Room[]];
  onClose: () => void;
  onSaved: (room: HotelRoomRecord) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [roomId, setRoomId] = useState(rooms[0].id);
  const [draft, setDraft] = useState<Partial<Record<CapacityField, string>>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean }>();
  const room = rooms.find(item => item.id === roomId) ?? rooms[0];
  const dirty = Object.keys(draft).length > 0;

  useEffect(() => { dialog.current?.showModal(); }, []);

  const value = (key: CapacityField) => draft[key] ?? savedValue(room, key);
  const totalLimit = Number(value("capacity")) || MAX_HOTEL_ROOM_CAPACITY;
  const childLimit = value("childCapacity") === "" ? totalLimit : Math.min(Number(value("childCapacity")), totalLimit);

  function changeField(key: CapacityField, nextValue: string) {
    setDraft(current => {
      const next = { ...current, [key]: nextValue };
      if (nextValue === savedValue(room, key)) delete next[key];
      return next;
    });
    setMessage(undefined);
  }

  function changeRoom(nextRoomId: string) {
    if (dirty && !window.confirm("لديك تغييرات غير محفوظة. هل تريد تجاهلها؟")) return;
    setRoomId(nextRoomId);
    setDraft({});
    setMessage(undefined);
  }

  function close() {
    if (saving) return;
    dialog.current?.close();
    onClose();
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || !dirty) return;

    const { capacity, ...changedLimits } = draft;
    const changes: HotelRoomOccupancyChange = Object.fromEntries(
      Object.entries(changedLimits).map(([key, limit]) => [key, limit === "" ? null : Number(limit)]),
    );
    if (capacity !== undefined) changes.capacity = Number(capacity);

    setSaving(true);
    setMessage(undefined);
    try {
      const savedRoom = await updateHotelRoomOccupancy(hotelId, room.id, changes);
      onSaved(savedRoom);
      setDraft({});
      setMessage({ text: "تم حفظ سعة الغرفة." });
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : "تعذّر حفظ سعة الغرفة.", error: true });
    } finally {
      setSaving(false);
    }
  }

  return (
    <dialog
      ref={dialog}
      dir="rtl"
      aria-labelledby="room-capacity-heading"
      onCancel={event => { event.preventDefault(); close(); }}
      className="m-auto max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-xl overflow-auto rounded-2xl bg-white p-4 text-slate-950 shadow-xl backdrop:bg-slate-950/60 sm:p-6"
    >
      <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 id="room-capacity-heading" className="text-lg font-bold">تعديل سعة الغرف</h2>
          <p className="mt-1 text-sm text-slate-600" dir="auto">{hotelName}</p>
        </div>
        <button type="button" onClick={close} disabled={saving} aria-label="إغلاق نافذة السعة"
          className="grid size-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50">
          <X size={18} aria-hidden />
        </button>
      </div>

      <form onSubmit={save} className="mt-4 space-y-4">
        <fieldset disabled={saving} className="grid min-w-0 gap-4">
          <label className="grid gap-1.5 text-sm font-semibold">
            نوع الغرفة
            <select value={room.id} onChange={event => changeRoom(event.target.value)} className={field}>
              {rooms.map(item => <option key={item.id} value={item.id}>{item.nameAr || item.nameEn}</option>)}
            </select>
          </label>

          <label className="grid gap-1.5 text-sm font-semibold">
            أقصى عدد ضيوف للغرفة
            <input type="number" min={1} max={MAX_HOTEL_ROOM_CAPACITY} step={1} required
              value={value("capacity")} onChange={event => changeField("capacity", event.target.value)} className={field} />
          </label>

          <fieldset aria-describedby="room-capacity-hint" className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
            <legend className="px-1 text-sm font-bold">حدود البالغين والأطفال</legend>
            <p id="room-capacity-hint" className="mb-3 text-xs leading-relaxed text-slate-600">
              اترك الحقل فارغًا إذا كانت الفئة بلا حد إضافي. إدخال صفر يمنع الحجز لهذه الفئة من الأطفال.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {limits.map(limit => (
                <label key={limit.key} className="grid content-start gap-1.5 text-sm font-medium">
                  {limit.label}
                  <input type="number" min={limit.min} max={"ageBand" in limit ? childLimit : totalLimit} step={1}
                    value={value(limit.key)} onChange={event => changeField(limit.key, event.target.value)}
                    placeholder="بلا حد إضافي" className={field} />
                </label>
              ))}
            </div>
          </fieldset>
        </fieldset>

        {message && <p role={message.error ? "alert" : "status"} className={`text-sm font-semibold ${message.error ? "text-red-700" : "text-emerald-800"}`}>
          {message.text}
        </p>}

        <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4">
          <button type="submit" disabled={saving || !dirty}
            className="min-h-11 rounded-xl bg-sky-800 px-5 py-2 text-sm font-bold text-white hover:bg-sky-900 disabled:bg-slate-200 disabled:text-slate-600">
            {saving ? "جاري حفظ السعة…" : "حفظ السعة"}
          </button>
          <button type="button" onClick={close} disabled={saving}
            className="min-h-11 rounded-xl border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            إغلاق
          </button>
        </div>
      </form>
    </dialog>
  );
}
