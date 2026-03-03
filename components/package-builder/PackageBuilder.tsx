"use client";

import { PackageProvider, usePackage } from "@/lib/package-context";
import ProgressIndicator from "./ProgressIndicator";
import HotelStep from "./HotelStep";
import TripsStep from "./TripsStep";
import AddOnsStep from "./AddOnsStep";
import ReviewStep from "./ReviewStep";
import PackageSummary from "./PackageSummary";

function BuilderContent() {
  const { step } = usePackage();

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] pt-8 pb-32 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 border border-[#BAE6FD] bg-[#E0F2FE] text-[#0369A1] rounded-full px-4 py-1.5 mb-5 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-xs font-bold">صمّم باقتك المثالية</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-[#0F172A] leading-tight mb-3">
            تخصيص رحلتك <span className="text-[#0EA5E9]">لم يكن أسهل من قبل</span>
          </h1>
          <p className="text-[#64748B] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            اختر الفندق، أضف الرحلات والإضافات، وشاهد السعر الإجمالي تلقائياً.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-10 text-center">
          <ProgressIndicator />
        </div>

        {/* Main Layout: Steps + Summary Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Steps Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-[2rem] shadow-sm border border-[#E2E8F0] p-6 sm:p-8">
              {step === 1 && <HotelStep />}
              {step === 2 && <TripsStep />}
              {step === 3 && <AddOnsStep />}
              {step === 4 && <ReviewStep />}
            </div>
          </div>

          {/* Desktop Summary Sidebar */}
          {step < 4 && (
            <div className="hidden lg:block w-[320px] shrink-0">
              <PackageSummary />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Summary */}
      {step < 4 && (
        <div className="lg:hidden mt-6 px-4">
          <PackageSummary />
        </div>
      )}
    </section>
  );
}

export default function PackageBuilder() {
  return (
    <PackageProvider>
      <BuilderContent />
    </PackageProvider>
  );
}
