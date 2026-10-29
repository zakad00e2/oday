"use client";

import { useEffect, useId, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Globe2, UserRound, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/dictionary-context";
import { useVisitorPricing } from "@/lib/visitor-pricing-context";

export default function VisitorResidenceDialog() {
  const { lang, dir } = useI18n();
  const { category, setCategory, isResidenceDialogOpen, closeResidenceDialog } = useVisitorPricing();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const isAr = lang === "ar";
  const ChoiceChevron = isAr ? ChevronLeft : ChevronRight;
  const choiceClassName = "flex w-full cursor-pointer items-center gap-3 rounded-xl border border-[#E1E1E1] bg-[#FCFCFC] px-3 py-3 text-start hover:border-[#9BC7DA] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 sm:gap-3 sm:px-3.5 sm:py-3.5";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isResidenceDialogOpen && !dialog.open) dialog.showModal();
    else if (!isResidenceDialogOpen && dialog.open) dialog.close();
  }, [isResidenceDialogOpen]);

  useEffect(() => {
    if (!isResidenceDialogOpen) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = previousOverflow; };
  }, [isResidenceDialogOpen]);

  return (
    <dialog
      ref={dialogRef}
      dir={dir}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        if (!category) event.preventDefault();
        else closeResidenceDialog();
      }}
      onClose={closeResidenceDialog}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not([disabled])");
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (!first || !last) return;
        const active = document.activeElement;
        if (event.shiftKey && (active === first || active === event.currentTarget)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (active === last || active === event.currentTarget)) {
          event.preventDefault();
          first.focus();
        }
      }}
      data-lenis-prevent
      className="fixed inset-0 m-auto max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] max-w-[440px] overflow-y-auto overscroll-contain rounded-[1.5rem] border border-[#DEDEDE] bg-[#FCFCFC] p-0 text-[#111] shadow-[0_24px_80px_-24px_rgba(15,23,42,0.25)] backdrop:bg-[#09263b]/60 backdrop:backdrop-blur-sm"
    >
      <div className="relative p-4 sm:p-5">
        {category && (
          <button type="button" onClick={closeResidenceDialog}
            aria-label={isAr ? "إلغاء تغيير الإقامة" : "Cancel residence change"}
            className="absolute end-4 top-4 z-10 cursor-pointer rounded-full border border-slate-200 bg-white/95 p-1.5 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
        <div data-residence-logo className="flex h-24 items-center justify-center sm:h-28">
          <Image src="/optimized/logo.webp" alt={isAr ? "شعار عدي للسياحة" : "Oday Tourism logo"}
            width={96} height={110} priority className="h-20 w-auto object-contain sm:h-24" />
        </div>
        <div className="border-b border-[#EEEEEE] px-1 pb-4 pt-1 text-center">
          <h2 id={titleId} className="text-[clamp(1rem,4vw,1.25rem)] font-extrabold leading-[1.65] text-[#080808]">
            {isAr ? "أهلًا بك في " : "Welcome to "}<bdi dir="ltr" className="font-english font-extrabold tracking-[-0.035em]">ODAY TOURISM</bdi>
          </h2>
          <p id={descriptionId} className="mx-auto mt-1.5 max-w-md text-xs font-medium leading-[1.8] text-[#636363] sm:text-[13px]">
            {isAr ? "للحصول على الأسعار، يُرجى اختيار فئة التسعير." : "To view prices, please select your pricing category."}
          </p>
        </div>
        <div className="space-y-2.5 pt-4">
          <button type="button" data-visitor-category="egyptian-resident" onClick={() => setCategory("egyptian-resident")}
            className={choiceClassName}>
            <UserRound className="h-6 w-6 shrink-0 text-[#5CA9C8] sm:h-[26px] sm:w-[26px]" strokeWidth={1.8} aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold leading-[1.7] sm:text-[15px]">{isAr ? "مصري أو حامل إقامة مصرية سارية" : "Egyptian or valid Egyptian residency holder"}</span>
              <span className="mt-0.5 block text-[11px] font-medium leading-[1.75] text-[#676767] sm:text-xs">{isAr ? "الأسعار المخصصة للمصريين والأجانب الحاصلين على إقامة مصرية سارية." : "Rates for Egyptians and foreign nationals holding valid Egyptian residency."}</span>
            </span>
            <ChoiceChevron className="h-4 w-4 shrink-0 text-[#666]" strokeWidth={1.8} aria-hidden="true" />
          </button>
          <button type="button" data-visitor-category="other" onClick={() => setCategory("other")}
            className={choiceClassName}>
            <Globe2 className="h-6 w-6 shrink-0 text-[#C3A053] sm:h-[26px] sm:w-[26px]" strokeWidth={1.8} aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold leading-[1.7] sm:text-[15px]">{isAr ? "الجنسيات الأخرى" : "Other nationalities"}</span>
              <span className="mt-0.5 block text-[11px] font-medium leading-[1.75] text-[#676767] sm:text-xs">{isAr ? "الأسعار المخصصة للجنسيات الأخرى وفقًا لسياسة الفندق." : "Rates for other nationalities, subject to hotel policy."}</span>
            </span>
            <ChoiceChevron className="h-4 w-4 shrink-0 text-[#666]" strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
        <p className="px-1 pb-1 pt-3 text-center text-[11px] font-medium leading-[1.8] text-[#676767]">
          {isAr ? "تُطبَّق الأسعار وفقًا لشروط الإقامة والجنسية وسياسة مقدم الخدمة." : "Rates are subject to residency, nationality and provider policies."}
        </p>
      </div>
    </dialog>
  );
}
