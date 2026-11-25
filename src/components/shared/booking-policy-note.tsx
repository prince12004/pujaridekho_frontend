import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/** Short cancellation / backup-pandit summary shown before payment and after booking. */
export function BookingPolicyNote({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-muted/40 p-3.5 text-left text-xs leading-relaxed text-muted-foreground", className)}>
      <p className="mb-1.5 flex items-center gap-1.5 font-semibold text-foreground">
        <ShieldCheck size={14} className="text-primary" /> Cancellation &amp; backup pandit
      </p>
      <ul className="list-disc space-y-1 pl-4">
        <li>Free cancellation or reschedule up to 24 hours before the puja.</li>
        <li>Within 24 hours, a partial charge may apply; reschedules depend on pandit availability.</li>
        <li>If your pandit becomes unavailable, we try to arrange another verified pandit — otherwise reschedule free or get a full refund.</li>
        <li>The ₹99 booking fee is non-refundable, except when we cannot provide a pandit.</li>
      </ul>
      <Link href="/refund-policy" className="mt-1.5 inline-block font-semibold text-primary hover:underline">
        Read the full policy
      </Link>
    </div>
  );
}
