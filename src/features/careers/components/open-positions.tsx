import { Briefcase, MapPin } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { openPositions } from "@/features/careers/data";

export function OpenPositions() {
  return (
    <section className="py-20 sm:py-15">
      <Container>
        <SectionHeading
          eyebrow={`${openPositions.length} Open Roles`}
          title="Open Positions"
          className="mb-10"
        />
        <div className="flex flex-col gap-4">
          {openPositions.map((job, i) => (
            <Reveal key={job.title} delay={i * 0.05}>
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
                <div>
                  <h3 className="font-heading text-lg">{job.title}</h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground">
                    <span className="flex items-center gap-1"><Briefcase size={13} className="text-primary" /> {job.department}</span>
                    <span className="flex items-center gap-1"><MapPin size={13} className="text-primary" /> {job.location}</span>
                    <Badge variant="secondary" className="font-ui text-[11px] font-bold">{job.type}</Badge>
                  </div>
                </div>
                <Button className="font-ui font-bold" asChild>
                  <a href="#apply">Apply Now</a>
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
