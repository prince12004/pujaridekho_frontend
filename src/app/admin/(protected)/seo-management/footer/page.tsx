"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { FOOTER_GROUP_KINDS, type FooterGroupAdmin, useFooterGroups, useSaveFooterGroups } from "@/features/admin/api/use-seo-management";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

function move<T>(list: T[], i: number, d: number) {
  const next = [...list];
  if (i + d < 0 || i + d >= next.length) return list;
  [next[i], next[i + d]] = [next[i + d], next[i]];
  return next;
}

export default function FooterLinksPage() {
  const { data, isLoading } = useFooterGroups();
  const save = useSaveFooterGroups();
  const [groups, setGroups] = useState<FooterGroupAdmin[]>([]);
  useEffect(() => {
    if (data) setGroups(data);
  }, [data]);

  const updateGroup = (i: number, patch: Partial<FooterGroupAdmin>) => setGroups(groups.map((g, j) => (j === i ? { ...g, ...patch } : g)));

  const onSave = async () => {
    try {
      await save.mutateAsync(groups);
      toast.success("Footer saved — live on the website within a few minutes");
    } catch (err) {
      toast.error(getErrorMessage(err), { duration: 10000 });
    }
  };

  return (
    <div className="pb-16">
      <AdminPageHeader
        title="Footer SEO Links"
        description="Footer blocks shown on every page: text blocks, link columns, automatic Puja and Latest Blog lists. The Contact column always uses Website Settings. Links are checked on save — broken links are refused."
        actions={
          <Button onClick={onSave} disabled={save.isPending}>
            {save.isPending ? <Loader2 className="animate-spin" /> : <Save />} Save footer
          </Button>
        }
      />
      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {groups.map((group, gi) => (
            <Card key={group.key}>
              <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                <CardTitle className="flex-1">
                  <Input value={group.title} onChange={(e) => updateGroup(gi, { title: e.target.value })} className="font-semibold" />
                </CardTitle>
                <label className="flex items-center gap-1.5 text-xs">
                  <input type="checkbox" checked={group.isActive} onChange={(e) => updateGroup(gi, { isActive: e.target.checked })} /> Shown
                </label>
                <Button variant="ghost" size="icon-sm" onClick={() => setGroups(move(groups, gi, -1))} aria-label="Move column left"><ArrowUp /></Button>
                <Button variant="ghost" size="icon-sm" onClick={() => setGroups(move(groups, gi, 1))} aria-label="Move column right"><ArrowDown /></Button>
                <Button variant="ghost" size="icon-sm" onClick={() => confirm(`Remove the "${group.title}" column?`) && setGroups(groups.filter((_, j) => j !== gi))} aria-label="Remove column"><Trash2 /></Button>
              </CardHeader>
              <CardContent className="grid gap-2">
                <select
                  value={group.kind ?? "links"}
                  onChange={(e) => updateGroup(gi, { kind: e.target.value as FooterGroupAdmin["kind"] })}
                  className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
                >
                  {FOOTER_GROUP_KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
                </select>
                {group.kind === "text" ? (
                  <Textarea rows={4} value={group.body ?? ""} onChange={(e) => updateGroup(gi, { body: e.target.value })} placeholder="Paragraph shown under the heading" />
                ) : group.kind === "cities" ? (
                  <div className="grid gap-2 text-sm text-muted-foreground">
                    <p>
                      Lists &quot;Pandit in &lt;city&gt;&quot; for every city in SEO Management → Cities (or, if none, Cities &amp; Service Areas). Each link opens the
                      city&apos;s published SEO page, or a basic noindex city page until one is published.
                    </p>
                    <div className="flex items-center gap-2">
                      Last link label
                      <Input value={group.body ?? ""} placeholder="All SEO Pages" onChange={(e) => updateGroup(gi, { body: e.target.value })} className="h-8 w-48" />
                    </div>
                  </div>
                ) : group.kind === "poojas" || group.kind === "blogs" || group.kind === "categories" ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    Show up to
                    <Input type="number" min={1} max={30} value={group.limit ?? 12} onChange={(e) => updateGroup(gi, { limit: Number(e.target.value) || 12 })} className="h-8 w-20" />
                    {group.kind === "poojas"
                      ? "published pujas (featured & popular first, then display order)."
                      : group.kind === "categories"
                        ? "columns — one per puja category (largest first); remaining pujas go in a \"More Pujas\" column. Column titles come from Pooja Categories."
                        : "latest published blog posts."}
                  </div>
                ) : null}
                {["links", "tags"].includes(group.kind ?? "links") ? group.links.map((link, li) => (
                  <div key={li} className="flex items-center gap-1.5">
                    <input type="checkbox" checked={link.isActive} title="Shown" onChange={(e) => updateGroup(gi, { links: group.links.map((l, j) => (j === li ? { ...l, isActive: e.target.checked } : l)) })} />
                    <Input value={link.label} placeholder="Label" onChange={(e) => updateGroup(gi, { links: group.links.map((l, j) => (j === li ? { ...l, label: e.target.value } : l)) })} />
                    <Input value={link.url} placeholder="/url" onChange={(e) => updateGroup(gi, { links: group.links.map((l, j) => (j === li ? { ...l, url: e.target.value } : l)) })} />
                    <Button variant="ghost" size="icon-sm" onClick={() => updateGroup(gi, { links: move(group.links, li, -1) })} aria-label="Up"><ArrowUp /></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => updateGroup(gi, { links: move(group.links, li, 1) })} aria-label="Down"><ArrowDown /></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => updateGroup(gi, { links: group.links.filter((_, j) => j !== li) })} aria-label="Remove"><Trash2 /></Button>
                  </div>
                )) : null}
                {["links", "tags"].includes(group.kind ?? "links") ? (
                  <Button variant="outline" size="sm" className="w-fit" onClick={() => updateGroup(gi, { links: [...group.links, { label: "", url: "", isActive: true }] })}>
                    <Plus /> Add link
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            className="h-24 border-dashed"
            onClick={() => setGroups([...groups, { key: `group-${Date.now()}`, title: "New column", isActive: true, kind: "links", links: [] }])}
          >
            <Plus /> Add column
          </Button>
        </div>
      )}
      <p className="mt-4 text-xs text-muted-foreground">
        Tip: keep the footer short — around 8–12 links per column. The full list of locations lives on the SEO directory page (/seo-pages).
      </p>
    </div>
  );
}
