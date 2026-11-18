"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ExternalLink, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { DIRECTORY_SECTIONS, type SeoPageListItem, useSeoPages, useUpdateDirectory } from "@/features/admin/api/use-seo-management";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";
import { env } from "@/lib/env";

type Row = Pick<SeoPageListItem, "_id" | "name" | "slug" | "pageType" | "showInDirectory" | "directorySection" | "directoryOrder" | "eligible"> & {
  city: string;
};

export default function DirectoryManagementPage() {
  const { data: pages, isLoading } = useSeoPages({ status: "published" });
  const update = useUpdateDirectory();
  const [rows, setRows] = useState<Row[]>([]);
  const [dirty, setDirty] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!pages) return;
    setRows(
      pages
        .map((p) => ({
          _id: p._id, name: p.name, slug: p.slug, pageType: p.pageType, showInDirectory: p.showInDirectory,
          directorySection: p.directorySection, directoryOrder: p.directoryOrder, eligible: p.eligible,
          city: p.pageType === "service" ? "Services" : p.location?.type === "city" ? p.location.name : (p.location?.city?.name ?? "—"),
        }))
        .sort((a, b) => a.city.localeCompare(b.city) || a.directoryOrder - b.directoryOrder || a.name.localeCompare(b.name)),
    );
    setDirty(new Set());
  }, [pages]);

  const patch = (id: string, change: Partial<Row>) => {
    setRows(rows.map((r) => (r._id === id ? { ...r, ...change } : r)));
    setDirty(new Set(dirty).add(id));
  };

  const onSave = async () => {
    try {
      await update.mutateAsync(
        rows.filter((r) => dirty.has(r._id)).map((r) => ({ id: r._id, showInDirectory: r.showInDirectory, directorySection: r.directorySection, directoryOrder: Number(r.directoryOrder) || 0 })),
      );
      toast.success("Directory updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="SEO Directory Management"
        description="Controls what /seo-pages lists and in which order. Only published, indexable pages appear there."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href={`${env.NEXT_PUBLIC_SITE_URL}/seo-pages`} target="_blank" rel="noopener noreferrer">View <ExternalLink /></a>
            </Button>
            <Button onClick={onSave} disabled={dirty.size === 0 || update.isPending}>
              {update.isPending ? <Loader2 className="animate-spin" /> : <Save />} Save {dirty.size ? `(${dirty.size})` : ""}
            </Button>
          </div>
        }
      />
      <Card>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group</TableHead>
                  <TableHead>Page</TableHead>
                  <TableHead>Show</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead className="w-24">Order</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No published pages yet.</TableCell></TableRow>
                ) : null}
                {rows.map((r) => (
                  <TableRow key={r._id}>
                    <TableCell className="text-muted-foreground">{r.city}</TableCell>
                    <TableCell>
                      <div className="font-medium">{r.name}</div>
                      <div className="text-xs text-muted-foreground">/{r.slug}{r.eligible ? "" : " · not indexable — hidden"}</div>
                    </TableCell>
                    <TableCell>
                      <input type="checkbox" checked={r.showInDirectory} onChange={(e) => patch(r._id, { showInDirectory: e.target.checked })} />
                    </TableCell>
                    <TableCell>
                      {r.pageType === "location" ? (
                        <select value={r.directorySection} onChange={(e) => patch(r._id, { directorySection: e.target.value })} className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm">
                          {DIRECTORY_SECTIONS.filter((s) => s.value !== "office").map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      ) : (
                        <span className="text-xs text-muted-foreground">{r.pageType === "service" ? "Services" : "Office puja"}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input type="number" value={r.directoryOrder} onChange={(e) => patch(r._id, { directoryOrder: Number(e.target.value) })} className="h-8" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
