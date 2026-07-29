"use client";

import { Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AccountPageHeader } from "@/features/account/components/account-page-header";
import { AccountEmptyState } from "@/features/account/components/empty-state";
import { AccountLoadingSkeleton, AccountErrorState } from "@/features/account/components/state-blocks";
import { useMyPayments } from "@/features/account/api/use-payments";
import { formatCurrency, formatDateTime } from "@/features/account/lib/format";

const TYPE_LABELS: Record<string, string> = { booking: "Pooja Booking", order: "Product Order", consultation: "Consultation" };

function toneForPaymentStatus(status: string): "default" | "outline" | "secondary" | "destructive" {
  if (status === "successful") return "default";
  if (status === "refunded") return "destructive";
  return "outline";
}

export default function PaymentsPage() {
  const { data, isLoading, isError, refetch } = useMyPayments();

  return (
    <div>
      <AccountPageHeader title="Payments" description="A unified history of every payment across bookings, orders and consultations." />

      {isLoading && <AccountLoadingSkeleton />}
      {isError && <AccountErrorState onRetry={() => refetch()} />}

      {data && data.length === 0 && (
        <AccountEmptyState icon={Wallet} title="No payments have been made yet." description="Your payment history will appear here." />
      )}

      {data && data.length > 0 && (
        <div className="space-y-2">
          {data.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant={toneForPaymentStatus(entry.status)} className="capitalize">
                      {entry.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{TYPE_LABELS[entry.type] ?? entry.type}</span>
                  </div>
                  <p className="text-sm font-medium text-secondary">{entry.referenceLabel}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(entry.date)} · {entry.method.toUpperCase()}
                  </p>
                </div>
                <p className="text-lg font-bold text-secondary">{formatCurrency(entry.amount)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
