import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  className,
  size = 14,
}: {
  rating: number;
  className?: string;
  size?: number;
}) {
  const rounded = Math.round(rating);
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rounded ? "fill-accent text-accent" : "fill-transparent text-muted-foreground/30"}
        />
      ))}
    </div>
  );
}
