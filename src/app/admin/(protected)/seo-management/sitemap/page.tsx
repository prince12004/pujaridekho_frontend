"use client";

import Link from "next/link";
import { ExternalLink, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useSeoPages, useSitemapReport } from "@/features/admin/api/use-seo-management";
import { env } from "@/lib/env";

export default function SitemapManagementPage() {
  const { data, isLoading } = useSitemapReport();
  const { data: pages } = useSeoPages();
  const idBySlug = new Map((pages ?? []).map((p) => [p.slug, p._id]));
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;

  return (
    <div>
      <AdminPageHeader
        title="Sitemap Management"
        description="sitemap.xml is generated automatically from live content and refreshed hourly. Poojas, festivals, blogs, products and CMS pages are always included when published."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href={`${siteUrl}/sitemap.xml`} target="_blank" rel="noopener noreferrer">sitemap.xml <ExternalLink /></a>
            </Button>
            <Button variant="outline" asChild>
              <a href={`${siteUrl}/robots.txt`} target="_blank" rel="noopener noreferrer">robots.txt <ExternalLink /></a>
            </Button>
          </div>
        }
      />
      <Card className="mb-4">
        <CardContent className="py-4 text-sm text-muted-foreground">
          Submit <code className="rounded bg-muted px-1">{siteUrl}/sitemap.xml</code> once in Google Search Console → Sitemaps. Google re-reads it on its own after that.
        </CardContent>
      </Card>
      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>SEO pages in the sitemap ({data?.included.length ?? 0})</CardTitle></CardHeader>
            <CardContent className="grid max-h-[60vh] gap-1 overflow-y-auto text-sm">
              {data?.included.map((p) => (
                <a key={p.slug} href={`${siteUrl}/${p.slug}`} target="_blank" rel="noopener noreferrer" className="truncate text-primary hover:underline">/{p.slug}</a>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Not in the sitemap ({data?.excluded.length ?? 0})</CardTitle></CardHeader>
            <CardContent className="grid max-h-[60vh] gap-1 overflow-y-auto text-sm">
              {data?.excluded.map((p) => (
                <div key={p.slug} className="flex items-center justify-between gap-2">
                  {idBySlug.get(p.slug) ? (
                    <Link href={`/admin/seo-management/pages/${idBySlug.get(p.slug)}`} className="truncate hover:text-primary">/{p.slug}</Link>
                  ) : <span className="truncate">/{p.slug}</span>}
                  <Badge variant="outline" className="shrink-0">{p.reason}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
