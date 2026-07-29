"use client";

import { AdminPageHeader } from "@/features/admin/components/page-header";
import { BlogForm } from "@/features/admin/components/blog-form";

export default function NewBlogPage() {
  return (
    <div>
      <AdminPageHeader title="Add Blog Post" description="Write a new blog article." />
      <BlogForm />
    </div>
  );
}
