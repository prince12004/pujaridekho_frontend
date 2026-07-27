import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  label: string;
  title: string;
  description: string;
  icon?: React.ComponentType<{ size?: number }>;
}

export function Timeline({ items, className }: { items: TimelineItem[]; className?: string }) {
  return (
    <div className={cn("relative flex flex-col gap-10", className)}>
      <div className="absolute left-[27px] top-2 bottom-2 w-px bg-border sm:left-[31px]" aria-hidden="true" />
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <Reveal key={item.title} delay={i * 0.06} className="relative flex gap-5 sm:gap-6">
            <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card text-primary shadow-sm sm:h-16 sm:w-16">
              {Icon ? <Icon size={24} /> : <span className="font-heading text-sm">{i + 1}</span>}
            </span>
            <div className="pt-1.5">
              <span className="font-ui text-xs font-bold uppercase tracking-wide text-primary">{item.label}</span>
              <h3 className="font-heading mt-1 text-lg">{item.title}</h3>
              <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">{item.description}</p>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
