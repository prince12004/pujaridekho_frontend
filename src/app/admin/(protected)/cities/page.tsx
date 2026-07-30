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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { City, useCities, useCreateCity, useDeleteCity, useUpdateCity } from "@/features/admin/api/use-cities";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const citySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  state: z.string().optional(),
  isServiceable: z.boolean().optional(),
  status: z.enum(["draft", "Published"]),
});

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function CitiesPage() {
  const { data: cities, isLoading } = useCities();
  const createMutation = useCreateCity();
  const updateMutation = useUpdateCity();
  const deleteMutation = useDeleteCity();
  const [editing, setEditing] = useState<City | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof citySchema>>({
    resolver: zodResolver(citySchema),
    defaultValues: { name: "", slug: "", state: "", isServiceable: true, status: "Published" },
  });

  const openCreate = () => {
    setEditing(null);
    reset({ name: "", slug: "", state: "", isServiceable: true, status: "Published" });
    setDialogOpen(true);
  };

  const openEdit = (city: City) => {
    setEditing(city);
    reset({ name: city.name, slug: city.slug, state: city.state ?? "", isServiceable: city.isServiceable, status: city.status });
    setDialogOpen(true);
  };

  const onSubmit = async (values: z.infer<typeof citySchema>) => {
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing._id, input: values });
        toast.success("City updated");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("City created");
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onDelete = async (id: string, name: string) => {
    if (!confirm(`Delete city "${name}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("City deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Cities & Service Areas"
        description="Manage the cities and areas PujariDekho serves."
        actions={
          <Button onClick={openCreate}>
            <Plus /> Add City
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
                  <TableHead>Name</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Serviceable</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cities?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No cities yet.
                    </TableCell>
                  </TableRow>
                )}
                {cities?.map((city) => (
                  <TableRow key={city._id}>
                    <TableCell className="font-medium">{city.name}</TableCell>
                    <TableCell className="text-muted-foreground">{city.state ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={city.isServiceable ? "default" : "destructive"}>{city.isServiceable ? "Yes" : "No"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={city.status === "Published" ? "default" : "outline"}>{city.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(city)}>
                        <Pencil />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => onDelete(city._id, city.name)}>
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
            <DialogTitle>{editing ? "Edit City" : "New City"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                {...register("name", {
                  onChange: (e) => {
                    if (!editing) setValue("slug", slugify(e.target.value));
                  },
                })}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input {...register("slug")} />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>State</Label>
              <Input {...register("state")} />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register("isServiceable")} /> Serviceable
              </label>
              <select {...register("status")} className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none">
                <option value="draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {editing ? "Save changes" : "Create city"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
