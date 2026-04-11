import type { LegalDocument, LegalLocale } from "@/lib/legal-content";

interface SecurityApprovalLegalContent {
  terms: LegalDocument;
  refund: LegalDocument;
}

const securityApprovalLegalContent: Record<LegalLocale, SecurityApprovalLegalContent> = {
  ar: {
    terms: {
      eyebrow: "Oday Tourism - التنسيق الأمني",
      title: "الشروط والأحكام",
      intro:
        "تنطبق هذه الشروط والأحكام على خدمة التنسيق الأمني المقدمة من Oday Tourism عبر الجهات المختصة داخل جمهورية مصر العربية.",
      sections: [
        {
          title: "1. تعريف الخدمة",
          body: [
            "خدمة التنسيق الأمني هي إجراء يتم تقديمه عبر الجهات المختصة داخل جمهورية مصر العربية، بهدف تسهيل دخول المسافر إلى البلاد وفقًا للأنظمة المعمول بها.",
          ],
        },
        {
          title: "2. مسؤولية الشركة",
          bullets: [
            "تلتزم الشركة بتقديم طلب التنسيق الأمني ومتابعته مع الجهات المختصة.",
            "الشركة ليست جهة إصدار القرار النهائي، ولا تملك أي سلطة على القبول أو الرفض.",
            "لا تتحمل الشركة أي مسؤولية عن الرفض أو التأخير الصادر من الجهات الأمنية.",
          ],
        },
        {
          title: "3. قرارات الجهات الأمنية",
          bullets: [
            "جميع القرارات هي قرارات سيادية صادرة عن الجهات المختصة.",
            "يحق للجهات الأمنية رفض الطلب دون إبداء أو توضيح أي أسباب.",
            "لا تتحمل الشركة أي مسؤولية عن قرارات القبول أو الرفض.",
          ],
        },
        {
          title: "4. إجراءات المطار",
          bullets: [
            "جميع إجراءات الدخول تخضع للجهات الأمنية المختصة، وقد تتطلب مدة انتظار داخل المطار.",
            "الشركة غير مسؤولة عن مدة الانتظار أو أي إجراءات أو قرارات تصدر داخل المطار.",
          ],
        },
        {
          title: "5. صلاحية الموافقة",
          bullets: [
            "الموافقة الأمنية صالحة لمدة محددة، عادةً 3 شهور ما لم يُذكر غير ذلك.",
            "في حال عدم السفر خلال فترة الصلاحية، تُعتبر الموافقة لاغية دون أي استرداد.",
          ],
        },
        {
          title: "6. تعديل البيانات والغرامات",
          bullets: [
            "أي تعديل على بيانات الطلب بعد تقديمه للجهات المختصة يُعد مسؤولية العميل بالكامل، وقد يؤدي إلى فرض غرامات أو رسوم تعديل أو إعادة إصدار حسب ما تقتضيه الإجراءات.",
            "الشركة غير مسؤولة عن أي تكاليف ناتجة عن هذه التعديلات، ويلتزم العميل بسدادها بالكامل.",
          ],
        },
        {
          title: "7. سياسة الإلغاء",
          bullets: [
            "بمجرد تقديم طلب التنسيق الأمني، يُعتبر الطلب نهائيًا وغير قابل للإلغاء لأي سبب من الأسباب من طرف العميل.",
            "لا تملك الشركة صلاحية إلغاء الطلب بعد تقديمه.",
            "الاستثناء الوحيد هو في حال صدور رفض رسمي من الجهات الأمنية.",
          ],
        },
        {
          title: "8. إقرار العميل",
          bullets: [
            "دفع المبلغ أو تأكيد الحجز يُعد موافقة صريحة على جميع الشروط والأحكام المذكورة أعلاه.",
            "يقر العميل بفهمه الكامل لكافة البنود والتزامه بها دون أي اعتراض.",
          ],
        },
        {
          title: "ملاحظة هامة",
          bullets: [
            "التنسيق الأمني لا يضمن دخول الدولة بنسبة 100%، والقرار النهائي يعود لسلطات الجوازات بالمطار.",
            "الشركة غير مسؤولة عن أي قرارات سيادية أو أمنية خارجة عن إرادتها.",
          ],
        },
      ],
    },
    refund: {
      eyebrow: "Oday Tourism - التنسيق الأمني",
      title: "سياسة الاسترداد",
      intro:
        "تنطبق هذه السياسة على المدفوعات الخاصة بخدمة التنسيق الأمني، وتُعد جزءًا مكملًا للشروط والأحكام الخاصة بهذه الخدمة.",
      sections: [
        {
          title: "1. عدم الاسترداد بعد تقديم الطلب",
          bullets: [
            "بمجرد تقديم طلب التنسيق الأمني للجهات المختصة، يُعتبر الطلب قيد التنفيذ بشكل فوري.",
            "لذلك، لا يمكن استرداد أي مبالغ مدفوعة بعد تقديم الطلب تحت أي ظرف.",
          ],
        },
        {
          title: "2. في حال الرفض",
          bullets: [
            "في حال رفض الطلب من الجهات المختصة، يحق للشركة خصم نسبة 5% كرسوم إدارية غير قابلة للاسترداد.",
            "يتم رد باقي المبلغ خلال مدة تصل إلى 14 يوم عمل، وذلك وفق الإجراءات المالية المعتمدة.",
            "لا يحق للعميل المطالبة بتسريع عملية الاسترداد أو الاعتراض على المدة المحددة.",
          ],
        },
        {
          title: "3. عدم السفر",
          bullets: [
            "في حال صدور الموافقة الأمنية وعدم سفر العميل لأي سبب كان، فلا يحق له المطالبة بأي استرداد.",
          ],
        },
        {
          title: "4. إلغاء من طرف العميل",
          bullets: [
            "أي طلب إلغاء يتم من قبل العميل بعد بدء الإجراءات لا يترتب عليه أي استرداد مالي.",
          ],
        },
        {
          title: "5. تعديل أو تغيير الرحلة",
          bullets: [
            "في حال تغيير موعد الرحلة أو بيانات السفر، فإن أي رسوم أو غرامات أو تكاليف إضافية ناتجة عن ذلك يتحملها العميل بالكامل.",
            "ولا يترتب على ذلك أي استرداد لأي مبالغ مدفوعة مسبقًا.",
          ],
        },
        {
          title: "6. إقرار العميل",
          bullets: [
            "دفع المبلغ يُعد موافقة صريحة ونهائية على سياسة الاسترداد هذه دون أي اعتراض لاحق.",
          ],
        },
      ],
    },
  },
  en: {
    terms: {
      eyebrow: "Oday Tourism - Security Coordination",
      title: "Terms & Conditions",
      intro:
        "These terms and conditions apply specifically to the security coordination service provided by Oday Tourism through the competent authorities in the Arab Republic of Egypt.",
      sections: [
        {
          title: "1. Service Definition",
          body: [
            "Security coordination is a procedure submitted through the competent authorities in the Arab Republic of Egypt to facilitate the traveler's entry into the country in accordance with applicable regulations.",
          ],
        },
        {
          title: "2. Company Responsibility",
          bullets: [
            "The company is committed to submitting the security coordination request and following it up with the competent authorities.",
            "The company is not the issuer of the final decision and has no authority over approval or rejection.",
            "The company bears no responsibility for any rejection or delay issued by the security authorities.",
          ],
        },
        {
          title: "3. Decisions of the Security Authorities",
          bullets: [
            "All decisions are sovereign decisions issued by the competent authorities.",
            "The security authorities may reject the request without providing or explaining any reasons.",
            "The company bears no responsibility for acceptance or rejection decisions.",
          ],
        },
        {
          title: "4. Airport Procedures",
          bullets: [
            "All entry procedures are subject to the competent security authorities and may require waiting time inside the airport.",
            "The company is not responsible for waiting times or for any procedures or decisions issued inside the airport.",
          ],
        },
        {
          title: "5. Approval Validity",
          bullets: [
            "The security approval is valid for a limited period, usually 3 months unless otherwise stated.",
            "If the customer does not travel within the validity period, the approval becomes void without any refund.",
          ],
        },
        {
          title: "6. Data Amendments and Penalties",
          bullets: [
            "Any amendment to the request data after submission to the competent authorities is entirely the customer's responsibility and may result in fines, amendment fees, or reissuance charges as required by the procedures.",
            "The company is not responsible for any costs resulting from these amendments, and the customer is fully responsible for paying them.",
          ],
        },
        {
          title: "7. Cancellation Policy",
          bullets: [
            "Once the security coordination request has been submitted, it is considered final and cannot be canceled by the customer for any reason.",
            "The company has no authority to cancel the request after submission.",
            "The only exception is an official rejection issued by the security authorities.",
          ],
        },
        {
          title: "8. Customer Acknowledgment",
          bullets: [
            "Payment of the amount or booking confirmation constitutes explicit acceptance of all the terms and conditions stated above.",
            "The customer acknowledges full understanding of all clauses and agrees to comply with them without objection.",
          ],
        },
        {
          title: "Important Note",
          bullets: [
            "Security coordination does not guarantee entry into the country 100%, and the final decision belongs to the passport authorities at the airport.",
            "The company is not responsible for any sovereign or security decisions beyond its control.",
          ],
        },
      ],
    },
    refund: {
      eyebrow: "Oday Tourism - Security Coordination",
      title: "Refund Policy",
      intro:
        "This policy applies to payments made for the security coordination service and forms an integral part of that service's terms and conditions.",
      sections: [
        {
          title: "1. No Refund After Submission",
          bullets: [
            "Once the security coordination request is submitted to the competent authorities, it is considered under execution immediately.",
            "Therefore, no paid amounts can be refunded after submission under any circumstances.",
          ],
        },
        {
          title: "2. In Case of Rejection",
          bullets: [
            "If the request is rejected by the competent authorities, the company may deduct 5% as a non-refundable administrative fee.",
            "The remaining amount will be refunded within up to 14 business days, according to the approved financial procedures.",
            "The customer is not entitled to demand faster processing of the refund or object to the specified timeline.",
          ],
        },
        {
          title: "3. Failure to Travel",
          bullets: [
            "If the security approval is issued and the customer does not travel for any reason, the customer is not entitled to any refund.",
          ],
        },
        {
          title: "4. Cancellation by the Customer",
          bullets: [
            "Any cancellation request made by the customer after the procedures have started does not result in any financial refund.",
          ],
        },
        {
          title: "5. Travel Changes",
          bullets: [
            "If the travel date or travel data is changed, any resulting fees, penalties, or additional costs are borne entirely by the customer.",
            "No refund of any previously paid amounts will result from such changes.",
          ],
        },
        {
          title: "6. Customer Acknowledgment",
          bullets: [
            "Payment of the amount constitutes explicit and final acceptance of this refund policy without any later objection.",
          ],
        },
      ],
    },
  },
};

export function getSecurityApprovalLegalContent(locale: LegalLocale): SecurityApprovalLegalContent {
  return securityApprovalLegalContent[locale];
}
