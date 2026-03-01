"use client";

import { useState } from "react";

export default function ContactCTA() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    destination: "",
    people: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`طلب رحلة سياحية - ${form.name}`);
    const body = encodeURIComponent(
      `الاسم: ${form.name}\nرقم الهاتف: ${form.phone}\nالبريد الإلكتروني: ${form.email}\nالوجهة المطلوبة: ${form.destination}\nعدد الأشخاص: ${form.people}\nتفاصيل إضافية:\n${form.message}`
    );
    window.location.href = `mailto:odaytourism@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const inputBase =
    "w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-right text-foreground placeholder-gray-400 outline-none transition focus:border-[#111] focus:bg-white focus:shadow-sm";

  return (
    <section id="contact" className="py-16 md:py-24 px-4 md:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">
            تواصل معنا
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-3">
            احجز رحلتك الآن
          </h2>
          <p className="text-muted text-base md:text-lg max-w-md mx-auto">
            أرسل لنا تفاصيل رحلتك وسنتواصل معك في أقرب وقت.
          </p>
        </div>

        {/* Card */}
        <div className="relative rounded-[2rem] border border-gray-100 shadow-xl bg-white overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -top-16 -right-16 w-52 h-52 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-green-100/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 p-8 md:p-12">
            {submitted ? (
              <div className="text-center py-12 flex flex-col items-center gap-4">
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 text-3xl mb-2">
                  ✓
                </span>
                <h3 className="text-2xl font-bold text-foreground">تم الإرسال بنجاح!</h3>
                <p className="text-muted">شكراً لك، سنتواصل معك قريباً.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "", destination: "", people: "", message: "" }); }}
                  className="mt-4 px-6 py-2.5 rounded-full bg-[#111] text-white text-sm font-medium hover:bg-[#333] transition"
                >
                  إرسال طلب جديد
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4" dir="rtl">
                {/* Row 1: Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">الاسم الكامل <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="محمد أحمد"
                      className={inputBase}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">رقم الهاتف <span className="text-red-400">*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="+966 5xxxxxxxx"
                      className={inputBase}
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Row 2: Email + Destination */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">البريد الإلكتروني</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className={inputBase}
                      dir="ltr"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">الوجهة المطلوبة <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      name="destination"
                      value={form.destination}
                      onChange={handleChange}
                      required
                      placeholder="باريس، تركيا، المالديف..."
                      className={inputBase}
                    />
                  </div>
                </div>

                {/* Row 3: People */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">عدد الأشخاص</label>
                  <select
                    name="people"
                    value={form.people}
                    onChange={handleChange}
                    className={inputBase}
                  >
                    <option value="">اختر عدد الأشخاص</option>
                    <option value="1">1 شخص</option>
                    <option value="2">2 شخص</option>
                    <option value="3-5">3 - 5 أشخاص</option>
                    <option value="6-10">6 - 10 أشخاص</option>
                    <option value="+10">أكثر من 10</option>
                  </select>
                </div>

                {/* Row 4: Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">تفاصيل إضافية</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="أي تفاصيل أخرى تريد إضافتها عن رحلتك..."
                    className={`${inputBase} resize-none`}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="mt-2 w-full py-3.5 rounded-2xl bg-[#111] text-white font-bold text-sm tracking-wide hover:bg-[#333] active:scale-[0.98] transition-all duration-200 shadow-md"
                >
                  إرسال الطلب
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
