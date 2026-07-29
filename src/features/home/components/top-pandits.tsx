import Image from "next/image";
import Link from "next/link";
import { CheckCheck, MessageCircle } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shared/star-rating";
import { MonogramAvatar } from "@/components/shared/monogram-avatar";
import { env } from "@/lib/env";

interface PublicPandit {
  _id: string;
  fullName: string;
  photo?: string;
  specializations: string[];
  experienceYears: number;
  rating: number;
  languages: string[];
  completedPoojas: number;
}

async function fetchTopPandits(): Promise<PublicPandit[]> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/pandits?sort=rating&limit=6`, { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data?.items ?? [];
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export async function TopPandits() {
  const pandits = await fetchTopPandits();
  if (pandits.length === 0) return null;

  return (
    <section id="pandits" className="bg-muted/40 py-20 sm:py-15">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Meet Our Priests"
            title="Top Rated Pandit Ji"
            description="Every pandit is identity-verified, experienced and rated by the families they've served."
          />
          <Button variant="outline" className="font-ui font-bold" asChild>
            <Link href="/pandits">View All Pandits</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pandits.map((pandit, i) => (
            <Reveal key={pandit._id} delay={(i % 3) * 0.08}>
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {pandit.photo ? (
                      <Image
                        src={pandit.photo}
                        alt={pandit.fullName}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <MonogramAvatar initials={initialsOf(pandit.fullName)} seed={i} className="h-16 w-16 text-lg" />
                    )}
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-primary text-white">
                      <CheckCheck size={11} />
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading text-base leading-snug">{pandit.fullName}</h3>
                    <p className="text-xs font-bold text-primary">
                      {pandit.specializations.length > 0 ? pandit.specializations.join(", ") : "Verified Ritual Specialist"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 border-y border-dashed border-border py-3">
                  <div>
                    <div className="text-sm font-bold">{pandit.experienceYears} yrs</div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                      Experience
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-sm font-bold">
                      {pandit.rating.toFixed(1)} <StarRating rating={pandit.rating} size={13} />
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                      Rating
                    </div>
                  </div>
                </div>

                {pandit.languages.length > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MessageCircle size={14} className="text-primary" /> {pandit.languages.join(", ")}
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-sm font-bold text-secondary">{pandit.completedPoojas}+ Poojas</span>
                  <Button size="sm" variant="outline" className="main_books font-ui font-bold" asChild>
                    <Link href="/poojas">Book Now</Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
