import Image from "next/image";
import { UserRound } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { TeamPhotoMotion } from "@/features/about/components/team-photo-motion";
import { SERVER_API_URL } from "@/lib/server-env";
import { cn } from "@/lib/utils";

// "Meet Our Team" — members, photos and order are managed in
// Admin → Website CMS → Team.
export interface TeamMember {
  _id: string;
  name: string;
  designation: string;
  bio?: string;
  photo?: string;
  photoPosition?: "top" | "center" | "bottom";
  featured?: boolean;
}

async function fetchTeam(): Promise<TeamMember[]> {
  try {
    const res = await fetch(`${SERVER_API_URL}/team`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return ((await res.json()).data ?? []) as TeamMember[];
  } catch {
    return [];
  }
}

const POSITION_CLASS = { top: "object-top", center: "object-center", bottom: "object-bottom" } as const;

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <Reveal
      delay={index * 0.1}
      y={40}
      // Flex-basis widths keep every card the same size and centre a short last row.
      className="w-full max-w-[20rem] basis-full min-[400px]:basis-[calc(50%-0.5rem)] sm:basis-[calc(50%-0.75rem)] md:basis-[calc(33.333%-1rem)] lg:basis-[calc(20%-1.6rem)]"
    >
      <figure className="group h-full">
        <div
          className={cn(
            "relative rounded-[1.4rem] p-[3px] shadow-[0_10px_30px_-20px_rgba(48,32,79,0.35)] transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_26px_50px_-22px_rgba(48,32,79,0.55)]",
            member.featured ? "team-ring-featured" : "bg-border/70 group-hover:bg-gradient-to-br group-hover:from-primary/70 group-hover:to-brand-gold/70",
          )}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.2rem] bg-muted">
            <TeamPhotoMotion delay={index * 0.1}>
            {member.photo ? (
              <Image
                src={member.photo}
                alt={`${member.name}, ${member.designation} at PujariDekho`}
                fill
                sizes="(min-width: 1024px) 20rem, (min-width: 768px) 30vw, (min-width: 400px) 45vw, 90vw"
                className={cn(
                  "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]",
                  POSITION_CLASS[member.photoPosition ?? "top"],
                )}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-muted to-muted/40 text-muted-foreground/50">
                <UserRound size={56} strokeWidth={1.25} />
              </div>
            )}
            </TeamPhotoMotion>
            {/* Light sweep across the photo on hover. */}
            <span className="pointer-events-none absolute inset-y-0 -left-[60%] w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[120%] group-hover:opacity-100 motion-reduce:hidden" />
            {/* Soft fade at the bottom so the photo sits on the card, plus thin brand corners. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-purple-deep/35 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="pointer-events-none absolute left-3 top-3 h-5 w-5 rounded-tl-md border-l-2 border-t-2 border-white/80 transition-all duration-500 group-hover:h-9 group-hover:w-9 group-hover:border-white" />
            <span className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 rounded-br-md border-b-2 border-r-2 border-white/80 transition-all duration-500 group-hover:h-9 group-hover:w-9 group-hover:border-white" />
          </div>
        </div>
        <figcaption className="px-1 pt-4 text-center">
          <h3 className="font-heading text-base font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary sm:text-lg lg:text-xl">{member.name}</h3>
          <p className="font-ui mt-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">{member.designation}</p>
          <span className="mx-auto mt-3 block h-[2px] w-6 rounded-full bg-primary/40 transition-all duration-300 group-hover:w-12 group-hover:bg-primary" />
          {member.bio ? <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{member.bio}</p> : null}
        </figcaption>
      </figure>
    </Reveal>
  );
}

export async function TeamSection() {
  const members = await fetchTeam();
  if (members.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-muted/30 py-20 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(217,164,65,0.18) 1.2px, transparent 1.4px)",
          backgroundSize: "28px 28px",
        }}
      />
      <Container className="relative">
        <SectionHeading
          eyebrow="The People Behind It"
          title="Meet Our Team"
          description="A passionate team bringing technology, expertise, and tradition together to make every spiritual experience seamless."
          align="center"
          className="mx-auto mb-12 max-w-2xl sm:mb-14"
        />
        <div className="mx-auto flex max-w-[88rem] flex-wrap justify-center gap-x-4 gap-y-12 sm:gap-x-6 lg:gap-x-8">
          {members.map((member, i) => (
            <TeamCard key={member._id} member={member} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
