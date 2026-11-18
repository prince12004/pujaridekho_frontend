"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ExternalLink, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { SingleImageUpload } from "@/features/admin/components/single-image-upload";
import { MultiImageUpload } from "@/features/admin/components/multi-image-upload";
import { RichTextEditor } from "@/features/admin/components/rich-text-editor";
import { ALL_RECORDS_LIMIT } from "@/features/admin/components/admin-pagination";
import { usePoojas } from "@/features/admin/api/use-poojas";
import {
  DIRECTORY_SECTIONS,
  SEO_PAGE_TYPES,
  type SeoPageDetail,
  type SeoPageInput,
  type SeoPageType,
  useDeleteSeoPage,
  useSaveSeoPage,
  useSeoLocations,
  useSeoPage,
} from "@/features/admin/api/use-seo-management";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";
import { env } from "@/lib/env";

const MIN_WORDS = 150;
const selectClass = "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none";

type FormState = Required<
  Pick<
    SeoPageDetail,
    | "pageType" | "slug" | "name" | "h1" | "metaTitle" | "metaDescription" | "intro" | "content" | "bannerImage" | "images"
    | "heroTagline" | "services" | "faqs" | "internalLinks" | "nearbyLocations" | "coverageNote" | "canonicalUrl"
    | "indexable" | "status" | "showInDirectory" | "directorySection" | "directoryOrder"
  >
> & { location: string };

function emptyForm(pageType: SeoPageType): FormState {
  return {
    pageType, slug: "", name: "", location: "", h1: "", metaTitle: "", metaDescription: "", intro: "", content: "",
    bannerImage: "", images: [], heroTagline: "", services: [], faqs: [], internalLinks: [], nearbyLocations: [],
    coverageNote: "", canonicalUrl: "", indexable: true, status: "draft", showInDirectory: true,
    directorySection: pageType === "office_location" ? "office" : "main", directoryOrder: 0,
  };
}

function fromDetail(p: SeoPageDetail): FormState {
  return {
    pageType: p.pageType, slug: p.slug, name: p.name, location: p.location?._id ?? "", h1: p.h1 ?? "",
    metaTitle: p.metaTitle ?? "", metaDescription: p.metaDescription ?? "", intro: p.intro ?? "", content: p.content ?? "",
    bannerImage: p.bannerImage ?? "", images: p.images ?? [], heroTagline: p.heroTagline ?? "",
    services: (p.services ?? []).map((s) => ({ ...s, pooja: s.pooja ?? "" })), faqs: p.faqs ?? [],
    internalLinks: p.internalLinks ?? [], nearbyLocations: (p.nearbyLocations ?? []).map(String),
    coverageNote: p.coverageNote ?? "", canonicalUrl: p.canonicalUrl ?? "", indexable: p.indexable !== false,
    status: p.status, showInDirectory: p.showInDirectory !== false, directorySection: p.directorySection ?? "main",
    directoryOrder: p.directoryOrder ?? 0,
  };
}

function countWords(...parts: string[]) {
  return parts
    .join(" ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .split(/\s+/)
    .filter((w) => /[a-z0-9]/i.test(w)).length;
}

function move<T>(list: T[], index: number, delta: number) {
  const next = [...list];
  const target = index + delta;
  if (target < 0 || target >= next.length) return list;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function CharCount({ value, max }: { value: string; max: number }) {
  return <span className={`text-xs ${value.length > max ? "text-destructive" : "text-muted-foreground"}`}>{value.length}/{max}</span>;
}

function SeoPageEditorInner() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const isNew = params.id === "new";
  const { data: page, isLoading } = useSeoPage(isNew ? undefined : params.id);
  const { data: locations } = useSeoLocations();
  const { data: poojas } = usePoojas({ limit: ALL_RECORDS_LIMIT });
  const save = useSaveSeoPage();
  const remove = useDeleteSeoPage();

  const [form, setForm] = useState<FormState>(() => emptyForm((searchParams.get("pageType") as SeoPageType) || "location"));
  useEffect(() => {
    if (page) setForm(fromDetail(page));
  }, [page]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));
  const words = countWords(form.intro, form.content);
  const selectedLocation = locations?.find((l) => l._id === form.location);
  const cityId = selectedLocation?.type === "city" ? selectedLocation._id : selectedLocation?.city?._id;
  const locationOptions = useMemo(
    () => (locations ?? []).filter((l) => (form.pageType === "office_location" ? l.type === "city" : true)),
    [locations, form.pageType],
  );
  const nearbyOptions = (locations ?? []).filter(
    (l) => l._id !== form.location && (selectedLocation?.type === "city" ? l.type === "city" : l.city?._id === cityId),
  );

  const submit = async (statusOverride?: "draft" | "published") => {
    const status = statusOverride ?? form.status;
    const input: SeoPageInput = {
      ...form,
      status,
      location: form.pageType === "service" ? null : form.location || null,
      services: form.services.map((s) => ({ ...s, pooja: s.pooja || null })),
      directoryOrder: Number(form.directoryOrder) || 0,
    };
    try {
      const saved = await save.mutateAsync({ id: isNew ? undefined : params.id, input });
      toast.success(status === "published" ? "Page saved and live" : "Draft saved");
      setForm((f) => ({ ...f, status }));
      if (isNew) router.replace(`/admin/seo-management/pages/${saved._id}`);
    } catch (err) {
      toast.error(getErrorMessage(err), { duration: 8000 });
    }
  };

  const onDelete = async () => {
    if (!confirm("Delete this draft page?")) return;
    try {
      await remove.mutateAsync(params.id);
      toast.success("Page deleted");
      router.replace("/admin/seo-management/pages");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (!isNew && isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <AdminPageHeader
        title={isNew ? "New SEO page" : form.name || "Edit SEO page"}
        description={isNew ? "Create a location, office or service landing page." : `/${form.slug}`}
        actions={
          !isNew && form.status === "published" ? (
            <Button variant="outline" asChild>
              <a href={`${env.NEXT_PUBLIC_SITE_URL}/${form.slug}`} target="_blank" rel="noopener noreferrer">
                View live <ExternalLink />
              </a>
            </Button>
          ) : null
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader><CardTitle>Page & URL</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Page type</Label>
                <select value={form.pageType} onChange={(e) => set("pageType", e.target.value as SeoPageType)} className={selectClass} disabled={!isNew}>
                  {SEO_PAGE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              {form.pageType !== "service" ? (
                <div className="space-y-1">
                  <Label>Location</Label>
                  <select value={form.location} onChange={(e) => set("location", e.target.value)} className={selectClass}>
                    <option value="">Choose…</option>
                    {locationOptions.map((l) => (
                      <option key={l._id} value={l._id}>
                        {l.name} ({l.type}{l.city ? ` · ${l.city.name}` : ""})
                      </option>
                    ))}
                  </select>
                </div>
              ) : <div />}
              <div className="space-y-1">
                <Label>Admin name</Label>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Pandit in Gaur City 2" />
                <p className="text-xs text-muted-foreground">Also used as link text in breadcrumbs, footer and directory.</p>
              </div>
              <div className="space-y-1">
                <Label>URL slug</Label>
                <div className="flex items-center rounded-lg border border-input pl-2.5 text-sm">
                  <span className="text-muted-foreground">/</span>
                  <input value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase())} className="h-9 flex-1 bg-transparent px-1 outline-none" placeholder="pandit-in-gaur-city-2" />
                </div>
                {!isNew && page?.status === "published" && form.slug !== page.slug ? (
                  <p className="text-xs text-amber-600">The old URL will automatically 301-redirect to the new one.</p>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Search appearance</CardTitle></CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-1">
                <div className="flex justify-between"><Label>H1 heading</Label><CharCount value={form.h1} max={120} /></div>
                <Input value={form.h1} onChange={(e) => set("h1", e.target.value)} />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between"><Label>Meta title</Label><CharCount value={form.metaTitle} max={60} /></div>
                <Input value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between"><Label>Meta description</Label><CharCount value={form.metaDescription} max={160} /></div>
                <Textarea rows={2} value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} />
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="truncate text-xs text-emerald-700">{env.NEXT_PUBLIC_SITE_URL.replace(/^https?:\/\//, "")}/{form.slug}</p>
                <p className="truncate text-base text-blue-700">{form.metaTitle || form.h1 || form.name || "Meta title"}</p>
                <p className="line-clamp-2 text-xs text-muted-foreground">{form.metaDescription || "Meta description…"}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Canonical URL (optional)</Label>
                  <Input value={form.canonicalUrl} onChange={(e) => set("canonicalUrl", e.target.value)} placeholder="Leave empty to use this page's URL" />
                </div>
                <label className="flex items-center gap-2 pt-6 text-sm">
                  <input type="checkbox" checked={form.indexable} onChange={(e) => set("indexable", e.target.checked)} />
                  Index in Google (unchecked = noindex)
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Content</CardTitle></CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-1">
                <Label>Hero tagline</Label>
                <Input value={form.heroTagline} onChange={(e) => set("heroTagline", e.target.value)} placeholder="e.g. Gaur City 1, Gaur City 2 and nearby towers" />
              </div>
              <div className="space-y-1">
                <Label>Intro paragraph</Label>
                <Textarea rows={3} value={form.intro} onChange={(e) => set("intro", e.target.value)} placeholder="A short, location-specific introduction shown under the H1." />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <Label>Main content</Label>
                  <span className={`text-xs ${words >= MIN_WORDS ? "text-emerald-600" : "text-amber-600"}`}>
                    {words}/{MIN_WORDS} words (intro + content) {words >= MIN_WORDS ? "✓" : "— needed to publish as indexable"}
                  </span>
                </div>
                <RichTextEditor value={form.content} onChange={(html) => set("content", html)} />
                <p className="text-xs text-muted-foreground">
                  Write genuinely local content — what families in this location usually book, how pujas work in its homes, nearby landmarks. Pages that only swap the location name will not be indexed well.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Banner image</Label>
                  <SingleImageUpload value={form.bannerImage} onChange={(url) => set("bannerImage", url)} />
                  {form.bannerImage ? <Button variant="ghost" size="sm" onClick={() => set("bannerImage", "")}>Remove banner</Button> : null}
                </div>
                <div className="space-y-1">
                  <Label>Page images</Label>
                  <MultiImageUpload value={form.images} onChange={(urls) => set("images", urls)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Puja services on this page</CardTitle></CardHeader>
            <CardContent className="grid gap-2">
              {form.services.map((s, i) => (
                <div key={i} className="grid gap-2 rounded-lg border border-border p-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
                  <Input value={s.label} placeholder="Label" onChange={(e) => set("services", form.services.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
                  <select value={s.pooja ?? ""} onChange={(e) => set("services", form.services.map((x, j) => (j === i ? { ...x, pooja: e.target.value } : x)))} className={selectClass}>
                    <option value="">— Link a pooja —</option>
                    {poojas?.items.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                  <Input value={s.url ?? ""} placeholder="or URL, e.g. /office-puja" onChange={(e) => set("services", form.services.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))} />
                  <div className="flex">
                    <Button variant="ghost" size="icon-sm" onClick={() => set("services", move(form.services, i, -1))} aria-label="Move up"><ArrowUp /></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => set("services", move(form.services, i, 1))} aria-label="Move down"><ArrowDown /></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => set("services", form.services.filter((_, j) => j !== i))} aria-label="Remove"><Trash2 /></Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-fit" onClick={() => set("services", [...form.services, { label: "", pooja: "", url: "" }])}>
                <Plus /> Add service
              </Button>
              <p className="text-xs text-muted-foreground">Linked poojas show their live price and image. Services pointing to a missing page are hidden automatically.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>FAQs</CardTitle></CardHeader>
            <CardContent className="grid gap-2">
              {form.faqs.map((f, i) => (
                <div key={i} className="grid gap-2 rounded-lg border border-border p-2">
                  <div className="flex gap-2">
                    <Input value={f.question} placeholder="Question" onChange={(e) => set("faqs", form.faqs.map((x, j) => (j === i ? { ...x, question: e.target.value } : x)))} />
                    <Button variant="ghost" size="icon-sm" onClick={() => set("faqs", form.faqs.filter((_, j) => j !== i))} aria-label="Remove"><Trash2 /></Button>
                  </div>
                  <Textarea rows={2} value={f.answer} placeholder="Answer" onChange={(e) => set("faqs", form.faqs.map((x, j) => (j === i ? { ...x, answer: e.target.value } : x)))} />
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-fit" onClick={() => set("faqs", [...form.faqs, { question: "", answer: "" }])}>
                <Plus /> Add FAQ
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Internal links, coverage & nearby</CardTitle></CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label>Internal links</Label>
                {form.internalLinks.map((l, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={l.label} placeholder="Link text" onChange={(e) => set("internalLinks", form.internalLinks.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
                    <Input value={l.url} placeholder="/pandit-in-noida" onChange={(e) => set("internalLinks", form.internalLinks.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))} />
                    <Button variant="ghost" size="icon-sm" onClick={() => set("internalLinks", form.internalLinks.filter((_, j) => j !== i))} aria-label="Remove"><Trash2 /></Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-fit" onClick={() => set("internalLinks", [...form.internalLinks, { label: "", url: "" }])}>
                  <Plus /> Add link
                </Button>
                <p className="text-xs text-muted-foreground">Links are checked on save — only live pages are accepted.</p>
              </div>
              <div className="space-y-1">
                <Label>Coverage note</Label>
                <Textarea rows={2} value={form.coverageNote} onChange={(e) => set("coverageNote", e.target.value)} placeholder="Areas, towers or landmarks covered (shown in the 'Areas we cover' box)." />
                <p className="text-xs text-muted-foreground">Sectors and societies inside this location are listed automatically.</p>
              </div>
              {form.pageType !== "service" && nearbyOptions.length > 0 ? (
                <div className="space-y-1">
                  <Label>Nearby locations (optional — defaults to the same city)</Label>
                  <div className="grid max-h-48 gap-1 overflow-y-auto rounded-lg border border-border p-2 sm:grid-cols-2">
                    {nearbyOptions.map((l) => (
                      <label key={l._id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={form.nearbyLocations.includes(l._id)}
                          onChange={(e) =>
                            set("nearbyLocations", e.target.checked ? [...form.nearbyLocations, l._id] : form.nearbyLocations.filter((id) => id !== l._id))
                          }
                        />
                        {l.name}
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6 xl:sticky xl:top-20 xl:h-fit">
          <Card>
            <CardHeader><CardTitle>Publish</CardTitle></CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <Badge variant={form.status === "published" ? "default" : "outline"} className="capitalize">{form.status}</Badge>
              </div>
              <ul className="grid gap-1 text-xs">
                <li className={form.h1 ? "text-emerald-600" : "text-muted-foreground"}>{form.h1 ? "✓" : "○"} H1</li>
                <li className={form.metaTitle ? "text-emerald-600" : "text-muted-foreground"}>{form.metaTitle ? "✓" : "○"} Meta title</li>
                <li className={form.metaDescription ? "text-emerald-600" : "text-muted-foreground"}>{form.metaDescription ? "✓" : "○"} Meta description</li>
                <li className={words >= MIN_WORDS ? "text-emerald-600" : "text-muted-foreground"}>{words >= MIN_WORDS ? "✓" : "○"} {MIN_WORDS}+ words of content</li>
                <li className={form.faqs.length ? "text-emerald-600" : "text-muted-foreground"}>{form.faqs.length ? "✓" : "○"} FAQs (recommended)</li>
              </ul>
              <Button onClick={() => submit("published")} disabled={save.isPending}>
                {save.isPending ? <Loader2 className="animate-spin" /> : <Save />} {form.status === "published" ? "Save live page" : "Publish"}
              </Button>
              <Button variant="outline" onClick={() => submit("draft")} disabled={save.isPending}>
                {form.status === "published" ? "Unpublish (save as draft)" : "Save draft"}
              </Button>
              {!isNew && form.status === "draft" ? (
                <Button variant="ghost" className="text-destructive" onClick={onDelete}>
                  <Trash2 /> Delete page
                </Button>
              ) : null}
              <p className="text-xs text-muted-foreground">Live pages refresh on the website within 5 minutes.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>SEO directory</CardTitle></CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.showInDirectory} onChange={(e) => set("showInDirectory", e.target.checked)} />
                Show on /seo-pages
              </label>
              <div className="space-y-1">
                <Label>Section</Label>
                <select value={form.directorySection} onChange={(e) => set("directorySection", e.target.value)} className={selectClass}>
                  {DIRECTORY_SECTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Display order</Label>
                <Input type="number" value={form.directoryOrder} onChange={(e) => set("directoryOrder", Number(e.target.value))} />
              </div>
            </CardContent>
          </Card>

          <Link href="/admin/seo-management/pages" className="text-sm text-muted-foreground hover:text-primary">← All SEO pages</Link>
        </div>
      </div>
    </div>
  );
}

export default function SeoPageEditor() {
  return (
    <Suspense>
      <SeoPageEditorInner />
    </Suspense>
  );
}
