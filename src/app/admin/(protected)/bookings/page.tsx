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

export default function BookingsListPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [channel, setChannel] = useState("");
  const [city, setCity] = useState("");
  const [pooja, setPooja] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useBookings({
    search: search || undefined,
    status: status || undefined,
    bookingChannel: channel || undefined,
    city: city || undefined,
    pooja: pooja || undefined,
    page,
  });
  const { data: cities } = useBookingCities();
  const { data: poojas } = usePoojas({ limit: ALL_RECORDS_LIMIT });

  return (
    <div>
      <AdminPageHeader
        title="Bookings"
        description="Every online and offline booking flows through this same list."
        actions={
          <Button asChild>
            <Link href="/admin/bookings/offline/new">
              <Plus /> Create Offline Booking
            </Link>
          </Button>
        }
      />

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
                      <TableHead>Customer</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.items.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={9}
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
                        <TableCell>{booking.customerSnapshot?.name}</TableCell>
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
                        <TableCell>
                          <Badge
                            variant={
                              booking.paymentStatus === "paid"
                                ? "default"
                                : "outline"
                            }
                            className="capitalize"
                          >
                            {booking.paymentStatus.replace(/_/g, " ")}
                          </Badge>
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
    </div>
  );
}
