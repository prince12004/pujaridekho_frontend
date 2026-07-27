import { Compass, Target } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { missionPoints, visionPoints } from "@/features/about/data";

export function MissionVision() {
  return (
    <section className="bg-muted/40 py-20 sm:py-15">
      <Container className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-8 shadow-sm">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
              <Target size={22} />
            </span>
            <h2 className="font-heading text-2xl">Our Mission</h2>
            <ul className="flex flex-col gap-3">
              {missionPoints.map((point) => (
                <li key={point} className="flex gap-2.5 text-sm text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-8 shadow-sm">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-brand-purple-tint text-white">
              <Compass size={22} />
            </span>
            <h2 className="font-heading text-2xl">Our Vision</h2>
            <ul className="flex flex-col gap-3">
              {visionPoints.map((point) => (
                <li key={point} className="flex gap-2.5 text-sm text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
