"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useBlogs, useDeleteBlog } from "@/features/admin/api/use-blogs";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

export default function BlogsListPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useBlogs({ search: search || undefined });
  const deleteMutation = useDeleteBlog();

  const onDelete = async (id: string, title: string) => {
    if (!confirm(`Delete blog post "${title}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Blog post deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Blogs"
        description="Write and publish blog articles."
        actions={
          <Button asChild>
            <Link href="/admin/blogs/new">
              <Plus /> Add Blog Post
            </Link>
          </Button>
        }
      />

      <div className="mb-4 max-w-sm">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search blog posts..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

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
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No blog posts found.
                    </TableCell>
                  </TableRow>
                )}
                {data?.items.map((blog) => (
                  <TableRow key={blog._id}>
                    <TableCell className="font-medium">{blog.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {typeof blog.category === "object" ? blog.category?.name : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={blog.status === "Published" ? "default" : "outline"}>{blog.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" asChild>
                        <Link href={`/admin/blogs/${blog._id}`}>
                          <Pencil />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => onDelete(blog._id, blog.title)}>
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
    </div>
  );
}
