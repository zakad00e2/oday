"use client";

import { useState } from "react";

interface Settings {
  companyName: string;
  companyNameEn: string;
  whatsappNumber: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  heroHeading: string;
  heroSubtitle: string;
  heroBadge: string;
  metaTitle: string;
  metaDescription: string;
}

const mockSettings: Settings = {
  companyName: "عدي للسياحة",
  companyNameEn: "Adi Tourism",
  whatsappNumber: "201032549630",
  contactEmail: "info@odaytourism.com",
  contactPhone: "+20 103 254 9630",
  address: "القاهرة، مصر",
  facebookUrl: "https://facebook.com/odaytourism",
  instagramUrl: "https://instagram.com/odaytourism",
  tiktokUrl: "https://tiktok.com/@odaytourism",
  heroHeading: "اكتشف جمال مصر",
  heroSubtitle: "رحلات سياحية مصممة خصيصاً لك مع أفضل الأسعار والخدمات",
  heroBadge: "✈️ أكثر من ١٠٠٠ عميل سعيد",
  metaTitle: "Adi Tourism | عدي للسياحة",
  metaDescription: "حجوزات فنادق • إدارة الجولات • تجارب سفر مصممة خصيصًا لك",
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>(mockSettings);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<"general" | "social" | "hero" | "seo">("general");

  const update = (key: keyof Settings, value: string) => {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  const handleSave = () => {
    // Mock save — backend will handle this
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const sections = [
    { key: "general" as const, label: "معلومات عامة", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg> },
    { key: "social" as const, label: "التواصل الاجتماعي", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg> },
    { key: "hero" as const, label: "قسم الهيرو", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" /></svg> },
    { key: "seo" as const, label: "SEO", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">الإعدادات</h1>
          <p className="text-sm text-[#6B7280] mt-1">إعدادات الموقع العامة</p>
        </div>
        <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${saved ? "bg-[#10B981] text-white" : "bg-[#111] text-white hover:bg-[#333]"}`}>
          {saved ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              تم الحفظ
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
              حفظ التغييرات
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Section Nav */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-2 flex flex-row lg:flex-col gap-1">
            {sections.map((s) => (
              <button key={s.key} onClick={() => setActiveSection(s.key)} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all w-full text-right ${activeSection === s.key ? "bg-[#111] text-white" : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111]"}`}>
                {s.icon}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl border border-[#F3F4F6] p-6">
          {activeSection === "general" && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[#111] mb-4">معلومات عامة</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1.5">اسم الشركة (عربي)</label>
                  <input value={settings.companyName} onChange={(e) => update("companyName", e.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1.5">اسم الشركة (إنجليزي)</label>
                  <input value={settings.companyNameEn} onChange={(e) => update("companyNameEn", e.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" dir="ltr" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">العنوان</label>
                <input value={settings.address} onChange={(e) => update("address", e.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1.5">رقم الواتساب</label>
                  <input value={settings.whatsappNumber} onChange={(e) => update("whatsappNumber", e.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" dir="ltr" placeholder="201032549630" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1.5">رقم الهاتف</label>
                  <input value={settings.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" dir="ltr" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">البريد الإلكتروني</label>
                <input value={settings.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" dir="ltr" />
              </div>
            </div>
          )}

          {activeSection === "social" && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[#111] mb-4">التواصل الاجتماعي</h2>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                    Facebook
                  </span>
                </label>
                <input value={settings.facebookUrl} onChange={(e) => update("facebookUrl", e.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" dir="ltr" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                    Instagram
                  </span>
                </label>
                <input value={settings.instagramUrl} onChange={(e) => update("instagramUrl", e.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" dir="ltr" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.51a6.27 6.27 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.16z" /></svg>
                    TikTok
                  </span>
                </label>
                <input value={settings.tiktokUrl} onChange={(e) => update("tiktokUrl", e.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" dir="ltr" />
              </div>
            </div>
          )}

          {activeSection === "hero" && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[#111] mb-4">قسم الهيرو (الصفحة الرئيسية)</h2>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">العنوان الرئيسي</label>
                <input value={settings.heroHeading} onChange={(e) => update("heroHeading", e.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">النص الفرعي</label>
                <textarea value={settings.heroSubtitle} onChange={(e) => update("heroSubtitle", e.target.value)} rows={3} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">نص الشارة (Badge)</label>
                <input value={settings.heroBadge} onChange={(e) => update("heroBadge", e.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
              </div>

              {/* Preview */}
              <div className="mt-4 p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                <p className="text-[10px] font-medium text-[#9CA3AF] mb-2 uppercase tracking-wider">معاينة</p>
                <div className="bg-gradient-to-br from-[#0C1D2E] to-[#1A3A52] rounded-xl p-6 text-white text-center">
                  <span className="inline-block bg-white/10 rounded-full px-3 py-1 text-[10px] mb-3">{settings.heroBadge}</span>
                  <h3 className="text-xl font-bold mb-2">{settings.heroHeading}</h3>
                  <p className="text-xs text-white/70">{settings.heroSubtitle}</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "seo" && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[#111] mb-4">تحسين محركات البحث (SEO)</h2>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">عنوان الصفحة (Meta Title)</label>
                <input value={settings.metaTitle} onChange={(e) => update("metaTitle", e.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                <p className="text-[10px] text-[#9CA3AF] mt-1">{settings.metaTitle.length}/60 حرف</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">وصف الصفحة (Meta Description)</label>
                <textarea value={settings.metaDescription} onChange={(e) => update("metaDescription", e.target.value)} rows={3} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors resize-none" />
                <p className="text-[10px] text-[#9CA3AF] mt-1">{settings.metaDescription.length}/160 حرف</p>
              </div>

              {/* Preview */}
              <div className="mt-4 p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                <p className="text-[10px] font-medium text-[#9CA3AF] mb-2 uppercase tracking-wider">معاينة نتائج Google</p>
                <div className="bg-white rounded-lg p-4 border border-[#E5E7EB]">
                  <p className="text-xs text-[#1A73E8] mb-0.5">{settings.metaTitle || "عنوان الصفحة"}</p>
                  <p className="text-[10px] text-[#006621] mb-1" dir="ltr">odaytourism.com</p>
                  <p className="text-[11px] text-[#4D5156] leading-relaxed">{settings.metaDescription || "وصف الصفحة..."}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Notice */}
      <div className="p-4 bg-[#FFF7ED] border border-[#FDE68A]/40 rounded-xl">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-xs font-bold text-[#92400E]">ملاحظة للمطور</p>
            <p className="text-[11px] text-[#B45309] mt-0.5 leading-relaxed">
              يحتاج الباك إند لإنشاء جدول <code className="bg-white/50 px-1 rounded font-mono">site_settings</code> بنظام key-value لحفظ هذه الإعدادات. كل حقل هنا يُحفظ كـ key منفصل.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
