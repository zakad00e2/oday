"use client";

import { TripSchedule as TripScheduleType } from "@/lib/trips-types";
import ScrollReveal from "../ScrollReveal";

export default function TripSchedule({ schedule }: { schedule: TripScheduleType }) {
    const items = [
        { label: "بداية الرحلة", value: schedule.startTime, icon: "🕐" },
        { label: "نهاية الرحلة", value: schedule.endTime, icon: "🕕" },
        { label: "مدة الرحلة", value: schedule.duration, icon: "⏱️" },
        { label: "التكرار", value: schedule.frequency, icon: "📅" },
    ];

    return (
        <section className="py-10 md:py-14 border-b border-[#e2e8f0]">
            <ScrollReveal>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#2563EB]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">مواعيد الرحلة</h2>
                </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {items.map((item, i) => (
                    <ScrollReveal key={item.label} delay={i * 80}>
                        <div className="bg-white rounded-2xl p-5 border border-[#f0f0f0] shadow-sm text-center">
                            <span className="text-2xl mb-2 block">{item.icon}</span>
                            <p className="text-xs text-[#94a3b8] font-medium mb-1">{item.label}</p>
                            <p className="text-base font-bold text-[#0f172a]">{item.value}</p>
                        </div>
                    </ScrollReveal>
                ))}
            </div>
        </section>
    );
}
