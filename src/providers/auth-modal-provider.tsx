"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { env } from "@/lib/env";
import { CUSTOMER_ACCESS_TOKEN_KEY, CUSTOMER_REFRESH_TOKEN_KEY, clearCustomerTokens, setCustomerTokens } from "@/lib/customer-api-client";
import { OtpLoginModal } from "@/components/auth/otp-login-modal";

export interface CustomerProfile {
  id: string;
  name: string;
  mobile: string;
  email?: string;
}

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthModalContextValue {
  status: AuthStatus;
  isLoggedIn: boolean;
  mobile: string | null;
  customer: CustomerProfile | null;
  /** Opens the OTP login modal. If the customer completes login, onSuccess fires with
   * their profile — used to resume a booking/checkout flow that required login.
   * `prefillMobile` carries over a mobile number already typed in the calling form. */
  openLogin: (onSuccess?: (customer: CustomerProfile) => void, prefillMobile?: string) => void;
  logout: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingOnSuccess, setPendingOnSuccess] = useState<((customer: CustomerProfile) => void) | null>(null);
  const [prefillMobile, setPrefillMobile] = useState("");

  useEffect(() => {
    const token = window.localStorage.getItem(CUSTOMER_ACCESS_TOKEN_KEY);
    if (!token) {
      setStatus("unauthenticated");
      return;
    }
    axios
      .get(`${env.NEXT_PUBLIC_API_URL}/customer-auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setCustomer(res.data.data.customer);
        setStatus("authenticated");
      })
      .catch(() => {
        clearCustomerTokens();
        setStatus("unauthenticated");
      });
  }, []);

  const openLogin = useCallback((onSuccess?: (customer: CustomerProfile) => void, prefillMobileValue?: string) => {
    setPendingOnSuccess(() => onSuccess ?? null);
    setPrefillMobile(prefillMobileValue ?? "");
    setIsModalOpen(true);
  }, []);

  const handleSuccess = useCallback(
    (loggedInCustomer: CustomerProfile, accessToken: string, refreshToken: string) => {
      setCustomerTokens(accessToken, refreshToken);
      setCustomer(loggedInCustomer);
      setStatus("authenticated");
      setIsModalOpen(false);
      pendingOnSuccess?.(loggedInCustomer);
      setPendingOnSuccess(null);
    },
    [pendingOnSuccess],
  );

  const logout = useCallback(() => {
    const refreshToken = window.localStorage.getItem(CUSTOMER_REFRESH_TOKEN_KEY);
    clearCustomerTokens();
    setCustomer(null);
    setStatus("unauthenticated");
    if (refreshToken) {
      axios.post(`${env.NEXT_PUBLIC_API_URL}/customer-auth/logout`).catch(() => undefined);
    }
  }, []);

  return (
    <AuthModalContext.Provider
      value={{
        status,
        isLoggedIn: status === "authenticated",
        mobile: customer?.mobile ?? null,
        customer,
        openLogin,
        logout,
      }}
    >
      {children}
      <OtpLoginModal open={isModalOpen} onOpenChange={setIsModalOpen} onSuccess={handleSuccess} initialMobile={prefillMobile} />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
}
