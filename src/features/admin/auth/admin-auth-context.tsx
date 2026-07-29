"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { adminApiClient, ADMIN_TOKEN_KEY } from "@/lib/admin-api-client";

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role?: string;
  roleName?: string;
  permissions: string[];
}

interface AdminAuthState {
  status: "loading" | "authenticated" | "unauthenticated";
  admin: AdminProfile | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AdminAuthContext = createContext<AdminAuthState | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AdminAuthState["status"]>("loading");
  const [admin, setAdmin] = useState<AdminProfile | null>(null);

  useEffect(() => {
    const token = window.localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) {
      setStatus("unauthenticated");
      return;
    }
    adminApiClient
      .get("/auth/me")
      .then((res) => {
        setAdmin(res.data.data.admin);
        setStatus("authenticated");
      })
      .catch(() => {
        window.localStorage.removeItem(ADMIN_TOKEN_KEY);
        setStatus("unauthenticated");
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await adminApiClient.post("/auth/login", { email, password });
    const { token, admin: profile } = res.data.data;
    window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
    setAdmin(profile);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    setAdmin(null);
    setStatus("unauthenticated");
  }, []);

  const hasPermission = useCallback(
    (permission: string) => {
      if (!admin) return false;
      return admin.permissions.includes("*") || admin.permissions.includes(permission);
    },
    [admin],
  );

  return (
    <AdminAuthContext.Provider value={{ status, admin, login, logout, hasPermission }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
