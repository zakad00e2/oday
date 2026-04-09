export const PHOTO_GALLERY_API_BASE =
  process.env.NEXT_PUBLIC_PHOTO_GALLERY_API_BASE ??
  "https://oday-tourisim-production.up.railway.app/photo-gallery";

// ── API response types ──────────────────────────────────────────────────────

export interface ApiAsset {
  id: string;
  url: string;
  kind: string;
  fileType?: string;
  fileSizeInKB?: number;
  photoGalleryId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiPhotoGallery {
  id: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  assets: ApiAsset[];
}

// ── App record type ─────────────────────────────────────────────────────────

export interface PhotoGalleryItem {
  id: string;
  imageUrl: string;
  assetId: string;
  createdAt: string;
}

// ── Mapping ─────────────────────────────────────────────────────────────────

function toPhotoGalleryItem(api: ApiPhotoGallery): PhotoGalleryItem | null {
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

export class PhotoGalleryServiceError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "PhotoGalleryServiceError";
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
  const headers = createAuthorizedHeaders(init?.headers);
  const response = await fetch(`${PHOTO_GALLERY_API_BASE}${path}`, {
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

    throw new PhotoGalleryServiceError(message, response.status);
  }

  return payload as T;
}

// ── CRUD operations ─────────────────────────────────────────────────────────

export async function listPhotoGallery(
  signal?: AbortSignal,
): Promise<PhotoGalleryItem[]> {
  const data = await request<ApiPhotoGallery[]>("", {
    method: "GET",
    signal,
  });

  return data
    .filter((item) => !item.is_deleted)
    .map(toPhotoGalleryItem)
    .filter((item): item is PhotoGalleryItem => item !== null);
}

export async function getPhotoGalleryById(
  id: string,
  signal?: AbortSignal,
): Promise<PhotoGalleryItem | null> {
  const data = await request<ApiPhotoGallery>(`/${id}`, {
    method: "GET",
    signal,
  });

  if (data.is_deleted) return null;
  return toPhotoGalleryItem(data);
}

export async function createPhotoGalleryItem(
  imageFile: File,
): Promise<PhotoGalleryItem> {
  const formData = new FormData();
  formData.append("images", imageFile, imageFile.name);

  const data = await request<ApiPhotoGallery>("", {
    method: "POST",
    body: formData,
  });

  const item = toPhotoGalleryItem(data);
  if (!item) {
    throw new PhotoGalleryServiceError("Created gallery item has no image");
  }
  return item;
}

export async function deletePhotoGalleryItem(id: string): Promise<void> {
  await request<unknown>(`/${id}`, { method: "DELETE" });
}
import {
  broadcastUnauthorizedSession,
  createAuthorizedHeaders,
} from "./auth-service";
