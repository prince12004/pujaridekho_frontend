"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Loader2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useCrmInquiries } from "@/features/admin/api/use-crm-inquiries";
import { useCrmSalespeople } from "@/features/admin/api/use-crm-salespeople";

const STATUS_LABELS: Record<string, string> = {
  inquiry: "Inquiry",
  confirmed: "Confirmed",
  notConverted: "Not Converted",
};

export default function CrmInquiriesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [page, setPage] = useState(1);

  const { data: salespeople } = useCrmSalespeople();
  const { data, isLoading } = useCrmInquiries({
    search: search || undefined,
    status: status || undefined,
    assignedTo: assignedTo || undefined,
    page,
    limit: 20,
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div>
      <AdminPageHeader title="CRM Inquiries" description="Leads worked by the sales team, from first inquiry through booking confirmation." />

      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name / phone..."
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
          <option value="inquiry">Inquiry</option>
          <option value="confirmed">Confirmed</option>
          <option value="notConverted">Not Converted</option>
        </select>
        <select
          value={assignedTo}
          onChange={(e) => {
            setAssignedTo(e.target.value);
            setPage(1);
          }}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
        >
          <option value="">All salespeople</option>
          <option value="unassigned">Unassigned</option>
          {salespeople?.map((sp) => (
            <option key={sp.id} value={sp.id}>
              {sp.name}
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
                    <TableHead>Client</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Puja</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        No inquiries found.
                      </TableCell>
                    </TableRow>
                  )}
                  {data?.data.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell>
                        <Link href={`/admin/crm/inquiries/${inquiry.id}`} className="font-medium text-primary">
                          {inquiry.clientName}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{inquiry.phone}</TableCell>
                      <TableCell className="text-muted-foreground">{inquiry.pujaName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {inquiry.pujaDate ? new Date(inquiry.pujaDate).toLocaleDateString("en-IN") : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={inquiry.status === "confirmed" ? "default" : inquiry.status === "notConverted" ? "destructive" : "secondary"}>
                          {STATUS_LABELS[inquiry.status] ?? inquiry.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {salespeople?.find((sp) => sp.id === inquiry.assignedTo)?.name ?? (inquiry.assignedTo ?? "Unassigned")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {inquiry.source}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/crm/inquiries/${inquiry.id}`}>
                            <Eye /> View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {data && data.total > data.limit && (
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Page {data.page} of {totalPages} ({data.total} total)
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled={!data.hasMore} onClick={() => setPage((p) => p + 1)}>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
