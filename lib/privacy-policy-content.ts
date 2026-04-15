import type { LegalDocument, LegalLocale } from "@/lib/legal-content";

const privacyPolicyContent: Record<LegalLocale, LegalDocument> = {
  ar: {
    eyebrow: "قانوني",
    title: "سياسة الخصوصية",
    intro:
      "في شركة Oday Tourism، نلتزم بحماية خصوصية عملائنا والتعامل مع بياناتهم الشخصية بأقصى درجات الأمان والمسؤولية.",
    sections: [
      {
        title: "1. المعلومات التي نقوم بجمعها",
        body: ["قد نقوم بجمع المعلومات التالية عند استخدامك لموقعنا أو خدماتنا:"],
        bullets: [
          "الاسم الكامل",
          "رقم الهاتف",
          "البريد الإلكتروني",
          "الجنسية",
          "تفاصيل الحجز (الفنادق، الرحلات، تواريخ السفر)",
        ],
      },
      {
        title: "2. كيفية استخدام المعلومات",
        body: ["نستخدم المعلومات التي يتم جمعها للأغراض التالية:"],
        bullets: [
          "تأكيد وتنفيذ الحجوزات",
          "التواصل مع العملاء بخصوص الخدمات",
          "تقديم الدعم الفني وخدمة العملاء",
          "تحسين جودة خدماتنا وتجربة المستخدم",
        ],
      },
      {
        title: "3. مشاركة المعلومات",
        body: [
          "نحن لا نقوم ببيع أو تأجير أو مشاركة بيانات العملاء مع أي طرف ثالث.",
          "قد يتم مشاركة البيانات فقط مع الجهات المعنية، مثل الفنادق أو مزودي الخدمات، وذلك بهدف تنفيذ الحجز المطلوب.",
        ],
      },
      {
        title: "4. حماية البيانات",
        body: [
          "نلتزم باتخاذ جميع الإجراءات الأمنية اللازمة لحماية بياناتكم من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف.",
        ],
      },
      {
        title: "5. ملفات تعريف الارتباط (Cookies)",
        body: [
          "قد يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربة المستخدم وتحليل أداء الموقع.",
          "يمكنك تعطيل هذه الخاصية من خلال إعدادات المتصفح الخاص بك.",
        ],
      },
      {
        title: "6. حقوق المستخدم",
        body: ["يحق لك:"],
        bullets: [
          "الاطلاع على بياناتك الشخصية",
          "طلب تعديل أو حذف بياناتك",
          "سحب الموافقة على استخدام البيانات في أي وقت",
        ],
      },
      {
        title: "7. روابط الطرف الثالث",
        body: [
          "قد يحتوي موقعنا على روابط لمواقع خارجية، ولسنا مسؤولين عن سياسات الخصوصية الخاصة بهذه المواقع.",
        ],
      },
      {
        title: "8. تحديثات السياسة",
        body: [
          "نحتفظ بحق تحديث هذه السياسة في أي وقت، وسيتم نشر أي تعديلات على هذه الصفحة.",
        ],
      },
    ],
  },
  en: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    intro:
      "At Oday Tourism, we are committed to protecting our customers' privacy and handling personal data with the highest standards of security and responsibility.",
    sections: [
      {
        title: "1. Information We Collect",
        body: ["We may collect the following information when you use our website or services:"],
        bullets: [
          "Full name",
          "Phone number",
          "Email address",
          "Nationality",
          "Booking details (hotels, trips, travel dates)",
        ],
      },
      {
        title: "2. How We Use Information",
        body: ["We use the information we collect for the following purposes:"],
        bullets: [
          "Confirming and processing bookings",
          "Communicating with customers about services",
          "Providing technical support and customer service",
          "Improving our service quality and user experience",
        ],
      },
      {
        title: "3. Information Sharing",
        body: [
          "We do not sell, rent, or share customer data with any third party.",
          "Data may only be shared with the relevant parties, such as hotels or service providers, when necessary to fulfill the requested booking.",
        ],
      },
      {
        title: "4. Data Protection",
        body: [
          "We are committed to taking all necessary security measures to protect your data from unauthorized access, alteration, disclosure, or destruction.",
        ],
      },
      {
        title: "5. Cookies",
        body: [
          "Our website may use cookies to improve user experience and analyze site performance.",
          "You can disable this feature through your browser settings.",
        ],
      },
      {
        title: "6. User Rights",
        body: ["You have the right to:"],
        bullets: [
          "Access your personal data",
          "Request correction or deletion of your data",
          "Withdraw consent for data use at any time",
        ],
      },
      {
        title: "7. Third-Party Links",
        body: [
          "Our website may contain links to external websites, and we are not responsible for the privacy policies of those websites.",
        ],
      },
      {
        title: "8. Policy Updates",
        body: [
          "We reserve the right to update this policy at any time, and any changes will be published on this page.",
        ],
      },
    ],
  },
};

export function getPrivacyPolicyContent(locale: LegalLocale): LegalDocument {
  return privacyPolicyContent[locale];
}
