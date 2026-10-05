"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useCrmInquiry, useUpdateCrmInquiry } from "@/features/admin/api/use-crm-inquiries";
import { useCrmSalespeople } from "@/features/admin/api/use-crm-salespeople";
import { useCrmActivityLogs } from "@/features/admin/api/use-crm-activity-log";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const STATUS_LABELS: Record<string, string> = {
  inquiry: "Inquiry",
  confirmed: "Confirmed",
  notConverted: "Not Converted",
};

export default function CrmInquiryDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: inquiry, isLoading } = useCrmInquiry(params.id);
  const { data: salespeople } = useCrmSalespeople();
  const { data: activityLogs, isLoading: logsLoading } = useCrmActivityLogs(params.id);
  const updateMutation = useUpdateCrmInquiry();

  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  useEffect(() => {
    if (inquiry) {
      setStatus(inquiry.status);
      setAssignedTo(inquiry.assignedTo ?? "");
    }
  }, [inquiry]);

  if (isLoading || !inquiry) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const onStatusChange = async (value: string) => {
    setStatus(value);
    try {
      await updateMutation.mutateAsync({ id: inquiry.id, status: value, version: inquiry.version });
      toast.success("Status updated");
    } catch (err) {
      setStatus(inquiry.status);
      toast.error(getErrorMessage(err));
    }
  };

  const onAssignChange = async (value: string) => {
    setAssignedTo(value);
    try {
      await updateMutation.mutateAsync({ id: inquiry.id, assignedTo: value || null, version: inquiry.version });
      toast.success("Assignment updated");
    } catch (err) {
      setAssignedTo(inquiry.assignedTo ?? "");
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-2" onClick={() => router.push("/admin/crm/inquiries")}>
        <ArrowLeft /> Back to inquiries
      </Button>

      <AdminPageHeader
        title={inquiry.clientName}
        description={`${inquiry.phone} · ${inquiry.pujaName}`}
        actions={
          <Badge variant={inquiry.status === "confirmed" ? "default" : inquiry.status === "notConverted" ? "destructive" : "secondary"}>
            {STATUS_LABELS[inquiry.status] ?? inquiry.status}
          </Badge>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Inquiry Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Puja" value={inquiry.pujaName} />
              <Row label="Puja date" value={inquiry.pujaDate ? new Date(inquiry.pujaDate).toLocaleDateString("en-IN") : "—"} />
              <Row label="Puja time" value={inquiry.pujaTime ?? "—"} />
              <Row label="Address" value={inquiry.address ?? "—"} />
              <Row label="Source" value={inquiry.source} />
              <Row label="Notes" value={inquiry.notes ?? "—"} />
              <Row label="Next call date" value={inquiry.nextCallDate ? new Date(inquiry.nextCallDate).toLocaleDateString("en-IN") : "—"} />
              <Row label="Total amount" value={`₹${inquiry.totalAmount}`} />
              <Row label="Token amount" value={`₹${inquiry.tokenAmount} (${inquiry.tokenStatus})`} />
              <Row label="Total payment status" value={inquiry.totalAmountStatus} />
              <Row label="Transaction ID" value={inquiry.transactionId ?? "—"} />
              <Row label="Samagri included" value={inquiry.samagriIncluded ? "Yes" : "No"} />
              <Row label="Website booking ID" value={inquiry.websiteBookingId ?? "—"} />
            </CardContent>
          </Card>

          {inquiry.pujaEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Puja Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {inquiry.pujaEvents.map((event) => (
                  <div key={event.id} className="rounded-lg border border-border px-3 py-2 text-sm">
                    <p className="font-medium">{event.label}</p>
                    <p className="text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("en-IN")} {event.time ?? ""}
                    </p>
                    <p className="text-muted-foreground">
                      Pandit: {event.panditName ?? "Unassigned"} {event.assignedSlot ? `· ${event.assignedSlot}` : ""}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {(inquiry.panditId || inquiry.panditName) && (
            <Card>
              <CardHeader>
                <CardTitle>Pandit Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row label="Pandit" value={inquiry.panditName ?? "—"} />
                <Row label="Slot" value={inquiry.assignedSlot ?? "—"} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {logsLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              ) : activityLogs && activityLogs.length > 0 ? (
                activityLogs.map((log) => (
                  <div key={log.id} className="border-b border-dashed border-border pb-2 text-xs last:border-0">
                    <div className="flex items-center gap-2">
                      {log.isConversion && <Badge variant="default">Conversion</Badge>}
                      {log.isReassignment && <Badge variant="secondary">Reassignment</Badge>}
                      {log.isRejection && <Badge variant="destructive">Rejection</Badge>}
                    </div>
                    {log.note && <p className="mt-1">{log.note}</p>}
                    <p className="mt-1 text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString("en-IN")} · by {salespeople?.find((sp) => sp.id === log.salesPersonId)?.name ?? log.salesPersonId}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={status}
                onChange={(e) => onStatusChange(e.target.value)}
                disabled={updateMutation.isPending}
                className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
              >
                <option value="inquiry">Inquiry</option>
                <option value="confirmed">Confirmed</option>
                <option value="notConverted">Not Converted</option>
              </select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assigned Salesperson</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={assignedTo}
                onChange={(e) => onAssignChange(e.target.value)}
                disabled={updateMutation.isPending}
                className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
              >
                <option value="">Unassigned</option>
                {salespeople?.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.name}
                  </option>
                ))}
              </select>
              <Separator className="my-3" />
              <p className="text-xs text-muted-foreground">
                Created {new Date(inquiry.createdAt).toLocaleString("en-IN")}
                {inquiry.updatedAt && <> · Updated {new Date(inquiry.updatedAt).toLocaleString("en-IN")}</>}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
