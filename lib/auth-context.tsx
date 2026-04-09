"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  login as apiLogin,
  getStoredToken,
  storeToken,
  clearToken,
  storeAdminData,
  getStoredAdminData,
  clearAdminData,
  type LoginInput,
  type AdminData,
  AuthError,
  subscribeToUnauthorizedSession,
} from "./auth-service";

type AuthState = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  state: AuthState;
  adminData: AdminData | null;
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>("loading");
  const [adminData, setAdminData] = useState<AdminData | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const token = getStoredToken();
      if (token) {
        setAdminData(getStoredAdminData());
        setState("authenticated");
      } else {
        setAdminData(null);
        setState("unauthenticated");
      }
    });
  }, []);

  useEffect(
    () =>
      subscribeToUnauthorizedSession(() => {
        clearToken();
        clearAdminData();
        setAdminData(null);
        setState("unauthenticated");
      }),
    [],
  );

  const login = useCallback(async (input: LoginInput) => {
    const result = await apiLogin(input);

    const token =
      result.access_token ??
      result.token ??
      result.data?.access_token ??
      result.data?.token;

    if (!token) {
      throw new AuthError("لم يتم استلام رمز الدخول", 500);
    }

    storeToken(token);

    if (result.adminData) {
      storeAdminData(result.adminData);
      setAdminData(result.adminData);
    }

    setState("authenticated");
  }, []);

  const logout = useCallback(() => {
    clearToken();
    clearAdminData();
    setAdminData(null);
    setState("unauthenticated");
  }, []);

  return (
    <AuthContext.Provider value={{ state, adminData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
