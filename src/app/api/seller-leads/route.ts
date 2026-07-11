import { NextResponse } from "next/server";

import { createSellerLead } from "@/lib/data-store";
import { sendSellerLeadNotification } from "@/lib/email";
import { readSitePreferencesFromCookieHeader } from "@/lib/site-preferences";

function requireString(value: unknown, label: string, requiredSuffix: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} ${requiredSuffix}`);
  }

  return value.trim();
}

function optionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  return normalized || undefined;
}

function optionalNumber(value: unknown, label: string, invalidMessage: string): number | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${label} ${invalidMessage}`);
  }

  return parsed;
}

function sanitizeMessage(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export async function POST(request: Request) {
  try {
    const language = readSitePreferencesFromCookieHeader(request.headers.get("cookie")).language;
    const copy =
      language === "EN"
        ? {
            labels: { name: "Full name", email: "Email", phone: "Phone", city: "City", district: "District", propertyType: "Property type", area: "Gross m²", message: "Property details and message" },
            required: "is required.",
            invalidNumber: "must be a valid number.",
            demo: "Your request was received. Our sales team will evaluate it and contact you shortly.",
            success: "Your request was sent successfully. Our sales team will contact you shortly.",
            fallback: "The request could not be sent.",
          }
        : language === "RU"
          ? {
              labels: { name: "Имя и фамилия", email: "Эл. почта", phone: "Телефон", city: "Город", district: "Район", propertyType: "Тип объекта", area: "Площадь м²", message: "Детали объекта и сообщение" },
              required: "обязательно.",
              invalidNumber: "должно быть корректным числом.",
              demo: "Ваш запрос получен. Наша команда продаж оценит его и скоро свяжется с вами.",
              success: "Ваш запрос успешно отправлен. Наша команда продаж скоро свяжется с вами.",
              fallback: "Не удалось отправить запрос.",
            }
          : language === "AR"
            ? {
                labels: { name: "الاسم الكامل", email: "البريد الإلكتروني", phone: "الهاتف", city: "المدينة", district: "المنطقة", propertyType: "نوع العقار", area: "المساحة م²", message: "تفاصيل العقار والرسالة" },
                required: "مطلوب.",
                invalidNumber: "يجب أن يكون رقمًا صالحًا.",
                demo: "تم استلام طلبك. سيقوم فريق المبيعات بتقييمه والتواصل معك قريبًا.",
                success: "تم إرسال طلبك بنجاح. سيتواصل معك فريق المبيعات قريبًا.",
                fallback: "تعذر إرسال الطلب.",
              }
            : {
                labels: { name: "Ad Soyad", email: "E-posta", phone: "Telefon", city: "Şehir", district: "İlçe", propertyType: "Portföy tipi", area: "Brüt m²", message: "Mülk detayları ve mesaj" },
                required: "zorunludur.",
                invalidNumber: "geçerli bir sayı olmalıdır.",
                demo: "Talebiniz alındı. Satış ekibimiz bilgilerinizi değerlendirip kısa süre içinde sizinle iletişime geçecek.",
                success: "Talebiniz başarıyla iletildi. Satış ekibimiz sizi en kısa sürede arayacak.",
                fallback: "Talep gönderilemedi.",
              };

    const payload = (await request.json()) as Record<string, unknown>;

    const sellerLead = createSellerLead({
      name: requireString(payload.name, copy.labels.name, copy.required),
      email: requireString(payload.email, copy.labels.email, copy.required),
      phone: requireString(payload.phone, copy.labels.phone, copy.required),
      city: requireString(payload.city, copy.labels.city, copy.required),
      district: requireString(payload.district, copy.labels.district, copy.required),
      neighborhood: optionalString(payload.neighborhood),
      propertyType: requireString(payload.propertyType, copy.labels.propertyType, copy.required),
      subType: optionalString(payload.subType),
      areaM2: optionalNumber(payload.areaM2, copy.labels.area, copy.invalidNumber),
      rooms: optionalString(payload.rooms),
      buildingAge: optionalString(payload.buildingAge),
      floor: optionalString(payload.floor),
      inCompound: optionalString(payload.inCompound),
      preferredDateTime: optionalString(payload.preferredDateTime),
      message: sanitizeMessage(requireString(payload.message, copy.labels.message, copy.required)),
    });

    const emailResult = await sendSellerLeadNotification(sellerLead);

    if (!emailResult.delivered) {
      return NextResponse.json({
        message: copy.demo,
        mode: "queued",
      });
    }

    return NextResponse.json({ message: copy.success });
  } catch (error) {
    const language = readSitePreferencesFromCookieHeader(request.headers.get("cookie")).language;
    const fallback =
      language === "EN"
        ? "The request could not be sent."
        : language === "RU"
          ? "Не удалось отправить запрос."
          : language === "AR"
            ? "تعذر إرسال الطلب."
            : "Talep gönderilemedi.";
    const message = error instanceof Error ? error.message : fallback;
    return NextResponse.json({ message }, { status: 400 });
  }
}
