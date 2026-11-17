// Single admin-facing payment label derived from the booking's money state
// (paymentStatus) plus its latest gateway attempt:
//   Paid / Partially Paid  – money received
//   Pending                – sent to PayU, no result back yet (closed the tab, still paying…)
//   Unpaid                 – never reached the gateway, or the attempt failed
//   Refunded
export type PaymentState = "paid" | "partially_paid" | "pending" | "unpaid" | "refunded";

export const PAYMENT_STATE_OPTIONS: { value: PaymentState; label: string }[] = [
  { value: "paid", label: "Paid" },
  { value: "partially_paid", label: "Partially Paid" },
  { value: "pending", label: "Pending" },
  { value: "unpaid", label: "Unpaid" },
  { value: "refunded", label: "Refunded" },
];

const LABELS: Record<PaymentState, string> = Object.fromEntries(
  PAYMENT_STATE_OPTIONS.map((o) => [o.value, o.label]),
) as Record<PaymentState, string>;

const BADGE_CLASSES: Record<PaymentState, string> = {
  paid: "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  partially_paid: "border-transparent bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  pending: "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  unpaid: "border-transparent bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  refunded: "border-transparent bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export function getPaymentState(booking: {
  paymentStatus: string;
  lastPaymentAttemptStatus?: string | null;
}): PaymentState {
  if (booking.paymentStatus === "paid") return "paid";
  if (booking.paymentStatus === "partially_paid") return "partially_paid";
  if (booking.paymentStatus === "refunded") return "refunded";
  return booking.lastPaymentAttemptStatus === "initiated" ? "pending" : "unpaid";
}

export function paymentStateLabel(state: PaymentState) {
  return LABELS[state];
}

export function paymentStateBadgeClass(state: PaymentState) {
  return BADGE_CLASSES[state];
}
