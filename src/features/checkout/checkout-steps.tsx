import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Your Details", "Review & Pay"];

export function CheckoutSteps({ current }: { current: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {STEPS.map((label, i) => {
        const step = (i + 1) as 1 | 2;
        const isDone = step < current;
        const isActive = step === current;
        return (
          <div key={label} className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  isDone
                    ? "bg-primary text-white"
                    : isActive
                      ? "bg-primary/15 text-primary ring-2 ring-primary"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {isDone ? <Check size={13} /> : step}
              </span>
              <span className={cn("text-xs font-semibold sm:text-sm", isActive ? "text-foreground" : "text-muted-foreground")}>
                {label}
              </span>
            </div>
            {step < STEPS.length ? <span className="h-px w-6 shrink-0 bg-border sm:w-10" /> : null}
          </div>
        );
      })}
    </div>
  );
}
