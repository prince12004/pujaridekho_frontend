"use client";

import Link from "next/link";
import { Building2, ExternalLink, FileText, FolderTree, Home, Loader2, Map, MapPin, Network, PanelBottom, Shuffle, Store } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useSeoLocations, useSeoPages } from "@/features/admin/api/use-seo-management";
import { env } from "@/lib/env";

const MODULES = [
  { href: "/admin/seo-management/locations?type=city", icon: MapPin, title: "City Management", text: "The 6 NCR cities and their order." },
  { href: "/admin/seo-management/locations?type=sector", icon: FolderTree, title: "Sector Management", text: "Numbered sectors and sector groups." },
  { href: "/admin/seo-management/locations?type=locality", icon: Map, title: "Locality Management", text: "Localities, colonies and commercial areas." },
  { href: "/admin/seo-management/locations?type=society", icon: Building2, title: "Society Management", text: "High-rise societies — add as many as needed." },
  { href: "/admin/seo-management/pages?pageType=location", icon: Home, title: "Puja SEO Pages", text: "Pandit-in-<location> landing pages." },
  { href: "/admin/seo-management/pages?pageType=office_location", icon: Store, title: "Office Puja Pages", text: "Office puja city pages and service pages." },
  { href: "/admin/seo-management/footer", icon: PanelBottom, title: "Footer SEO Links", text: "Footer columns and links." },
  { href: "/admin/seo-management/directory", icon: Network, title: "SEO Directory", text: "What /seo-pages shows, and in which order." },
  { href: "/admin/seo-management/sitemap", icon: FileText, title: "Sitemap Management", text: "What is in sitemap.xml and why." },
  { href: "/admin/seo-management/redirects", icon: Shuffle, title: "301 Redirects", text: "Redirect old URLs to new ones." },
];

export default function SeoManagementOverview() {
  const { data: pages, isLoading } = useSeoPages();
  const { data: locations } = useSeoLocations();
  const published = pages?.filter((p) => p.status === "published").length ?? 0;
  const live = pages?.filter((p) => p.eligible).length ?? 0;
  const needsContent = pages?.filter((p) => p.status === "draft").length ?? 0;
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;

  const stats = [
    { label: "Locations", value: locations?.length ?? "—" },
    { label: "SEO pages", value: pages?.length ?? "—" },
    { label: "Published", value: published },
    { label: "In sitemap", value: live },
    { label: "Drafts needing content", value: needsContent },
  ];

  return (
    <div>
      <AdminPageHeader
        title="SEO Management"
        description="Delhi NCR location pages, office puja pages, SEO directory, footer links, sitemap and redirects."
        actions={
          <a href={`${siteUrl}/seo-pages`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            View directory <ExternalLink size={14} />
          </a>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="py-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-2xl font-bold">{isLoading ? <Loader2 className="size-5 animate-spin" /> : s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map(({ href, icon: Icon, title, text }) => (
          <Link key={href} href={href}>
            <Card className="h-full transition-colors hover:border-primary/40">
              <CardContent className="flex gap-3 py-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
