"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useConsultations, useUpdateConsultation } from "@/features/admin/api/use-consultations";
import { usePandits } from "@/features/admin/api/use-pandits";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const STATUS_OPTIONS = ["new", "contacted", "scheduled", "completed", "cancelled"] as const;

export default function ConsultationsPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const { data: consultations, isLoading } = useConsultations(statusFilter || undefined);
  const { data: pandits } = usePandits({ verificationStatus: "verified" });
  const updateMutation = useUpdateConsultation();

  const onStatusChange = async (id: string, status: string) => {
    try {
      await updateMutation.mutateAsync({ id, input: { status } });
      toast.success("Consultation updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onAssignPandit = async (id: string, pandit: string) => {
    if (!pandit) return;
    try {
      await updateMutation.mutateAsync({ id, input: { pandit, status: "scheduled" } });
      toast.success("Pandit assigned");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Consultations"
        description="Leads from the public consultation form (fixed ₹500 fee). Customers don't pick a pandit — assign one here after reviewing the request."
      />

      <div className="mb-4 flex gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Pandit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultations?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No consultation requests yet.
                    </TableCell>
                  </TableRow>
                )}
                {consultations?.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-muted-foreground">{c.mobile}</TableCell>
                    <TableCell className="text-muted-foreground">{c.topic ?? "—"}</TableCell>
                    <TableCell>₹{c.fee}</TableCell>
                    <TableCell>
                      <Badge variant={c.paymentStatus === "paid" ? "default" : "outline"}>{c.paymentStatus}</Badge>
                    </TableCell>
                    <TableCell>
                      <select
                        value={c.status}
                        onChange={(e) => onStatusChange(c._id, e.target.value)}
                        className="h-7 rounded-md border border-input bg-transparent px-2 text-xs outline-none"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell>
                      <select
                        value={c.pandit?._id ?? ""}
                        onChange={(e) => onAssignPandit(c._id, e.target.value)}
                        className="h-7 rounded-md border border-input bg-transparent px-2 text-xs outline-none"
                      >
                        <option value="" disabled>
                          Assign pandit…
                        </option>
                        {pandits?.items.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.fullName}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
