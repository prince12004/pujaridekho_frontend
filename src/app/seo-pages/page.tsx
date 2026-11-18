import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, ChevronRight, MapPin, Sparkles } from "lucide-react";
import { Container } from "@/components/shared/container";
import { PageBanner } from "@/components/shared/page-banner";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { buildMetadata } from "@/lib/seo";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";
import { fetchSeoDirectory, fetchSeoSettings, type SeoLink } from "@/features/seo-pages/api";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { directory } = await fetchSeoSettings();
  return buildMetadata({ title: directory.title, description: directory.description.slice(0, 160), path: "/seo-pages" });
}

// Every link is a plain anchor in the server-rendered HTML (good for crawling).
function LinkList({ links, columns = 1 }: { links: SeoLink[]; columns?: 1 | 2 | 4 }) {
  return (
    <ul
      className={cn(
        "grid gap-x-6 gap-y-1",
        columns === 2 && "sm:grid-cols-2",
        columns === 4 && "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      )}
    >
      {links.map((link) => (
        <li key={link.path}>
          <Link
            href={link.path}
            className="group flex items-center gap-2 rounded-lg py-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ChevronRight size={14} className="shrink-0 text-primary/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Box({ icon, title, children, className }: { icon: React.ReactNode; title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6", className)}>
      <h2 className="font-heading flex items-center gap-2.5 text-lg font-bold">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">{icon}</span>
        {title}
      </h2>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
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

      <Container className="flex flex-col gap-6 py-10 sm:py-14">
        {!directory || (directory.cities.length === 0 && directory.office.length === 0 && !directory.poojas?.length) ? (
          <p className="text-center text-muted-foreground">{copy.emptyText}</p>
        ) : null}

        {/* One box per city: its page first, then any published sectors / societies.
            Masonry columns: each box is as tall as its content and the next one starts right below it. */}
        {directory?.cities.length ? (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
            {directory.cities.map((city) => (
              <Box key={city.key} icon={<MapPin size={18} />} title={city.title} className="mb-5 break-inside-avoid">
                {city.main ? (
                  <Link
                    href={city.main.path}
                    className="font-ui inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    {city.main.name} <ChevronRight size={14} />
                  </Link>
                ) : null}
                {city.sections.map((section) => (
                  <div key={section.key}>
                    <h3 className="font-ui mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground/80">{section.label}</h3>
                    <LinkList links={section.links} />
                  </div>
                ))}
              </Box>
            ))}
          </div>
        ) : null}

        {directory?.poojas?.length ? (
          <Box icon={<Sparkles size={18} />} title={copy.poojasGroupTitle}>
            <LinkList links={directory.poojas} columns={4} />
          </Box>
        ) : null}

        {directory && (directory.office.length > 0 || directory.services.length > 0) ? (
          <div className="grid items-start gap-5 lg:grid-cols-2">
            {directory.office.length > 0 ? (
              <Box icon={<Briefcase size={18} />} title={copy.officeGroupTitle}>
                <LinkList links={directory.office} columns={2} />
              </Box>
            ) : null}
            {directory.services.length > 0 ? (
              <Box icon={<Sparkles size={18} />} title={copy.servicesGroupTitle}>
                <LinkList links={directory.services} columns={2} />
              </Box>
            ) : null}
          </div>
        ) : null}
      </Container>
    </>
  );
}
