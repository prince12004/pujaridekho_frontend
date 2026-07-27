import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { earningsBreakdown } from "@/features/become-a-pandit/data";

export function EarningsSection() {
  return (
    <section className="bg-muted/40 py-20 sm:py-15">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="Transparent Payouts"
          title="Typical Earnings by Puja"
          description="Indicative payouts per booking — your exact payout is confirmed before you accept any booking."
          className="mb-10"
        />
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {earningsBreakdown.map((row, i) => (
              <div
                key={row.pooja}
                className={`flex items-center justify-between gap-4 px-6 py-4 ${i % 2 === 0 ? "bg-muted/40" : ""}`}
              >
                <span className="text-sm font-semibold">{row.pooja}</span>
                <span className="font-heading text-secondary">{row.payout}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
