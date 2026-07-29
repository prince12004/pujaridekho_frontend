import axios from "axios";
import { env } from "@/lib/env";

export const CUSTOMER_ACCESS_TOKEN_KEY = "pujaridekho_customer_access_token";
export const CUSTOMER_REFRESH_TOKEN_KEY = "pujaridekho_customer_refresh_token";

// Separate axios instance from the plain public `apiClient` and from
// `adminApiClient` — customer sessions must never share a token store with
// either the admin JWT or the (unauthenticated) public browsing client.
export const customerApiClient = axios.create({
  baseURL: `${env.NEXT_PUBLIC_API_URL}/account`,
  headers: { "Content-Type": "application/json" },
});

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CUSTOMER_ACCESS_TOKEN_KEY);
}

function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CUSTOMER_REFRESH_TOKEN_KEY);
}

export function setCustomerTokens(accessToken: string, refreshToken: string) {
  window.localStorage.setItem(CUSTOMER_ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(CUSTOMER_REFRESH_TOKEN_KEY, refreshToken);
}

export function clearCustomerTokens() {
  window.localStorage.removeItem(CUSTOMER_ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(CUSTOMER_REFRESH_TOKEN_KEY);
}

customerApiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  try {
    const res = await axios.post(`${env.NEXT_PUBLIC_API_URL}/customer-auth/refresh`, { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = res.data.data;
    setCustomerTokens(accessToken, newRefreshToken);
    return accessToken;
  } catch {
    clearCustomerTokens();
    return null;
  }
}

customerApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retried) {
      originalRequest._retried = true;
      refreshPromise ??= refreshAccessToken();
      const newAccessToken = await refreshPromise;
      refreshPromise = null;
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return customerApiClient(originalRequest);
      }
    }
    return Promise.reject(error);
  },
);
