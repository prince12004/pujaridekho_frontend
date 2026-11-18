"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ExternalLink, Loader2, Pencil, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPagination, paginateClient } from "@/features/admin/components/admin-pagination";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { SEO_PAGE_TYPES, type SeoPageType, useSeoLocations, useSeoPages } from "@/features/admin/api/use-seo-management";
import { env } from "@/lib/env";

const MIN_WORDS = 150;
const selectClass = "h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none";

function SeoPagesListInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageType = (searchParams.get("pageType") as SeoPageType) || "location";
  const [status, setStatus] = useState("");
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");
  const [needsContent, setNeedsContent] = useState(false);
  const [page, setPage] = useState(1);

  const { data: pages, isLoading } = useSeoPages({
    pageType,
    status: status || undefined,
    city: city || undefined,
    search: search || undefined,
    needsContent: needsContent ? "true" : undefined,
  });
  const { data: cities } = useSeoLocations({ type: "city" });
  const { pageItems, total, totalPages } = paginateClient(pages, page);

  return (
    <div>
      <AdminPageHeader
        title="SEO Pages"
        description={`Pages go into Google only when published, indexable and with at least ${MIN_WORDS} words of unique content.`}
        actions={
          <Button asChild>
            <Link href={`/admin/seo-management/pages/new?pageType=${pageType}`}>
              <Plus /> New page
            </Link>
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-1 rounded-lg border border-border bg-muted/40 p-1 w-fit">
        {SEO_PAGE_TYPES.map((t) => (
          <Button
            key={t.value}
            size="sm"
            variant={t.value === pageType ? "default" : "ghost"}
            onClick={() => {
              setPage(1);
              router.replace(`/admin/seo-management/pages?pageType=${t.value}`);
            }}
          >
            {t.label}
          </Button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name / URL…"
            className="w-56 pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={selectClass}>
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        {pageType !== "service" ? (
          <select value={city} onChange={(e) => { setCity(e.target.value); setPage(1); }} className={selectClass}>
            <option value="">All cities</option>
            {cities?.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        ) : null}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={needsContent} onChange={(e) => { setNeedsContent(e.target.checked); setPage(1); }} />
          Needs content
        </label>
      </div>

      <Card>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    {pageType !== "service" ? <TableHead>Location</TableHead> : null}
                    <TableHead>Content</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>In Google</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No pages found.
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {pageItems.map((p) => (
                    <TableRow key={p._id}>
                      <TableCell>
                        <Link href={`/admin/seo-management/pages/${p._id}`} className="font-medium text-primary">
                          {p.name}
                        </Link>
                        <div className="text-xs text-muted-foreground">/{p.slug}</div>
                      </TableCell>
                      {pageType !== "service" ? (
                        <TableCell className="text-muted-foreground">
                          {p.location ? (
                            <>
                              {p.location.name}
                              <div className="text-xs capitalize">
                                {p.location.type}
                                {p.location.city ? ` · ${p.location.city.name}` : ""}
                              </div>
                            </>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                      ) : null}
                      <TableCell>
                        <span className={p.wordCount >= MIN_WORDS ? "text-emerald-600" : "text-amber-600"}>
                          {p.wordCount} words
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={p.status === "published" ? "default" : "outline"} className="capitalize">
                          {p.status}
                        </Badge>
                        {p.status === "published" && !p.indexable ? (
                          <Badge variant="outline" className="ml-1">
                            noindex
                          </Badge>
                        ) : null}
                      </TableCell>
                      <TableCell>{p.eligible ? <Badge variant="secondary">Yes</Badge> : <span className="text-xs text-muted-foreground">No</span>}</TableCell>
                      <TableCell className="whitespace-nowrap text-right">
                        {p.status === "published" ? (
                          <Button variant="ghost" size="icon-sm" asChild aria-label="View live page">
                            <a href={`${env.NEXT_PUBLIC_SITE_URL}/${p.slug}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink />
                            </a>
                          </Button>
                        ) : null}
                        <Button variant="ghost" size="icon-sm" asChild aria-label="Edit">
                          <Link href={`/admin/seo-management/pages/${p._id}`}>
                            <Pencil />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <AdminPagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function SeoPagesListPage() {
  return (
    <Suspense>
      <SeoPagesListInner />
    </Suspense>
  );
}
