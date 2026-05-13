// ── Security Approval Service ────────────────────────────────────────────────

export const SECURITY_APPROVAL_API_BASE =
  process.env.NEXT_PUBLIC_SECURITY_APPROVAL_API_BASE ??
  "https://oday-tourisim-production.up.railway.app/security-approval";

// ── ID mapping helpers ───────────────────────────────────────────────────────
// Frontend uses lowercase kebab-case (e.g. "libyan", "saint-kitts-dominica-group")
// API uses UPPER_SNAKE_CASE (e.g. "LIBYAN", "SAINT_KITTS_AND_NEVIS")

const FRONTEND_TO_API_KEY_ALIASES: Record<string, string> = {
  "iraqi-document": "IRAQ_DOCUMENT",
  "saint-kitts-dominica-group": "SAINT_KITTS_AND_NEVIS",
  qatar: "QATAR_AIRWAYS",
  turkish: "TURKISH_AIRLINES",
  oman: "OMAN_AIR",
};

const API_TO_FRONTEND_KEY_ALIASES: Record<string, string> = Object.fromEntries(
  Object.entries(FRONTEND_TO_API_KEY_ALIASES).map(([frontendKey, apiKey]) => [
    apiKey,
    frontendKey,
  ]),
);

export function toApiKey(id: string): string {
  return FRONTEND_TO_API_KEY_ALIASES[id] ?? id.toUpperCase().replace(/-/g, "_");
}

export function fromApiKey(key: string): string {
  return API_TO_FRONTEND_KEY_ALIASES[key] ?? key.toLowerCase().replace(/_/g, "-");
}

// ── API response types ───────────────────────────────────────────────────────

export interface ApiNationalityPricing {
  id: string;
  nationality: string;
  price_24h: string;
  price_72h: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiAirlinePricing {
  id: string;
  airline: string;
  price: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

// ── App record types ─────────────────────────────────────────────────────────

export interface NationalityPricingRecord {
  id: string;
  nationalityKey: string;
  price24h: number;
  price72h: number;
}

export interface AirlinePricingRecord {
  id: string;
  airlineKey: string;
  price: number;
}

// ── Mutation input types ─────────────────────────────────────────────────────

export interface NationalityPricingInput {
  nationality: string;
  price24h: number;
  price72h: number;
}

export interface AirlinePricingInput {
  airline: string;
  price: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function mapNationalityRecord(api: ApiNationalityPricing): NationalityPricingRecord {
  return {
    id: api.id,
    nationalityKey: fromApiKey(api.nationality),
    price24h: parseFloat(api.price_24h) || 0,
    price72h: parseFloat(api.price_72h) || 0,
  };
}

function mapAirlineRecord(api: ApiAirlinePricing): AirlinePricingRecord {
  return {
    id: api.id,
    airlineKey: fromApiKey(api.airline),
    price: parseFloat(api.price) || 0,
  };
}

// ── Error class ──────────────────────────────────────────────────────────────

export class SecurityApprovalServiceError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "SecurityApprovalServiceError";
    this.status = status;
  }
}

// ── HTTP helpers ─────────────────────────────────────────────────────────────

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

async function requestJson<T>(path = "", init?: RequestInit): Promise<T> {
  const headers = createAuthorizedHeaders(init?.headers);
  if (!headers.has("Content-Type") && init?.method !== "GET") {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${SECURITY_APPROVAL_API_BASE}${path}`, {
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

    throw new SecurityApprovalServiceError(message, response.status);
  }

  return payload as T;
}

// ── Nationality Pricing CRUD ─────────────────────────────────────────────────

export async function listNationalityPricing(
  signal?: AbortSignal,
): Promise<NationalityPricingRecord[]> {
  const payload = await requestJson<ApiNationalityPricing[]>(
    "/nationality-pricing",
    { method: "GET", signal },
  );
  return payload.filter((r) => !r.is_deleted).map(mapNationalityRecord);
}

export async function createNationalityPricing(
  input: NationalityPricingInput,
): Promise<NationalityPricingRecord> {
  const payload = await requestJson<ApiNationalityPricing>(
    "/nationality-pricing",
    {
      method: "POST",
      body: JSON.stringify({
        nationality: input.nationality,
        price_24h: String(input.price24h),
        price_72h: String(input.price72h),
      }),
    },
  );
  return mapNationalityRecord(payload);
}

export async function updateNationalityPricing(
  id: string,
  input: Partial<NationalityPricingInput>,
): Promise<NationalityPricingRecord> {
  const body: Record<string, string> = {};
  if (input.price24h !== undefined) body.price_24h = String(input.price24h);
  if (input.price72h !== undefined) body.price_72h = String(input.price72h);

  const payload = await requestJson<ApiNationalityPricing>(
    `/nationality-pricing/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    },
  );
  return mapNationalityRecord(payload);
}

export async function deleteNationalityPricing(id: string): Promise<void> {
  await requestJson<unknown>(`/nationality-pricing/${id}`, {
    method: "DELETE",
  });
}

// ── Airline Pricing CRUD ─────────────────────────────────────────────────────

export async function listAirlinePricing(
  signal?: AbortSignal,
): Promise<AirlinePricingRecord[]> {
  const payload = await requestJson<ApiAirlinePricing[]>("/airline-pricing", {
    method: "GET",
    signal,
  });
  return payload.filter((r) => !r.is_deleted).map(mapAirlineRecord);
}

export async function createAirlinePricing(
  input: AirlinePricingInput,
): Promise<AirlinePricingRecord> {
  const payload = await requestJson<ApiAirlinePricing>("/airline-pricing", {
    method: "POST",
    body: JSON.stringify({
      airline: input.airline,
      price: String(input.price),
    }),
  });
  return mapAirlineRecord(payload);
}

export async function updateAirlinePricing(
  id: string,
  input: Partial<AirlinePricingInput>,
): Promise<AirlinePricingRecord> {
  const body: Record<string, string> = {};
  if (input.airline !== undefined) body.airline = input.airline;
  if (input.price !== undefined) body.price = String(input.price);

  const payload = await requestJson<ApiAirlinePricing>(
    `/airline-pricing/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    },
  );
  return mapAirlineRecord(payload);
}

export async function deleteAirlinePricing(id: string): Promise<void> {
  await requestJson<unknown>(`/airline-pricing/${id}`, { method: "DELETE" });
}
import {
  broadcastUnauthorizedSession,
  createAuthorizedHeaders,
} from "./auth-service";
