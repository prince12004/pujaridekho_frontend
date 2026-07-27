import { cn } from "@/lib/utils";

/** Brand-flavored loading indicator — a flickering diya, standing in for a generic spinner. */
export function Loading({
  label = "Loading",
  className,
  size = 40,
}: {
  label?: string;
  className?: string;
  size?: number;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-10", className)} role="status">
      <svg width={size} height={size * 0.9} viewBox="0 0 100 90" fill="none" aria-hidden="true">
        <path d="M8 55 Q50 92 92 55 L82 49 Q50 74 18 49 Z" fill="var(--secondary)" />
        <ellipse cx="50" cy="52" rx="35" ry="6.5" fill="var(--brand-purple-tint)" opacity="0.5" />
        <path
          className="animate-diya-flicker"
          d="M50 10c5 8 2 12-1 16-3 4-6 8-6 13a7 7 0 0 0 14 0c0-4-2-7-4-9 1 2 0 4-1 5 1-6-2-9-2-13-1-4 0-8 0-12z"
          fill="var(--primary)"
        />
      </svg>
      <span className="font-ui text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</span>
    </div>
  );
}
