import axios from "axios";
import { env } from "@/lib/env";
import { ADMIN_TOKEN_KEY } from "@/lib/admin-api-client";

// CRM endpoints (crm-salespeople / crm-inquiries / crm-activity-logs) live
// at /api/v1/crm-*, not under /api/v1/admin like the rest of the admin
// panel's API — so this is a separate axios instance with a different
// baseURL. It deliberately reuses the SAME admin-panel token
// (ADMIN_TOKEN_KEY): the API's requireCrmAuth middleware accepts a regular
// admin-session JWT as an alternative to a CRM-specific login, provided the
// admin's role has a crm:view/crm:manage permission (see
// apps/api/src/middlewares/crm-auth.ts). This means an admin-panel user who
// is already logged in does not need a separate CRM login to manage
// salespeople/inquiries from this same admin panel.
export const crmApiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

crmApiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

crmApiClient.interceptors.response.use(
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
