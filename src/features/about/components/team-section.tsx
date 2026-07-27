import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { MonogramAvatar } from "@/components/shared/monogram-avatar";
import { teamMembers } from "@/features/about/data";

export function TeamSection() {
  return (
    <section className="py-20 sm:py-15">
      <Container>
        <SectionHeading
          eyebrow="The People Behind It"
          title="Our Team"
          description="A small team that plans its own family's poojas on the same platform you're using."
          align="center"
          className="mx-auto mb-12"
        />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {teamMembers.map((member, i) => (
            <Reveal key={member.name} delay={i * 0.06} className="flex flex-col items-center gap-3 text-center">
              <MonogramAvatar initials={member.initials} seed={i} className="h-20 w-20 text-xl" />
              <div>
                <div className="font-heading text-sm">{member.name}</div>
                <div className="text-xs font-semibold text-muted-foreground">{member.role}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
