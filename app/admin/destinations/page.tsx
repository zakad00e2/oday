"use client";

import { useCallback, useEffect, useState } from "react";
import DestinationImage from "@/components/DestinationImage";
import { getDestinationLabels, type Destination } from "@/lib/destinations";
import {
  deleteDestinationImage,
  DestinationServiceError,
  getDestinationImage,
  listDestinations,
  updateDestinationImage,
  type DestinationRecord,
} from "@/lib/destination-service";

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<DestinationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState<Destination | null>(null);
  const [notice, setNotice] = useState<{ error: boolean; message: string } | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setLoadError(null);
    try {
      const records = await listDestinations({ signal });
      if (!signal?.aborted) setDestinations(records);
    } catch (error) {
      if (!signal?.aborted) setLoadError(error instanceof Error ? error.message : "تعذر تحميل الوجهات.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  async function saveImage(destination: Destination, file: File) {
    setBusy(destination);
    setNotice(null);
    try {
      const updated = await updateDestinationImage(destination, file);
      setDestinations((records) => records.map((record) => record.destination === destination ? updated : record));
      setNotice({ error: false, message: "تم حفظ صورة الوجهة. ستظهر في صفحات الفنادق والرحلات." });
    } catch (error) {
      setNotice({ error: true, message: error instanceof Error ? error.message : "تعذر حفظ الصورة." });
    } finally {
      setBusy(null);
    }
  }

  async function removeImage(destination: Destination) {
    setBusy(destination);
    setNotice(null);
    try {
      await deleteDestinationImage(destination);
      setDestinations((records) => records.map((record) => record.destination === destination ? { ...record, image: null } : record));
      setNotice({ error: false, message: "تم حذف الصورة. ستُعرض الصورة الافتراضية للوجهة." });
    } catch (error) {
      if (error instanceof DestinationServiceError && error.status === 404) {
        setDestinations((records) => records.map((record) => record.destination === destination ? { ...record, image: null } : record));
        setNotice({ error: true, message: "لا توجد صورة لهذه الوجهة. تم تحديث المعاينة إلى الصورة الافتراضية." });
      } else {
        setNotice({ error: true, message: error instanceof Error ? error.message : "تعذر حذف الصورة." });
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111]">صور الوجهات</h1>
        <p className="mt-2 text-sm leading-7 text-[#6B7280]">أضف صورة لكل وجهة لتظهر في صفحات الفنادق والرحلات. يمكنك استبدالها أو حذفها في أي وقت.</p>
        <p className="text-xs leading-6 text-[#6B7280]">ملف صورة واحد لكل وجهة، بحد أقصى <bdi dir="ltr">2 MB</bdi>. تُعرض صورة افتراضية عند عدم إضافة صورة.</p>
      </div>

      {notice ? <p role={notice.error ? "alert" : "status"} className={`rounded-xl border p-4 text-sm ${notice.error ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-800"}`}>{notice.message}</p> : null}

      {loading ? <p role="status" className="py-12 text-center text-sm text-[#6B7280]">جاري تحميل الوجهات...</p> : loadError ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <p>{loadError}</p>
          <button type="button" onClick={() => void load()} className="mt-3 rounded-lg border border-red-300 px-4 py-2">إعادة المحاولة</button>
        </div>
      ) : destinations.length === 0 ? <p className="py-12 text-center text-sm text-[#6B7280]">لا توجد وجهات متاحة حاليًا.</p> : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {destinations.map((record) => {
            const labels = getDestinationLabels(record.destination);
            const saving = busy === record.destination;
            return (
              <article key={record.destination} aria-busy={saving} className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
                <div className="relative aspect-[4/3] bg-[#F3F4F6]">
                  <DestinationImage destination={record.destination} src={getDestinationImage(record)} alt={labels.ar} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" />
                  <span className="absolute right-3 bottom-3 rounded-full bg-white/95 px-3 py-1 text-xs text-[#374151]">{record.image ? "صورة مخصصة" : "صورة افتراضية"}</span>
                </div>
                <div className="space-y-4 p-5">
                  <div>
                    <h2 className="font-bold text-[#111]">{labels.ar}</h2>
                    <p dir="ltr" className="mt-1 text-right text-xs text-[#6B7280]">{labels.en}</p>
                    <p className="mt-3 text-xs text-[#6B7280]">{record.hotels_count.toLocaleString("ar")} فنادق · {record.trips_count.toLocaleString("ar")} رحلات</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className={`relative rounded-xl bg-[#111] px-4 py-2.5 text-xs font-semibold text-white focus-within:outline-2 focus-within:outline-offset-2 ${busy ? "opacity-50" : "cursor-pointer hover:bg-[#374151]"}`}>
                      {saving ? "جاري الحفظ..." : record.image ? "استبدال الصورة" : "إضافة صورة"}
                      <input type="file" accept="image/*" disabled={busy !== null} aria-label={`رفع صورة ${labels.ar}`} className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-wait" onChange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        event.currentTarget.value = "";
                        if (file) void saveImage(record.destination, file);
                      }} />
                    </label>
                    <button type="button" disabled={!record.image || busy !== null} aria-label={`حذف صورة ${labels.ar}`} onClick={() => void removeImage(record.destination)} className="rounded-xl border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40">حذف الصورة</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
