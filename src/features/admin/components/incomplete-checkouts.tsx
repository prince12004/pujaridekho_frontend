"use client";

import { useState } from "react";
import Link from "next/link";
import { Inbox, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPagination, paginateClient } from "@/features/admin/components/admin-pagination";
import { useHomeLeads } from "@/features/admin/api/use-leads";

// Customers who filled the checkout form and pressed "Book Now" but never
// finished OTP login, so no booking exists for them. As soon as one of them
// completes login the capture is marked "converted" and linked to the
// booking, which then appears in the main list.
export function IncompleteCheckouts() {
  const [showConverted, setShowConverted] = useState(false);
  const [page, setPage] = useState(1);
  const { data: leads, isLoading } = useHomeLeads({
    source: "checkout",
    status: showConverted ? undefined : "open",
  });
  const { pageItems, total, totalPages } = paginateClient(leads, page);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Customers who filled the booking form but left before logging in. No booking was created, so call them to follow up.
        </p>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showConverted}
            onChange={(e) => {
              setShowConverted(e.target.checked);
              setPage(1);
            }}
          />
          Include ones that became bookings
        </label>
      </div>

      <Card>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : leads && leads.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Submitted On</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Pooja Date</TableHead>
                    <TableHead>Est. Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageItems.map((lead) => (
                    <TableRow key={lead._id}>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {new Date(lead.updatedAt ?? lead.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{lead.name}</div>
                        <a href={`tel:${lead.mobile}`} className="text-xs text-primary">
                          {lead.mobile}
                        </a>
                      </TableCell>
                      <TableCell>{lead.city}</TableCell>
                      <TableCell className="max-w-xs truncate">{lead.address}</TableCell>
                      <TableCell>
                        <div>{lead.pooja}</div>
                        {lead.packageName ? <div className="text-xs text-muted-foreground">{lead.packageName}</div> : null}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(lead.date).toLocaleDateString("en-IN")}
                      </TableCell>
                      <TableCell>
                        {lead.estimatedAmount != null ? `₹${lead.estimatedAmount.toLocaleString("en-IN")}` : "—"}
                      </TableCell>
                      <TableCell>
                        {lead.status === "converted" && lead.booking ? (
                          <Link href={`/admin/bookings/${lead.booking}`} className="text-sm font-medium text-primary">
                            Booked · {lead.bookingRef}
                          </Link>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-transparent bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                          >
                            Not booked · Unpaid
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <AdminPagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Inbox className="size-8 text-muted-foreground" />
              <p className="font-medium text-foreground">No incomplete checkouts</p>
              <p className="max-w-md text-sm text-muted-foreground">
                Customers who fill the booking form but leave before logging in will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
