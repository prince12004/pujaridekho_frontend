"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Loader2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ALL_RECORDS_LIMIT, AdminPagination } from "@/features/admin/components/admin-pagination";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useBookingCities, useBookings } from "@/features/admin/api/use-bookings";
import { usePoojas } from "@/features/admin/api/use-poojas";
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUSES,
} from "@/features/admin/lib/booking-status";
import {
  PAYMENT_STATE_OPTIONS,
  getPaymentState,
  paymentStateBadgeClass,
  paymentStateLabel,
} from "@/features/admin/lib/payment-state";
import { IncompleteCheckouts } from "@/features/admin/components/incomplete-checkouts";
import { useHomeLeads } from "@/features/admin/api/use-leads";
import { cn } from "@/lib/utils";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function BookingsListPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [channel, setChannel] = useState("");
  const [city, setCity] = useState("");
  const [pooja, setPooja] = useState("");
  const [paymentState, setPaymentState] = useState("");
  const [view, setView] = useState<"bookings" | "incomplete">("bookings");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useBookings({
    search: search || undefined,
    status: status || undefined,
    bookingChannel: channel || undefined,
    city: city || undefined,
    pooja: pooja || undefined,
    paymentState: paymentState || undefined,
    page,
  });
  const { data: openCheckouts } = useHomeLeads({ source: "checkout", status: "open" });
  const { data: cities } = useBookingCities();
  const { data: poojas } = usePoojas({ limit: ALL_RECORDS_LIMIT });

  return (
    <div>
      <AdminPageHeader
        title="Bookings"
        description="Every online and offline booking — paid or not — newest first."
        actions={
          <Button asChild>
            <Link href="/admin/bookings/offline/new">
              <Plus /> Create Offline Booking
            </Link>
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-1 rounded-lg border border-border bg-muted/40 p-1 w-fit">
        <Button
          type="button"
          size="sm"
          variant={view === "bookings" ? "default" : "ghost"}
          onClick={() => setView("bookings")}
        >
          All Bookings{data ? ` (${data.total})` : ""}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={view === "incomplete" ? "default" : "ghost"}
          onClick={() => setView("incomplete")}
        >
          Incomplete Checkouts{openCheckouts ? ` (${openCheckouts.length})` : ""}
        </Button>
      </div>

      {view === "incomplete" ? (
        <IncompleteCheckouts />
      ) : (
      <>
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search booking ID / name / mobile..."
            className="w-64 pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
        >
          <option value="">All statuses</option>
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {BOOKING_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <select
          value={channel}
          onChange={(e) => {
            setChannel(e.target.value);
            setPage(1);
          }}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
        >
          <option value="">Online + Offline</option>
          <option value="online">Online only</option>
          <option value="offline">Offline only</option>
        </select>
        <select
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setPage(1);
          }}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
        >
          <option value="">All cities</option>
          {cities?.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={pooja}
          onChange={(e) => {
            setPooja(e.target.value);
            setPage(1);
          }}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
        >
          <option value="">All poojas</option>
          {poojas?.items.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          value={paymentState}
          onChange={(e) => {
            setPaymentState(e.target.value);
            setPage(1);
          }}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
        >
          <option value="">All payments</option>
          {PAYMENT_STATE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <Card>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Booked On</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Pooja Date</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.items.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={11}
                          className="text-center text-muted-foreground"
                        >
                          No bookings found.
                        </TableCell>
                      </TableRow>
                    )}
                    {data?.items.map((booking) => (
                      <TableRow key={booking._id} className="cursor-pointer">
                        <TableCell>
                          <Link
                            href={`/admin/bookings/${booking._id}`}
                            className="font-medium text-primary"
                          >
                            {booking.bookingId}
                          </Link>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {formatDateTime(booking.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{booking.customerSnapshot?.name}</div>
                          <div className="text-xs text-muted-foreground">{booking.customerSnapshot?.mobile}</div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {booking.city ?? "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {booking.pooja?.name ??
                            booking.festival?.name ??
                            booking.serviceType}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(booking.poojaDate).toLocaleDateString(
                            "en-IN",
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {booking.bookingChannel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {BOOKING_STATUS_LABELS[booking.status] ??
                              booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          ₹{Number(booking.pricing?.finalAmount ?? 0).toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const state = getPaymentState(booking);
                            return (
                              <Badge variant="outline" className={cn(paymentStateBadgeClass(state))}>
                                {paymentStateLabel(state)}
                              </Badge>
                            );
                          })()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/bookings/${booking._id}`}>
                              <Eye /> View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              <AdminPagination page={page} totalPages={data?.totalPages ?? 1} total={data?.total ?? 0} onPageChange={setPage} />
            </>
          )}
        </CardContent>
      </Card>
      </>
      )}
    </div>
  );
}
