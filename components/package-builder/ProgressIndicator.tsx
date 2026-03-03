"use client";

import { usePackage } from "@/lib/package-context";

const steps = [
  { num: 1, label: "اختر الفندق" },
  { num: 2, label: "اختر الرحلات" },
  { num: 3, label: "الإضافات" },
  { num: 4, label: "المراجعة" },
];

export default function ProgressIndicator() {
  const { step, setStep, selection } = usePackage();

  const canJumpTo = (targetStep: number): boolean => {
    if (targetStep <= step) return true;
    if (targetStep > 1 && !selection.hotel) return false;
    return targetStep <= step + 1;
  };

  const progressPct = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 relative">
      <div className="relative z-0">
        {/* Progress bar wrapper spanning exactly from center of first to center of last */}
        <div className="absolute top-[18px] left-10 right-10 sm:left-14 sm:right-14 h-1 bg-[#E2E8F0] rounded-full">
          {/* Animated progress bar active */}
          <div
            className="absolute top-0 right-0 h-full bg-gradient-to-l from-[#0EA5E9] to-[#38BDF8] rounded-full transition-all duration-700 ease-in-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Step circles */}
        <div className="flex justify-between relative z-10 w-full">
          {steps.map((s, index) => {
            const isActive = step === s.num;
            const isCompleted = step > s.num;
            const clickable = canJumpTo(s.num);

            return (
              <div key={s.num} className="flex flex-col items-center gap-2 w-20 sm:w-28 relative">
                <button
                  onClick={() => clickable && setStep(s.num)}
                  disabled={!clickable}
                  className={`relative z-10 w-10 h-10 rounded-full border-[3px] flex items-center justify-center text-sm font-bold transition-all duration-300 ${isActive
                    ? "bg-white text-[#0EA5E9] border-[#0EA5E9] scale-110 shadow-md shadow-[#0EA5E9]/20"
                    : isCompleted
                      ? "bg-[#0EA5E9] text-white border-[#0EA5E9]"
                      : "bg-white text-[#94A3B8] border-[#E2E8F0]"
                    } ${clickable ? "cursor-pointer hover:scale-105" : "cursor-not-allowed opacity-50"}`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s.num
                  )}
                </button>
                <span
                  className={`text-[11px] font-medium text-center leading-tight ${isActive ? "text-[#0EA5E9] font-bold" : isCompleted ? "text-[#0EA5E9]" : "text-[#94A3B8]"
                    }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
