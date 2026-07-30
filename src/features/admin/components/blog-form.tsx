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
import { useBlogCategories } from "@/features/admin/api/use-blog-categories";
import { Blog, useCreateBlog, useUpdateBlog } from "@/features/admin/api/use-blogs";
import { ImageUploadInput } from "@/features/admin/components/image-upload-input";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  category: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional(),
  author: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(["draft", "Published"]),
});

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function BlogForm({ blog }: { blog?: Blog }) {
  const router = useRouter();
  const { data: categories } = useBlogCategories();
  const createMutation = useCreateBlog();
  const updateMutation = useUpdateBlog();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof blogFormSchema>>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: blog?.title ?? "",
      slug: blog?.slug ?? "",
      category: typeof blog?.category === "object" ? blog.category._id : blog?.category ?? "",
      excerpt: blog?.excerpt ?? "",
      content: blog?.content ?? "",
      coverImage: blog?.coverImage ?? "",
      author: blog?.author ?? "PujariDekho Team",
      tags: blog?.tags?.join(", ") ?? "",
      status: blog?.status ?? "draft",
    },
  });

  const onSubmit = async (values: z.infer<typeof blogFormSchema>) => {
    try {
      const payload = {
        ...values,
        category: values.category || undefined,
        tags: values.tags ? values.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };
      if (blog) {
        await updateMutation.mutateAsync({ id: blog._id, input: payload });
        toast.success("Blog post updated");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Blog post created");
        router.push("/admin/blogs");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Blog post</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5 md:col-span-2">
            <Label>Title</Label>
            <Input
              {...register("title", {
                onChange: (e) => {
                  if (!blog) setValue("slug", slugify(e.target.value));
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
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Author</Label>
            <Input {...register("author")} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Cover Image</Label>
            <ImageUploadInput value={watch("coverImage") ?? ""} onChange={(v) => setValue("coverImage", v)} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Tags (comma separated)</Label>
            <Input {...register("tags")} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Excerpt</Label>
            <Textarea rows={2} {...register("excerpt")} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Content (HTML)</Label>
            <Textarea rows={12} className="font-mono text-xs" {...register("content")} />
            {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {blog ? "Save changes" : "Create blog post"}
        </Button>
      </div>
    </form>
  );
}
