"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProductCategories } from "@/features/admin/api/use-product-categories";
import { Product, useCreateProduct, useUpdateProduct } from "@/features/admin/api/use-products";
import { MultiImageUpload } from "@/features/admin/components/multi-image-upload";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  category: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  sellingPrice: z.coerce.number().min(0, "Required"),
  marketPrice: z.coerce.number().optional(),
  stockQuantity: z.coerce.number().optional(),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
  status: z.enum(["draft", "Published", "archived"]),
});

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const { data: categories } = useProductCategories();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof productFormSchema>, unknown, z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      category: typeof product?.category === "object" ? product.category._id : product?.category ?? "",
      shortDescription: product?.shortDescription ?? "",
      description: product?.description ?? "",
      images: product?.images ?? [],
      sellingPrice: product?.sellingPrice ?? 0,
      marketPrice: product?.marketPrice,
      stockQuantity: product?.stockQuantity ?? 0,
      inStock: product?.inStock ?? true,
      featured: product?.featured ?? false,
      status: product?.status ?? "draft",
    },
  });

  const onSubmit = async (values: z.infer<typeof productFormSchema>) => {
    try {
      const payload = {
        ...values,
        category: values.category || undefined,
        images: values.images ?? [],
      };
      if (product) {
        await updateMutation.mutateAsync({ id: product._id, input: payload });
        toast.success("Product updated");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Product created");
        router.push("/admin/products");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input
              {...register("name", {
                onChange: (e) => {
                  if (!product) setValue("slug", slugify(e.target.value));
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
            <Label>Selling Price (₹)</Label>
            <Input type="number" {...register("sellingPrice")} />
            {errors.sellingPrice && <p className="text-xs text-destructive">{errors.sellingPrice.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Market Price (₹, optional strike-through)</Label>
            <Input type="number" {...register("marketPrice")} />
          </div>
          <div className="space-y-1.5">
            <Label>Stock quantity</Label>
            <Input type="number" {...register("stockQuantity")} />
          </div>
          <div className="flex items-center gap-4 pt-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("inStock")} /> In stock
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("featured")} /> Featured
            </label>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Product Images</Label>
            <MultiImageUpload value={watch("images") ?? []} onChange={(urls) => setValue("images", urls)} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Short Description</Label>
            <Textarea rows={2} {...register("shortDescription")} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Description</Label>
            <Textarea rows={5} {...register("description")} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {product ? "Save changes" : "Create product"}
        </Button>
      </div>
    </form>
  );
}
