import { broadcastUnauthorizedSession, createAuthorizedHeaders } from "./auth-service";
import { getDestinationFallbackImage, type Destination } from "./destinations";

export const DESTINATION_API_BASE =
  process.env.NEXT_PUBLIC_DESTINATION_API_BASE ??
  "https://oday-tourisim-production.up.railway.app/destination";

export interface DestinationRecord {
  destination: Destination;
  image: { id: string; url: string; kind: "DESTINATION_IMAGE" } | null;
  hotels_count: number;
  trips_count: number;
}

export class DestinationServiceError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "DestinationServiceError";
  }
}

async function request<T>(path: string, init: RequestInit = {}, authorized = false): Promise<T> {
  const headers = authorized ? createAuthorizedHeaders(init.headers) : new Headers(init.headers);
  const response = await fetch(`${DESTINATION_API_BASE}${path}`, { ...init, headers, cache: "no-store" });
  const payload = response.status === 204 ? null : await (
    response.headers.get("content-type")?.includes("application/json") ? response.json() : response.text()
  );

  if (response.status === 401 && headers.has("Authorization")) broadcastUnauthorizedSession();
  if (!response.ok) {
    const message = payload && typeof payload === "object" && "message" in payload ? payload.message : null;
    throw new DestinationServiceError(
      Array.isArray(message) ? message.join("، ") : typeof message === "string" ? message : `تعذر إتمام الطلب (${response.status}).`,
      response.status,
    );
  }
  return payload as T;
}

export function listDestinations(options?: { type?: "hotels" | "trips"; signal?: AbortSignal }) {
  return request<DestinationRecord[]>(options?.type ? `?type=${options.type}` : "", { signal: options?.signal });
}

export function getDestination(destination: Destination, signal?: AbortSignal) {
  return request<DestinationRecord>(`/${encodeURIComponent(destination)}`, { signal });
}

export function getDestinationImage(record: Pick<DestinationRecord, "destination" | "image">) {
  return record.image?.url || getDestinationFallbackImage(record.destination);
}

export async function updateDestinationImage(destination: Destination, file: File) {
  if (!file || !file.type.startsWith("image/")) throw new DestinationServiceError("يرجى اختيار ملف صورة.", 400);
  if (file.size > 2 * 1024 * 1024) throw new DestinationServiceError("حجم الصورة يجب ألا يتجاوز 2 MB.", 400);
  const body = new FormData();
  body.append("image", file);
  return request<DestinationRecord>(`/${encodeURIComponent(destination)}/image`, { method: "PUT", body }, true);
}

export async function deleteDestinationImage(destination: Destination) {
  await request<unknown>(`/${encodeURIComponent(destination)}/image`, { method: "DELETE" }, true);
}
