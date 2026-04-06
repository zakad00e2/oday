export const OFFER_API_BASE =
  process.env.NEXT_PUBLIC_OFFER_API_BASE ??
  "https://oday-tourisim-production.up.railway.app/offer";

// ── API response types ──────────────────────────────────────────────────────

export interface ApiOfferAsset {
  id: string;
  url: string;
  kind: string;
  fileType?: string;
  fileSizeInKB?: number;
  offerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiOffer {
  id: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  assets: ApiOfferAsset[];
}

// ── App record type ─────────────────────────────────────────────────────────

export interface OfferItem {
  id: string;
  imageUrl: string;
  assetId: string;
  createdAt: string;
}

// ── Mapping ─────────────────────────────────────────────────────────────────

function toOfferItem(api: ApiOffer): OfferItem | null {
  const asset = api.assets?.[0];
  if (!asset?.url) return null;

  return {
    id: api.id,
    imageUrl: asset.url,
    assetId: asset.id,
    createdAt: api.created_at,
  };
}

// ── Error class ─────────────────────────────────────────────────────────────

export class OfferServiceError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "OfferServiceError";
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

async function request<T>(path = "", init?: RequestInit): Promise<T> {
  const response = await fetch(`${OFFER_API_BASE}${path}`, {
    ...init,
    cache: "no-store",
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : `Request failed with status ${response.status}`;

    throw new OfferServiceError(message, response.status);
  }

  return payload as T;
}

// ── CRUD operations ─────────────────────────────────────────────────────────

export async function listOffers(
  signal?: AbortSignal,
): Promise<OfferItem[]> {
  const data = await request<ApiOffer[]>("", {
    method: "GET",
    signal,
  });

  return data
    .filter((item) => !item.is_deleted)
    .map(toOfferItem)
    .filter((item): item is OfferItem => item !== null);
}

export async function getOfferById(
  id: string,
  signal?: AbortSignal,
): Promise<OfferItem | null> {
  const data = await request<ApiOffer>(`/${id}`, {
    method: "GET",
    signal,
  });

  if (data.is_deleted) return null;
  return toOfferItem(data);
}

export async function createOffer(
  imageFile: File,
): Promise<OfferItem> {
  const formData = new FormData();
  formData.append("images", imageFile, imageFile.name);

  const data = await request<ApiOffer>("", {
    method: "POST",
    body: formData,
  });

  const item = toOfferItem(data);
  if (!item) {
    throw new OfferServiceError("Created offer has no image");
  }
  return item;
}

export async function deleteOffer(id: string): Promise<void> {
  await request<unknown>(`/${id}`, { method: "DELETE" });
}
