// ── FAQ Service ─────────────────────────────────────────────────────────────
// Mirrors the pattern used in trip-service.ts

export const FAQ_API_BASE =
  process.env.NEXT_PUBLIC_FAQ_API_BASE ??
  "https://oday-tourisim-production.up.railway.app/question";

// ── API response types ──────────────────────────────────────────────────────

export interface ApiFaqTranslation {
  id?: string;
  question_id?: string;
  language: "ar" | "en";
  question: string;
  answer: string;
}

export interface ApiFaq {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  translations: ApiFaqTranslation[];
}

export interface ApiFaqListResponse {
  data: ApiFaq[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ── App record type ─────────────────────────────────────────────────────────

export interface FaqRecord {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  createdAt: string;
  updatedAt: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getTranslation(
  translations: ApiFaqTranslation[] | undefined,
  language: "ar" | "en",
) {
  return translations?.find((t) => t.language === language);
}

function createFaqRecord(apiFaq: ApiFaq): FaqRecord {
  const ar = getTranslation(apiFaq.translations, "ar");
  const en = getTranslation(apiFaq.translations, "en");

  return {
    id: apiFaq.id,
    questionAr: ar?.question || en?.question || "",
    questionEn: en?.question || ar?.question || "",
    answerAr: ar?.answer || en?.answer || "",
    answerEn: en?.answer || ar?.answer || "",
    createdAt: apiFaq.created_at,
    updatedAt: apiFaq.updated_at,
  };
}

// ── Error class ─────────────────────────────────────────────────────────────

export class FaqServiceError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "FaqServiceError";
    this.status = status;
  }
}

// ── HTTP helpers ────────────────────────────────────────────────────────────

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

async function requestJson<T>(path = "", init?: RequestInit): Promise<T> {
  const headers = createAuthorizedHeaders(init?.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${FAQ_API_BASE}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const payload = await parseResponse(response);

  if (
    (response.status === 401 || response.status === 403) &&
    headers.has("Authorization")
  ) {
    broadcastUnauthorizedSession();
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : `Request failed with status ${response.status}`;

    throw new FaqServiceError(message, response.status);
  }

  return payload as T;
}

// ── Mutation input type ─────────────────────────────────────────────────────

export interface FaqMutationInput {
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
}

// ── CRUD operations ─────────────────────────────────────────────────────────

export async function listFaqs(options?: {
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}) {
  const search = new URLSearchParams();

  if (options?.page) search.set("page", String(options.page));
  if (options?.limit) search.set("limit", String(options.limit));

  const query = search.toString();
  const payload = await requestJson<ApiFaqListResponse>(
    query ? `?${query}` : "",
    { method: "GET", signal: options?.signal },
  );

  return {
    faqs: payload.data
      .filter((f) => !f.is_deleted)
      .map(createFaqRecord),
    meta: payload.meta,
  };
}

export async function getFaqById(id: string, signal?: AbortSignal) {
  const payload = await requestJson<ApiFaq>(`/${id}`, {
    method: "GET",
    signal,
  });
  return createFaqRecord(payload);
}

export async function createFaq(input: FaqMutationInput) {
  const body = {
    translations: [
      {
        language: "ar",
        question: input.questionAr.trim(),
        answer: input.answerAr.trim(),
      },
      {
        language: "en",
        question: input.questionEn.trim(),
        answer: input.answerEn.trim(),
      },
    ],
  };

  const payload = await requestJson<ApiFaq>("", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return createFaqRecord(payload);
}

export async function updateFaq(id: string, input: FaqMutationInput) {
  const body = {
    translations: [
      {
        language: "ar",
        question: input.questionAr.trim(),
        answer: input.answerAr.trim(),
      },
      {
        language: "en",
        question: input.questionEn.trim(),
        answer: input.answerEn.trim(),
      },
    ],
  };

  const payload = await requestJson<ApiFaq>(`/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

  return createFaqRecord(payload);
}

export async function deleteFaq(id: string) {
  await requestJson<unknown>(`/${id}`, { method: "DELETE" });
}
import {
  broadcastUnauthorizedSession,
  createAuthorizedHeaders,
} from "./auth-service";
