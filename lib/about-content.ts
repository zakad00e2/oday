export const ABOUT_CONTENT_STORAGE_KEY = "oday-about-content";
export const ABOUT_CONTENT_UPDATED_EVENT = "oday-about-content-updated";

export interface AboutReview {
  id: string;
  nameAr: string;
  nameEn: string;
  locationAr: string;
  locationEn: string;
  serviceAr: string;
  serviceEn: string;
  rating: number;
  textAr: string;
  textEn: string;
  isPublished: boolean;
  isFeatured: boolean;
}

export interface AboutFaq {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  isPublished: boolean;
}

export interface AboutContent {
  reviews: AboutReview[];
  faqs: AboutFaq[];
}

export const defaultAboutContent: AboutContent = {
  reviews: [
    {
      id: "review-1",
      nameAr: "محمد أحمد",
      nameEn: "Mohamed Ahmed",
      locationAr: "القاهرة",
      locationEn: "Cairo",
      serviceAr: "رحلة شرم الشيخ",
      serviceEn: "Sharm El-Sheikh trip",
      rating: 5,
      textAr: "تجربة ممتازة من البداية للنهاية! الفندق كان فوق التوقعات والمرشد السياحي كان محترف جداً. أنصح الجميع بالتعامل مع Oday Tourism.",
      textEn: "An excellent experience from start to finish. The hotel exceeded expectations and the tour guide was highly professional. I highly recommend booking with Oday Tourism.",
      isPublished: true,
      isFeatured: true,
    },
    {
      id: "review-2",
      nameAr: "سارة عبدالله",
      nameEn: "Sara Abdallah",
      locationAr: "الإسكندرية",
      locationEn: "Alexandria",
      serviceAr: "إجازة عائلية",
      serviceEn: "Family holiday",
      rating: 5,
      textAr: "رحلة شرم الشيخ كانت لا تُنسى! كل شيء منظم بشكل مذهل من الحجز للإقامة. شكراً لفريق عدي للسياحة.",
      textEn: "Our Sharm El-Sheikh trip was unforgettable. Everything was perfectly organized from booking to accommodation. Thanks to the Oday Tourism team.",
      isPublished: true,
      isFeatured: true,
    },
    {
      id: "review-3",
      nameAr: "أحمد فوزي",
      nameEn: "Ahmed Fawzy",
      locationAr: "المنصورة",
      locationEn: "Mansoura",
      serviceAr: "رحلة نيلية",
      serviceEn: "Nile experience",
      rating: 4,
      textAr: "خدمة عملاء ممتازة وأسعار تنافسية جداً. الرحلة النيلية كانت تجربة رائعة لي ولعائلتي.",
      textEn: "Excellent customer service and very competitive prices. The Nile trip was a wonderful experience for me and my family.",
      isPublished: true,
      isFeatured: false,
    },
    {
      id: "review-4",
      nameAr: "نورا حسين",
      nameEn: "Noura Hussein",
      locationAr: "الجيزة",
      locationEn: "Giza",
      serviceAr: "برنامج مخصص",
      serviceEn: "Custom itinerary",
      rating: 5,
      textAr: "أفضل شركة سياحة تعاملت معها. الاهتمام بالتفاصيل والمرونة في التعديلات كانت مذهلة.",
      textEn: "This is the best travel company I have worked with. Their attention to detail and flexibility with changes were outstanding.",
      isPublished: true,
      isFeatured: true,
    },
    {
      id: "review-5",
      nameAr: "علي محمود",
      nameEn: "Ali Mahmoud",
      locationAr: "السويس",
      locationEn: "Suez",
      serviceAr: "إجازة الغردقة",
      serviceEn: "Hurghada getaway",
      rating: 5,
      textAr: "حجزنا رحلة الغردقة وكانت من أجمل الرحلات. الفندق ممتاز والأنشطة البحرية رائعة!",
      textEn: "We booked a Hurghada trip and it was one of our best vacations. The hotel was excellent and the sea activities were amazing.",
      isPublished: true,
      isFeatured: false,
    },
    {
      id: "review-6",
      nameAr: "ريم خالد",
      nameEn: "Reem Khaled",
      locationAr: "أسيوط",
      locationEn: "Assiut",
      serviceAr: "دعم الحجز",
      serviceEn: "Booking support",
      rating: 4,
      textAr: "تعامل راقي وخدمة سريعة عبر الواتساب. الرحلة كانت منظمة بشكل احترافي من الألف للياء.",
      textEn: "Very professional service and quick support on WhatsApp. The trip was organized smoothly from beginning to end.",
      isPublished: true,
      isFeatured: false,
    },
  ],
  faqs: [
    {
      id: "faq-1",
      questionAr: "كيف يمكنني حجز رحلة مع Oday Tourism؟",
      questionEn: "How can I book a trip with Oday Tourism?",
      answerAr: "يمكنك بسهولة حجز رحلتك من خلال صفحة الرحلات أو عبر التواصل المباشر معنا على الواتساب لاختيار البرنامج الأنسب لك.",
      answerEn: "You can book directly through the trips page or contact us on WhatsApp to choose the itinerary that fits you best.",
      isPublished: true,
    },
    {
      id: "faq-2",
      questionAr: "هل الأسعار تشمل تذاكر الطيران؟",
      questionEn: "Do your packages include flights?",
      answerAr: "بعض الباقات تشمل تذاكر الطيران والبعض الآخر يركز على الفندق والانتقالات والأنشطة. ستجد التفاصيل موضحة داخل كل باقة.",
      answerEn: "Some packages include flights, while others focus on accommodation, transfers, and activities. Each package clearly lists what is included.",
      isPublished: true,
    },
    {
      id: "faq-3",
      questionAr: "هل توفرون خدمة الاستقبال من المطار؟",
      questionEn: "Do you provide airport pickup?",
      answerAr: "نعم، نوفر خدمة استقبال وتوديع من وإلى المطار بسيارات حديثة وسائقين محترفين لضمان رحلة مريحة من البداية.",
      answerEn: "Yes. We offer airport pickup and drop-off with modern vehicles and professional drivers to make your arrival smooth.",
      isPublished: true,
    },
    {
      id: "faq-4",
      questionAr: "هل يمكن تعديل الحجز أو إلغاؤه؟",
      questionEn: "Can I change or cancel my booking?",
      answerAr: "يمكن تعديل أو إلغاء الحجز بحسب سياسة الإلغاء الخاصة بالخدمة أو الفندق، ويتم توضيح ذلك قبل تأكيد الطلب النهائي.",
      answerEn: "Bookings can be changed or canceled according to the cancellation policy of the selected service or hotel, and we clarify that before confirmation.",
      isPublished: true,
    },
    {
      id: "faq-5",
      questionAr: "ما هي الأنشطة المتاحة في رحلاتكم؟",
      questionEn: "What activities do you offer?",
      answerAr: "نوفر رحلات بحرية ويخوت وسنوركلينج وغوص وسفاري صحراوي وعشاء بدوي وزيارات لأشهر المعالم السياحية في شرم الشيخ وما حولها.",
      answerEn: "We offer boat trips, yacht cruises, snorkeling, diving, desert safari, Bedouin dinners, and visits to the best-known attractions around Sharm El-Sheikh.",
      isPublished: true,
    },
  ],
};

function clampRating(value: unknown) {
  const rating = Number(value);

  if (!Number.isFinite(rating)) {
    return 5;
  }

  return Math.min(5, Math.max(1, Math.round(rating)));
}

function normalizeReview(review: Partial<AboutReview> | undefined, index: number): AboutReview {
  return {
    id: review?.id || `review-${index + 1}`,
    nameAr: review?.nameAr || "",
    nameEn: review?.nameEn || "",
    locationAr: review?.locationAr || "",
    locationEn: review?.locationEn || "",
    serviceAr: review?.serviceAr || "",
    serviceEn: review?.serviceEn || "",
    rating: clampRating(review?.rating),
    textAr: review?.textAr || "",
    textEn: review?.textEn || "",
    isPublished: review?.isPublished ?? true,
    isFeatured: review?.isFeatured ?? false,
  };
}

function normalizeFaq(faq: Partial<AboutFaq> | undefined, index: number): AboutFaq {
  return {
    id: faq?.id || `faq-${index + 1}`,
    questionAr: faq?.questionAr || "",
    questionEn: faq?.questionEn || "",
    answerAr: faq?.answerAr || "",
    answerEn: faq?.answerEn || "",
    isPublished: faq?.isPublished ?? true,
  };
}

export function cloneAboutContent(content: AboutContent = defaultAboutContent): AboutContent {
  return {
    reviews: content.reviews.map((review, index) => normalizeReview(review, index)),
    faqs: content.faqs.map((faq, index) => normalizeFaq(faq, index)),
  };
}

export function normalizeAboutContent(content?: Partial<AboutContent> | null): AboutContent {
  const reviews = Array.isArray(content?.reviews) ? content.reviews : defaultAboutContent.reviews;
  const faqs = Array.isArray(content?.faqs) ? content.faqs : defaultAboutContent.faqs;

  return {
    reviews: reviews.map((review, index) => normalizeReview(review, index)),
    faqs: faqs.map((faq, index) => normalizeFaq(faq, index)),
  };
}

export function readAboutContent(): AboutContent {
  if (typeof window === "undefined") {
    return cloneAboutContent();
  }

  try {
    const stored = window.localStorage.getItem(ABOUT_CONTENT_STORAGE_KEY);

    if (!stored) {
      return cloneAboutContent();
    }

    return normalizeAboutContent(JSON.parse(stored) as Partial<AboutContent>);
  } catch {
    return cloneAboutContent();
  }
}

export function saveAboutContent(content: AboutContent) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ABOUT_CONTENT_STORAGE_KEY, JSON.stringify(normalizeAboutContent(content)));
  window.dispatchEvent(new Event(ABOUT_CONTENT_UPDATED_EVENT));
}
