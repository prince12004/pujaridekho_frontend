"use client";

import { useState } from "react";
import Link from "next/link";
import { PackageCheck } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AccountPageHeader } from "@/features/account/components/account-page-header";
import { AccountEmptyState } from "@/features/account/components/empty-state";
import { AccountLoadingSkeleton, AccountErrorState } from "@/features/account/components/state-blocks";
import { useMyOrders } from "@/features/account/api/use-orders";
import { ORDER_STATUS_LABELS, badgeToneForStatus } from "@/features/account/lib/status-labels";
import { formatCurrency, formatDate } from "@/features/account/lib/format";

const TABS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function MyOrdersPage() {
  const [tab, setTab] = useState("all");
  const { data, isLoading, isError, refetch } = useMyOrders(tab);

  return (
    <div>
      <AccountPageHeader title="My Orders" description="Puja samagri and product orders." />

      <Tabs value={tab} onValueChange={setTab} className="mb-4">
        <TabsList className="flex-wrap">
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading && <AccountLoadingSkeleton />}
      {isError && <AccountErrorState onRetry={() => refetch()} />}

      {data && data.items.length === 0 && (
        <AccountEmptyState
          icon={PackageCheck}
          title="No orders have been received yet"
          description="Shop for Puja samagri and spiritual products."
          ctaLabel="Explore Products"
          ctaHref="/products"
        />
      )}

      {data && data.items.length > 0 && (
        <div className="space-y-3">
          {data.items.map((order) => (
            <Card key={order._id}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <Badge variant={badgeToneForStatus(order.status)}>{ORDER_STATUS_LABELS[order.status] ?? order.status}</Badge>
                    <span className="text-xs text-muted-foreground">#{order.orderId}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} item{order.items.length === 1 ? "" : "s"} · {formatDate(order.createdAt)}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-secondary">{formatCurrency(order.total)}</p>
                </div>
                <Button asChild size="sm" variant="outline" className="font-ui font-bold">
                  <Link href={`/account/orders/${order._id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
