import { ADMIN_WHATSAPP } from "./airport-config";

export interface AirportFormData {
    documentType: "palestinian" | "european" | "zeroed";
    serviceType: "24h" | "72h";
    basePrice: number;
    airlineName: string;
    extraFee: number;
    total: number;
    fileName: string;
    country: string;
    airport: string;
    travelDate: string;
    fullName: string;
    whatsappNumber: string;
    email: string;
    notes: string;
}

type AirportMessageLocale = "ar" | "en";

/**
 * Build a formatted WhatsApp message from the form data.
 */
export function buildWhatsAppMessage(data: AirportFormData, locale: AirportMessageLocale = "ar"): string {
    const isAr = locale === "ar";
    const documentLabel =
        data.documentType === "palestinian"
            ? (isAr ? "الجوازات الفلسطينية (السلطة)" : "Palestinian passport (Authority)")
            : data.documentType === "european"
                ? (isAr ? "الوثائق الاوروبية (اللاجئين)" : "European travel document (refugees)")
                : (isAr ? "الجوازات المصفرة" : "Yellow passports");
    const serviceLabel =
        data.serviceType === "24h"
            ? (isAr ? "موافقة أمنية خلال 24 ساعة" : "Security approval within 24 hours")
            : (isAr ? "موافقة أمنية خلال 72 ساعة" : "Security approval within 72 hours");

    const lines = [
        isAr ? `— *خدمات التأشيرات والموافقات الأمنية* —` : `— *Visa support & security approvals* —`,
        ``,
        `${isAr ? "• *نوع الوثيقة:*" : "• *Document type:*"} ${documentLabel}`,
        `${isAr ? "• *نوع الخدمة:*" : "• *Service type:*"} ${serviceLabel}`,
        `${isAr ? "• *السعر الأساسي:*" : "• *Base price:*"} $${data.basePrice}`,
        `${isAr ? "• *شركة الطيران:*" : "• *Airline:*"} ${data.airlineName}`,
        `${isAr ? "• *رسوم إضافية:*" : "• *Extra fee:*"} $${data.extraFee}`,
        `${isAr ? "• *الإجمالي:*" : "• *Total:*"} $${data.total}`,
        ``,
        isAr
            ? `• *المستند:* ${data.fileName} — تم إرفاق الملف (سيتم إرساله في المحادثة)`
            : `• *Document:* ${data.fileName} — the file is attached and will be sent in the chat`,
        ``,
        `${isAr ? "• *بلد المغادرة:*" : "• *Departure country:*"} ${data.country}`,
        `${isAr ? "• *مطار المغادرة:*" : "• *Departure airport:*"} ${data.airport}`,
    ];

    if (data.travelDate) {
        lines.push(`${isAr ? "• *تاريخ السفر:*" : "• *Travel date:*"} ${data.travelDate}`);
    }

    lines.push(
        ``,
        `${isAr ? "• *الاسم:*" : "• *Full name:*"} ${data.fullName}`,
        `${isAr ? "• *واتساب:*" : "• *WhatsApp:*"} ${data.whatsappNumber}`
    );

    if (data.email) {
        lines.push(`${isAr ? "• *البريد:*" : "• *Email:*"} ${data.email}`);
    }
    if (data.notes) {
        lines.push(`${isAr ? "• *Notes:*" : "• *Notes:*"} ${data.notes}`);
    }

    return lines.join("\n");
}

/**
 * Build a wa.me deep link URL from a message string.
 */
export function buildWhatsAppUrl(message: string): string {
    return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
