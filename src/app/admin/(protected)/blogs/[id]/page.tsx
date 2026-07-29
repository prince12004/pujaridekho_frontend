"use client";

import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { BlogForm } from "@/features/admin/components/blog-form";
import { useBlog } from "@/features/admin/api/use-blogs";

export default function EditBlogPage() {
  const params = useParams<{ id: string }>();
  const { data: blog, isLoading } = useBlog(params.id);

  if (isLoading || !blog) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title={`Edit — ${blog.title}`} description="Update blog post content." />
      <BlogForm blog={blog} />
    </div>
  );
}
