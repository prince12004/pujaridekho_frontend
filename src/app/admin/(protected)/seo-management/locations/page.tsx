"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { FileEdit, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import {
  SEO_LOCATION_TYPES,
  type SeoLocation,
  type SeoLocationType,
  useDeleteSeoLocation,
  useSaveSeoLocation,
  useSeoLocations,
} from "@/features/admin/api/use-seo-management";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const selectClass = "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none";

interface FormState {
  name: string;
  slug: string;
  city: string;
  parent: string;
  areaLabel: string;
  pincode: string;
  sortOrder: string;
  isActive: boolean;
}

const EMPTY: FormState = { name: "", slug: "", city: "", parent: "", areaLabel: "", pincode: "", sortOrder: "0", isActive: true };

function LocationsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = (searchParams.get("type") as SeoLocationType) || "city";
  const typeMeta = SEO_LOCATION_TYPES.find((t) => t.value === type) ?? SEO_LOCATION_TYPES[0];
  const [cityFilter, setCityFilter] = useState("");
  const [search, setSearch] = useState("");

  const { data: locations, isLoading } = useSeoLocations({ type, city: cityFilter || undefined, search: search || undefined });
  const { data: cities } = useSeoLocations({ type: "city" });
  const { data: allAreas } = useSeoLocations();
  const save = useSaveSeoLocation();
  const remove = useDeleteSeoLocation();

  const [editing, setEditing] = useState<SeoLocation | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);

  const parentOptions = (allAreas ?? []).filter(
    (l) => l.type !== "society" && l.type !== "city" && l._id !== editing?._id && (!form.city || l.city?._id === form.city),
  );

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY, city: cityFilter });
    setOpen(true);
  };
  const openEdit = (l: SeoLocation) => {
    setEditing(l);
    setForm({
      name: l.name,
      slug: l.slug,
      city: l.city?._id ?? "",
      parent: l.parent && l.parent._id !== l.city?._id ? l.parent._id : "",
      areaLabel: l.areaLabel ?? "",
      pincode: l.pincode ?? "",
      sortOrder: String(l.sortOrder ?? 0),
      isActive: l.isActive,
    });
    setOpen(true);
  };

  const submit = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (type !== "city" && !form.city) return toast.error("Choose a city");
    const input = {
      type,
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      city: type === "city" ? null : form.city,
      parent: type === "city" ? null : form.parent || form.city,
      areaLabel: form.areaLabel || undefined,
      pincode: form.pincode || undefined,
      sortOrder: Number(form.sortOrder) || 0,
      isActive: form.isActive,
    };
    try {
      await save.mutateAsync({ id: editing?._id, input });
      toast.success(editing ? "Location updated" : `${typeMeta.singular} added — a draft page was created for it`);
      setOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onDelete = async (l: SeoLocation) => {
    if (!confirm(`Delete "${l.name}" and its draft page?`)) return;
    try {
      await remove.mutateAsync(l._id);
      toast.success("Location deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader
        title={`${typeMeta.singular} Management`}
        description="Every location gets its own draft 'Pandit in …' page. Add unique content and publish it from SEO Pages."
        actions={
          <Button onClick={openCreate}>
            <Plus /> Add {typeMeta.singular}
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-1 rounded-lg border border-border bg-muted/40 p-1 w-fit">
        {SEO_LOCATION_TYPES.map((t) => (
          <Button
            key={t.value}
            size="sm"
            variant={t.value === type ? "default" : "ghost"}
            onClick={() => router.replace(`/admin/seo-management/locations?type=${t.value}`)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      {type !== "city" ? (
        <div className="mb-4 flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search…" className="w-56 pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className={`${selectClass} w-48`}>
            <option value="">All cities</option>
            {cities?.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <Card>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  {type !== "city" ? <TableHead>City</TableHead> : null}
                  {type !== "city" ? <TableHead>Inside</TableHead> : null}
                  <TableHead>Page</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Nothing here yet.
                    </TableCell>
                  </TableRow>
                ) : null}
                {locations?.map((l) => {
                  const page = l.pages?.find((p) => p.pageType === "location");
                  return (
                    <TableRow key={l._id}>
                      <TableCell>
                        <div className="font-medium">{l.name}</div>
                        <div className="text-xs text-muted-foreground">{l.slug}</div>
                      </TableCell>
                      {type !== "city" ? <TableCell className="text-muted-foreground">{l.city?.name ?? "—"}</TableCell> : null}
                      {type !== "city" ? (
                        <TableCell className="text-muted-foreground">
                          {l.parent && l.parent._id !== l.city?._id ? l.parent.name : "—"}
                        </TableCell>
                      ) : null}
                      <TableCell>
                        {page ? (
                          <Link href={`/admin/seo-management/pages/${page._id}`} className="inline-flex items-center gap-1.5 text-sm text-primary">
                            <FileEdit size={13} /> /{page.slug}
                            <Badge variant={page.status === "published" ? "default" : "outline"} className="ml-1">
                              {page.status}
                            </Badge>
                          </Link>
                        ) : (
                          <span className="text-xs text-muted-foreground">No page</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={l.isActive ? "default" : "outline"}>{l.isActive ? "Yes" : "No"}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(l)} aria-label="Edit">
                          <Pencil />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => onDelete(l)} aria-label="Delete">
                          <Trash2 />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${typeMeta.singular}` : `Add ${typeMeta.singular}`}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={type === "society" ? "e.g. Gaur City 2" : ""} />
            </div>
            <div className="space-y-1">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Auto-generated from the name" />
              <p className="text-xs text-muted-foreground">Page URL will be /pandit-in-{form.slug || "<slug>"}. Must be unique.</p>
            </div>
            {type !== "city" ? (
              <>
                <div className="space-y-1">
                  <Label>City</Label>
                  <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value, parent: "" })} className={selectClass}>
                    <option value="">Choose a city</option>
                    {cities?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Inside sector / locality (optional)</Label>
                  <select value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })} className={selectClass}>
                    <option value="">— Directly under the city —</option>
                    {parentOptions.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Area label</Label>
                    <Input value={form.areaLabel} onChange={(e) => setForm({ ...form, areaLabel: e.target.value })} placeholder="e.g. IT offices" />
                  </div>
                  <div className="space-y-1">
                    <Label>Pincode</Label>
                    <Input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
                  </div>
                </div>
              </>
            ) : null}
            <div className="grid grid-cols-2 items-end gap-3">
              <div className="space-y-1">
                <Label>Sort order</Label>
                <Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
              </div>
              <label className="flex h-9 items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                Active (shown in coverage lists)
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={save.isPending}>
              {save.isPending ? <Loader2 className="animate-spin" /> : null} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function LocationsPage() {
  return (
    <Suspense>
      <LocationsPageInner />
    </Suspense>
  );
}
