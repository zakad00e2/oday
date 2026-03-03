"use client";

import { usePackage } from "@/lib/package-context";
import { addOns } from "@/lib/data";
import { formatPrice } from "@/lib/pricing";
import AddonIcon from "./AddonIcon";

const typeLabels: Record<string, string> = {
  flight: "تذاكر الطيران",
  transfer: "الاستقبال والتنقلات",
  insurance: "تأمين السفر",
  other: "خدمات إضافية",
};

export default function AddOnsStep() {
  const { selection, toggleAddOn, goNext, goPrev } = usePackage();

  const grouped = addOns.reduce((acc, curr) => {
    if (!acc[curr.type]) acc[curr.type] = [];
    acc[curr.type].push(curr);
    return acc;
  }, {} as Record<string, typeof addOns>);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-5">
        <div>
          <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-widest mb-1.5">إضافات (اختياري)</p>
          <h3 className="text-lg font-bold text-[#0F172A]">خدمات تكميلية لراحتك</h3>
        </div>
        {selection.addOns.length > 0 && (
          <div className="inline-flex items-center gap-2 bg-[#E0F2FE] text-[#0369A1] rounded-xl px-4 py-2 text-sm font-bold border border-[#BAE6FD] shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            </svg>
            {selection.addOns.length} خدمات مختارة
          </div>
        )}
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([type, items]) => (
          <div key={type} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-6 shadow-sm">
            <h4 className="text-[15px] font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0EA5E9]"></span>
              {typeLabels[type]}
            </h4>
            <div className="grid gap-3">
              {items.map((addOn) => {
                const selected = selection.addOns.some((a) => a.id === addOn.id);
                return (
                  <button
                    key={addOn.id}
                    onClick={() => toggleAddOn(addOn)}
                    className={`flex items-center justify-between text-right p-4 rounded-xl border-2 transition-all duration-300 ${
                      selected
                        ? "border-[#0EA5E9] bg-[#F0F9FF] shadow-sm"
                        : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        selected ? "bg-[#0EA5E9] text-white" : "bg-[#F1F5F9] text-[#0EA5E9]"
                      }`}>
                        <AddonIcon id={addOn.id} />
                      </div>
                      <div>
                        <h5 className={`text-sm font-bold mb-1 ${selected ? "text-[#0369A1]" : "text-[#0F172A]"}`}>
                          {addOn.name}
                        </h5>
                        <p className="text-xs text-[#64748B] mb-2">{addOn.description}</p>
                        <div className={`text-[10px] font-semibold rounded-md px-2 py-1 inline-block ${
                          selected ? "bg-[#BAE6FD] text-[#0369A1]" : "bg-[#F1F5F9] text-[#64748B]"
                        }`}>
                          {addOn.pricingModel === "fixed" ? "سعر ثابت" :
                           addOn.pricingModel === "perPerson" ? "للشخص الواحد" : "لليلة الواحدة"}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 shrink-0 pl-2">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        selected ? "bg-[#0EA5E9] border-[#0EA5E9] text-white" : "border-[#CBD5E1]"
                      }`}>
                        {selected && (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm font-bold ${selected ? "text-[#0284C7]" : "text-[#0F172A]"}`}>
                        +{formatPrice(addOn.price)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E2E8F0]">
        <button
          onClick={goPrev}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-[#64748B] bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A] transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          رجوع
        </button>
        <button
          onClick={goNext}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold bg-[#0EA5E9] text-white hover:bg-[#0284C7] shadow-md hover:shadow-lg shadow-[#0EA5E9]/20 transition-all duration-300"
        >
          التالي: المراجعة
          <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
