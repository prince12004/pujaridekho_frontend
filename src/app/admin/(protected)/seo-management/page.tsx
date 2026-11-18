"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Building2, DownloadCloud, ExternalLink, FileText, FolderTree, Home, Loader2, Map, MapPin, Network, PanelBottom, Settings2, Shuffle, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { type StarterImportReport, useImportStarterData, useSeoLocations, useSeoPages } from "@/features/admin/api/use-seo-management";
import { env } from "@/lib/env";

const MODULES = [
  { href: "/admin/seo-management/locations?type=city", icon: MapPin, title: "City Management", text: "The 6 NCR cities and their order." },
  { href: "/admin/seo-management/locations?type=sector", icon: FolderTree, title: "Sector Management", text: "Numbered sectors and sector groups." },
  { href: "/admin/seo-management/locations?type=locality", icon: Map, title: "Locality Management", text: "Localities, colonies and commercial areas." },
  { href: "/admin/seo-management/locations?type=society", icon: Building2, title: "Society Management", text: "High-rise societies — add as many as needed." },
  { href: "/admin/seo-management/pages?pageType=location", icon: Home, title: "Puja SEO Pages", text: "Pandit-in-<location> landing pages." },
  { href: "/admin/seo-management/pages?pageType=office_location", icon: Store, title: "Office Puja Pages", text: "Office puja city pages and service pages." },
  { href: "/admin/seo-management/settings", icon: Settings2, title: "Page Content Settings", text: "Shared text on landing pages, directory and footer." },
  { href: "/admin/seo-management/footer", icon: PanelBottom, title: "Footer SEO Links", text: "Footer columns, text blocks and links." },
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
  const isEmpty = !isLoading && (locations?.length ?? 0) === 0;

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

      <StarterImportCard highlight={isEmpty} />

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

function StarterImportCard({ highlight }: { highlight: boolean }) {
  const importer = useImportStarterData();
  const [parts, setParts] = useState({ locations: true, pages: true, footer: true });
  const [preview, setPreview] = useState<StarterImportReport | null>(null);
  const [open, setOpen] = useState(false);

  if (!highlight && !open) {
    return (
      <div className="mb-6 flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
          <DownloadCloud /> Import missing Delhi NCR starter data
        </Button>
      </div>
    );
  }

  const run = async (dryRun: boolean) => {
    try {
      const report = await importer.mutateAsync({ ...parts, dryRun });
      if (dryRun) setPreview(report);
      else {
        setPreview(null);
        toast.success(`Imported ${report.locations} locations and ${report.published} live pages — everything is now editable here.`);
        if (report.footerLinksOff.length) toast.message(report.footerLinksOff.join("\n"), { duration: 10000 });
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Card className="mb-6 border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DownloadCloud size={18} className="text-primary" /> {highlight ? "Get started — nothing has been added yet" : "Import starter data"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Optional. Adds the Delhi NCR starter set to the database: 6 cities, their sectors, localities and 92 societies (as draft pages), 21 ready-written pages (6 city, 6 office-puja, 9 service) and default footer blocks. Nothing that already exists is changed. After import, everything is normal data you can edit or delete here — or skip this and add your own from the modules below.
        </p>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="flex flex-wrap gap-4 text-sm">
          {([
            ["locations", "Cities, sectors, localities & societies"],
            ["pages", "21 written pages"],
            ["footer", "Footer blocks (only if the footer is empty)"],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2">
              <input type="checkbox" checked={parts[key]} onChange={(e) => { setParts({ ...parts, [key]: e.target.checked }); setPreview(null); }} />
              {label}
            </label>
          ))}
        </div>
        {preview ? (
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
            <p className="font-medium">This will add:</p>
            <ul className="mt-1 list-disc pl-5 text-muted-foreground">
              <li>{preview.locations} new locations</li>
              <li>{preview.published} live pages{preview.notPublished.length ? ` (${preview.notPublished.length} kept as draft)` : ""}</li>
              <li>{preview.draftPages} draft location pages to fill in</li>
              <li>Footer: {preview.footer === "created" ? "default blocks" : preview.footer === "kept-existing" ? "already set up — left unchanged" : "not included"}</li>
              {preview.skippedExisting ? <li>{preview.skippedExisting} pages already exist and will be left as they are</li> : null}
            </ul>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {preview ? (
            <Button onClick={() => run(false)} disabled={importer.isPending}>
              {importer.isPending ? <Loader2 className="animate-spin" /> : <DownloadCloud />} Import now
            </Button>
          ) : (
            <Button variant="outline" onClick={() => run(true)} disabled={importer.isPending || (!parts.locations && !parts.pages && !parts.footer)}>
              {importer.isPending ? <Loader2 className="animate-spin" /> : null} Preview import
            </Button>
          )}
          {!highlight ? (
            <Button variant="ghost" onClick={() => { setOpen(false); setPreview(null); }}>
              Close
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
