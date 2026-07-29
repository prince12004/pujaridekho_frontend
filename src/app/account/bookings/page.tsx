"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarCheck, MapPin } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AccountPageHeader } from "@/features/account/components/account-page-header";
import { AccountEmptyState } from "@/features/account/components/empty-state";
import { AccountLoadingSkeleton, AccountErrorState } from "@/features/account/components/state-blocks";
import { useMyBookings } from "@/features/account/api/use-bookings";
import { BOOKING_STATUS_LABELS, badgeToneForStatus } from "@/features/account/lib/status-labels";
import { formatCurrency, formatDate } from "@/features/account/lib/format";

const TABS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "all", label: "All" },
];

export default function MyBookingsPage() {
  const [tab, setTab] = useState("upcoming");
  const { data, isLoading, isError, refetch } = useMyBookings(tab);

  return (
    <div>
      <AccountPageHeader title="My Bookings" description="All your Pooja and Festival bookings, online and offline." />

      <Tabs value={tab} onValueChange={setTab} className="mb-4">
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading && <AccountLoadingSkeleton />}
      {isError && <AccountErrorState onRetry={() => refetch()} />}

      {data && data.items.length === 0 && (
        <AccountEmptyState
          icon={CalendarCheck}
          title="No Puja bookings have been made yet."
          description="Book a Pooja or Festival ritual and track it right here."
          ctaLabel="Explore Poojas"
          ctaHref="/poojas"
        />
      )}

      {data && data.items.length > 0 && (
        <div className="space-y-3">
          {data.items.map((booking) => {
            const eligibleForRequest = [
              "pending_payment",
              "payment_received",
              "booking_confirmed",
              "pandit_assignment_pending",
              "pandit_assigned",
            ].includes(booking.status);
            const canPayBalance =
              (booking.pricing?.finalAmount ?? 0) - booking.payments.filter((p) => p.status === "success").reduce((s, p) => s + p.amount, 0) > 0 &&
              !["cancelled", "refunded", "refund_requested", "pooja_completed", "closed"].includes(booking.status);
            const canReschedule = eligibleForRequest && !booking.rescheduleRequest;
            const canCancel = eligibleForRequest && !booking.cancelRequest;

            return (
              <Card key={booking._id}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <Badge variant={badgeToneForStatus(booking.status)}>{BOOKING_STATUS_LABELS[booking.status] ?? booking.status}</Badge>
                      <span className="text-xs text-muted-foreground">#{booking.bookingId}</span>
                    </div>
                    <p className="truncate font-heading text-base font-bold text-secondary">
                      {booking.pooja?.name ?? booking.festival?.name ?? "Pooja Booking"}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <CalendarCheck className="size-3.5" />
                        {formatDate(booking.poojaDate)}
                        {booking.poojaTime ? ` · ${booking.poojaTime}` : ""}
                      </span>
                      {booking.city && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3.5" />
                          {booking.city}
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-sm font-medium text-secondary">{formatCurrency(booking.pricing?.finalAmount)}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:shrink-0">
                    {canPayBalance && (
                      <Button asChild size="sm" className="font-ui font-bold">
                        <Link href={`/account/bookings/${booking._id}`}>Pay Balance</Link>
                      </Button>
                    )}
                    {canReschedule && (
                      <Button asChild size="sm" variant="outline" className="font-ui font-bold">
                        <Link href={`/account/bookings/${booking._id}`}>Reschedule</Link>
                      </Button>
                    )}
                    {canCancel && (
                      <Button asChild size="sm" variant="ghost" className="font-ui font-bold">
                        <Link href={`/account/bookings/${booking._id}`}>Cancel</Link>
                      </Button>
                    )}
                    <Button asChild size="sm" variant="outline" className="font-ui font-bold">
                      <Link href={`/account/bookings/${booking._id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
