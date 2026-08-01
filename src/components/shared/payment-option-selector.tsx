"use client";

import { cn } from "@/lib/utils";

export const ADVANCE_AMOUNT = 99;
export const DISTANCE_CHARGE = 149;

export type PaymentOption = "advance" | "full";

export function PaymentOptionSelector({
  value,
  onChange,
  fullAmountLabel,
}: {
  value: PaymentOption;
  onChange: (value: PaymentOption) => void;
  /** e.g. "₹2,450" — shown when the full amount is known, otherwise "Full Amount". */
  fullAmountLabel: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => onChange("advance")}
        className={cn(
          "flex flex-col items-center gap-0.5 rounded-lg border px-3 py-2 text-center transition-colors",
          value === "advance" ? "border-primary bg-primary/8" : "border-input bg-background hover:border-primary/40",
        )}
      >
        <span className={cn("font-heading text-base font-bold", value === "advance" && "text-primary")}>
          ₹{ADVANCE_AMOUNT}
        </span>
        <span className="text-[11px] font-semibold text-muted-foreground">Booking Amount</span>
      </button>
      <button
        type="button"
        onClick={() => onChange("full")}
        className={cn(
          "flex flex-col items-center gap-0.5 rounded-lg border px-3 py-2 text-center transition-colors",
          value === "full" ? "border-primary bg-primary/8" : "border-input bg-background hover:border-primary/40",
        )}
      >
        <span className={cn("font-heading text-base font-bold", value === "full" && "text-primary")}>{fullAmountLabel}</span>
        <span className="text-[11px] font-semibold text-muted-foreground">Full Amount</span>
      </button>
    </div>
  );
}
