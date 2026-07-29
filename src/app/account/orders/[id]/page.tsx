"use client";

import { use } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AccountPageHeader } from "@/features/account/components/account-page-header";
import { AccountLoadingSkeleton, AccountErrorState } from "@/features/account/components/state-blocks";
import { useMyOrder } from "@/features/account/api/use-orders";
import { ORDER_STATUS_LABELS, badgeToneForStatus } from "@/features/account/lib/status-labels";
import { formatCurrency, formatDateTime } from "@/features/account/lib/format";

const ORDER_TIMELINE_ORDER = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: order, isLoading, isError, refetch } = useMyOrder(id);

  if (isLoading) return <AccountLoadingSkeleton rows={4} />;
  if (isError || !order) return <AccountErrorState onRetry={() => refetch()} />;

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
