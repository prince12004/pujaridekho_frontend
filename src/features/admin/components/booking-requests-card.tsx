"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { type BookingDetail, useResolveBookingRequest } from "@/features/admin/api/use-bookings";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const fmt = (d?: string) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "");

/** Customer cancel / reschedule requests with approve & reject. Hidden when there are none. */
export function BookingRequestsCard({ booking }: { booking: BookingDetail }) {
  const resolve = useResolveBookingRequest();
  const [note, setNote] = useState("");
  const cancel = booking.cancelRequest;
  const reschedule = booking.rescheduleRequest;
  if (!cancel && !reschedule) return null;

  const act = async (kind: "cancel" | "reschedule", decision: "approve" | "reject") => {
    const question =
      kind === "cancel"
        ? decision === "approve" ? "Cancel this booking? The customer will be notified." : "Reject the cancellation request?"
        : decision === "approve" ? "Move the puja to the requested date? The customer will be notified." : "Reject the reschedule request?";
    if (!confirm(question)) return;
    try {
      await resolve.mutateAsync({ id: booking._id, kind, decision, note: note.trim() || undefined });
      setNote("");
      toast.success(decision === "approve" ? "Approved — customer notified" : "Rejected — customer notified");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const statusBadge = (status: string) => (
    <Badge variant={status === "requested" ? "default" : "outline"} className="capitalize">
      {status === "requested" ? "Pending" : status}
    </Badge>
  );
  const pending = cancel?.status === "requested" || reschedule?.status === "requested";

  return (
    <Card className={pending ? "border-primary/40" : undefined}>
      <CardHeader>
        <CardTitle>Customer Requests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {cancel ? (
          <div className="space-y-2 rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Cancellation</span>
              {statusBadge(cancel.status)}
            </div>
            <p className="text-muted-foreground">Reason: {cancel.reason}{cancel.notes ? ` — ${cancel.notes}` : ""}</p>
            {cancel.requestedAt ? <p className="text-xs text-muted-foreground">Requested {fmt(cancel.requestedAt)}</p> : null}
            {cancel.resolutionNote ? <p className="text-xs text-muted-foreground">Note: {cancel.resolutionNote}</p> : null}
            {cancel.status === "requested" ? (
              <div className="flex gap-2">
                <Button size="sm" variant="destructive" disabled={resolve.isPending} onClick={() => act("cancel", "approve")}>
                  {resolve.isPending ? <Loader2 className="animate-spin" /> : <Check />} Approve & cancel
                </Button>
                <Button size="sm" variant="outline" disabled={resolve.isPending} onClick={() => act("cancel", "reject")}>
                  <X /> Reject
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}

        {reschedule ? (
          <div className="space-y-2 rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Reschedule</span>
              {statusBadge(reschedule.status)}
            </div>
            <p className="text-muted-foreground">
              New date: <span className="font-medium text-foreground">{fmt(reschedule.requestedDate)}{reschedule.requestedTime ? `, ${reschedule.requestedTime}` : ""}</span>
            </p>
            {reschedule.reason ? <p className="text-muted-foreground">Reason: {reschedule.reason}</p> : null}
            {reschedule.resolutionNote ? <p className="text-xs text-muted-foreground">Note: {reschedule.resolutionNote}</p> : null}
            {reschedule.status === "requested" ? (
              <div className="flex gap-2">
                <Button size="sm" disabled={resolve.isPending} onClick={() => act("reschedule", "approve")}>
                  {resolve.isPending ? <Loader2 className="animate-spin" /> : <Check />} Approve
                </Button>
                <Button size="sm" variant="outline" disabled={resolve.isPending} onClick={() => act("reschedule", "reject")}>
                  <X /> Reject
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}

        {pending ? (
          <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional note (saved on the booking)" />
        ) : null}
      </CardContent>
    </Card>
  );
}
