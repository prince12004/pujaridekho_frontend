"use client";

import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/providers/auth-modal-provider";

export function RequireCustomerAuth({ children }: { children: React.ReactNode }) {
  const { status, openLogin } = useAuthModal();

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-muted">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-muted px-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShieldCheck className="size-7" />
        </span>
        <div>
          <h1 className="font-heading text-xl font-bold text-secondary">Login to view your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your bookings, orders and Kundlis are just a login away.</p>
        </div>
        <Button size="lg" className="font-ui font-bold" onClick={() => openLogin()}>
          Login with Mobile Number
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
