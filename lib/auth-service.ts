const AUTH_API_BASE =
  process.env.NEXT_PUBLIC_AUTH_API_BASE ??
  "https://oday-tourisim-production.up.railway.app/auth";

const TOKEN_KEY = "oday-admin-token";
const ADMIN_DATA_KEY = "oday-admin-data";

// ── Types ───────────────────────────────────────────────────────────────────

export interface LoginInput {
  email: string;
  password: string;
}

export interface AdminData {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  access_token?: string;
  token?: string;
  adminData?: AdminData;
  data?: { token?: string; access_token?: string };
  [key: string]: unknown;
}

export class AuthError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

// ── API call ────────────────────────────────────────────────────────────────

export async function login(input: LoginInput): Promise<LoginResponse> {
  const response = await fetch(`${AUTH_API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  const payload = await response.json();

  if (!response.ok) {
    const message =
      typeof payload?.message === "string"
        ? payload.message
        : "فشل تسجيل الدخول";
    throw new AuthError(message, response.status);
  }

  return payload as LoginResponse;
}

// ── Token helpers ───────────────────────────────────────────────────────────

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getStoredToken();
}

export function storeAdminData(data: AdminData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(data));
}

export function getStoredAdminData(): AdminData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ADMIN_DATA_KEY);
    return raw ? (JSON.parse(raw) as AdminData) : null;
  } catch {
    return null;
  }
}

export function clearAdminData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_DATA_KEY);
}
