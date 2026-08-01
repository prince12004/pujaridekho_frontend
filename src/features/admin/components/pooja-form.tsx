"use client";

import { useEffect } from "react";
import Link from "next/link";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePoojaCategories } from "@/features/admin/api/use-pooja-categories";
import { Pooja, useCreatePooja, useUpdatePooja } from "@/features/admin/api/use-poojas";
import { useSamagriTemplates } from "@/features/admin/api/use-samagri-templates";
import { ImageUploadInput } from "@/features/admin/components/image-upload-input";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const packageSchema = z.object({
  name: z.string().min(1, "Required"),
  price: z.coerce.number().min(0),
  salePrice: z.coerce.number().optional(),
  duration: z.string().optional(),
  samagriIncluded: z.boolean().optional(),
  dakshinaIncluded: z.boolean().optional(),
});

const poojaFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  category: z.string().optional(),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  featuredImage: z.string().optional(),
  gallery: z.array(z.object({ url: z.string().min(1, "Required") })),
  startingPrice: z.coerce.number().min(0, "Required"),
  marketPrice: z.coerce.number().optional(),
  status: z.enum(["draft", "Published", "archived"]),
  featured: z.boolean().optional(),
  popular: z.boolean().optional(),
  sortOrder: z.coerce.number().optional(),
  packages: z.array(packageSchema),
});

export type PoojaFormValues = z.infer<typeof poojaFormSchema>;

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function PoojaForm({ pooja }: { pooja?: Pooja }) {
  const router = useRouter();
  const { data: categories } = usePoojaCategories();
  const { data: samagriTemplates } = useSamagriTemplates();
  const createMutation = useCreatePooja();
  const updateMutation = useUpdatePooja();
  const linkedTemplate = samagriTemplates?.items.find((t) => (typeof t.pooja === "object" ? t.pooja._id : t.pooja) === pooja?._id);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof poojaFormSchema>, unknown, PoojaFormValues>({
    resolver: zodResolver(poojaFormSchema),
    defaultValues: {
      name: pooja?.name ?? "",
      slug: pooja?.slug ?? "",
      category: typeof pooja?.category === "object" ? pooja.category._id : pooja?.category ?? "",
      shortDescription: pooja?.shortDescription ?? "",
      fullDescription: pooja?.fullDescription ?? "",
      featuredImage: pooja?.featuredImage ?? "",
      gallery: (pooja?.gallery ?? []).map((url) => ({ url })),
      startingPrice: pooja?.startingPrice ?? 0,
      marketPrice: pooja?.marketPrice ?? undefined,
      status: pooja?.status ?? "draft",
      featured: pooja?.featured ?? false,
      popular: pooja?.popular ?? false,
      sortOrder: pooja?.sortOrder ?? 0,
      packages: pooja?.packages ?? [],
    },
  });

  const packagesArray = useFieldArray({ control, name: "packages" });
  const galleryArray = useFieldArray({ control, name: "gallery" });

  useEffect(() => {
    if (pooja) {
      setValue("category", typeof pooja.category === "object" ? pooja.category._id : (pooja.category ?? ""));
    }
  }, [pooja, setValue]);

  const onSubmit = async (values: PoojaFormValues) => {
    try {
      const payload = {
        ...values,
        category: values.category || undefined,
        gallery: values.gallery.map((g) => g.url).filter(Boolean),
      };
      if (pooja) {
        await updateMutation.mutateAsync({ id: pooja._id, input: payload });
        toast.success("Pooja updated");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Pooja created");
        router.push("/admin/poojas");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input
              {...register("name", {
                onChange: (e) => {
                  if (!pooja) setValue("slug", slugify(e.target.value));
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
            <Label>Category</Label>
            <select {...register("category")} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none">
              <option value="">No category</option>
              {categories?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
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
            <Label>Display Order</Label>
            <Input type="number" {...register("sortOrder")} />
            <p className="text-xs text-muted-foreground">Lower numbers show first on the Poojas page and homepage. Same order works across all pages.</p>
          </div>
          <div className="space-y-1.5">
            <Label>Starting Price (₹)</Label>
            <Input type="number" {...register("startingPrice")} />
            {errors.startingPrice && <p className="text-xs text-destructive">{errors.startingPrice.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Market Price (₹, optional strike-through)</Label>
            <Input type="number" {...register("marketPrice")} />
          </div>
          <div className="space-y-1.5">
            <Label>Featured Image</Label>
            <ImageUploadInput value={watch("featuredImage") ?? ""} onChange={(v) => setValue("featuredImage", v)} />
            <p className="text-xs text-muted-foreground">Shown as the big hero image at the top of the pooja page.</p>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <div className="flex items-center justify-between">
              <Label>Gallery Images</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => galleryArray.append({ url: "" })}>
                <Plus /> Add image
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Extra photos shown below the hero on the pooja detail page — add as many as you like.
            </p>
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
          <div className="flex items-center gap-4 pt-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("featured")} /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("popular")} /> Popular
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

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Packages</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => packagesArray.append({ name: "", price: 0, samagriIncluded: false, dakshinaIncluded: false })}
          >
            <Plus /> Add package
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {packagesArray.fields.length === 0 && <p className="text-sm text-muted-foreground">No packages added yet.</p>}
          {packagesArray.fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 gap-3 rounded-lg border border-border p-3 md:grid-cols-5">
              <div className="space-y-1">
                <Label className="text-xs">Package name</Label>
                <Input {...register(`packages.${index}.name`)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Price (₹)</Label>
                <Input type="number" {...register(`packages.${index}.price`)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Sale price (₹)</Label>
                <Input type="number" {...register(`packages.${index}.salePrice`)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Duration</Label>
                <Input {...register(`packages.${index}.duration`)} placeholder="e.g. 2 hours" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <label className="flex items-center gap-1.5 text-xs">
                  <input type="checkbox" {...register(`packages.${index}.samagriIncluded`)} /> Samagri incl.
                </label>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => packagesArray.remove(index)}>
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Samagri Template</CardTitle>
          <p className="text-xs text-muted-foreground">
            The structured ritual-materials list bundled into this pooja&apos;s kit is managed separately.
          </p>
        </CardHeader>
        <CardContent>
          {linkedTemplate ? (
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">{linkedTemplate.samagriTemplateName}</p>
                <p className="text-xs text-muted-foreground">
                  {linkedTemplate.includedItems.length} item(s) · Estimated cost ₹
                  {linkedTemplate.estimatedSamagriCost.toLocaleString("en-IN")}
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" asChild>
                <Link href={`/admin/samagri-templates/${linkedTemplate._id}`}>Manage Template →</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-lg border border-dashed border-border p-3">
              <p className="text-sm text-muted-foreground">No samagri template linked to this pooja yet.</p>
              <Button type="button" variant="outline" size="sm" asChild>
                <Link href="/admin/samagri-templates/new">Create Template →</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {pooja ? "Save changes" : "Create pooja"}
        </Button>
      </div>
    </form>
  );
}
