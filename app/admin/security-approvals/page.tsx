"use client";

import { useEffect, useState, useCallback } from "react";
import { NATIONALITY_OPTIONS, AIRLINES } from "@/lib/airport-config";
import {
  listNationalityPricing,
  listAirlinePricing,
  createNationalityPricing,
  updateNationalityPricing,
  createAirlinePricing,
  updateAirlinePricing,
  toApiKey,
  type NationalityPricingRecord,
  type AirlinePricingRecord,
  SecurityApprovalServiceError,
} from "@/lib/security-approval-service";

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface NationalityRow {
  frontendId: string;
  labelAr: string;
  labelEn: string;
  record: NationalityPricingRecord | null;
  draft24: string;
  draft72: string;
  saving: boolean;
  saved: boolean;
  error: string | null;
}

interface AirlineRow {
  frontendId: string;
  labelAr: string;
  labelEn: string;
  record: AirlinePricingRecord | null;
  draftPrice: string;
  saving: boolean;
  saved: boolean;
  error: string | null;
}

const KNOWN_NATIONALITY_BACKEND_FAILURES: Record<string, string> = {
  "iraqi-document":
    "فشل الحفظ من الباك إند لهذه الجنسية. المفتاح المرسل صحيح، لكن خدمة Railway ترجع خطأ داخليًا عند إنشاء وثيقة عراق.",
  "saint-kitts-dominica-group":
    "فشل الحفظ من الباك إند لهذه الجنسية. المفتاح المرسل صحيح، لكن خدمة Railway ترجع خطأ داخليًا عند إنشاء سانت كيتس ونيفيس.",
};

// â”€â”€ Skeleton â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function RowSkeleton({ cols }: { cols: number }) {
  return (
    <div className="p-4 flex gap-3 items-center animate-pulse">
      <div className="flex-1 h-4 bg-[#F3F4F6] rounded-lg" />
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="w-28 h-9 bg-[#F3F4F6] rounded-xl" />
      ))}
      <div className="w-20 h-9 bg-[#F3F4F6] rounded-xl" />
    </div>
  );
}

// â”€â”€ Feedback badge â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function SavedBadge() {
  return (
    <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
      حُفظ
    </span>
  );
}

function normalizePriceValue(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const num = Number(trimmed);
  return Number.isFinite(num) ? String(num) : trimmed;
}

function isNationalityDirty(row: NationalityRow): boolean {
  const initial24 = row.record ? String(row.record.price24h) : "";
  const initial72 = row.record ? String(row.record.price72h) : "";
  return (
    normalizePriceValue(row.draft24) !== initial24 ||
    normalizePriceValue(row.draft72) !== initial72
  );
}

function isAirlineDirty(row: AirlineRow): boolean {
  const initialPrice = row.record ? String(row.record.price) : "";
  return normalizePriceValue(row.draftPrice) !== initialPrice;
}

function SaveButton({
  saving,
  saved,
  dirty,
  onClick,
}: {
  saving: boolean;
  saved: boolean;
  dirty: boolean;
  onClick: () => void;
}) {
  const disabled = saving || !dirty;
  const className = saving
    ? "bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed"
    : saved && !dirty
      ? "bg-[#10B981] text-white cursor-not-allowed"
      : !dirty
        ? "bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed"
        : "bg-[#111] text-white hover:bg-[#2A2A2A]";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${className}`}
    >
      {saving ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          جاري الحفظ...
        </>
      ) : (
        <>
          حفظ
          {saved && !dirty && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </>
      )}
    </button>
  );
}
// â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function SecurityApprovalsPage() {
  const [natRows, setNatRows] = useState<NationalityRow[]>([]);
  const [airRows, setAirRows] = useState<AirlineRow[]>([]);

  const [natLoading, setNatLoading] = useState(true);
  const [airLoading, setAirLoading] = useState(true);
  const [natLoadError, setNatLoadError] = useState<string | null>(null);
  const [airLoadError, setAirLoadError] = useState<string | null>(null);

  // â”€â”€ Load functions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const loadNationalities = useCallback(async (signal?: AbortSignal) => {
    setNatLoading(true);
    setNatLoadError(null);
    try {
      const records = await listNationalityPricing(signal);
      const recordMap = new Map(records.map((r) => [r.nationalityKey, r]));

      setNatRows(
        NATIONALITY_OPTIONS.map((opt) => {
          const record = recordMap.get(opt.id) ?? null;
          return {
            frontendId: opt.id,
            labelAr: opt.labelAr,
            labelEn: opt.labelEn,
            record,
            draft24: record ? String(record.price24h) : "",
            draft72: record ? String(record.price72h) : "",
            saving: false,
            saved: false,
            error: null,
          };
        }),
      );
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setNatLoadError(
        err instanceof SecurityApprovalServiceError
          ? err.message
          : "فشل تحميل أسعار الجنسيات",
      );
    } finally {
      setNatLoading(false);
    }
  }, []);

  const loadAirlines = useCallback(async (signal?: AbortSignal) => {
    setAirLoading(true);
    setAirLoadError(null);
    try {
      const records = await listAirlinePricing(signal);
      const recordMap = new Map(records.map((r) => [r.airlineKey, r]));

      // Build rows from the known AIRLINES list first (excluding EgyptAir which has no extra fee)
      const knownAirlines = AIRLINES.filter((a) => !a.isEgyptAir);
      const knownIds = new Set<string>(knownAirlines.map((a) => a.id));

      const knownRows: AirlineRow[] = knownAirlines.map((a) => {
        const record = recordMap.get(a.id) ?? null;
        return {
          frontendId: a.id,
          labelAr: a.labelAr,
          labelEn: a.labelEn,
          record,
          draftPrice: record ? String(record.price) : "",
          saving: false,
          saved: false,
          error: null,
        };
      });

      // Append any extra airlines from the API that aren't in our known list
      const extraRows: AirlineRow[] = records
        .filter((r) => !knownIds.has(r.airlineKey))
        .map((r) => ({
          frontendId: r.airlineKey,
          labelAr: r.airlineKey,
          labelEn: r.airlineKey,
          record: r,
          draftPrice: String(r.price),
          saving: false,
          saved: false,
          error: null,
        }));

      setAirRows([...knownRows, ...extraRows]);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setAirLoadError(
        err instanceof SecurityApprovalServiceError
          ? err.message
          : "فشل تحميل أسعار شركات الطيران",
      );
    } finally {
      setAirLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadNationalities(controller.signal);
    void loadAirlines(controller.signal);
    return () => controller.abort();
  }, [loadNationalities, loadAirlines]);

  // â”€â”€ Validation helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  function validatePrice(value: string): string | null {
    if (value.trim() === "") return "السعر مطلوب";
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return "أدخل رقمًا صحيحًا غير سالب";
    return null;
  }

  // â”€â”€ Nationality handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  function updateNatDraft(id: string, field: "24" | "72", value: string) {
    setNatRows((prev) =>
      prev.map((row) =>
        row.frontendId === id
          ? {
              ...row,
              draft24: field === "24" ? value : row.draft24,
              draft72: field === "72" ? value : row.draft72,
              saved: false,
              error: null,
            }
          : row,
      ),
    );
  }

  async function saveNationality(id: string) {
    const row = natRows.find((r) => r.frontendId === id);
    if (!row) return;

    const err24 = validatePrice(row.draft24);
    const err72 = validatePrice(row.draft72);
    if (err24 || err72) {
      setNatRows((prev) =>
        prev.map((r) =>
          r.frontendId === id
            ? { ...r, error: err24 ?? err72 ?? null }
            : r,
        ),
      );
      return;
    }

    setNatRows((prev) =>
      prev.map((r) =>
        r.frontendId === id ? { ...r, saving: true, error: null } : r,
      ),
    );

    try {
      const price24h = parseFloat(row.draft24);
      const price72h = parseFloat(row.draft72);

      let updated: NationalityPricingRecord;
      if (row.record) {
        updated = await updateNationalityPricing(row.record.id, {
          price24h,
          price72h,
        });
      } else {
        updated = await createNationalityPricing({
          nationality: toApiKey(row.frontendId),
          price24h,
          price72h,
        });
      }

      setNatRows((prev) =>
        prev.map((r) =>
          r.frontendId === id
            ? {
                ...r,
                record: updated,
                draft24: String(updated.price24h),
                draft72: String(updated.price72h),
                saving: false,
                saved: true,
                error: null,
              }
            : r,
        ),
      );
    } catch (err) {
      const backendHint =
        !row.record &&
        err instanceof SecurityApprovalServiceError &&
        err.status >= 500
          ? KNOWN_NATIONALITY_BACKEND_FAILURES[row.frontendId]
          : null;
      const msg =
        err instanceof SecurityApprovalServiceError
          ? err.message
          : "فشل الحفظ، حاول مجدداً";
      setNatRows((prev) =>
        prev.map((r) =>
          r.frontendId === id
            ? { ...r, saving: false, error: backendHint ?? msg }
            : r,
        ),
      );
    }
  }

  // â”€â”€ Airline handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  function updateAirDraft(id: string, value: string) {
    setAirRows((prev) =>
      prev.map((row) =>
        row.frontendId === id
          ? { ...row, draftPrice: value, saved: false, error: null }
          : row,
      ),
    );
  }

  async function saveAirline(id: string) {
    const row = airRows.find((r) => r.frontendId === id);
    if (!row) return;

    const priceErr = validatePrice(row.draftPrice);
    if (priceErr) {
      setAirRows((prev) =>
        prev.map((r) =>
          r.frontendId === id ? { ...r, error: priceErr } : r,
        ),
      );
      return;
    }

    setAirRows((prev) =>
      prev.map((r) =>
        r.frontendId === id ? { ...r, saving: true, error: null } : r,
      ),
    );

    try {
      const price = parseFloat(row.draftPrice);

      let updated: AirlinePricingRecord;
      if (row.record) {
        updated = await updateAirlinePricing(row.record.id, { price });
      } else {
        updated = await createAirlinePricing({
          airline: toApiKey(row.frontendId),
          price,
        });
      }

      setAirRows((prev) =>
        prev.map((r) =>
          r.frontendId === id
            ? {
                ...r,
                record: updated,
                draftPrice: String(updated.price),
                saving: false,
                saved: true,
                error: null,
              }
            : r,
        ),
      );
    } catch (err) {
      const msg =
        err instanceof SecurityApprovalServiceError
          ? err.message
          : "فشل الحفظ، حاول مجدداً";
      setAirRows((prev) =>
        prev.map((r) =>
          r.frontendId === id ? { ...r, saving: false, error: msg } : r,
        ),
      );
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#111] mb-2">الموافقات الأمنية</h1>
        <p className="text-[#6B7280] text-sm">
          إدارة أسعار الموافقات الأمنية — تعديل الأسعار فقط، بدون إضافة أو تعديل أسماء الجنسيات
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* â”€â”€ Nationality Pricing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="bg-[#111] px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">الأسعار حسب الجنسية</h2>
            {natLoadError && (
              <button
                onClick={() => loadNationalities()}
                className="text-xs text-white/70 hover:text-white underline"
              >
                إعادة المحاولة
              </button>
            )}
          </div>

          {natLoadError && (
            <div className="m-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {natLoadError}
            </div>
          )}

          <div className="divide-y divide-[#F3F4F6] max-h-[70vh] overflow-y-auto">
            {natLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <RowSkeleton key={i} cols={2} />
              ))
            ) : (
              natRows.map((row) => (
                <div
                  key={row.frontendId}
                  className="p-4 hover:bg-[#F9FAFB] transition-colors"
                >
                  <div className="font-medium text-[#111] mb-3 text-sm">
                    {row.labelAr}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {/* 24h price */}
                    <div>
                      <label className="text-xs text-[#6B7280] block mb-1.5">
                        سعر 24 ساعة ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0"
                        value={row.draft24}
                        onChange={(e) =>
                          updateNatDraft(row.frontendId, "24", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-xl text-sm outline-none focus:border-[#111] transition-all"
                      />
                    </div>
                    {/* 72h price */}
                    <div>
                      <label className="text-xs text-[#6B7280] block mb-1.5">
                        سعر 72 ساعة ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0"
                        value={row.draft72}
                        onChange={(e) =>
                          updateNatDraft(row.frontendId, "72", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-xl text-sm outline-none focus:border-[#111] transition-all"
                      />
                    </div>
                  </div>

                  {row.error && (
                    <p className="text-red-500 text-xs mb-2">{row.error}</p>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    {row.saved ? (
                      <SavedBadge />
                    ) : (
                      <span className="text-xs text-[#9CA3AF]">
                        {row.record ? "معدّل" : "غير محفوظ"}
                      </span>
                    )}
                                          <SaveButton saving={row.saving} saved={row.saved} dirty={isNationalityDirty(row)} onClick={() => saveNationality(row.frontendId)} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* â”€â”€ Airline Pricing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="bg-[#111] px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">الأسعار حسب شركة الطيران</h2>
            {airLoadError && (
              <button
                onClick={() => loadAirlines()}
                className="text-xs text-white/70 hover:text-white underline"
              >
                إعادة المحاولة
              </button>
            )}
          </div>

          {airLoadError && (
            <div className="m-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {airLoadError}
            </div>
          )}

          <div className="divide-y divide-[#F3F4F6]">
            {airLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <RowSkeleton key={i} cols={1} />
              ))
            ) : (
              <>
                {airRows.map((row) => (
                  <div
                    key={row.frontendId}
                    className="p-4 hover:bg-[#F9FAFB] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="font-medium text-[#111] text-sm pt-1">
                        {row.labelAr}
                      </div>
                      <div className="flex items-start gap-2 w-full sm:w-auto">
                        <div className="flex-1 sm:w-32">
                          <label className="text-xs text-[#6B7280] block mb-1.5">
                            الرسوم الإضافية ($)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            placeholder="0"
                            value={row.draftPrice}
                            onChange={(e) =>
                              updateAirDraft(row.frontendId, e.target.value)
                            }
                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-xl text-sm outline-none focus:border-[#111] transition-all"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5 mt-5">
                                                    <SaveButton saving={row.saving} saved={row.saved} dirty={isAirlineDirty(row)} onClick={() => saveAirline(row.frontendId)} />
                        </div>
                      </div>
                    </div>

                    {row.error && (
                      <p className="text-red-500 text-xs mt-2">{row.error}</p>
                    )}
                    {row.saved && (
                      <div className="mt-2">
                        <SavedBadge />
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




