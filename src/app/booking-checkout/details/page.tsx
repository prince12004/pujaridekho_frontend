"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Container } from "@/components/shared/container";

// The "your details" step now lives inline on /booking-checkout itself
// (it opens in edit mode automatically when nothing's saved yet) — this
// route just forwards anyone who still lands on the old URL (a stale
// bookmark, browser history from before this change, etc).
function DetailsRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const type = searchParams.get("type") ?? "pooja";
    const slug = searchParams.get("slug") ?? "";
    router.replace(`/booking-checkout?type=${type}&slug=${slug}`);
  }, [router, searchParams]);

  return null;
}

export default function BookingDetailsPage() {
  return (
    <Suspense
      fallback={
        <Container className="flex min-h-[50vh] items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </Container>
      }
    >
      <DetailsRedirect />
    </Suspense>
  );
}
