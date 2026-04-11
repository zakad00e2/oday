"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import AdminLogin from "@/components/admin/AdminLogin";

type SidebarIconKey =
  | "dashboard"
  | "homepage"
  | "hotels"
  | "trips"
  | "security-approvals"
  | "about";

const sidebarLinks = [
  {
    label: "لوحة التحكم",
    href: "/admin",
    icon: "dashboard" as const,
  },
  {
    label: "الرئيسية",
    href: "/admin/homepage",
    icon: "homepage" as const,
  },
  {
    label: "الفنادق",
    href: "/admin/hotels",
    icon: "hotels" as const,
  },
  {
    label: "الرحلات",
    href: "/admin/trips",
    icon: "trips" as const,
  },
  {
    label: "الموافقات الأمنية",
    href: "/admin/security-approvals",
    icon: "security-approvals" as const,
  },
  {
    label: "من نحن",
    href: "/admin/about",
    icon: "about" as const,
  },
];

function renderSidebarIcon(icon: SidebarIconKey) {
  switch (icon) {
    case "dashboard":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      );
    case "homepage":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 9.75v9A2.25 2.25 0 007.5 21h9a2.25 2.25 0 002.25-2.25v-9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 21v-6.75h4.5V21" />
        </svg>
      );
    case "hotels":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
      );
    case "trips":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
        </svg>
      );
    case "security-approvals":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "about":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0ZM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      );
  }
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, logout, adminData } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const initials = adminData?.name ? adminData.name.charAt(0) : "م";

  if (state === "loading") {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-[#F8F9FB]"
        style={{ fontFamily: "'Cairo', sans-serif" }}
        dir="rtl"
      >
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 animate-spin text-[#9CA3AF]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm text-[#9CA3AF]">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (state === "unauthenticated") {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex" style={{ fontFamily: "'Cairo', sans-serif" }} dir="rtl">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 h-screen w-[260px] overflow-hidden bg-white border-l border-[#E5E7EB] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#F3F4F6]">
          <div className="flex items-center gap-1">
            <Image
              src="/optimized/logo.webp"
              alt="Oday Tourism Logo"
              width={160}
              height={64}
              sizes="160px"
              quality={75}
              className="h-10 w-auto object-contain drop-shadow-sm"
            />
            <div className="flex flex-col pt-1">
              <span className="text-[15px] leading-none text-[#111]" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>
                Oday Tourism
              </span>
            </div>
          </div>
          <span className="text-[10px] text-[#9CA3AF] bg-[#F3F4F6] px-2 py-1 rounded-lg">لوحة التحكم</span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#111] text-white shadow-sm"
                    : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111]"
                }`}
              >
                {renderSidebarIcon(link.icon)}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#F3F4F6] space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111] transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            عرض الموقع
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#EF4444] hover:bg-[#FEF2F2] transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            تسجيل الخروج
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen lg:pr-[260px]">
        <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -mr-2 text-[#6B7280] hover:text-[#111]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="flex items-center gap-3 mr-auto">
            {adminData?.name && (
              <span className="hidden sm:block text-sm text-[#6B7280]">
                مرحباً، <span className="font-semibold text-[#111]">{adminData.name}</span>
              </span>
            )}
            <div
              title={adminData?.email ?? ""}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#6366F1] flex items-center justify-center text-white text-xs font-bold select-none"
            >
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
