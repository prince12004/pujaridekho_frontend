"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import {
  CityPoojaSeo,
  useCityPoojaSeoList,
  useCreateCityPoojaSeo,
  useDeleteCityPoojaSeo,
  useUpdateCityPoojaSeo,
} from "@/features/admin/api/use-city-pooja-seo";
import { useCities } from "@/features/admin/api/use-cities";
import { usePoojas } from "@/features/admin/api/use-poojas";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const createSchema = z.object({
  city: z.string().min(1, "Select a city"),
  pooja: z.string().min(1, "Select a pooja"),
  title: z.string().optional(),
  description: z.string().optional(),
});

export default function AdvancedSeoPage() {
  const { data: entries, isLoading } = useCityPoojaSeoList();
  const { data: cities } = useCities();
  const { data: poojasResult } = usePoojas({ status: "Published" });
  const createMutation = useCreateCityPoojaSeo();
  const updateMutation = useUpdateCityPoojaSeo();
  const deleteMutation = useDeleteCityPoojaSeo();
  const [editing, setEditing] = useState<CityPoojaSeo | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: { city: "", pooja: "", title: "", description: "" },
  });

  const openCreate = () => {
    setEditing(null);
    reset({ city: "", pooja: "", title: "", description: "" });
    setDialogOpen(true);
  };

  const openEdit = (entry: CityPoojaSeo) => {
    setEditing(entry);
    reset({ city: entry.city._id, pooja: entry.pooja._id, title: entry.title ?? "", description: entry.description ?? "" });
    setDialogOpen(true);
  };

  const onSubmit = async (values: z.infer<typeof createSchema>) => {
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing._id, input: { title: values.title, description: values.description } });
        toast.success("SEO entry updated");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("SEO entry created");
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onDelete = async (id: string, slug: string) => {
    if (!confirm(`Delete SEO entry "${slug}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("SEO entry deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Advanced SEO (City × Pooja)"
        description="Manage per-city SEO overrides for individual poojas — created explicitly here, never auto-generated in bulk."
        actions={
          <Button onClick={openCreate}>
            <Plus /> Add Entry
          </Button>
        }
      />

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
                  <TableHead>Slug</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Pooja</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No city × pooja SEO entries yet.
                    </TableCell>
                  </TableRow>
                )}
                {entries?.map((entry) => (
                  <TableRow key={entry._id}>
                    <TableCell className="font-medium">{entry.slug}</TableCell>
                    <TableCell>{entry.city.name}</TableCell>
                    <TableCell>{entry.pooja.name}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">{entry.title ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(entry)}>
                        <Pencil />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => onDelete(entry._id, entry.slug)}>
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit SEO Entry" : "New SEO Entry"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>City</Label>
                <select
                  {...register("city")}
                  disabled={!!editing}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none disabled:opacity-60"
                >
                  <option value="">Select city</option>
                  {cities?.map((city) => (
                    <option key={city._id} value={city._id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Pooja</Label>
                <select
                  {...register("pooja")}
                  disabled={!!editing}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none disabled:opacity-60"
                >
                  <option value="">Select pooja</option>
                  {poojasResult?.items.map((pooja) => (
                    <option key={pooja._id} value={pooja._id}>
                      {pooja.name}
                    </option>
                  ))}
                </select>
                {errors.pooja && <p className="text-xs text-destructive">{errors.pooja.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Meta Title</Label>
              <Input {...register("title")} placeholder="e.g. Griha Pravesh Puja in Noida | PujariDekho" />
            </div>
            <div className="space-y-1.5">
              <Label>Meta Description</Label>
              <Textarea rows={3} {...register("description")} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {editing ? "Save changes" : "Create entry"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
