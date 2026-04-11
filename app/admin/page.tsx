"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listHotels } from "@/lib/hotel-service";
import { listTrips } from "@/lib/trip-service";

interface Counts {
  hotels: number | null;
  trips: number | null;
}

type DashboardIconKey = "hotels" | "trips";

function StatSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5 animate-pulse">
      <div className="w-12 h-12 rounded-2xl bg-[#F3F4F6] mb-4" />
      <div className="h-3 w-16 bg-[#F3F4F6] rounded mb-3" />
      <div className="h-8 w-10 bg-[#F3F4F6] rounded" />
    </div>
  );
}

function renderDashboardIcon(icon: DashboardIconKey) {
  switch (icon) {
    case "hotels":
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
      );
    case "trips":
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
        </svg>
      );
  }
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts>({
    hotels: null,
    trips: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    Promise.allSettled([
      listHotels({ signal }),
      listTrips({ signal }),
    ]).then(([hotelsRes, tripsRes]) => {
      setCounts({
        hotels:
          hotelsRes.status === "fulfilled" ? hotelsRes.value.meta.total : 0,
        trips:
          tripsRes.status === "fulfilled" ? tripsRes.value.meta.total : 0,
      });
    });

    return () => controller.abort();
  }, []);

  const loading = counts.hotels === null || counts.trips === null;

  const stats = [
    {
      label: "الفنادق",
      value: counts.hotels,
      href: "/admin/hotels",
      color: "from-[#8B5CF6] to-[#A78BFA]",
      icon: "hotels" as const,
    },
    {
      label: "الرحلات",
      value: counts.trips,
      href: "/admin/trips",
      color: "from-[#F59E0B] to-[#FBBF24]",
      icon: "trips" as const,
    },
  ];

  const quickActions = [
    { label: "إضافة فندق", href: "/admin/hotels", color: "bg-[#8B5CF6]" },
    { label: "إضافة رحلة", href: "/admin/trips", color: "bg-[#F59E0B]" },
    { label: "تحرير صور الرئيسية", href: "/admin/homepage", color: "bg-[#0EA5E9]" },
    { label: "الموافقات الأمنية", href: "/admin/security-approvals", color: "bg-[#10B981]" },
    { label: "إدارة الأسئلة والتقييمات", href: "/admin/about", color: "bg-[#6366F1]" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#111]">لوحة التحكم</h1>
        <p className="text-sm text-[#6B7280] mt-1">نظرة عامة على محتوى الموقع</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {Array.from({ length: stats.length }).map((_, i) => (
            <StatSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="group relative bg-white rounded-2xl border border-[#F3F4F6] p-5 hover:shadow-lg hover:border-transparent transition-all duration-300"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}
              >
                {renderDashboardIcon(stat.icon)}
              </div>
              <p className="text-sm text-[#6B7280] mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                {stat.value !== null ? (
                  <span className="text-3xl font-bold text-[#111]">
                    {stat.value}
                  </span>
                ) : (
                  <span className="text-sm font-medium text-[#9CA3AF]">
                    إدارة
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F3F4F6] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#111]">أقسام لوحة التحكم</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: "الفنادق", desc: "إضافة وتعديل وحذف الفنادق", href: "/admin/hotels", color: "bg-[#F5F3FF]", textColor: "text-[#7C3AED]" },
              { label: "الرحلات", desc: "إدارة الرحلات السياحية والأسعار", href: "/admin/trips", color: "bg-[#FFFBEB]", textColor: "text-[#D97706]" },
              { label: "الرئيسية", desc: "صور العروض والمعرض", href: "/admin/homepage", color: "bg-[#F0F9FF]", textColor: "text-[#0284C7]" },
              { label: "الموافقات الأمنية", desc: "أسعار الجنسيات وشركات الطيران", href: "/admin/security-approvals", color: "bg-[#ECFDF5]", textColor: "text-[#059669]" },
              { label: "من نحن", desc: "الأسئلة الشائعة والتقييمات", href: "/admin/about", color: "bg-[#EEF2FF]", textColor: "text-[#4F46E5]" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-start gap-3 p-4 rounded-xl border border-[#F3F4F6] hover:border-[#E5E7EB] hover:shadow-sm transition-all duration-200"
              >
                <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                  <span className={`text-xs font-bold ${item.textColor}`}>
                    {item.label.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#111]">{item.label}</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-6">
          <h2 className="text-lg font-bold text-[#111] mb-6">إجراءات سريعة</h2>
          <div className="space-y-3">
            {quickActions.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#F3F4F6] hover:border-[#E5E7EB] hover:shadow-sm transition-all duration-200"
              >
                <span className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-sm text-[#374151]">{item.label}</span>
                <svg
                  className="w-4 h-4 text-[#D1D5DB] mr-auto rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
