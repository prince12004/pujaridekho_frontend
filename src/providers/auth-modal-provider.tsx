"use client";

import { createContext, useContext, useState } from "react";
import { OtpLoginModal } from "@/components/auth/otp-login-modal";

interface AuthModalContextValue {
  isLoggedIn: boolean;
  mobile: string | null;
  openLogin: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState<string | null>(null);

  return (
    <AuthModalContext.Provider value={{ isLoggedIn: Boolean(mobile), mobile, openLogin: () => setOpen(true) }}>
      {children}
      <OtpLoginModal open={open} onOpenChange={setOpen} onSuccess={(value) => setMobile(value)} />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
}
