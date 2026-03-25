"use client";

import ScrollReveal from "../ScrollReveal";

export default function TripSchedule({
    startTime,
    endTime,
    duration,
    labels,
}: {
    startTime: string;
    endTime: string;
    duration: string;
    labels: {
        start: string;
        end: string;
        duration: string;
        heading: string;
    };
}) {
    const items = [
        {
            label: labels.start,
            value: startTime,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M7.05 7.05L5.636 5.636M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
        },
        {
            label: labels.end,
            value: endTime,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            ),
        },
        {
            label: labels.duration,
            value: duration,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="lg:sticky lg:top-28">
            <ScrollReveal>
                <div className="lg:border-r lg:border-[#e2e8f0] lg:pr-5 p-5 lg:p-0 lg:pl-0">
                    <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-[#e2e8f0]">
                        {/* <div className="w-8 h-8 rounded-lg bg-[#0F2854]/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-[#0F2854]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div> */}
                        <h3 className="text-base font-bold text-[#0F2854]">{labels.heading}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:gap-4">
                        {items.map((item) => (
                            <div key={item.label} className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#f4f5f7] text-[#6b7280] flex items-center justify-center shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-[11px] text-[#9ca3af] font-medium leading-none mb-1">{item.label}</p>
                                    <p className="text-sm font-semibold text-[#1f2937] leading-none">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </ScrollReveal>
        </div>
    );
}
