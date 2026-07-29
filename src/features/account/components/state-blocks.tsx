import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function AccountLoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-24 w-full rounded-2xl" />
      ))}
    </div>
  );
}

export function AccountErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-destructive/30 bg-destructive/5 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" />
      </span>
      <p className="font-heading text-base font-bold text-secondary">Something went wrong</p>
      <p className="max-w-sm text-sm text-muted-foreground">{message ?? "We couldn't load this. Please try again."}</p>
      {onRetry && (
        <Button variant="outline" className="mt-2 font-ui font-bold" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
