import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Payment Result",
  description: "Your PujariDekho payment status.",
  path: "/payment/result",
});

function ResultContent({ status, entityType, entityId }: { status: string; entityType?: string; entityId?: string }) {
  const succeeded = status === "success";

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span
        className={`flex size-16 items-center justify-center rounded-full ${succeeded ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"}`}
      >
        {succeeded ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
      </span>
      <h1 className="font-heading mt-4 text-2xl font-bold">
        {succeeded ? "Payment Successful" : status === "error" ? "Something Went Wrong" : "Payment Failed"}
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {succeeded
          ? "Your payment has been received and your order is confirmed. Our team will be in touch shortly."
          : "Your payment could not be completed. No amount has been deducted for a failed transaction — please try again or contact support."}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {succeeded && entityType === "booking" && entityId ? (
          <Button asChild>
            <Link href={`/account/bookings/${entityId}`}>View My Booking</Link>
          </Button>
        ) : succeeded && entityType === "order" && entityId ? (
          <Button asChild>
            <Link href={`/orders/${entityId}`}>View Order Details</Link>
          </Button>
        ) : succeeded && entityType === "consultation" && entityId ? (
          <Button asChild>
            <Link href={`/account/consultations/${entityId}`}>View My Consultation</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        )}
        {succeeded ? (
          <Button variant="outline" asChild>
            <Link href="/account/bookings">Go to Dashboard</Link>
          </Button>
        ) : (
          <Button variant="outline" asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
        )}
      </div>
    </Container>
  );
}

export default async function PaymentResultPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; entityType?: string; entityId?: string }>;
}) {
  const { status, entityType, entityId } = await searchParams;
  return <ResultContent status={status ?? "unknown"} entityType={entityType} entityId={entityId} />;
}
