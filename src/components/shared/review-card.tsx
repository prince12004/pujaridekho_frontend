import { Quote } from "lucide-react";
import { StarRating } from "@/components/shared/star-rating";
import { MonogramAvatar } from "@/components/shared/monogram-avatar";
import { cn } from "@/lib/utils";

export function ReviewCard({
  name,
  subtitle,
  rating,
  quote,
  seed = 0,
  className,
}: {
  name: string;
  subtitle: string;
  rating: number;
  quote: string;
  seed?: number;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  return (
    <div className={cn("flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm", className)}>
      <Quote size={24} className="text-accent" />
      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">&ldquo;{quote}&rdquo;</p>
      <StarRating rating={rating} />
      <div className="flex items-center gap-3 border-t border-border pt-4">
        <MonogramAvatar initials={initials} seed={seed} className="h-11 w-11 text-sm" />
        <div>
          <div className="text-sm font-bold">{name}</div>
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}
