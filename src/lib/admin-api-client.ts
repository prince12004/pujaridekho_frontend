import axios from "axios";
import { env } from "@/lib/env";

export const ADMIN_TOKEN_KEY = "pujaridekho_admin_token";

// Deliberately separate from the customer-facing `apiClient` — admin auth
// (JWT + RBAC) must never share a token store with the customer OTP session.
export const adminApiClient = axios.create({
  baseURL: `${env.NEXT_PUBLIC_API_URL}/admin`,
  headers: { "Content-Type": "application/json" },
});

adminApiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

adminApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error?.response?.status === 401) {
      window.localStorage.removeItem(ADMIN_TOKEN_KEY);
      if (!window.location.pathname.startsWith("/admin/login")) {
        window.location.href = "/admin/login?session=expired";
      }
    }
    return Promise.reject(error);
  },
);
