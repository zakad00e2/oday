// ── Comment Service ─────────────────────────────────────────────────────────
// Mirrors the pattern used in trip-service.ts

export const COMMENT_API_BASE =
  process.env.NEXT_PUBLIC_COMMENT_API_BASE ??
  "https://oday-tourisim-production.up.railway.app/comment";

// ── Stars enum mapping ──────────────────────────────────────────────────────

const STARS_TO_NUMBER: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

const NUMBER_TO_STARS: Record<number, string> = {
  1: "ONE",
  2: "TWO",
  3: "THREE",
  4: "FOUR",
  5: "FIVE",
};

export function starsToNumber(stars: string): number {
  return STARS_TO_NUMBER[stars] ?? 5;
}

export function numberToStars(rating: number): string {
  const clamped = Math.min(5, Math.max(1, Math.round(rating)));
  return NUMBER_TO_STARS[clamped] ?? "FIVE";
}

// ── API response types ──────────────────────────────────────────────────────

export interface ApiComment {
  id: string;
  client_name: string;
  stars: string;
  comment: string;
  trip_name: string;
  city: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface ApiCommentListResponse {
  data: ApiComment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ── App record type (bilingual) ─────────────────────────────────────────────

export interface CommentRecord {
  id: string;
  clientNameAr: string;
  clientNameEn: string;
  rating: number;
  commentAr: string;
  commentEn: string;
  tripNameAr: string;
  tripNameEn: string;
  cityAr: string;
  cityEn: string;
  createdAt: string;
  updatedAt: string;
}

// ── Bilingual encoding helpers ──────────────────────────────────────────────
// The API stores flat single-value fields. We encode both languages into one
// field with a `|||` separator, e.g. "نص عربي|||English text".
// When reading, we split on `|||`. If no separator is found the raw value is
// treated as Arabic and also used as the English fallback.

const SEPARATOR = "|||";

function encode(ar: string, en: string): string {
  const a = ar.trim();
  const e = en.trim();
  if (!e || a === e) return a;
  return `${a}${SEPARATOR}${e}`;
}

function decode(raw: string): { ar: string; en: string } {
  if (!raw) return { ar: "", en: "" };
  const idx = raw.indexOf(SEPARATOR);
  if (idx === -1) return { ar: raw, en: raw };
  return { ar: raw.slice(0, idx), en: raw.slice(idx + SEPARATOR.length) };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function createCommentRecord(apiComment: ApiComment): CommentRecord {
  const clientName = decode(apiComment.client_name);
  const comment = decode(apiComment.comment);
  const tripName = decode(apiComment.trip_name);
  const city = decode(apiComment.city);

  return {
    id: apiComment.id,
    clientNameAr: clientName.ar,
    clientNameEn: clientName.en,
    rating: starsToNumber(apiComment.stars),
    commentAr: comment.ar,
    commentEn: comment.en,
    tripNameAr: tripName.ar,
    tripNameEn: tripName.en,
    cityAr: city.ar,
    cityEn: city.en,
    createdAt: apiComment.created_at,
    updatedAt: apiComment.updated_at,
  };
}

// ── Error class ─────────────────────────────────────────────────────────────

export class CommentServiceError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "CommentServiceError";
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

  const response = await fetch(`${COMMENT_API_BASE}${path}`, {
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

    throw new CommentServiceError(message, response.status);
  }

  return payload as T;
}

// ── Mutation input type (bilingual) ─────────────────────────────────────────

export interface CommentMutationInput {
  clientNameAr: string;
  clientNameEn: string;
  stars: number;
  commentAr: string;
  commentEn: string;
  tripNameAr: string;
  tripNameEn: string;
  cityAr: string;
  cityEn: string;
}

// ── CRUD operations ─────────────────────────────────────────────────────────

export async function listComments(options?: {
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}) {
  const search = new URLSearchParams();

  if (options?.page) search.set("page", String(options.page));
  if (options?.limit) search.set("limit", String(options.limit));

  const query = search.toString();
  const payload = await requestJson<ApiCommentListResponse>(
    query ? `?${query}` : "",
    { method: "GET", signal: options?.signal },
  );

  return {
    comments: payload.data
      .filter((c) => !c.is_deleted)
      .map(createCommentRecord),
    meta: payload.meta,
  };
}

export async function getCommentById(id: string, signal?: AbortSignal) {
  const payload = await requestJson<ApiComment>(`/${id}`, {
    method: "GET",
    signal,
  });
  return createCommentRecord(payload);
}

export async function createComment(input: CommentMutationInput) {
  const body = {
    client_name: encode(input.clientNameAr, input.clientNameEn),
    stars: numberToStars(input.stars),
    comment: encode(input.commentAr, input.commentEn),
    trip_name: encode(input.tripNameAr, input.tripNameEn),
    city: encode(input.cityAr, input.cityEn),
  };

  const payload = await requestJson<ApiComment>("", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return createCommentRecord(payload);
}

export async function updateComment(id: string, input: CommentMutationInput) {
  const body = {
    client_name: encode(input.clientNameAr, input.clientNameEn),
    stars: numberToStars(input.stars),
    comment: encode(input.commentAr, input.commentEn),
    trip_name: encode(input.tripNameAr, input.tripNameEn),
    city: encode(input.cityAr, input.cityEn),
  };

  const payload = await requestJson<ApiComment>(`/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

  return createCommentRecord(payload);
}

export async function deleteComment(id: string) {
  await requestJson<unknown>(`/${id}`, { method: "DELETE" });
}
import {
  broadcastUnauthorizedSession,
  createAuthorizedHeaders,
} from "./auth-service";

