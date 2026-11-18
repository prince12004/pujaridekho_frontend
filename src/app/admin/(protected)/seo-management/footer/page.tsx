"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { type FooterGroupAdmin, useFooterGroups, useSaveFooterGroups } from "@/features/admin/api/use-seo-management";
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
        description="Footer columns shown on every page. The Contact column always uses the details from Website Settings. Every link is checked on save — broken links are refused."
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
                {group.links.map((link, li) => (
                  <div key={li} className="flex items-center gap-1.5">
                    <input type="checkbox" checked={link.isActive} title="Shown" onChange={(e) => updateGroup(gi, { links: group.links.map((l, j) => (j === li ? { ...l, isActive: e.target.checked } : l)) })} />
                    <Input value={link.label} placeholder="Label" onChange={(e) => updateGroup(gi, { links: group.links.map((l, j) => (j === li ? { ...l, label: e.target.value } : l)) })} />
                    <Input value={link.url} placeholder="/url" onChange={(e) => updateGroup(gi, { links: group.links.map((l, j) => (j === li ? { ...l, url: e.target.value } : l)) })} />
                    <Button variant="ghost" size="icon-sm" onClick={() => updateGroup(gi, { links: move(group.links, li, -1) })} aria-label="Up"><ArrowUp /></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => updateGroup(gi, { links: move(group.links, li, 1) })} aria-label="Down"><ArrowDown /></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => updateGroup(gi, { links: group.links.filter((_, j) => j !== li) })} aria-label="Remove"><Trash2 /></Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-fit" onClick={() => updateGroup(gi, { links: [...group.links, { label: "", url: "", isActive: true }] })}>
                  <Plus /> Add link
                </Button>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            className="h-24 border-dashed"
            onClick={() => setGroups([...groups, { key: `group-${Date.now()}`, title: "New column", isActive: true, links: [] }])}
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
