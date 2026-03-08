import { TripDetail } from "./trips-types";

export const allTrips: TripDetail[] = [
    // ═══════════════════════════════════════════════════════════════
    // 1. رحلة يخت رأس محمد والجزيرة البيضاء
    // ═══════════════════════════════════════════════════════════════
    {
        slug: "ras-mohammed-yacht",
        titleAr: "رحلة يخت رأس محمد والجزيرة البيضاء",
        titleEn: "Ras Mohammed & White Island Yacht Trip",
        taglineAr: "أبحر في أجمل مياه البحر الأحمر واستمتع بجنة تحت الماء",
        descriptionAr:
            "ابدأ يومك برحلة يخت مميزة في البحر الأحمر إلى محمية رأس محمد والجزيرة البيضاء، من أجمل الوجهات الطبيعية في شرم الشيخ. يتم استلامكم من الفندق صباحًا بواسطة فان شركة Oday Tourism والتوجه إلى السقالة للانطلاق في الرحلة.\n\nتشمل الرحلة 3 توقفات رائعة للاستمتاع بالسباحة والسنوركلينج والطبيعة الساحرة. تبدأ بزيارة محمية رأس محمد المشهورة بالشعاب المرجانية والأسماك الملونة، مع إمكانية تجربة الغوص بإشراف مختصين. ثم التوجه إلى الجزيرة البيضاء المعروفة بجمال رمالها البيضاء ومياهها الفيروزية الصافية. بعد ذلك، يتم التوقف في موقع آخر مميز للسباحة والسنوركلينج، مع تقديم وجبة غداء على متن اليخت.\n\nفي نهاية اليوم، يعود اليخت إلى السقالة مساءً ثم يتم إعادتكم إلى الفندق بعد تجربة بحرية ممتعة ومليئة بالذكريات.",
        heroImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1400&q=80",
        galleryImages: [
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
            "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
            "https://images.unsplash.com/photo-1582967788606-a171c7FA6c79?w=800&q=80",
            "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=800&q=80",
            "https://images.unsplash.com/photo-1437719417032-8799fe6344c2?w=800&q=80",
        ],
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        schedule: {
            startTime: "07:00 AM",
            endTime: "05:00 PM",
            duration: "8 ساعات",
            frequency: "يومياً",
        },
        includes: [
            "الانتقالات ذهاب وعودة من الفندق",
            "وجبة غداء على متن اليخت",
            "مشروبات غازية ومياه",
            "معدات السنوركلينج",
            "مرشد بحري محترف",
            "تأمين بحري",
        ],
        essentials: [
            "ملابس سباحة",
            "منشفة شخصية",
            "كريم واقي من الشمس",
            "نظارات شمسية",
            "قبعة",
            "كاميرا مقاومة للماء",
        ],
        options: [
            {
                id: "yacht-luxury-3floor",
                nameAr: "يخت فاخر 3 أدوار",
                nameEn: "Luxury 3-Floor Yacht",
                descriptionAr: "يخت واسع بثلاثة طوابق مع سطح للتشمس ومنطقة داخلية مكيفة",
                price: 80,
            },
            {
                id: "yacht-sina-dream",
                nameAr: "يخت شراعي Sina Dream",
                nameEn: "Sina Dream Sailing Yacht",
                descriptionAr: "يخت شراعي أنيق مع أجواء هادئة ورومانسية",
                price: 65,
            },
            {
                id: "yacht-vip",
                nameAr: "يخت VIP",
                nameEn: "VIP Yacht",
                descriptionAr: "أفخم يخوتنا مع خدمة خاصة وضيافة متميزة",
                price: 100,
            },
        ],
        addOns: [
            {
                id: "diving-addon",
                nameAr: "تجربة الغوص",
                nameEn: "Diving Experience",
                price: 30,
                descriptionAr: "غوص مع مدرب محترف واستكشاف أعماق البحر الأحمر",
                icon: "🤿",
            },
        ],
        startingPrice: 65,
        bookingFields: ["name", "guests", "childrenUnder5", "hotel", "date", "time", "tripType", "addOns", "notes"],
    },

    // ═══════════════════════════════════════════════════════════════
    // 2. رحلة سفاري بيتش باجي في الصحراء
    // ═══════════════════════════════════════════════════════════════
    {
        slug: "desert-safari-buggy",
        titleAr: "رحلة سفاري بيتش باجي في الصحراء",
        titleEn: "Desert Safari Beach Buggy Adventure",
        taglineAr: "مغامرة مثيرة في قلب الصحراء مع إطلالات خلابة",
        descriptionAr:
            "عش مغامرة لا مثيل لها في صحراء شرم الشيخ! اختر البيتش باجي أو الكار باجي وانطلق في رحلة مشوقة عبر الكثبان الرملية والوديان الصحراوية. استمتع بمشاهدة الغروب الساحر وتعرّف على حياة البدو الأصيلة.",
        heroImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1400&q=80",
        galleryImages: [
            "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
            "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&q=80",
            "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80",
            "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&q=80",
            "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800&q=80",
        ],
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        schedule: {
            startTime: "02:00 PM",
            endTime: "09:00 PM",
            duration: "7 ساعات",
            frequency: "يومياً",
        },
        includes: [
            "الانتقالات ذهاب وعودة من الفندق",
            "ركوب الجمال",
            "مشروبات (شاي بدوي)",
            "مرشد سفاري محترف",
            "معدات الأمان كاملة",
        ],
        essentials: [
            "ملابس مريحة",
            "حذاء مغلق",
            "نظارات شمسية",
            "كريم واقي من الشمس",
            "بندانة أو غطاء رأس",
            "كاميرا",
        ],
        options: [
            {
                id: "buggy-single",
                nameAr: "بيتش باجي سنجل",
                nameEn: "Single Beach Buggy",
                descriptionAr: "باجي فردي لشخص واحد",
                price: 20,
                capacityLabel: "شخص واحد",
                maxQuantity: 10,
            },
            {
                id: "buggy-double",
                nameAr: "بيتش باجي دبل",
                nameEn: "Double Beach Buggy",
                descriptionAr: "باجي مزدوج لشخصين",
                price: 25,
                capacityLabel: "شخصين",
                maxQuantity: 10,
            },
            {
                id: "car-buggy-2",
                nameAr: "كار باجي ثنائي",
                nameEn: "Car Buggy (2-Seater)",
                descriptionAr: "كار باجي يتسع لشخصين بقوة أكبر",
                price: 50,
                capacityLabel: "شخصين",
                maxQuantity: 5,
            },
            {
                id: "car-buggy-4",
                nameAr: "كار باجي رباعي",
                nameEn: "Car Buggy (4-Seater)",
                descriptionAr: "كار باجي عائلي يتسع لأربعة أشخاص",
                price: 70,
                capacityLabel: "4 أشخاص",
                maxQuantity: 5,
            },
        ],
        addOns: [
            {
                id: "bedouin-dinner",
                nameAr: "حفلة الجبل والعشاء البدوي",
                nameEn: "Mountain Party & Bedouin Dinner",
                price: 25,
                descriptionAr: "عشاء بدوي تقليدي مع عرض فلكلوري تحت النجوم",
                icon: "🏕️",
            },
        ],
        startingPrice: 20,
        bookingFields: ["name", "guests", "childrenUnder5", "hotel", "date", "time", "tripType", "addOns", "notes"],
    },

    // ═══════════════════════════════════════════════════════════════
    // 3. أنشطة البحر – ووتر سبورت
    // ═══════════════════════════════════════════════════════════════
    {
        slug: "water-sports",
        titleAr: "أنشطة البحر – ووتر سبورت",
        titleEn: "Water Sports Experience",
        taglineAr: "أدرينالين وإثارة فوق أمواج البحر الأحمر",
        descriptionAr:
            "استمتع بأشهر الرياضات المائية في شرم الشيخ! اختر من بين الباراشوت الطائر، البانانا بوت المرح، والتيوبا المثيرة. كل نشاط يقدم لك جرعة من المتعة والإثارة التي لا تُنسى فوق مياه البحر الأحمر الصافية.",
        heroImage: "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=1400&q=80",
        galleryImages: [
            "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=800&q=80",
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
            "https://images.unsplash.com/photo-1437719417032-8799fe6344c2?w=800&q=80",
        ],
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        schedule: {
            startTime: "10:00 AM",
            endTime: "04:00 PM",
            duration: "حسب النشاط",
            frequency: "يومياً",
        },
        includes: [
            "معدات السلامة الكاملة",
            "مدرب محترف",
            "تأمين بحري",
        ],
        essentials: [
            "ملابس سباحة",
            "منشفة",
            "كريم واقي من الشمس",
            "نظارات شمسية",
        ],
        options: [
            {
                id: "parasail-single",
                nameAr: "باراشوت سنجل",
                nameEn: "Single Parasailing",
                descriptionAr: "طيران فردي فوق البحر بالمظلة",
                price: 30,
                maxQuantity: 5,
            },
            {
                id: "parasail-double",
                nameAr: "باراشوت دبل",
                nameEn: "Double Parasailing",
                descriptionAr: "طيران مزدوج فوق البحر بالمظلة لشخصين",
                price: 45,
                maxQuantity: 5,
            },
            {
                id: "banana-boat",
                nameAr: "بانانا بوت",
                nameEn: "Banana Boat",
                descriptionAr: "مغامرة جماعية مليئة بالمرح والضحك",
                price: 15,
                maxQuantity: 5,
            },
            {
                id: "tuba-ride",
                nameAr: "تيوبا",
                nameEn: "Tube Ride",
                descriptionAr: "ركوب التيوبا المثير فوق الأمواج",
                price: 15,
                maxQuantity: 5,
            },
        ],
        addOns: [
            {
                id: "transfers-ws",
                nameAr: "خدمة الانتقالات",
                nameEn: "Transfer Service",
                price: 10,
                descriptionAr: "انتقالات من وإلى الفندق بسيارة مكيفة",
                icon: "🚗",
            },
        ],
        startingPrice: 15,
        bookingFields: ["name", "guests", "hotel", "date", "time", "tripType", "addOns", "notes"],
    },

    // ═══════════════════════════════════════════════════════════════
    // 4. اليخت المسائي – دينر كروز
    // ═══════════════════════════════════════════════════════════════
    {
        slug: "sunset-dinner-cruise",
        titleAr: "اليخت المسائي – دينر كروز",
        titleEn: "Sunset Dinner Cruise Yacht",
        taglineAr: "أمسية ساحرة على متن اليخت مع عشاء فاخر وغروب الشمس",
        descriptionAr:
            "استمتع بأمسية لا تُنسى على متن يخت فاخر في مياه شرم الشيخ. شاهد غروب الشمس الساحر بينما تتناول عشاءً فاخراً مع أجواء موسيقية هادئة. الرحلة المثالية للأزواج والعائلات الباحثين عن تجربة رومانسية مميزة.",
        heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1400&q=80",
        galleryImages: [
            "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
            "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        ],
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        schedule: {
            startTime: "04:30 PM",
            endTime: "09:00 PM",
            duration: "4.5 ساعات",
            frequency: "يومياً",
        },
        includes: [
            "الانتقالات ذهاب وعودة من الفندق",
            "عشاء بوفيه مفتوح",
            "مشروبات غازية ومياه",
            "حفلة موسيقية على متن اليخت",
            "تأمين بحري",
        ],
        essentials: [
            "ملابس أنيقة",
            "جاكيت خفيف (للأمسيات الباردة)",
            "كاميرا",
        ],
        options: [
            {
                id: "dinner-yacht-luxury",
                nameAr: "يخت فاخر",
                nameEn: "Luxury Yacht",
                descriptionAr: "يخت واسع مع صالة داخلية مكيفة وسطح مفتوح",
                price: 75,
            },
            {
                id: "dinner-yacht-sina",
                nameAr: "يخت شراعي Sina Dream",
                nameEn: "Sina Dream Sailing Yacht",
                descriptionAr: "يخت شراعي بأجواء رومانسية هادئة",
                price: 60,
            },
        ],
        addOns: [],
        startingPrice: 60,
        bookingFields: ["name", "guests", "childrenUnder5", "hotel", "date", "tripType", "notes"],
    },

    // ═══════════════════════════════════════════════════════════════
    // 5. رحلة الغواصة
    // ═══════════════════════════════════════════════════════════════
    {
        slug: "submarine-experience",
        titleAr: "رحلة الغواصة",
        titleEn: "Submarine Sea Experience",
        taglineAr: "شاهد عالم ما تحت الماء بدون أن تبتل!",
        descriptionAr:
            "تجربة فريدة من نوعها! انزل إلى أعماق البحر الأحمر داخل غواصة حقيقية وشاهد الشعاب المرجانية والأسماك الملونة من خلال النوافذ البانورامية، دون الحاجة للسباحة أو الغوص. مناسبة لجميع الأعمار.",
        heroImage: "https://images.unsplash.com/photo-1582967788606-a171c7FA6c79?w=1400&q=80",
        galleryImages: [
            "https://images.unsplash.com/photo-1582967788606-a171c7FA6c79?w=800&q=80",
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        ],
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        schedule: {
            startTime: "حسب الموعد المختار",
            endTime: "—",
            duration: "ساعة ونصف",
            frequency: "عدة مواعيد يومياً",
        },
        includes: [
            "تذكرة دخول الغواصة",
            "مرشد مختص",
            "تأمين",
        ],
        essentials: [
            "كاميرا أو هاتف",
            "ملابس مريحة",
        ],
        options: [],
        addOns: [],
        startingPrice: 50,
        bookingFields: ["name", "guests", "childrenUnder5", "hotel", "date", "time", "notes"],
    },

    // ═══════════════════════════════════════════════════════════════
    // 6. عرض الدولفين
    // ═══════════════════════════════════════════════════════════════
    {
        slug: "dolphin-show",
        titleAr: "عرض الدولفين",
        titleEn: "Dolphin Show Experience",
        taglineAr: "استمتع بعروض مذهلة من أذكى كائنات البحر",
        descriptionAr:
            "شاهد عروض الدلافين الممتعة والمدهشة في شرم الشيخ! عرض تفاعلي رائع يناسب جميع الأعمار، حيث تتعلم عن الدلافين وتشاهدها تقوم بحركات بهلوانية مذهلة. فرصة رائعة للتصوير والاستمتاع مع العائلة.",
        heroImage: "https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=1400&q=80",
        galleryImages: [
            "https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=800&q=80",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
        ],
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        schedule: {
            startTime: "03:00 PM",
            endTime: "05:00 PM",
            duration: "ساعتان",
            frequency: "يومياً",
        },
        includes: [
            "تذكرة دخول العرض",
            "مقعد مميز",
        ],
        essentials: [
            "كاميرا",
            "ملابس مريحة",
            "نظارات شمسية",
        ],
        options: [],
        addOns: [
            {
                id: "transfers-dolphin",
                nameAr: "خدمة الانتقالات",
                nameEn: "Transfer Service",
                price: 10,
                descriptionAr: "انتقالات ذهاب وعودة من الفندق",
                icon: "🚗",
            },
        ],
        startingPrice: 35,
        bookingFields: ["name", "guests", "childrenUnder5", "hotel", "date", "addOns", "notes"],
    },

    // ═══════════════════════════════════════════════════════════════
    // 7. أكوا بارك ألباتروس
    // ═══════════════════════════════════════════════════════════════
    {
        slug: "albatros-aqua-park",
        titleAr: "أكوا بارك ألباتروس",
        titleEn: "Albatros Aqua Park Experience",
        taglineAr: "يوم كامل من المرح والمغامرة المائية للعائلة",
        descriptionAr:
            "استمتع بيوم كامل من المرح في أكوا بارك ألباتروس الشهير في شرم الشيخ! زلاقات مائية متنوعة، مسابح للكبار والصغار، ومنطقة ألعاب مائية للأطفال. يوم مثالي للعائلات والمجموعات.",
        heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80",
        galleryImages: [
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
            "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=800&q=80",
            "https://images.unsplash.com/photo-1437719417032-8799fe6344c2?w=800&q=80",
        ],
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        schedule: {
            startTime: "10:00 AM",
            endTime: "05:00 PM",
            duration: "7 ساعات",
            frequency: "يومياً",
        },
        includes: [
            "تذكرة دخول الأكوا بارك",
            "استخدام جميع الألعاب المائية",
            "وجبة غداء",
        ],
        essentials: [
            "ملابس سباحة",
            "منشفة",
            "كريم واقي من الشمس",
            "نظارات شمسية",
            "ملابس بديلة",
        ],
        options: [],
        addOns: [
            {
                id: "transfers-aqua",
                nameAr: "خدمة الانتقالات",
                nameEn: "Transfer Service",
                price: 10,
                descriptionAr: "انتقالات ذهاب وعودة من الفندق",
                icon: "🚗",
            },
        ],
        startingPrice: 40,
        bookingFields: ["name", "guests", "childrenUnder5", "hotel", "date", "addOns", "notes"],
    },

    // ═══════════════════════════════════════════════════════════════
    // 8. رحلة غطس من الشاطئ
    // ═══════════════════════════════════════════════════════════════
    {
        slug: "shore-diving",
        titleAr: "رحلة غطس من الشاطئ",
        titleEn: "Shore Diving Experience",
        taglineAr: "اغطس في عالم الشعاب المرجانية مباشرة من الشاطئ",
        descriptionAr:
            "تجربة غوص احترافية من شواطئ شرم الشيخ الشهيرة! مع مدرب محترف ومعدات كاملة، ستستكشف أجمل مواقع الغوص في البحر الأحمر. مناسبة للمبتدئين والمحترفين على حد سواء.",
        heroImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1400&q=80",
        galleryImages: [
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
            "https://images.unsplash.com/photo-1582967788606-a171c7FA6c79?w=800&q=80",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        ],
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        schedule: {
            startTime: "09:00 AM",
            endTime: "01:00 PM",
            duration: "4 ساعات",
            frequency: "يومياً",
        },
        includes: [
            "معدات الغوص الكاملة",
            "مدرب غوص محترف",
            "شهادة غوص تذكارية",
            "تأمين بحري",
        ],
        essentials: [
            "ملابس سباحة",
            "منشفة",
            "كريم واقي من الشمس",
        ],
        options: [],
        addOns: [
            {
                id: "transfers-diving",
                nameAr: "خدمة الانتقالات",
                nameEn: "Transfer Service",
                price: 10,
                descriptionAr: "انتقالات ذهاب وعودة من الفندق",
                icon: "🚗",
            },
        ],
        startingPrice: 45,
        bookingFields: ["name", "guests", "hotel", "date", "time", "addOns", "notes"],
    },

    // ═══════════════════════════════════════════════════════════════
    // 9. جولة مدينة شرم الشيخ
    // ═══════════════════════════════════════════════════════════════
    {
        slug: "sharm-city-tour",
        titleAr: "جولة مدينة شرم الشيخ",
        titleEn: "Sharm El Sheikh City Tour",
        taglineAr: "اكتشف معالم وأسواق شرم الشيخ مع مرشد محلي",
        descriptionAr:
            "جولة شاملة في أبرز معالم مدينة شرم الشيخ! زيارة السوق القديم، المسجد السماوي، الكنيسة السماوية، خليج نعمة، وأشهر المطاعم والمقاهي. فرصة رائعة للتعرف على ثقافة المدينة وتاريخها.",
        heroImage: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1400&q=80",
        galleryImages: [
            "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=80",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
            "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80",
        ],
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        schedule: {
            startTime: "10:00 AM",
            endTime: "06:00 PM",
            duration: "8 ساعات",
            frequency: "يومياً",
        },
        includes: [
            "الانتقالات ذهاب وعودة من الفندق",
            "مرشد سياحي محلي",
            "دخول المعالم",
        ],
        essentials: [
            "ملابس مريحة",
            "حذاء مريح للمشي",
            "نظارات شمسية",
            "كريم واقي من الشمس",
            "كاميرا",
            "مبلغ نقدي للتسوق",
        ],
        options: [],
        addOns: [],
        startingPrice: 25,
        bookingFields: ["name", "guests", "hotel", "date", "time", "notes"],
    },
];

// Helper to find a trip by slug
export function getTripBySlug(slug: string): TripDetail | undefined {
    return allTrips.find((t) => t.slug === slug);
}
