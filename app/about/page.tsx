"use client";

import ScrollReveal from "@/components/ScrollReveal";

/* ── Icon helpers ────────────────────────────────────── */
function EyeIcon() {
    return (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
    );
}
function TargetIcon() {
    return (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 12h.01" />
        </svg>
    );
}
function ShieldIcon() {
    return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
    );
}
function SparklesIcon() {
    return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>
    );
}
function BriefcaseIcon() {
    return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
    );
}
function HeartIcon() {
    return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
    );
}
function MapIcon() {
    return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
        </svg>
    );
}
function CurrencyIcon() {
    return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    );
}
function ClipboardIcon() {
    return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
        </svg>
    );
}
function BuildingIcon() {
    return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3 4.5h.008v.008H18v-.008Zm0 3h.008v.008H18v-.008Zm0 3h.008v.008H18v-.008Z" />
        </svg>
    );
}
function ChatIcon() {
    return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
    );
}
function GlobeIcon() {
    return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
    );
}

/* ── Data ─────────────────────────────────────────────── */
const values = [
    {
        title: "المصداقية",
        desc: "نؤمن بأن الشفافية والصدق هما أساس العلاقة مع عملائنا.",
        icon: <ShieldIcon />,
    },
    {
        title: "الجودة",
        desc: "نحرص على تقديم خدمات سياحية بمستوى عالٍ من الجودة.",
        icon: <SparklesIcon />,
    },
    {
        title: "الاحترافية",
        desc: "نعمل وفق أعلى المعايير المهنية في تنظيم الرحلات.",
        icon: <BriefcaseIcon />,
    },
    {
        title: "رضا العملاء",
        desc: "راحة وسعادة عملائنا هي هدفنا الأول.",
        icon: <HeartIcon />,
    },
];

const whyUs = [
    {
        title: "خبرة حقيقية في شرم الشيخ",
        desc: "نمتلك خبرة واسعة في السياحة في مدينة شرم الشيخ، ونعرف أفضل الفنادق، وأجمل أماكن الرحلات، والأنشطة السياحية التي تمنح المسافر تجربة لا تُنسى.",
        icon: <MapIcon />,
    },
    {
        title: "أفضل الأسعار والخدمات",
        desc: "نحرص على تقديم أفضل العروض والأسعار التنافسية مع الحفاظ على مستوى عالٍ من الجودة والخدمة.",
        icon: <CurrencyIcon />,
    },
    {
        title: "تنظيم احترافي للرحلات",
        desc: "نقوم بتنظيم جميع الرحلات والأنشطة السياحية باحترافية عالية لضمان تجربة آمنة وممتعة لجميع المسافرين.",
        icon: <ClipboardIcon />,
    },
    {
        title: "اختيار أفضل الفنادق والأنشطة",
        desc: "نعمل مع مجموعة من أفضل الفنادق والمنتجعات السياحية في شرم الشيخ، بالإضافة إلى تقديم أشهر الرحلات والأنشطة السياحية.",
        icon: <BuildingIcon />,
    },
    {
        title: "خدمة عملاء ومتابعة مستمرة",
        desc: "فريقنا متواجد لمساعدة العملاء قبل الرحلة وأثناءها لضمان راحة المسافر وتقديم الدعم عند الحاجة.",
        icon: <ChatIcon />,
    },
    {
        title: "تجربة سياحية متكاملة",
        desc: "نوفر برامج سياحية متكاملة تشمل الإقامة، الرحلات، والأنشطة المختلفة، لتقديم تجربة سفر مريحة ومميزة.",
        icon: <GlobeIcon />,
    },
];

/* ── Page ─────────────────────────────────────────────── */
export default function AboutPage() {
    return (
        <main className="pt-20 bg-[#FAFAFA]">

            {/* ─── Hero ──────────────────────────────────────── */}
            <section className="relative overflow-hidden py-12 md:py-16 text-center">
                {/* decorative blobs */}
                <div className="absolute top-[-120px] right-[-80px] w-[340px] h-[340px] rounded-full bg-gradient-to-br from-[#2563EB]/10 to-transparent blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-80px] left-[-60px] w-[280px] h-[280px] rounded-full bg-gradient-to-tr from-[#111]/5 to-transparent blur-3xl pointer-events-none" />

                <ScrollReveal className="relative z-10 max-w-[720px] mx-auto">
                    <p className="text-sm font-semibold tracking-widest text-[#2563EB] uppercase mb-3">
                        من نحن
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#111] leading-tight mb-4">
                        Oday Tourism
                    </h1>
                    <div className="mx-auto w-16 h-1 rounded-full bg-[#2563EB]" />
                </ScrollReveal>
            </section>

            {/* ─── Intro paragraphs ──────────────────────────── */}
            <section className="pb-12 md:pb-16">
                <div className="max-w-[820px] mx-auto space-y-6">
                    <ScrollReveal>
                        <p className="text-[#444] text-base md:text-lg leading-[1.9]">
                            عدي توريزم (Oday Tourism) هي شركة سياحية متخصصة في تقديم الخدمات السياحية المتكاملة في مصر، وبشكل خاص في مدينة شرم الشيخ، إحدى أبرز الوجهات السياحية في منطقة البحر الأحمر.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal delay={100}>
                        <p className="text-[#444] text-base md:text-lg leading-[1.9]">
                            نحن في Oday Tourism نؤمن أن السفر ليس مجرد حجز فندق أو رحلة سياحية، بل تجربة متكاملة تبدأ منذ لحظة التخطيط وحتى نهاية الرحلة. لذلك نحرص على تقديم خدمات سياحية احترافية تجمع بين الجودة، التنظيم، والأسعار المناسبة.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal delay={200}>
                        <p className="text-[#444] text-base md:text-lg leading-[1.9]">
                            بفضل خبرتنا في السياحة في شرم الشيخ، نقدم لعملائنا أفضل البرامج السياحية التي تشمل الإقامة في المنتجعات المميزة، والرحلات البحرية، والأنشطة الصحراوية، بالإضافة إلى العديد من التجارب السياحية التي تجعل الرحلة أكثر متعة وتميزًا.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal delay={300}>
                        <p className="text-[#555] text-base md:text-lg leading-[1.9] font-medium border-r-4 border-[#2563EB] pr-5">
                            هدفنا هو أن يحصل كل عميل على تجربة سياحية مريحة وآمنة مليئة بالذكريات الجميلة
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* ─── Vision & Mission ──────────────────────────── */}
            <section className="py-12 md:py-16 bg-white">
                <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ScrollReveal>
                        <div className="rounded-3xl border border-[#E5E7EB] p-8 md:p-10 h-full hover:border-[#2563EB]/30 hover:shadow-lg transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] mb-6">
                                <EyeIcon />
                            </div>
                            <h2 className="text-xl font-bold text-[#111] mb-4">رؤيتنا</h2>
                            <p className="text-[#555] text-[15px] leading-[1.9]">
                                أن نكون من الشركات السياحية الرائدة في مصر والشرق الأوسط في تقديم التجارب السياحية المميزة، وأن نصبح الخيار الأول للمسافرين الراغبين في استكشاف شرم الشيخ بأفضل طريقة ممكنة.
                            </p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={150}>
                        <div className="rounded-3xl border border-[#E5E7EB] p-8 md:p-10 h-full hover:border-[#2563EB]/30 hover:shadow-lg transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-[#111]/5 flex items-center justify-center text-[#111] mb-6">
                                <TargetIcon />
                            </div>
                            <h2 className="text-xl font-bold text-[#111] mb-4">رسالتنا</h2>
                            <p className="text-[#555] text-[15px] leading-[1.9]">
                                تقديم خدمات سياحية احترافية تعتمد على الجودة، التنظيم، والاهتمام بأدق التفاصيل، مع الحرص على توفير أفضل تجربة سفر لعملائنا وبناء علاقات طويلة الأمد مبنية على الثقة والرضا.
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* ─── Values ────────────────────────────────────── */}
            <section className="py-12 md:py-16">
                <ScrollReveal className="text-center mb-14">
                    <p className="text-sm font-semibold tracking-widest text-[#2563EB] uppercase mb-2">ما يميزنا</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#111]">قيمنا</h2>
                </ScrollReveal>

                <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((v, i) => (
                        <ScrollReveal key={v.title} delay={i * 100}>
                            <div className="rounded-3xl bg-white border border-[#E5E7EB] p-7 text-center h-full hover:border-[#2563EB]/30 hover:shadow-lg transition-all duration-300 group">
                                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] mb-5 group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300">
                                    {v.icon}
                                </div>
                                <h3 className="text-lg font-bold text-[#111] mb-3">{v.title}</h3>
                                <p className="text-[#6B7280] text-sm leading-relaxed">{v.desc}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </section>

            {/* ─── Why Choose Us ─────────────────────────────── */}
            <section className="py-12 md:py-16 bg-white">
                <ScrollReveal className="text-center mb-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#111]">
                        لماذا تختار Oday Tourism؟
                    </h2>
                </ScrollReveal>

                <ScrollReveal delay={100} className="max-w-[820px] mx-auto text-center mb-14">
                    <p className="text-[#555] text-base md:text-lg leading-[1.9]">
                        اختيار شركة السياحة المناسبة هو الخطوة الأولى لرحلة ناجحة. في Oday Tourism نحرص على تقديم تجربة سياحية متكاملة تجمع بين الاحترافية، الجودة، والأسعار المناسبة، لنضمن لعملائنا رحلة مميزة منذ لحظة التخطيط وحتى نهاية الرحلة.
                    </p>
                </ScrollReveal>

                <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {whyUs.map((item, i) => (
                        <ScrollReveal key={item.title} delay={i * 80}>
                            <div className="rounded-3xl border border-[#E5E7EB] p-7 h-full hover:border-[#111]/20 hover:shadow-lg transition-all duration-300 group">
                                <div className="w-12 h-12 rounded-xl bg-[#111]/5 flex items-center justify-center text-[#111] mb-5 group-hover:bg-[#111] group-hover:text-white transition-colors duration-300">
                                    {item.icon}
                                </div>
                                <h3 className="text-[16px] font-bold text-[#111] mb-3">{item.title}</h3>
                                <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </section>

        </main>
    );
}
