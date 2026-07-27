import { CheckCircle2, FileText } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { documentsRequired, eligibilityCriteria } from "@/features/become-a-pandit/data";

export function EligibilityDocuments() {
  return (
    <section className="bg-muted/40 py-20 sm:py-15">
      <Container className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-8 shadow-sm">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
              <CheckCircle2 size={22} />
            </span>
            <h2 className="font-heading text-2xl">Eligibility</h2>
            <ul className="flex flex-col gap-3">
              {eligibilityCriteria.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-8 shadow-sm">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-brand-purple-tint text-white">
              <FileText size={22} />
            </span>
            <h2 className="font-heading text-2xl">Documents Required</h2>
            <ul className="flex flex-col gap-3">
              {documentsRequired.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
