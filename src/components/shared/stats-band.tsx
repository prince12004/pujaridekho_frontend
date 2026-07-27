import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { cn } from "@/lib/utils";

// Tailwind scans for literal class names, so dynamic `grid-cols-${n}` strings
// won't be picked up at build time — map explicitly instead.
const gridColsBySize: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
};

export function StatsBand({
  stats,
  className,
}: {
  stats: { value: string; label: string }[];
  className?: string;
}) {
  const smCols = gridColsBySize[Math.min(stats.length, 5)] ?? "sm:grid-cols-4";

  return (
    <section className={cn("relative overflow-hidden bg-brand-purple-deep py-14", className)}>
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(217,164,65,0.14) 1.4px, transparent 1.6px)",
          backgroundSize: "26px 26px",
        }}
      />
      <Container className={cn("relative grid grid-cols-2 gap-8", smCols)}>
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08} className="text-center">
            <div className="font-heading text-3xl font-bold text-brand-gold-soft sm:text-4xl">
              <AnimatedCounter value={stat.value} />
            </div>
            <div className="mt-1 text-sm font-semibold text-brand-cream/75">{stat.label}</div>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
