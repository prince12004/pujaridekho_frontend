import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeIndianRupee,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Home,
  MapPin,
  MessageCircle,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Container } from "@/components/shared/container";
import { CtaBanner } from "@/components/shared/cta-banner";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/images";
import { fillPlaceholders, type SeoPagePublic, type SeoSettings } from "@/features/seo-pages/api";

function resolveImage(src?: string) {
  if (!src) return images.bowlWoodenTable;
  return src in images ? images[src as keyof typeof images] : src;
}

function whatsappHref(number: string, page: SeoPagePublic, template: string) {
  const place = page.location?.name ?? page.city?.name ?? page.name;
  const text = fillPlaceholders(template, { place });
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

// Icons for the admin-editable "why choose" cards and booking steps (by position).
const WHY_ICONS = [ShieldCheck, BadgeIndianRupee, Package, MessageCircle];
const STEP_ICONS = [ClipboardList, MapPin, CalendarCheck, Sparkles];

export function SeoLandingPage({
  page,
  whatsappNumber,
  settings,
}: {
  page: SeoPagePublic;
  whatsappNumber: string;
  settings: SeoSettings["landing"];
}) {
  const bookHref = page.services[0]?.url ?? "/poojas";
  const isBusiness = page.pageType !== "location";
  const place = page.location?.name ?? page.city?.name;
  const crumbs = page.breadcrumbs.map((b) => ({ label: b.name, href: b.path }));
  const hasCoverage = page.coverageGroups.length > 0 || !!page.coverageNote;
  const t = (template: string) => fillPlaceholders(template, { place });
  const waHref = whatsappHref(whatsappNumber, page, settings.whatsappMessage);

  return (
    <>
      {/* 1–6: breadcrumbs, H1, hero, intro, booking + WhatsApp CTAs */}
      <section className="relative overflow-hidden bg-brand-purple-deep">
        {page.bannerImage ? (
          <div className="absolute inset-0">
            <Image
              src={resolveImage(page.bannerImage)}
              alt=""
              fill
              priority
              unoptimized
              className="object-cover opacity-30"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-deep via-brand-purple-deep/90 to-brand-purple-deep/60" />
          </div>
        ) : (
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(217,164,65,0.16) 1.4px, transparent 1.6px)",
              backgroundSize: "26px 26px",
            }}
          />
        )}
        <Container className="relative py-10 sm:py-14">
          <Breadcrumb
            items={crumbs}
            className="[&_a]:text-brand-cream/70 [&_span]:text-brand-gold-soft [&_svg]:text-brand-cream/40"
          />
          {page.heroTagline ? (
            <span className="font-ui mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-gold-soft">
              {isBusiness ? <Building2 size={13} /> : <Home size={13} />}
              {page.heroTagline}
            </span>
          ) : null}
          <h1 className="font-heading mt-4 max-w-3xl text-balance text-3xl font-bold text-brand-cream sm:text-5xl">{page.h1}</h1>
          {page.intro ? <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-cream/80 sm:text-lg">{page.intro}</p> : null}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="font-ui h-12 font-bold" asChild>
              <Link href={bookHref}>
                {settings.bookButtonLabel} <ArrowRight size={16} />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-ui h-12 border-white/25 bg-white/5 font-bold text-brand-cream hover:bg-white/15 hover:text-brand-cream"
              asChild
            >
              <a href={waHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={16} /> {settings.whatsappButtonLabel}
              </a>
            </Button>
          </div>
        </Container>
      </section>

      {/* 7: popular puja services */}
      {page.services.length > 0 ? (
        <section className="py-14 sm:py-16">
          <Container>
            <SectionHeading
              eyebrow={isBusiness ? settings.businessServicesEyebrow : settings.servicesEyebrow}
              title={place ? t(settings.servicesHeading) : settings.servicesHeadingNoPlace}
            />
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {page.services.map((service) => (
                <Link
                  key={service.url + service.label}
                  href={service.url}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  {service.pooja ? (
                    <div className="relative aspect-[4/3] bg-muted">
                      <Image
                        src={resolveImage(service.pooja.image)}
                        alt={service.pooja.name}
                        fill
                        unoptimized
                        loading="lazy"
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-brand-purple-deep to-brand-cocoa-deep">
                      {isBusiness ? (
                        <Building2 size={34} className="text-brand-gold-soft" />
                      ) : (
                        <Sparkles size={34} className="text-brand-gold-soft" />
                      )}
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-1 p-3.5 sm:p-4">
                    <span className="font-heading text-sm font-bold text-foreground group-hover:text-primary sm:text-base">
                      {service.label}
                    </span>
                    {service.pooja?.startingPrice ? (
                      <span className="text-xs text-muted-foreground sm:text-sm">
                        From <span className="font-semibold text-foreground">₹{service.pooja.startingPrice.toLocaleString("en-IN")}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground sm:text-sm">{service.note ?? "View details"}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Unique page content + 8: coverage */}
      <section className="bg-muted/30 py-14 sm:py-16">
        <Container className={hasCoverage ? "grid gap-10 lg:grid-cols-[1fr_360px]" : ""}>
          {page.content ? (
            <article className="prose-policy max-w-3xl" dangerouslySetInnerHTML={{ __html: page.content }} />
          ) : null}
          {hasCoverage ? (
            <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
              <h2 className="font-heading flex items-center gap-2 text-lg font-bold">
                <MapPin size={18} className="text-primary" /> {place ? t(settings.coverageHeading) : t(settings.coverageHeading).replace(/\s+in\s*$/, "")}
              </h2>
              {page.coverageNote ? <p className="mt-2 text-sm text-muted-foreground">{page.coverageNote}</p> : null}
              {page.coverageGroups.map((group) => (
                <div key={group.type} className="mt-5">
                  <h3 className="font-ui text-xs font-bold uppercase tracking-wide text-muted-foreground">{group.label}</h3>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li key={item.name}>
                        {item.path ? (
                          <Link
                            href={item.path}
                            className="inline-block rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/10"
                          >
                            {item.name}
                          </Link>
                        ) : (
                          <span className="inline-block rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                            {item.name}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </aside>
          ) : null}
        </Container>
      </section>

      {/* 9: why choose */}
      <section className="py-14 sm:py-16">
        <Container>
          <SectionHeading eyebrow={settings.whyEyebrow} title={settings.whyHeading} align="center" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {settings.whyItems.map(({ title, text }, i) => {
              const Icon = WHY_ICONS[i % WHY_ICONS.length];
              return (
              <div key={title + i} className="rounded-2xl border border-border bg-card p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon size={20} />
                </span>
                <h3 className="font-heading mt-4 text-base font-bold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
              </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 10: booking process */}
      <section className="bg-muted/30 py-14 sm:py-16">
        <Container>
          <SectionHeading eyebrow={settings.stepsEyebrow} title={settings.stepsHeading} align="center" />
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {settings.steps.map(({ title, text }, i) => {
              const Icon = STEP_ICONS[i % STEP_ICONS.length];
              return (
              <li key={title + i} className="relative rounded-2xl border border-border bg-card p-5">
                <span className="font-heading absolute right-5 top-4 text-3xl font-bold text-primary/15">{i + 1}</span>
                <Icon size={22} className="text-primary" />
                <h3 className="font-heading mt-3 text-base font-bold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
              </li>
              );
            })}
          </ol>
        </Container>
      </section>

      {/* 11: real reviews only — section hidden when there are none */}
      {page.reviews.length > 0 ? (
        <section className="py-14 sm:py-16">
          <Container>
            <SectionHeading eyebrow={settings.reviewsEyebrow} title={settings.reviewsHeading} />
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {page.reviews.map((review, i) => (
                <figure key={i} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex gap-0.5 text-accent" aria-label={`${review.rating} out of 5`}>
                    {Array.from({ length: 5 }, (_, s) => (
                      <Star key={s} size={15} className={s < review.rating ? "fill-current" : "opacity-25"} />
                    ))}
                  </div>
                  <blockquote className="mt-3 text-sm leading-relaxed text-foreground">{review.comment}</blockquote>
                  <figcaption className="mt-3 text-xs text-muted-foreground">
                    — {review.customerName}
                    {review.pooja ? `, ${review.pooja}` : ""}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* 12: FAQs */}
      {page.faqs.length > 0 ? (
        <section className="py-14 sm:py-16">
          <Container className="max-w-4xl">
            <SectionHeading eyebrow={settings.faqEyebrow} title={place ? t(settings.faqHeading) : settings.faqHeadingNoPlace} />
            <FaqAccordion items={page.faqs} className="mt-8" />
          </Container>
        </section>
      ) : null}

      {/* 13–14: related services, internal links, nearby locations */}
      <section className="border-t border-border py-14 sm:py-16">
        <Container className="grid gap-10 md:grid-cols-2">
          <LinkList
            title={isBusiness ? settings.relatedHeadingBusiness : settings.relatedHeadingHome}
            links={[
              ...(page.officeCityPage ? [page.officeCityPage] : []),
              ...(page.cityPage ? [page.cityPage] : []),
              ...page.internalLinks.map((l) => ({ name: l.label, path: l.url })),
              ...page.relatedServices,
            ]}
          />
          <LinkList title={page.pageType === "service" ? settings.citiesHeading : settings.nearbyHeading} links={page.nearby} />
        </Container>
      </section>

      {/* 15: final CTA */}
      <CtaBanner
        eyebrow={settings.finalCtaEyebrow}
        title={place ? t(settings.finalCtaHeading) : settings.finalCtaHeadingNoPlace}
        description={t(settings.finalCtaText)}
        primaryAction={{ label: settings.bookButtonLabel, href: bookHref }}
        secondaryAction={{ label: settings.whatsappButtonLabel, href: waHref }}
      />
    </>
  );
}

function LinkList({ title, links }: { title: string; links: { name: string; path: string }[] }) {
  const unique = links.filter((l, i) => links.findIndex((x) => x.path === l.path) === i);
  if (unique.length === 0) return <div />;
  return (
    <div>
      <h2 className="font-heading text-xl font-bold">{title}</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {unique.map((link) => (
          <li key={link.path}>
            <Link href={link.path} className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
              <CheckCircle2 size={14} className="shrink-0 text-primary/60 group-hover:text-primary" />
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
