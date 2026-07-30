"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/shared/date-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Festival, useCreateFestival, useUpdateFestival } from "@/features/admin/api/use-festivals";
import { ImageUploadInput } from "@/features/admin/components/image-upload-input";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const festivalFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  dateLabel: z.string().optional(),
  festivalDate: z.string().optional(),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  featuredImage: z.string().optional(),
  gallery: z.array(z.object({ url: z.string().min(1, "Required") })),
  startingPrice: z.coerce.number().min(0, "Required"),
  marketPrice: z.coerce.number().optional(),
  status: z.enum(["draft", "Published", "archived"]),
  featured: z.boolean().optional(),
});

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function FestivalForm({ festival }: { festival?: Festival }) {
  const router = useRouter();
  const createMutation = useCreateFestival();
  const updateMutation = useUpdateFestival();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof festivalFormSchema>, unknown, z.infer<typeof festivalFormSchema>>({
    resolver: zodResolver(festivalFormSchema),
    defaultValues: {
      name: festival?.name ?? "",
      slug: festival?.slug ?? "",
      dateLabel: festival?.dateLabel ?? "",
      festivalDate: festival?.festivalDate ? festival.festivalDate.slice(0, 10) : "",
      shortDescription: festival?.shortDescription ?? "",
      fullDescription: festival?.fullDescription ?? "",
      featuredImage: festival?.featuredImage ?? "",
      gallery: (festival?.gallery ?? []).map((url) => ({ url })),
      startingPrice: festival?.startingPrice ?? 0,
      marketPrice: festival?.marketPrice,
      status: festival?.status ?? "draft",
      featured: festival?.featured ?? false,
    },
  });

  const galleryArray = useFieldArray({ control, name: "gallery" });

  const onSubmit = async (values: z.infer<typeof festivalFormSchema>) => {
    try {
      const payload = { ...values, gallery: values.gallery.map((g) => g.url).filter(Boolean) };
      if (festival) {
        await updateMutation.mutateAsync({ id: festival._id, input: payload });
        toast.success("Festival updated");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Festival created");
        router.push("/admin/festivals");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Festival details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input
              {...register("name", {
                onChange: (e) => {
                  if (!festival) setValue("slug", slugify(e.target.value));
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
            <Label>Date label (e.g. &quot;Nov 2026&quot;)</Label>
            <Input {...register("dateLabel")} placeholder="Nov 2026" />
          </div>
          <div className="space-y-1.5">
            <Label>Festival date (optional)</Label>
            <DatePicker value={watch("festivalDate") ?? ""} onChange={(v) => setValue("festivalDate", v)} placeholder="Choose a date" />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <select {...register("status")} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none">
              <option value="draft">Draft</option>
              <option value="Published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Starting Price (₹)</Label>
            <Input type="number" {...register("startingPrice")} />
            {errors.startingPrice && <p className="text-xs text-destructive">{errors.startingPrice.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Market Price (₹, optional)</Label>
            <Input type="number" {...register("marketPrice")} />
          </div>
          <div className="space-y-1.5">
            <Label>Featured Image</Label>
            <ImageUploadInput value={watch("featuredImage") ?? ""} onChange={(v) => setValue("featuredImage", v)} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <div className="flex items-center justify-between">
              <Label>Gallery Images</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => galleryArray.append({ url: "" })}>
                <Plus /> Add image
              </Button>
            </div>
            {galleryArray.fields.length === 0 && <p className="text-sm text-muted-foreground">No gallery images added yet.</p>}
            {galleryArray.fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <div className="flex-1">
                  <ImageUploadInput
                    value={watch(`gallery.${index}.url`) ?? ""}
                    onChange={(v) => setValue(`gallery.${index}.url`, v)}
                  />
                </div>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => galleryArray.remove(index)}>
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("featured")} /> Featured on homepage
            </label>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Short Description</Label>
            <Textarea rows={2} {...register("shortDescription")} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Full Description</Label>
            <Textarea rows={5} {...register("fullDescription")} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {festival ? "Save changes" : "Create festival"}
        </Button>
      </div>
    </form>
  );
}
