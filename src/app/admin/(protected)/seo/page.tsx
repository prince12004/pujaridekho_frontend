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
import { SingleImageUpload } from "@/features/admin/components/single-image-upload";
import { SeoSetting, useCreateSeoSetting, useDeleteSeoSetting, useSeoSettings, useUpdateSeoSetting } from "@/features/admin/api/use-seo";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const seoSchema = z.object({
  pagePath: z.string().min(1, "Path is required (e.g. / or /about)"),
  title: z.string().optional(),
  description: z.string().optional(),
  ogImage: z.string().optional(),
});

export default function SeoManagerPage() {
  const { data: settings, isLoading } = useSeoSettings();
  const createMutation = useCreateSeoSetting();
  const updateMutation = useUpdateSeoSetting();
  const deleteMutation = useDeleteSeoSetting();
  const [editing, setEditing] = useState<SeoSetting | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof seoSchema>>({
    resolver: zodResolver(seoSchema),
    defaultValues: { pagePath: "", title: "", description: "", ogImage: "" },
  });

  const openCreate = () => {
    setEditing(null);
    reset({ pagePath: "", title: "", description: "", ogImage: "" });
    setDialogOpen(true);
  };

  const openEdit = (setting: SeoSetting) => {
    setEditing(setting);
    reset({
      pagePath: setting.pagePath,
      title: setting.title ?? "",
      description: setting.description ?? "",
      ogImage: setting.ogImage ?? "",
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: z.infer<typeof seoSchema>) => {
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing._id, input: values });
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

  const onDelete = async (id: string, path: string) => {
    if (!confirm(`Delete SEO entry for "${path}"?`)) return;
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
        title="SEO Manager"
        description="Override the meta title, description and OG image for any page path. The homepage checks this first."
        actions={
          <Button onClick={openCreate}>
            <Plus /> Add SEO Entry
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
                  <TableHead>Path</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No SEO overrides yet — pages fall back to their default metadata.
                    </TableCell>
                  </TableRow>
                )}
                {settings?.map((setting) => (
                  <TableRow key={setting._id}>
                    <TableCell className="font-medium">{setting.pagePath}</TableCell>
                    <TableCell className="max-w-xs truncate">{setting.title ?? "—"}</TableCell>
                    <TableCell className="max-w-sm truncate text-muted-foreground">{setting.description ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(setting)}>
                        <Pencil />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => onDelete(setting._id, setting.pagePath)}>
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
            <div className="space-y-1.5">
              <Label>Page Path</Label>
              <Input {...register("pagePath")} placeholder="/ or /about" disabled={!!editing} />
              {errors.pagePath && <p className="text-xs text-destructive">{errors.pagePath.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Meta Title</Label>
              <Input {...register("title")} />
            </div>
            <div className="space-y-1.5">
              <Label>Meta Description</Label>
              <Textarea rows={3} {...register("description")} />
            </div>
            <div className="space-y-1.5">
              <Label>OG Image</Label>
              <SingleImageUpload value={watch("ogImage") ?? ""} onChange={(url) => setValue("ogImage", url)} />
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
