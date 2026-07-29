"use client";

import { use, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, Phone, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AccountPageHeader } from "@/features/account/components/account-page-header";
import { AccountLoadingSkeleton, AccountErrorState } from "@/features/account/components/state-blocks";
import { useMyBooking, useRequestCancellation, useRequestReschedule } from "@/features/account/api/use-bookings";
import { BOOKING_STATUS_LABELS, BOOKING_TIMELINE_ORDER, badgeToneForStatus } from "@/features/account/lib/status-labels";
import { formatCurrency, formatDate, formatDateTime } from "@/features/account/lib/format";
import { getErrorMessage } from "@/features/account/lib/get-error-message";
import { apiClient } from "@/lib/api-client";
import { useAuthModal } from "@/providers/auth-modal-provider";

const ELIGIBLE_FOR_REQUEST = ["pending_payment", "payment_received", "booking_confirmed", "pandit_assignment_pending", "pandit_assigned"];
const PANDIT_CONTACT_VISIBLE_AT = ["pandit_accepted", "pandit_on_the_way", "pooja_started", "pooja_completed", "closed"];

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { customer } = useAuthModal();
  const { data: booking, isLoading, isError, refetch } = useMyBooking(id);
  const rescheduleMutation = useRequestReschedule();
  const cancelMutation = useRequestCancellation();
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  if (isLoading) return <AccountLoadingSkeleton rows={4} />;
  if (isError || !booking) return <AccountErrorState onRetry={() => refetch()} />;

  const booking_ = booking;
  const paidAmount = booking_.payments.filter((p) => p.status === "success").reduce((sum, p) => sum + p.amount, 0);
  const balanceDue = Math.max((booking_.pricing?.finalAmount ?? 0) - paidAmount, 0);
  const eligibleForRequest = ELIGIBLE_FOR_REQUEST.includes(booking_.status);
  const canReschedule = eligibleForRequest && !booking_.rescheduleRequest;
  const canCancel = eligibleForRequest && !booking_.cancelRequest;
  const isCompleted = ["pooja_completed", "closed"].includes(booking_.status);
  const panditContactVisible = PANDIT_CONTACT_VISIBLE_AT.includes(booking_.status);

  async function handlePayBalance() {
    setIsPaying(true);
    try {
      const res = await apiClient.post("/payments/payu/initiate", {
        entityType: "booking",
        entityId: booking_._id,
        amount: balanceDue,
        name: customer?.name ?? "Customer",
        email: "guest@pujaridekho.com",
        phone: customer?.mobile ?? "",
      });
      const { action, fields } = res.data.data;
      const form = document.createElement("form");
      form.method = "POST";
      form.action = action;
      Object.entries(fields as Record<string, unknown>).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not start payment"));
      setIsPaying(false);
    }
  }

  async function submitReschedule() {
    if (!rescheduleDate) {
      toast.error("Please select a preferred date");
      return;
    }
    try {
      await rescheduleMutation.mutateAsync({
        id: booking_._id,
        input: { requestedDate: rescheduleDate, requestedTime: rescheduleTime || undefined, reason: rescheduleReason || undefined },
      });
      toast.success("Reschedule request sent to our team");
      setRescheduleOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not submit reschedule request"));
    }
  }

  async function submitCancel() {
    if (!cancelReason.trim()) {
      toast.error("Please tell us why you'd like to cancel");
      return;
    }
    try {
      await cancelMutation.mutateAsync({ id: booking_._id, input: { reason: cancelReason } });
      toast.success("Cancellation request sent to our team");
      setCancelOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not submit cancellation request"));
    }
  }

  return (
    <div className="space-y-6">
      <AccountPageHeader
        title={booking.pooja?.name ?? booking.festival?.name ?? "Pooja Booking"}
        description={`Booking #${booking.bookingId}`}
        actions={<Badge variant={badgeToneForStatus(booking.status)}>{BOOKING_STATUS_LABELS[booking.status] ?? booking.status}</Badge>}
      />

      <Card>
        <CardContent className="p-5">
          <p className="mb-3 font-heading text-sm font-bold text-secondary">Status Timeline</p>
          <div className="flex flex-wrap gap-3">
            {BOOKING_TIMELINE_ORDER.filter((status) => booking.timeline.some((t) => t.status === status) || status === booking.status).map(
              (status) => {
                const event = booking.timeline.find((t) => t.status === status);
                const reached = Boolean(event) || status === booking.status;
                return (
                  <div key={status} className="flex items-center gap-2">
                    <span
                      className={
                        reached
                          ? "flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                          : "flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground"
                      }
                    >
                      <Check className="size-3.5" />
                    </span>
                    <div>
                      <p className="text-xs font-medium text-secondary">{BOOKING_STATUS_LABELS[status] ?? status}</p>
                      {event && <p className="text-[11px] text-muted-foreground">{formatDateTime(event.changedAt)}</p>}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-2 p-5">
            <p className="mb-1 font-heading text-sm font-bold text-secondary">Booking Details</p>
            <DetailRow label="Date" value={formatDate(booking.poojaDate)} />
            <DetailRow label="Time" value={booking.poojaTime ?? "—"} />
            <DetailRow label="City" value={booking.city ?? "—"} />
            <DetailRow label="Address" value={booking.address ?? "—"} />
            {booking.gotra && <DetailRow label="Gotra" value={booking.gotra} />}
            {booking.package?.name && <DetailRow label="Package" value={booking.package.name} />}
            {booking.selectedSamagri.length > 0 && (
              <DetailRow label="Samagri" value={booking.selectedSamagri.map((s) => s.name).join(", ")} />
            )}
            {booking.specialInstructions && <DetailRow label="Instructions" value={booking.specialInstructions} />}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 p-5">
            <p className="mb-1 font-heading text-sm font-bold text-secondary">Pandit</p>
            {booking.pandit ? (
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-secondary">{booking.pandit.fullName}</p>
                  {panditContactVisible && booking.pandit.mobile ? (
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="size-3.5" /> {booking.pandit.mobile}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Contact details will appear once the Pandit is on the way.</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">A Pandit will be assigned to this booking soon.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-3 p-5">
          <p className="font-heading text-sm font-bold text-secondary">Payment</p>
          <DetailRow label="Total Amount" value={formatCurrency(booking.pricing?.finalAmount)} />
          <DetailRow label="Paid" value={formatCurrency(paidAmount)} />
          <DetailRow label="Balance Due" value={formatCurrency(balanceDue)} />
          {balanceDue > 0 && !["cancelled", "refunded", "refund_requested"].includes(booking.status) && (
            <Button onClick={handlePayBalance} disabled={isPaying} className="mt-1 font-ui font-bold">
              {isPaying ? "Redirecting..." : `Pay Balance ${formatCurrency(balanceDue)}`}
            </Button>
          )}
        </CardContent>
      </Card>

      {booking.rescheduleRequest && (
        <Card className="border-accent/30 bg-accent/5">
          <CardContent className="p-5">
            <p className="font-heading text-sm font-bold text-secondary">Reschedule Request — {booking.rescheduleRequest.status}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Requested for {formatDate(booking.rescheduleRequest.requestedDate)}
              {booking.rescheduleRequest.requestedTime ? ` · ${booking.rescheduleRequest.requestedTime}` : ""}
            </p>
          </CardContent>
        </Card>
      )}

      {booking.cancelRequest && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-5">
            <p className="font-heading text-sm font-bold text-secondary">Cancellation Request — {booking.cancelRequest.status}</p>
            <p className="mt-1 text-sm text-muted-foreground">{booking.cancelRequest.reason}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        {canReschedule && (
          <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="font-ui font-bold">
                Request Reschedule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request a Reschedule</DialogTitle>
                <DialogDescription>
                  Our team will review your request and confirm the new date. This does not reschedule automatically.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="reschedule-date" className="mb-1.5">Preferred Date</Label>
                  <Input id="reschedule-date" type="date" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="reschedule-time" className="mb-1.5">Preferred Time (optional)</Label>
                  <Input id="reschedule-time" placeholder="e.g. Morning, 10 AM" value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="reschedule-reason" className="mb-1.5">Reason (optional)</Label>
                  <Textarea id="reschedule-reason" placeholder="Let us know why you'd like to reschedule..." value={rescheduleReason} onChange={(e) => setRescheduleReason(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={submitReschedule} disabled={rescheduleMutation.isPending} className="font-ui font-bold">
                  {rescheduleMutation.isPending ? "Submitting..." : "Submit Request"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {canCancel && (
          <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="font-ui font-bold text-destructive hover:text-destructive">
                Request Cancellation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel this Booking</DialogTitle>
                <DialogDescription>
                  Cancellation and refunds are subject to our cancellation policy — refunds (if applicable) are processed by our team
                  after review, not automatically. Submitting this sends a cancellation request; it does not cancel the booking
                  immediately.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="cancel-reason" className="mb-1.5">Reason for cancellation</Label>
                  <Textarea id="cancel-reason" placeholder="Tell us why you're cancelling..." value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={submitCancel}
                  disabled={cancelMutation.isPending}
                  className="font-ui font-bold"
                >
                  {cancelMutation.isPending ? "Submitting..." : "Confirm Cancellation Request"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {isCompleted && (
          <>
            <Button asChild variant="outline" className="font-ui font-bold">
              <Link href="/account/invoices">View Invoice</Link>
            </Button>
            <Button asChild variant="outline" className="font-ui font-bold">
              <Link href="/poojas">Book Again</Link>
            </Button>
            <Button asChild variant="outline" className="font-ui font-bold">
              <Link href="/account/reviews">Rate this Service</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-secondary">{value}</span>
    </div>
  );
}
