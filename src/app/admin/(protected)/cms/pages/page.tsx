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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { CmsPage, useCreatePage, useDeletePage, usePages, useUpdatePage } from "@/features/admin/api/use-pages";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const pageSchema = z.object({
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  status: z.enum(["draft", "Published"]),
});

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function PagesCmsPage() {
  const { data: pages, isLoading } = usePages();
  const createMutation = useCreatePage();
  const updateMutation = useUpdatePage();
  const deleteMutation = useDeletePage();
  const [editing, setEditing] = useState<CmsPage | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof pageSchema>>({
    resolver: zodResolver(pageSchema),
    defaultValues: { slug: "", title: "", content: "", metaTitle: "", metaDescription: "", status: "draft" },
  });

  const openCreate = () => {
    setEditing(null);
    reset({ slug: "", title: "", content: "", metaTitle: "", metaDescription: "", status: "draft" });
    setDialogOpen(true);
  };

  const openEdit = (page: CmsPage) => {
    setEditing(page);
    reset({
      slug: page.slug,
      title: page.title,
      content: page.content,
      metaTitle: page.metaTitle ?? "",
      metaDescription: page.metaDescription ?? "",
      status: page.status,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: z.infer<typeof pageSchema>) => {
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing._id, input: values });
        toast.success("Page updated");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Page created");
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onDelete = async (id: string, title: string) => {
    if (!confirm(`Delete page "${title}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Page deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Pages CMS"
        description="Create simple standalone content pages (e.g. FAQs, offers) — Published pages are live at /pages/[slug]."
        actions={
          <Button onClick={openCreate}>
            <Plus /> Add Page
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
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No pages yet.
                    </TableCell>
                  </TableRow>
                )}
                {pages?.map((page) => (
                  <TableRow key={page._id}>
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell className="text-muted-foreground">/pages/{page.slug}</TableCell>
                    <TableCell>
                      <Badge variant={page.status === "Published" ? "default" : "outline"}>{page.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(page)}>
                        <Pencil />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => onDelete(page._id, page.title)}>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Page" : "New Page"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  {...register("title", {
                    onChange: (e) => {
                      if (!editing) setValue("slug", slugify(e.target.value));
                    },
                  })}
                />
                {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Slug</Label>
                <Input {...register("slug")} />
                {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Content (HTML)</Label>
              <Textarea rows={8} {...register("content")} placeholder="<p>Page content...</p>" />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Meta Title</Label>
                <Input {...register("metaTitle")} />
              </div>
              <div className="space-y-1.5">
                <Label>Meta Description</Label>
                <Input {...register("metaDescription")} />
              </div>
            </div>
            <select {...register("status")} className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none">
              <option value="draft">Draft</option>
              <option value="Published">Published</option>
            </select>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {editing ? "Save changes" : "Create page"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
