"use client";

import Link from "next/link";

const stats = [
  { label: "الفنادق", value: "4", change: "+1", href: "/admin/hotels", color: "from-[#8B5CF6] to-[#A78BFA]", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg> },
  { label: "الرحلات", value: "6", change: "0", href: "/admin/trips", color: "from-[#F59E0B] to-[#FBBF24]", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" /></svg> },
  { label: "الرئيسية", value: "2", change: "0", href: "/admin/homepage", color: "from-[#0EA5E9] to-[#38BDF8]", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 9.75v9A2.25 2.25 0 007.5 21h9a2.25 2.25 0 002.25-2.25v-9" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 21v-6.75h4.5V21" /></svg> },
];

const recentActivity = [
  { action: "تم إضافة عرض جديد", detail: "شرم الشيخ — $2,499", time: "منذ ساعتين", type: "add" },
  { action: "تم تعديل فندق", detail: "فندق هيلتون الغردقة", time: "منذ 5 ساعات", type: "edit" },
  { action: "تم إضافة مراجعة", detail: "أحمد محمد — ★★★★★", time: "منذ يوم", type: "add" },
  { action: "تم حذف رحلة", detail: "رحلة وادي الحيتان", time: "منذ يومين", type: "delete" },
  { action: "تم تعديل الإعدادات", detail: "تحديث رقم الواتساب", time: "منذ 3 أيام", type: "edit" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#111]">لوحة التحكم</h1>
        <p className="text-sm text-[#6B7280] mt-1">نظرة عامة على محتوى الموقع</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group relative bg-white rounded-2xl border border-[#F3F4F6] p-5 hover:shadow-lg hover:border-transparent transition-all duration-300"
          >
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
              {stat.icon}
            </div>
            <p className="text-sm text-[#6B7280] mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#111]">{stat.value}</span>
              {stat.change !== "0" && (
                <span className="text-xs font-medium text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                  {stat.change}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F3F4F6] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#111]">آخر النشاطات</h2>
            <span className="text-xs text-[#9CA3AF]">آخر 7 أيام</span>
          </div>
          <div className="space-y-4">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-4 border-b border-[#F9FAFB] last:border-0 last:pb-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  item.type === "add" ? "bg-[#ECFDF5] text-[#10B981]" :
                  item.type === "edit" ? "bg-[#EFF6FF] text-[#3B82F6]" :
                  "bg-[#FEF2F2] text-[#EF4444]"
                }`}>
                  {item.type === "add" && <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>}
                  {item.type === "edit" && <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" /></svg>}
                  {item.type === "delete" && <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#111]">{item.action}</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">{item.detail}</p>
                </div>
                <span className="text-[11px] text-[#9CA3AF] flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-6">
          <h2 className="text-lg font-bold text-[#111] mb-6">إجراءات سريعة</h2>
          <div className="space-y-3">
              {[
                { label: "إضافة فندق", href: "/admin/hotels", color: "bg-[#8B5CF6]" },
                { label: "إضافة رحلة", href: "/admin/trips", color: "bg-[#F59E0B]" },
                { label: "تحرير صور الرئيسية", href: "/admin/homepage", color: "bg-[#0EA5E9]" },
              ].map((item) => (
                <Link
                  key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#F3F4F6] hover:border-[#E5E7EB] hover:shadow-sm transition-all duration-200"
              >
                <span className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-sm text-[#374151]">{item.label}</span>
                <svg className="w-4 h-4 text-[#D1D5DB] mr-auto rotate-180" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-[#FFF7ED] border border-[#FDE68A]/40 rounded-xl">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-xs font-bold text-[#92400E]">وضع المعاينة</p>
                <p className="text-[11px] text-[#B45309] mt-0.5 leading-relaxed">
                  هذه واجهة عرض فقط. ربط الباك إند مطلوب لتفعيل الحفظ والحذف.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
