import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <span className="font-ui inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
        <span className="h-[2px] w-5 rounded-full bg-accent" />
        {eyebrow}
      </span>
      <h2 className="text-balance text-3xl font-bold sm:text-4xl">{title}</h2>
      {description ? (
        <p
          className={cn(
            "max-w-xl text-base text-muted-foreground",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
