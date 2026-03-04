import { ADMIN_WHATSAPP } from "./airport-config";

export interface AirportFormData {
    serviceType: "24h" | "72h";
    basePrice: number;
    airlineName: string;
    extraFee: number;
    total: number;
    fileName: string;
    country: string;
    city: string;
    airport: string;
    arrivalDate: string;
    arrivalTime: string;
    flightNumber: string;
    fullName: string;
    whatsappNumber: string;
    email: string;
    notes: string;
}

/**
 * Build a formatted Arabic WhatsApp message from the form data.
 */
export function buildWhatsAppMessage(data: AirportFormData): string {
    const serviceLabel =
        data.serviceType === "24h"
            ? "تأشيرة خلال 24 ساعة"
            : "تأشيرة خلال 72 ساعة";

    const lines = [
        `— *حجز تنسيقات المطار* —`,
        ``,
        `• *نوع الخدمة:* ${serviceLabel}`,
        `• *السعر الأساسي:* $${data.basePrice}`,
        `• *شركة الطيران:* ${data.airlineName}`,
        `• *رسوم إضافية:* $${data.extraFee}`,
        `• *الإجمالي:* $${data.total}`,
        ``,
        `• *المستند:* ${data.fileName} — تم إرفاق الملف (سيتم إرساله في المحادثة)`,
        ``,
        `• *قادم من:* ${data.country}${data.city ? ` — ${data.city}` : ""}`,
        `• *مطار الوصول:* ${data.airport}`,
    ];

    if (data.arrivalDate) {
        lines.push(`• *تاريخ الوصول:* ${data.arrivalDate}`);
    }
    if (data.arrivalTime) {
        lines.push(`• *وقت الوصول:* ${data.arrivalTime}`);
    }
    if (data.flightNumber) {
        lines.push(`• *رقم الرحلة:* ${data.flightNumber}`);
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
