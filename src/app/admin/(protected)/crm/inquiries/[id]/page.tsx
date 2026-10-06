"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useCrmInquiry, useUpdateCrmInquiry, useDeleteCrmInquiry } from "@/features/admin/api/use-crm-inquiries";
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
  const deleteMutation = useDeleteCrmInquiry();

  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [packagePrice, setPackagePrice] = useState("");
  const [samagriIncluded, setSamagriIncluded] = useState(false);
  const [samagriPrice, setSamagriPrice] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [tokenStatus, setTokenStatus] = useState<"pending" | "received">("pending");

  useEffect(() => {
    if (inquiry) {
      setStatus(inquiry.status);
      setAssignedTo(inquiry.assignedTo ?? "");
      setPackagePrice(inquiry.packagePrice != null ? String(inquiry.packagePrice) : "");
      setSamagriIncluded(inquiry.samagriIncluded);
      setSamagriPrice(inquiry.samagriPrice != null ? String(inquiry.samagriPrice) : "");
      setTokenAmount(String(inquiry.tokenAmount));
      setTokenStatus(inquiry.tokenStatus);
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

  const onDelete = async () => {
    try {
      await deleteMutation.mutateAsync(inquiry.id);
      toast.success("Inquiry deleted");
      router.push("/admin/crm/inquiries");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // Computed, never entered directly — the backend derives the same way on save.
  const computedTotal = Number(packagePrice || 0) + (samagriIncluded ? Number(samagriPrice || 0) : 0);
  const computedRemaining = Math.max(computedTotal - (tokenStatus === "received" ? Number(tokenAmount || 0) : 0), 0);

  const onSavePricing = async () => {
    try {
      await updateMutation.mutateAsync({
        id: inquiry.id,
        packagePrice: packagePrice === "" ? null : Number(packagePrice),
        samagriIncluded,
        samagriPrice: samagriPrice === "" ? null : Number(samagriPrice),
        tokenAmount: Number(tokenAmount || 0),
        tokenStatus,
        version: inquiry.version,
      });
      toast.success("Pricing updated");
    } catch (err) {
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
          <div className="flex items-center gap-2">
            <Badge variant={inquiry.status === "confirmed" ? "default" : inquiry.status === "notConverted" ? "destructive" : "secondary"}>
              {STATUS_LABELS[inquiry.status] ?? inquiry.status}
            </Badge>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 /> Delete
            </Button>
          </div>
        }
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this inquiry?</DialogTitle>
            <DialogDescription>
              This permanently deletes the inquiry{inquiry.websiteBookingId ? ", its linked Booking record, and any pandit slot reservation" : ""}.
              This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              <Row label="Total payment status" value={inquiry.totalAmountStatus} />
              <Row label="Transaction ID" value={inquiry.transactionId ?? "—"} />
              <Row label="Website booking ID" value={inquiry.websiteBookingId ?? "—"} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Puja Package Price</label>
                  <input
                    type="number"
                    value={packagePrice}
                    onChange={(e) => setPackagePrice(e.target.value)}
                    className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Samagri Included by Pujaridekho</label>
                  <select
                    value={samagriIncluded ? "yes" : "no"}
                    onChange={(e) => setSamagriIncluded(e.target.value === "yes")}
                    className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Samagri Price</label>
                  <input
                    type="number"
                    value={samagriPrice}
                    onChange={(e) => setSamagriPrice(e.target.value)}
                    disabled={!samagriIncluded}
                    className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none disabled:opacity-50"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Total Booking Amount</label>
                  <input
                    type="number"
                    value={computedTotal}
                    disabled
                    className="h-9 w-full rounded-lg border border-input bg-muted px-2.5 text-sm font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Token Amount Received</label>
                  <input
                    type="number"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(e.target.value)}
                    className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Token Status</label>
                  <select
                    value={tokenStatus}
                    onChange={(e) => setTokenStatus(e.target.value as "pending" | "received")}
                    className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="received">Received</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs text-muted-foreground">Remaining Amount</label>
                  <input
                    type="number"
                    value={computedRemaining}
                    disabled
                    className="h-9 w-full rounded-lg border border-input bg-muted px-2.5 text-sm font-medium outline-none"
                  />
                </div>
              </div>
              <Button size="sm" onClick={onSavePricing} disabled={updateMutation.isPending} className="mt-1">
                {updateMutation.isPending ? "Saving..." : "Save Pricing"}
              </Button>
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
