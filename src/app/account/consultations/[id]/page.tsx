"use client";

import { use, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Phone, ShieldCheck } from "lucide-react";
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
import {
  useMyConsultation,
  useRequestConsultationCancellation,
  useRequestConsultationReschedule,
} from "@/features/account/api/use-consultations";
import { CONSULTATION_STATUS_LABELS, badgeToneForStatus } from "@/features/account/lib/status-labels";
import { formatCurrency, formatDate } from "@/features/account/lib/format";
import { getErrorMessage } from "@/features/account/lib/get-error-message";

const ELIGIBLE_STATUSES = ["new", "contacted", "scheduled"];

export default function ConsultationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: consultation, isLoading, isError, refetch } = useMyConsultation(id);
  const rescheduleMutation = useRequestConsultationReschedule();
  const cancelMutation = useRequestConsultationCancellation();
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [requestedDate, setRequestedDate] = useState("");
  const [requestedTime, setRequestedTime] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  if (isLoading) return <AccountLoadingSkeleton rows={3} />;
  if (isError || !consultation) return <AccountErrorState onRetry={() => refetch()} />;

  const c = consultation;
  const eligible = ELIGIBLE_STATUSES.includes(c.status);
  const canReschedule = eligible && !c.rescheduleRequest;
  const canCancel = eligible && !c.cancelRequest;
  const isCompleted = c.status === "completed";

  async function submitReschedule() {
    try {
      await rescheduleMutation.mutateAsync({
        id: c._id,
        input: { requestedDate: requestedDate || undefined, requestedTime: requestedTime || undefined, reason: rescheduleReason || undefined },
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
      await cancelMutation.mutateAsync({ id: c._id, input: { reason: cancelReason } });
      toast.success("Cancellation request sent to our team");
      setCancelOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not submit cancellation request"));
    }
  }

  return (
    <div className="space-y-6">
      <AccountPageHeader
        title={c.topic ?? "Astrology Consultation"}
        description={c.type}
        actions={<Badge variant={badgeToneForStatus(c.status)}>{CONSULTATION_STATUS_LABELS[c.status] ?? c.status}</Badge>}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-2 p-5">
            <p className="mb-1 font-heading text-sm font-bold text-secondary">Consultation Details</p>
            <Row label="Preferred Date" value={formatDate(c.preferredDate)} />
            <Row label="Preferred Time" value={c.preferredTime ?? "—"} />
            <Row label="Duration" value={c.duration ?? "—"} />
            <Row label="Fee" value={formatCurrency(c.fee)} />
            {c.message && <Row label="Your Message" value={c.message} />}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 p-5">
            <p className="mb-1 font-heading text-sm font-bold text-secondary">Astrologer</p>
            {c.pandit ? (
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-secondary">{c.pandit.fullName}</p>
                  {["scheduled", "completed"].includes(c.status) && c.pandit.mobile ? (
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="size-3.5" /> {c.pandit.mobile}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Contact details will appear once scheduled.</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">An Astrologer will be assigned soon.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {c.rescheduleRequest && (
        <Card className="border-accent/30 bg-accent/5">
          <CardContent className="p-5">
            <p className="font-heading text-sm font-bold text-secondary">Reschedule Request — {c.rescheduleRequest.status}</p>
          </CardContent>
        </Card>
      )}

      {c.cancelRequest && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-5">
            <p className="font-heading text-sm font-bold text-secondary">Cancellation Request — {c.cancelRequest.status}</p>
            <p className="mt-1 text-sm text-muted-foreground">{c.cancelRequest.reason}</p>
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
                <DialogDescription>Our team will review this and confirm the new time.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="c-date" className="mb-1.5">Preferred Date</Label>
                  <Input id="c-date" type="date" value={requestedDate} onChange={(e) => setRequestedDate(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="c-time" className="mb-1.5">Preferred Time (optional)</Label>
                  <Input id="c-time" placeholder="e.g. Morning, 10 AM" value={requestedTime} onChange={(e) => setRequestedTime(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="c-reason" className="mb-1.5">Reason (optional)</Label>
                  <Textarea id="c-reason" placeholder="Let us know why you'd like to reschedule..." value={rescheduleReason} onChange={(e) => setRescheduleReason(e.target.value)} />
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
                <DialogTitle>Cancel this Consultation</DialogTitle>
                <DialogDescription>This sends a cancellation request to our team for review — it isn&apos;t cancelled immediately.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="cc-reason" className="mb-1.5">Reason for cancellation</Label>
                  <Textarea id="cc-reason" placeholder="Tell us why you're cancelling..." value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="destructive" onClick={submitCancel} disabled={cancelMutation.isPending} className="font-ui font-bold">
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
              <Link href="/account/reviews">Rate this Consultation</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-secondary">{value}</span>
    </div>
  );
}
