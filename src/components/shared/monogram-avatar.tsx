import { cn } from "@/lib/utils";

const gradients = [
  "from-primary to-accent",
  "from-secondary to-brand-purple-tint",
  "from-accent to-primary",
  "from-brand-purple-tint to-secondary",
];

export function MonogramAvatar({
  initials,
  seed = 0,
  className,
}: {
  initials: string;
  seed?: number;
  className?: string;
}) {
  const gradient = gradients[seed % gradients.length];
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-heading font-bold text-white",
        gradient,
        className,
      )}
    >
      {initials}
    </div>
  );
}
