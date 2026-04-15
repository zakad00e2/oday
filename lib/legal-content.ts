export type LegalLocale = "ar" | "en";

export interface LegalSection {
  title: string;
  body?: string[];
  bullets?: string[];
}

export interface LegalDocument {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
}

export interface LegalCheckoutCopy {
  title: string;
  intro: string;
  termsLabel: string;
  refundLabel: string;
  termsLink: string;
  refundLink: string;
  agreementLabel: string;
  agreementError: string;
  whatsappNote: string;
  summaryTitle: string;
  acceptanceLine: string;
  acceptedAt: string;
  consentChannel: string;
}

export interface LegalContent {
  terms: LegalDocument;
  refund: LegalDocument;
  checkout: LegalCheckoutCopy;
}

const legalContent: Record<LegalLocale, LegalContent> = {
  en: {
    terms: {
      eyebrow: "Legal",
      title: "Terms & Conditions",
      intro:
        "These terms govern bookings and services arranged by Oday Tourism. Completing a payment or confirming a booking means you accept these terms together with the refund policy.",
      sections: [
        {
          title: "Bookings & Confirmation",
          bullets: [
            "All bookings are subject to availability at the time of request.",
            "A booking is only confirmed after full payment or the agreed deposit is completed.",
          ],
        },
        {
          title: "Pricing Policy",
          bullets: [
            "All prices provided by the company are official, final, and non-negotiable.",
            "Prices in the market may vary depending on the level of service, and the company is committed to delivering quality and service for the listed price.",
            "The customer is not entitled to request a price reduction after booking if lower prices are found elsewhere.",
            "Prices are made clear before booking, and payment constitutes final acceptance of the price and service.",
          ],
        },
        {
          title: "Accuracy of Information",
          bullets: [
            "The customer must ensure all entered details, including names, dates, and nationalities, are correct.",
            "The company is not responsible for any errors resulting from incorrect customer information.",
          ],
        },
        {
          title: "Hotel Check-in / Check-out",
          bullets: [
            "Check-in starts from 2:00 PM.",
            "Check-out is at 12:00 PM.",
            "Early check-in or late check-out is subject to availability and may incur additional charges.",
          ],
        },
        {
          title: "Peak Seasons",
          bullets: [
            "Peak seasons include Eid holidays, New Year, public holidays, and high tourist seasons.",
            "Cancellation less than 15 days before arrival during peak periods may result in a 100% charge.",
          ],
        },
        {
          title: "Tours & Activities",
          bullets: [
            "Customers must adhere to scheduled timings.",
            "In case of delay or no show, the service is considered fully used and non-refundable.",
          ],
        },
        {
          title: "Force Majeure",
          bullets: [
            "The company is not responsible for delays or cancellations caused by circumstances beyond its control, including weather conditions, government decisions, or emergencies.",
          ],
        },
        {
          title: "No Show",
          bullets: [
            "Failure to attend any booked service will result in no refund.",
          ],
        },
        {
          title: "Third-Party Services",
          bullets: [
            "Some services, including flight tickets, security coordination, and certain activities, are subject to external providers' policies and may be non-refundable.",
          ],
        },
        {
          title: "Compliance",
          bullets: [
            "Customers must follow all safety instructions and guidelines.",
            "The company is not responsible for damages caused by non-compliance.",
          ],
        },
        {
          title: "Photographers & Sales Representatives",
          bullets: [
            "Photographers or external sales representatives may be present during trips, and they are not affiliated with Oday Tourism.",
            "The company is not responsible for any financial transactions, service quality, or delivery related to them.",
            "Any dealings with them are at the customer's own risk.",
            "Official company representatives are only those introduced beforehand or wearing official uniforms.",
          ],
        },
        {
          title: "External Transactions",
          bullets: [
            "Any transactions conducted outside Oday Tourism are entirely the customer's responsibility.",
          ],
        },
        {
          title: "Acceptance of Terms",
          bullets: [
            "Completing payment, whether online or otherwise, constitutes full and final acceptance of all terms, conditions, and the refund policy.",
          ],
        },
      ],
    },
    refund: {
      eyebrow: "Legal",
      title: "Refund Policy",
      intro:
        "This refund policy applies to all services provided by Oday Tourism, including hotels, tours, flights, and security coordination services.",
      sections: [
        {
          title: "Scope",
          bullets: [
            "This policy applies to all services provided by Oday Tourism, including hotels, tours, flights, and security coordination services.",
          ],
        },
        {
          title: "Hotels & Tours Cancellation",
          bullets: [
            "More than 10 days before arrival: first night hotel fee plus 20% of tours are deducted, and the remaining balance is refunded.",
            "5 to 10 days before arrival: two nights hotel fee plus 30% of tours are deducted, and the remaining balance is refunded if applicable.",
            "Less than 5 days before arrival or in case of no show: no refund.",
          ],
        },
        {
          title: "Peak Seasons",
          bullets: [
            "During peak periods such as Eid, New Year, holidays, and high seasons, stricter cancellation policies may apply.",
            "Deductions may reach 100% if cancelled within 10 to 15 days.",
            "Specific conditions will be clarified before booking confirmation.",
          ],
        },
        {
          title: "Non-Refundable Services",
          bullets: [
            "Flight tickets are non-refundable and non-changeable after confirmation.",
            "Security approvals and coordination are non-refundable under any circumstances.",
          ],
        },
        {
          title: "Force Majeure",
          bullets: [
            "In case of uncontrollable events, bookings are handled according to service providers' policies, with possible alternatives offered when available.",
          ],
        },
        {
          title: "Refund Method & Timeline",
          bullets: [
            "Refunds are processed within 7 to 14 business days.",
            "Refunds are issued via the same payment method used.",
          ],
        },
        {
          title: "No Show",
          bullets: [
            "No refunds will be issued if the customer does not attend the service.",
          ],
        },
        {
          title: "Policy Acceptance",
          bullets: [
            "Payment or booking confirmation constitutes full acceptance of this policy.",
          ],
        },
      ],
    },
    checkout: {
      title: "Terms Approval Before Checkout",
      intro:
        "Please review the Terms & Conditions, Refund Policy, and Privacy Policy carefully. You must agree before sending your booking request.",
      termsLabel: "Terms & Conditions",
      refundLabel: "Refund Policy",
      termsLink: "Open full Terms & Conditions page",
      refundLink: "Open full Refund Policy page",
      agreementLabel:
        "I have read and agree to the Terms & Conditions, Refund Policy, and Privacy Policy, and I understand that sending this request via WhatsApp will serve as my approval for confirmation and record.",
      agreementError:
        "You must agree to the Terms & Conditions, Refund Policy, and Privacy Policy before completing the booking.",
      whatsappNote:
        "After agreement, your approval will be included in the WhatsApp confirmation message for record.",
      summaryTitle: "Customer Agreement Before Checkout",
      acceptanceLine: "Accepted terms, refund policy, and privacy policy",
      acceptedAt: "Accepted at",
      consentChannel: "Approval sent via WhatsApp for confirmation and record",
    },
  },
  ar: {
    terms: {
      eyebrow: "قانوني",
      title: "الشروط والأحكام",
      intro:
        "تنظم هذه الشروط جميع الحجوزات والخدمات المقدمة من Oday Tourism. ويعد إتمام الدفع أو تأكيد الحجز موافقة كاملة على هذه الشروط وعلى سياسة الاسترداد.",
      sections: [
        {
          title: "الحجوزات والتأكيد",
          bullets: [
            "جميع الحجوزات تخضع للتوافر وقت طلب الحجز.",
            "لا يعتبر الحجز مؤكداً إلا بعد سداد كامل المبلغ أو العربون المتفق عليه.",
          ],
        },
        {
          title: "سياسة التسعير",
          bullets: [
            "جميع الأسعار المقدمة من الشركة هي أسعار رسمية نهائية وغير قابلة للتفاوض.",
            "تختلف الأسعار في السوق حسب مستوى الخدمة، والشركة ملتزمة بتقديم جودة وخدمة مقابل السعر المعروض.",
            "لا يحق للعميل المطالبة بتخفيض السعر بعد الحجز في حال وجود أسعار أقل لدى جهات أخرى.",
            "الأسعار تكون واضحة قبل الحجز، ويُعتبر الدفع موافقة نهائية على السعر والخدمة.",
          ],
        },
        {
          title: "دقة المعلومات",
          bullets: [
            "يجب على العميل التأكد من صحة جميع البيانات المدخلة مثل الأسماء والتواريخ والجنسيات.",
            "الشركة غير مسؤولة عن أي أخطاء ناتجة عن إدخال معلومات غير صحيحة من قبل العميل.",
          ],
        },
        {
          title: "تسجيل الدخول والخروج بالفنادق",
          bullets: [
            "تسجيل الدخول يبدأ من الساعة 2:00 ظهراً.",
            "تسجيل الخروج الساعة 12:00 ظهراً.",
            "الدخول المبكر أو الخروج المتأخر يخضع للتوافر وقد يترتب عليه رسوم إضافية.",
          ],
        },
        {
          title: "المواسم والأوقات المرتفعة",
          bullets: [
            "تشمل المواسم المرتفعة الأعياد، ورأس السنة، والعطلات الرسمية، وفترات الذروة السياحية.",
            "قد يؤدي الإلغاء قبل الوصول بأقل من 15 يوماً خلال هذه الفترات إلى خصم يصل إلى 100%.",
          ],
        },
        {
          title: "الرحلات والأنشطة",
          bullets: [
            "يلتزم العملاء بالمواعيد المحددة للرحلات والأنشطة.",
            "في حالة التأخير أو عدم الحضور، تعتبر الخدمة مستخدمة بالكامل وغير قابلة للاسترداد.",
          ],
        },
        {
          title: "القوة القاهرة",
          bullets: [
            "الشركة غير مسؤولة عن أي تأخير أو إلغاء ناتج عن ظروف خارجة عن الإرادة مثل الأحوال الجوية أو القرارات الحكومية أو الحالات الطارئة.",
          ],
        },
        {
          title: "عدم الحضور",
          bullets: [
            "عدم حضور العميل لأي خدمة محجوزة يؤدي إلى عدم استحقاق أي استرداد.",
          ],
        },
        {
          title: "خدمات الجهات الخارجية",
          bullets: [
            "بعض الخدمات مثل تذاكر الطيران، والتنسيقات الأمنية، وبعض الأنشطة تخضع لسياسات مزودي الخدمة الخارجيين وقد تكون غير قابلة للاسترداد.",
          ],
        },
        {
          title: "الالتزام بالتعليمات",
          bullets: [
            "يجب على العملاء الالتزام بجميع تعليمات وإرشادات السلامة.",
            "الشركة غير مسؤولة عن أي أضرار تنتج عن عدم الالتزام.",
          ],
        },
        {
          title: "المصورون ومندوبي المبيعات الخارجيون",
          bullets: [
            "قد يتواجد مصورون أو مندوبو مبيعات خارجيون أثناء الرحلات، وهم غير تابعين لشركة Oday Tourism.",
            "الشركة غير مسؤولة عن أي معاملات مالية أو جودة خدمات أو تسليم يخصهم.",
            "أي تعامل معهم يكون على مسؤولية العميل الشخصية.",
            "ممثلو الشركة الرسميون هم فقط من يتم التعريف بهم مسبقاً أو من يرتدون الزي الرسمي المعتمد.",
          ],
        },
        {
          title: "المعاملات الخارجية",
          bullets: [
            "أي معاملات تتم خارج Oday Tourism تكون مسؤوليتها كاملة على العميل.",
          ],
        },
        {
          title: "قبول الشروط",
          bullets: [
            "إتمام الدفع، سواء إلكترونياً أو بأي وسيلة أخرى، يعد قبولاً نهائياً وكاملاً لجميع الشروط والأحكام وسياسة الاسترداد وسياسة الخصوصية.",
          ],
        },
      ],
    },
    refund: {
      eyebrow: "قانوني",
      title: "سياسة الاسترداد",
      intro:
        "تطبق هذه السياسة على جميع الخدمات التي تقدمها Oday Tourism، بما في ذلك الفنادق والرحلات الجوية والبرية وخدمات التنسيق الأمني.",
      sections: [
        {
          title: "نطاق التطبيق",
          bullets: [
            "تسري هذه السياسة على جميع الخدمات المقدمة من Oday Tourism، بما يشمل الفنادق والرحلات وتذاكر الطيران وخدمات التنسيق الأمني.",
          ],
        },
        {
          title: "إلغاء الفنادق والرحلات",
          bullets: [
            "أكثر من 10 أيام قبل الوصول: يتم خصم قيمة الليلة الأولى من الفندق و20% من قيمة الرحلات، ويُرد المتبقي من الرصيد.",
            "من 5 إلى 10 أيام قبل الوصول: يتم خصم قيمة ليلتين من الفندق و30% من قيمة الرحلات، ويُرد المتبقي إن وجد.",
            "أقل من 5 أيام قبل الوصول أو في حالة عدم الحضور: لا يوجد استرداد.",
          ],
        },
        {
          title: "المواسم المرتفعة",
          bullets: [
            "خلال فترات الذروة مثل الأعياد ورأس السنة والعطلات الرسمية والمواسم السياحية المرتفعة، قد تطبق سياسات إلغاء أكثر تشدداً.",
            "قد تصل الخصومات إلى 100% عند الإلغاء خلال 10 إلى 15 يوماً قبل الوصول.",
            "يتم توضيح أي شروط خاصة قبل تأكيد الحجز.",
          ],
        },
        {
          title: "الخدمات غير القابلة للاسترداد",
          bullets: [
            "تذاكر الطيران غير قابلة للاسترداد أو التعديل بعد التأكيد.",
            "الموافقات أو التنسيقات الأمنية غير قابلة للاسترداد تحت أي ظرف.",
          ],
        },
        {
          title: "القوة القاهرة",
          bullets: [
            "في حال وقوع أحداث خارجة عن الإرادة، يتم التعامل مع الحجوزات وفق سياسات مزودي الخدمة، مع إمكانية تقديم بدائل عند التوفر.",
          ],
        },
        {
          title: "طريقة ومدة الاسترداد",
          bullets: [
            "تتم معالجة طلبات الاسترداد خلال 7 إلى 14 يوم عمل.",
            "يتم رد المبالغ عبر نفس وسيلة الدفع المستخدمة.",
          ],
        },
        {
          title: "عدم الحضور",
          bullets: [
            "لا يتم إصدار أي استرداد في حال عدم حضور العميل للخدمة المحجوزة.",
          ],
        },
        {
          title: "قبول السياسة",
          bullets: [
            "يعد الدفع أو تأكيد الحجز موافقة كاملة على هذه السياسة.",
          ],
        },
      ],
    },
    checkout: {
      title: "الموافقة على الشروط قبل إتمام الحجز",
      intro:
        "يرجى مراجعة الشروط والأحكام وسياسة الاسترداد وسياسة الخصوصية بعناية. يجب الموافقة عليها قبل إرسال طلب الحجز.",
      termsLabel: "الشروط والأحكام",
      refundLabel: "سياسة الاسترداد",
      termsLink: "فتح صفحة الشروط والأحكام كاملة",
      refundLink: "فتح صفحة سياسة الاسترداد كاملة",
      agreementLabel:
        "أقر بأنني قرأت ووافقت على الشروط والأحكام وسياسة الاسترداد وسياسة الخصوصية، وأفهم أن إرسال هذا الطلب عبر واتساب يعد موافقة مني لأغراض التأكيد والحفظ في السجلات.",
      agreementError:
        "يجب الموافقة على الشروط والأحكام وسياسة الاسترداد وسياسة الخصوصية قبل إتمام الحجز.",
      whatsappNote:
        "بعد الموافقة، سيتم تضمين هذا الإقرار داخل رسالة واتساب للتأكيد والحفظ في السجلات.",
      summaryTitle: "إقرار العميل قبل إتمام الحجز",
      acceptanceLine: "تمت الموافقة على الشروط وسياسة الاسترداد وسياسة الخصوصية",
      acceptedAt: "وقت الموافقة",
      consentChannel: "تم إرسال الموافقة عبر واتساب للتأكيد والحفظ في السجلات",
    },
  },
};

export function getLegalContent(locale: LegalLocale): LegalContent {
  return legalContent[locale];
}
