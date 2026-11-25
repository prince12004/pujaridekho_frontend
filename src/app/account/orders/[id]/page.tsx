"use client";

import { use, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getErrorMessage } from "@/features/account/lib/get-error-message";
import { AccountPageHeader } from "@/features/account/components/account-page-header";
import { AccountLoadingSkeleton, AccountErrorState } from "@/features/account/components/state-blocks";
import { ORDER_CANCELLABLE_STATUSES, useMyOrder, useRequestOrderCancellation } from "@/features/account/api/use-orders";
import { ORDER_STATUS_LABELS, badgeToneForStatus } from "@/features/account/lib/status-labels";
import { formatCurrency, formatDateTime } from "@/features/account/lib/format";

const ORDER_TIMELINE_ORDER = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: order, isLoading, isError, refetch } = useMyOrder(id);
  const cancelMutation = useRequestOrderCancellation();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  if (isLoading) return <AccountLoadingSkeleton rows={4} />;
  if (isError || !order) return <AccountErrorState onRetry={() => refetch()} />;

  const canCancel = ORDER_CANCELLABLE_STATUSES.includes(order.status) && order.cancelRequest?.status !== "requested";

  async function submitCancel() {
    if (!order || !cancelReason.trim()) {
      toast.error("Please tell us why you'd like to cancel");
      return;
    }
    try {
      await cancelMutation.mutateAsync({ id: order._id, reason: cancelReason.trim() });
      toast.success("Cancellation request sent to our team");
      setCancelOpen(false);
      setCancelReason("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not submit cancellation request"));
    }
  }

  return (
    <div className="space-y-6">
      <AccountPageHeader
        title={`Order #${order.orderId}`}
        description={formatDateTime(order.createdAt)}
        actions={<Badge variant={badgeToneForStatus(order.status)}>{ORDER_STATUS_LABELS[order.status] ?? order.status}</Badge>}
      />

      {!["cancelled", "returned"].includes(order.status) && (
        <Card>
          <CardContent className="p-5">
            <p className="mb-3 font-heading text-sm font-bold text-secondary">Order Status</p>
            <div className="flex flex-wrap gap-3">
              {ORDER_TIMELINE_ORDER.map((status) => {
                const event = order.timeline.find((t) => t.status === status);
                const reached = Boolean(event) || status === order.status || ORDER_TIMELINE_ORDER.indexOf(order.status) > ORDER_TIMELINE_ORDER.indexOf(status);
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
                    <p className="text-xs font-medium text-secondary">{ORDER_STATUS_LABELS[status] ?? status}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-5">
          <p className="mb-3 font-heading text-sm font-bold text-secondary">Items</p>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between gap-3 text-sm">
                <div>
                  <p className="font-medium text-secondary">{item.name}</p>
                  <p className="text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-secondary">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {order.cancelRequest && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-5">
            <p className="font-heading text-sm font-bold text-secondary">
              Cancellation Request —{" "}
              {order.cancelRequest.status === "requested" ? "under review" : order.cancelRequest.status}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{order.cancelRequest.reason}</p>
            {order.cancelRequest.resolutionNote ? (
              <p className="mt-1 text-xs text-muted-foreground">Note from our team: {order.cancelRequest.resolutionNote}</p>
            ) : null}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-2 p-5">
            <p className="mb-1 font-heading text-sm font-bold text-secondary">Shipping Address</p>
            <p className="text-sm text-secondary">{order.shippingAddress.name}</p>
            <p className="text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
            <p className="text-sm text-muted-foreground">
              {order.shippingAddress.address}, {order.shippingAddress.city} — {order.shippingAddress.pincode}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 p-5">
            <p className="mb-1 font-heading text-sm font-bold text-secondary">Payment Summary</p>
            <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
            {order.discount > 0 && <Row label="Discount" value={`-${formatCurrency(order.discount)}`} />}
            <Row label="Delivery Charge" value={order.shippingCharge ? formatCurrency(order.shippingCharge) : "Free"} />
            <Row label="Total" value={formatCurrency(order.total)} />
            <Row label="Payment Method" value={order.paymentMethod} />
            <Row label="Payment Status" value={order.paymentStatus} />
          </CardContent>
        </Card>
      </div>

      {canCancel && (
        <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="font-ui font-bold text-destructive hover:text-destructive">
              Request Cancellation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel this Order</DialogTitle>
              <DialogDescription>
                Orders can be cancelled until they are shipped. Our team reviews every request; if you have already paid, the
                refund is processed after approval. Submitting this sends a cancellation request — it does not cancel the order
                immediately.
              </DialogDescription>
            </DialogHeader>
            <div>
              <Label htmlFor="order-cancel-reason" className="mb-1.5">Reason for cancellation</Label>
              <Textarea
                id="order-cancel-reason"
                placeholder="Tell us why you're cancelling..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="destructive" onClick={submitCancel} disabled={cancelMutation.isPending} className="font-ui font-bold">
                {cancelMutation.isPending ? "Submitting..." : "Confirm Cancellation Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {order.status === "delivered" && (
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="font-ui font-bold">
            <Link href="/account/invoices">View Invoice</Link>
          </Button>
          <Button asChild variant="outline" className="font-ui font-bold">
            <Link href="/account/reviews">Rate Products</Link>
          </Button>
          <Button asChild variant="outline" className="font-ui font-bold">
            <Link href="/products">Buy Again</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-secondary capitalize">{value}</span>
    </div>
  );
}
