import Image from "next/image";
import { UserRound } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { TeamPhotoMotion } from "@/features/about/components/team-photo-motion";
import { TeamProfileDialog } from "@/features/about/components/team-profile-dialog";
import { SERVER_API_URL } from "@/lib/server-env";
import { cn } from "@/lib/utils";

// "Meet Our Team" — members, photos and order are managed in
// Admin → Website CMS → Team.
export interface TeamMember {
  _id: string;
  name: string;
  designation: string;
  bio?: string;
  profile?: string;
  group?: "leadership" | "advisor";
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
      className="w-full max-w-[18rem] basis-full min-[400px]:basis-[calc(50%-0.5rem)] sm:basis-[calc(50%-0.75rem)] md:basis-[calc(33.333%-1rem)] lg:max-w-none lg:basis-[calc(33.333%-1.34rem)]"
    >
      <figure className="group h-full lg:flex lg:items-center lg:gap-6 lg:rounded-[1.75rem] lg:border lg:border-border lg:bg-card lg:p-4 lg:shadow-[0_14px_40px_-28px_rgba(48,32,79,0.4)] lg:transition-all lg:duration-500 lg:hover:-translate-y-1.5 lg:hover:border-primary/30 lg:hover:shadow-[0_26px_50px_-24px_rgba(48,32,79,0.5)]">
        <div
          className={cn(
            "relative rounded-[1.4rem] p-[3px] shadow-[0_10px_30px_-20px_rgba(48,32,79,0.35)] transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_26px_50px_-22px_rgba(48,32,79,0.55)] lg:w-[44%] lg:shrink-0 lg:group-hover:translate-y-0",
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
            {/* PujariDekho mark on every portrait, including photos uploaded later from admin. */}
            <span className="pointer-events-none absolute bottom-3 left-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/95 shadow-md ring-1 ring-black/5 transition-transform duration-500 group-hover:scale-110">
              <Image src="/brand/icon.png" alt="" width={16} height={16} className="h-4 w-4 object-contain" />
            </span>
          </div>
        </div>
        <figcaption className="px-1 pt-4 text-center lg:flex-1 lg:px-0 lg:pt-0 lg:text-left">
          <h4 className="font-heading text-base font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary sm:text-lg lg:text-xl">{member.name}</h4>
          <p className="font-ui mt-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">{member.designation}</p>
          <span className="mx-auto mt-3 block h-[2px] w-6 rounded-full bg-primary/40 transition-all duration-300 group-hover:w-12 group-hover:bg-primary lg:mx-0" />
          {member.bio ? <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground lg:text-sm">{member.bio}</p> : null}
          {member.profile ? (
            <TeamProfileDialog name={member.name} designation={member.designation} photo={member.photo} profile={member.profile} />
          ) : null}
        </figcaption>
      </figure>
    </Reveal>
  );
}


/** Line-art mandala used as a faint background ornament. */
function Mandala({ className }: { className?: string }) {
  const petals = Array.from({ length: 16 }, (_, i) => i * 22.5);
  const outer = Array.from({ length: 32 }, (_, i) => i * 11.25);
  return (
    <svg viewBox="0 0 400 400" fill="none" stroke="currentColor" aria-hidden className={className}>
      <circle cx="200" cy="200" r="196" strokeWidth="1" />
      <circle cx="200" cy="200" r="170" strokeWidth="0.8" strokeDasharray="2 6" />
      {outer.map((a) => (
        <path key={`o${a}`} d="M200 30 Q212 48 200 66 Q188 48 200 30Z" strokeWidth="0.8" transform={`rotate(${a} 200 200)`} />
      ))}
      <circle cx="200" cy="200" r="128" strokeWidth="1" />
      {petals.map((a) => (
        <path key={`p${a}`} d="M200 72 Q232 120 200 168 Q168 120 200 72Z" strokeWidth="1" transform={`rotate(${a} 200 200)`} />
      ))}
      <circle cx="200" cy="200" r="32" strokeWidth="1" />
      <circle cx="200" cy="200" r="12" strokeWidth="1" />
    </svg>
  );
}

export async function TeamSection() {
  const members = await fetchTeam();
  if (members.length === 0) return null;
  const groups = [
    { key: "leadership", title: "Leadership Team", members: members.filter((m) => (m.group ?? "leadership") === "leadership") },
    { key: "advisor", title: "Mentors & Advisors", members: members.filter((m) => m.group === "advisor") },
  ].filter((g) => g.members.length > 0);

  return (
    <section className="relative isolate overflow-hidden bg-muted/30 py-16 sm:py-20">
      {/* Background ornaments: mandala behind the heading, soft brand glows, gold edge lines. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Mandala className="absolute left-1/2 top-[-9rem] h-[34rem] w-[34rem] -translate-x-1/2 text-brand-gold/[0.12] motion-safe:animate-[spin_160s_linear_infinite] sm:h-[42rem] sm:w-[42rem]" />
        <span className="absolute -left-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl" />
        <span className="absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-secondary/10 blur-3xl" />
        <Mandala className="absolute -bottom-40 -left-32 hidden h-80 w-80 text-primary/10 lg:block" />
        <Mandala className="absolute -right-28 top-1/3 hidden h-72 w-72 text-secondary/10 lg:block" />
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
        <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-50"
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
          className="mx-auto mb-10 max-w-2xl sm:mb-12"
        />
        <div className="flex flex-col gap-12 sm:gap-16">
          {groups.map((g) => (
            <div key={g.key}>
              <div className="mb-8 flex items-center justify-center gap-4">
                <span aria-hidden className="h-px w-10 bg-gradient-to-r from-transparent to-primary/60 sm:w-20" />
                <h3 className="font-ui text-xs font-bold uppercase tracking-[0.22em] text-secondary sm:text-sm">{g.title}</h3>
                <span aria-hidden className="h-px w-10 bg-gradient-to-l from-transparent to-primary/60 sm:w-20" />
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-10 sm:gap-x-6 lg:gap-x-8 lg:gap-y-8">
                {g.members.map((member, i) => (
                  <TeamCard key={member._id} member={member} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
