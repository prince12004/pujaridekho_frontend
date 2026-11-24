import type { Metadata } from "next";
import { PageBanner } from "@/components/shared/page-banner";
import { StatsBand } from "@/components/shared/stats-band";
import { CtaBanner } from "@/components/shared/cta-banner";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { CompanyStory } from "@/features/about/components/company-story";
import { MissionVision } from "@/features/about/components/mission-vision";
import { WhyChooseAbout } from "@/features/about/components/why-choose-about";
import { JourneySection } from "@/features/about/components/journey-section";
import { TeamSection } from "@/features/about/components/team-section";
import { CustomerTrust } from "@/features/about/components/customer-trust";
import { aboutFaq } from "@/features/about/data";
import { fetchSiteStats, plus, stars } from "@/features/home/site-stats";
import { buildMetadata } from "@/lib/seo";
import { images } from "@/lib/images";
import { env } from "@/lib/env";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description:
    "PujariDekho connects families across Delhi NCR with verified, experienced pandits. Learn our story, mission and the team behind the platform.",
  path: "/about",
});

export default async function AboutPage() {
  // Live numbers (same source as the homepage) so the two pages never disagree.
  const stats = await fetchSiteStats();
  const aboutStats = stats
    ? [
        stats.verifiedPandits > 0 ? { value: plus(stats.verifiedPandits), label: "Verified Pandits" } : null,
        stats.poojasCompleted > 0 ? { value: plus(stats.poojasCompleted), label: "Pujas Completed" } : null,
        stats.cities > 0 ? { value: String(stats.cities), label: "Cities Served" } : null,
        stats.rating ? { value: stars(stats.rating.value), label: "Average Rating" } : null,
      ].filter((s): s is { value: string; label: string } => !!s)
    : [];
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([{ name: "About Us", path: "/about" }], env.NEXT_PUBLIC_SITE_URL)}
      />
      <PageBanner
        eyebrow="Our Story"
        title="Bringing trusted pandits to every family's doorstep"
        description="PujariDekho connects families with verified, experienced pandits for every puja and sanskar — with fixed prices and no last-minute surprises."
        breadcrumbItems={[{ label: "About Us" }]}
        image={images.heroTemple}
      />

      <CompanyStory />
      <MissionVision />
      <WhyChooseAbout />
      <JourneySection />
      {aboutStats.length > 0 ? <StatsBand stats={aboutStats} /> : null}
      <CustomerTrust />
      <TeamSection />

      <CtaBanner
        eyebrow="Partner With Us"
        title="Become a Partner"
        description="Samagri suppliers, temples and community organizations — let's serve more families together."
        primaryAction={{ label: "Get in Touch", href: "/contact" }}
        secondaryAction={{ label: "Become a Pandit", href: "/become-a-pandit" }}
      />

      <section className="pb-20 sm:pb-28">
        <Container className="max-w-[820px]">
          <SectionHeading eyebrow="Good to Know" title="Frequently Asked Questions" className="mb-8" />
          <FaqAccordion items={aboutFaq} />
        </Container>
      </section>
    </>
  );
}
