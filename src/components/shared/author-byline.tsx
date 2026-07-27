import { Calendar, Clock } from "lucide-react";
import { MonogramAvatar } from "@/components/shared/monogram-avatar";
import { cn } from "@/lib/utils";

export function AuthorByline({
  name,
  role,
  date,
  readTime,
  seed = 0,
  className,
}: {
  name: string;
  role: string;
  date: string;
  readTime: string;
  seed?: number;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      <div className="flex items-center gap-3">
        <MonogramAvatar initials={initials} seed={seed} className="h-11 w-11 text-sm" />
        <div>
          <div className="text-sm font-bold">{name}</div>
          <div className="text-xs text-muted-foreground">{role}</div>
        </div>
      </div>
      <span className="hidden h-8 w-px bg-border sm:block" />
      <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar size={13} className="text-primary" /> {date}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={13} className="text-primary" /> {readTime}
        </span>
      </div>
    </div>
  );
}
