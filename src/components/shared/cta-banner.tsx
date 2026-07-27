import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaBanner({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  className?: string;
}) {
  return (
    <section className={cn("py-20 sm:py-15", className)}>
      <Container>
        <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-secondary to-brand-purple-deep px-7 py-14 text-center text-brand-cream sm:px-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(217,164,65,0.2) 1.4px, transparent 1.6px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative mx-auto max-w-xl">
            {eyebrow ? (
              <span className="font-ui text-xs font-bold uppercase tracking-wide text-brand-gold-soft">
                {eyebrow}
              </span>
            ) : null}
            <h2 className="font-heading mt-2 text-3xl font-bold text-brand-gold-soft sm:text-4xl">{title}</h2>
            {description ? <p className="mt-3 text-brand-cream/80">{description}</p> : null}
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button size="lg" className="font-ui font-bold" asChild>
                <Link href={primaryAction.href}>{primaryAction.label}</Link>
              </Button>
              {secondaryAction ? (
                <Button
                  size="lg"
                  variant="outline"
                  className="font-ui border-white/25 bg-transparent font-bold text-brand-cream hover:bg-white/10"
                  asChild
                >
                  <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
