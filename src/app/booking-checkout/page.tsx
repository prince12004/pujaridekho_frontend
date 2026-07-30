"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Container } from "@/components/shared/container";
import { CheckoutClient } from "@/features/checkout/checkout-client";

export default function BookingCheckoutPage() {
  return (
    <Suspense
      fallback={
        <Container className="flex min-h-[50vh] items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </Container>
      }
    >
      <CheckoutClient />
    </Suspense>
  );
}
