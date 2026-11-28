import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, BookOpen, CalendarCheck, Languages, MapPin, ShieldCheck, Star } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Container } from "@/components/shared/container";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { env } from "@/lib/env";
import { SERVER_API_URL } from "@/lib/server-env";

interface PanditProfile {
  _id: string;
  slug: string;
  fullName: string;
  photo?: string;
  bio?: string;
  experienceYears?: number;
  languages: string[];
  qualifications?: string[];
  specializations: string[];
  cities: string[];
  serviceAreas?: string[];
  completedPoojas: number;
  rating: number;
  reviewCount: number;
}

async function fetchPandit(slug: string): Promise<PanditProfile | null> {
  try {
    const res = await fetch(`${SERVER_API_URL}/pandits/${encodeURIComponent(slug)}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return ((await res.json()).data ?? null) as PanditProfile | null;
  } catch {
    return null;
  }
}

function summary(p: PanditProfile) {
  const parts = [
    p.experienceYears ? `${p.experienceYears}+ years of experience` : null,
    p.specializations.length ? `specialises in ${p.specializations.slice(0, 3).join(", ")}` : null,
    p.cities.length ? `serves ${p.cities.join(", ")}` : null,
  ].filter(Boolean);
  return `${p.fullName} is a verified pandit on PujariDekho${parts.length ? ` — ${parts.join("; ")}` : ""}.`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pandit = await fetchPandit(slug);
  if (!pandit) return {};
  return buildMetadata({
    title: `${pandit.fullName} — Verified Pandit${pandit.cities[0] ? ` in ${pandit.cities[0]}` : ""}`,
    description: summary(pandit),
    path: `/pandits/${pandit.slug}`,
    image: pandit.photo,
  });
}

export default async function PanditProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pandit = await fetchPandit(slug);
  if (!pandit) notFound();

  const pageUrl = `${env.NEXT_PUBLIC_SITE_URL}/pandits/${pandit.slug}`;
  const areas = [...new Set([...(pandit.cities ?? []), ...(pandit.serviceAreas ?? [])])];
  const initials = pandit.fullName.replace(/^pandit\s+/i, "").split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: "Pandit Ji", path: "/pandits" },
            { name: pandit.fullName, path: `/pandits/${pandit.slug}` },
          ],
          env.NEXT_PUBLIC_SITE_URL,
        )}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: pandit.fullName,
          url: pageUrl,
          ...(pandit.photo ? { image: pandit.photo } : {}),
          jobTitle: "Pandit",
          knowsLanguage: pandit.languages,
          knowsAbout: pandit.specializations,
          areaServed: areas.map((a) => ({ "@type": "Place", name: a })),
          worksFor: { "@type": "Organization", name: "PujariDekho", url: env.NEXT_PUBLIC_SITE_URL },
        }}
      />

      <Container className="pt-6">
        <Breadcrumb items={[{ label: "Pandit Ji", href: "/pandits" }, { label: pandit.fullName }]} />
      </Container>

      <section className="py-8 sm:py-12">
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-12">
          <div className="relative aspect-[4/5] w-full max-w-[360px] overflow-hidden rounded-3xl border border-border bg-muted">
            {pandit.photo ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pandit.photo} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-xl" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pandit.photo} alt={pandit.fullName} className="relative h-full w-full object-contain" />
              </>
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/15 via-brand-gold/15 to-secondary/10">
                <span className="font-heading flex size-28 items-center justify-center rounded-full bg-card text-4xl font-bold text-primary shadow-sm">
                  {initials}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <span className="font-ui inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700">
                <ShieldCheck size={14} /> Identity verified by PujariDekho
              </span>
              <h1 className="font-heading mt-3 text-3xl font-bold sm:text-4xl">{pandit.fullName}</h1>
              {pandit.specializations.length ? (
                <p className="mt-2 text-lg text-muted-foreground">{pandit.specializations.join(" · ")}</p>
              ) : null}
            </div>

            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Stat icon={Award} label="Experience" value={pandit.experienceYears ? `${pandit.experienceYears} years` : "—"} />
              <Stat
                icon={CalendarCheck}
                label="Pujas on PujariDekho"
                value={pandit.completedPoojas > 0 ? String(pandit.completedPoojas) : "New"}
              />
              <Stat
                icon={Star}
                label="Rating"
                value={pandit.reviewCount > 0 ? `${pandit.rating.toFixed(1)} ★ (${pandit.reviewCount})` : "No reviews yet"}
              />
            </dl>

            {pandit.bio ? (
              <div>
                <h2 className="font-heading text-lg font-bold">About</h2>
                <p className="mt-2 whitespace-pre-line leading-relaxed text-muted-foreground">{pandit.bio}</p>
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {pandit.languages.length ? <Detail icon={Languages} title="Languages" items={pandit.languages} /> : null}
              {areas.length ? <Detail icon={MapPin} title="Areas served" items={areas} /> : null}
              {pandit.qualifications?.length ? <Detail icon={BookOpen} title="Training & qualifications" items={pandit.qualifications} /> : null}
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">
                Choose your puja and date — our team confirms an available verified pandit for your booking. You can mention{" "}
                {pandit.fullName} as your preference in the booking notes.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild className="font-ui font-bold">
                  <Link href="/poojas">Book a Puja</Link>
                </Button>
                <Button asChild variant="outline" className="font-ui font-bold">
                  <Link href="/pandits">See all pandits</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
        <Icon size={13} className="text-primary" /> {label}
      </dt>
      <dd className="font-heading mt-1 text-base font-bold">{value}</dd>
    </div>
  );
}

function Detail({ icon: Icon, title, items }: { icon: React.ComponentType<{ size?: number; className?: string }>; title: string; items: string[] }) {
  return (
    <div>
      <h2 className="font-heading flex items-center gap-1.5 text-sm font-bold">
        <Icon size={15} className="text-primary" /> {title}
      </h2>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((i) => (
          <span key={i} className="rounded-full border border-border bg-card px-2.5 py-1 text-xs">
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}
