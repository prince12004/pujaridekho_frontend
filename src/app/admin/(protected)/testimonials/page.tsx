"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { SingleImageUpload } from "@/features/admin/components/single-image-upload";
import {
  Testimonial,
  useCreateTestimonial,
  useDeleteTestimonial,
  useTestimonials,
  useUpdateTestimonial,
} from "@/features/admin/api/use-testimonials";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().optional(),
  rating: z.coerce.number().min(1).max(5),
  quote: z.string().min(1, "Quote is required"),
  photo: z.string().optional(),
  featured: z.boolean().optional(),
  status: z.enum(["draft", "Published"]),
});

export default function TestimonialsPage() {
  const { data: testimonials, isLoading } = useTestimonials();
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const deleteMutation = useDeleteTestimonial();
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof testimonialSchema>, unknown, z.infer<typeof testimonialSchema>>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { name: "", location: "", rating: 5, quote: "", photo: "", featured: false, status: "draft" },
  });

  const openCreate = () => {
    setEditing(null);
    reset({ name: "", location: "", rating: 5, quote: "", photo: "", featured: false, status: "draft" });
    setDialogOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    reset({ name: t.name, location: t.location ?? "", rating: t.rating, quote: t.quote, photo: t.photo ?? "", featured: t.featured, status: t.status });
    setDialogOpen(true);
  };

  const onSubmit = async (values: z.infer<typeof testimonialSchema>) => {
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing._id, input: values });
        toast.success("Testimonial updated");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Testimonial created");
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Testimonial deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Testimonials"
        description="Curate testimonials shown on the homepage."
        actions={
          <Button onClick={openCreate}>
            <Plus /> Add Testimonial
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
                  <TableHead>Rating</TableHead>
                  <TableHead>Quote</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No testimonials yet.
                    </TableCell>
                  </TableRow>
                )}
                {testimonials?.map((t) => (
                  <TableRow key={t._id}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <Star className="size-3.5 fill-brand-gold text-brand-gold" /> {t.rating}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-sm truncate text-muted-foreground">{t.quote}</TableCell>
                    <TableCell>
                      <Badge variant={t.status === "Published" ? "default" : "outline"}>{t.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(t)}>
                        <Pencil />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => onDelete(t._id)}>
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
            <DialogTitle>{editing ? "Edit Testimonial" : "New Testimonial"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input {...register("location")} />
            </div>
            <div className="space-y-1.5">
              <Label>Rating (1-5)</Label>
              <Input type="number" min={1} max={5} {...register("rating")} />
            </div>
            <div className="space-y-1.5">
              <Label>Quote</Label>
              <Textarea rows={3} {...register("quote")} />
              {errors.quote && <p className="text-xs text-destructive">{errors.quote.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Photo</Label>
              <SingleImageUpload value={watch("photo") ?? ""} onChange={(url) => setValue("photo", url)} />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register("featured")} /> Featured
              </label>
              <select {...register("status")} className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none">
                <option value="draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {editing ? "Save changes" : "Create testimonial"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
