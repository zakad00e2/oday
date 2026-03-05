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

/**
 * Build a formatted Arabic WhatsApp message from the form data.
 */
export function buildWhatsAppMessage(data: AirportFormData): string {
    const documentLabel =
        data.documentType === "palestinian" ? "الجوازات الفلسطينية (السلطة)" :
            data.documentType === "european" ? "الوثائق الاوروبية (اللاجئين)" :
                "الجوازات المصفرة";
    const serviceLabel =
        data.serviceType === "24h"
            ? "موافقة أمنية خلال 24 ساعة"
            : "موافقة أمنية خلال 72 ساعة";

    const lines = [
        `— *خدمات التأشيرات والموافقات الأمنية* —`,
        ``,
        `• *نوع الوثيقة:* ${documentLabel}`,
        `• *نوع الخدمة:* ${serviceLabel}`,
        `• *السعر الأساسي:* $${data.basePrice}`,
        `• *شركة الطيران:* ${data.airlineName}`,
        `• *رسوم إضافية:* $${data.extraFee}`,
        `• *الإجمالي:* $${data.total}`,
        ``,
        `• *المستند:* ${data.fileName} — تم إرفاق الملف (سيتم إرساله في المحادثة)`,
        ``,
        `• *بلد المغادرة:* ${data.country}`,
        `• *مطار المغادرة:* ${data.airport}`,
    ];

    if (data.travelDate) {
        lines.push(`• *تاريخ السفر:* ${data.travelDate}`);
    }

    lines.push(
        ``,
        `• *الاسم:* ${data.fullName}`,
        `• *واتساب:* ${data.whatsappNumber}`
    );

    if (data.email) {
        lines.push(`• *البريد:* ${data.email}`);
    }
    if (data.notes) {
        lines.push(`• *ملاحظات:* ${data.notes}`);
    }

    return lines.join("\n");
}

/**
 * Build a wa.me deep link URL from a message string.
 */
export function buildWhatsAppUrl(message: string): string {
    return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
