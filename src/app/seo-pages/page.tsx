import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, ChevronDown, MapPin, Sparkles } from "lucide-react";
import { Container } from "@/components/shared/container";
import { PageBanner } from "@/components/shared/page-banner";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { buildMetadata } from "@/lib/seo";
import { env } from "@/lib/env";
import { fetchSeoDirectory, fetchSeoSettings, type SeoLink } from "@/features/seo-pages/api";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { directory } = await fetchSeoSettings();
  return buildMetadata({ title: directory.title, description: directory.description.slice(0, 160), path: "/seo-pages" });
}

function Links({ links }: { links: SeoLink[] }) {
  return (
    <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((link) => (
        <li key={link.path}>
          <Link href={link.path} className="text-sm text-muted-foreground transition-colors hover:text-primary">
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Group({
  icon,
  title,
  children,
  defaultOpen,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group rounded-2xl border border-border bg-card [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 sm:px-6">
        <h2 className="font-heading flex items-center gap-2.5 text-lg font-bold sm:text-xl">
          {icon}
          {title}
        </h2>
        <ChevronDown size={18} className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="flex flex-col gap-5 border-t border-border px-5 py-5 sm:px-6">{children}</div>
    </details>
  );
}

export default async function SeoDirectoryPage() {
  const [directory, settings] = await Promise.all([fetchSeoDirectory(), fetchSeoSettings()]);
  const copy = settings.directory;
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Locations", path: "/seo-pages" }], siteUrl)} />
      <PageBanner title={copy.title} description={copy.description} breadcrumbItems={[{ label: "Locations" }]} />

      <Container className="flex flex-col gap-4 py-10 sm:py-14">
        {!directory || (directory.cities.length === 0 && directory.office.length === 0) ? (
          <p className="text-center text-muted-foreground">{copy.emptyText}</p>
        ) : null}

        {directory?.cities.map((city, i) => (
          <Group key={city.key} icon={<MapPin size={20} className="text-primary" />} title={city.title} defaultOpen={i < 2}>
            {city.main ? (
              <Link href={city.main.path} className="font-ui w-fit text-sm font-bold text-primary hover:underline">
                {city.main.name} →
              </Link>
            ) : null}
            {city.sections.map((section) => (
              <div key={section.key}>
                <h3 className="font-ui mb-2.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">{section.label}</h3>
                <Links links={section.links} />
              </div>
            ))}
          </Group>
        ))}

        {directory && directory.office.length > 0 ? (
          <Group icon={<Briefcase size={20} className="text-primary" />} title={copy.officeGroupTitle}>
            <Links links={directory.office} />
          </Group>
        ) : null}

        {directory && directory.services.length > 0 ? (
          <Group icon={<Sparkles size={20} className="text-primary" />} title={copy.servicesGroupTitle}>
            <Links links={directory.services} />
          </Group>
        ) : null}
      </Container>
    </>
  );
}
