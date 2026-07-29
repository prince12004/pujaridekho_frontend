"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Copy, Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useDeleteMedia, useMedia, useUploadMedia } from "@/features/admin/api/use-media";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibraryPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMedia(page);
  const uploadMutation = useUploadMedia();
  const deleteMutation = useDeleteMedia();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadMutation.mutateAsync(file);
      toast.success("File uploaded");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("File deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Media Library"
        description="Upload and manage images used across poojas, festivals, products and blogs."
        actions={
          <>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <Button onClick={() => inputRef.current?.click()} disabled={uploadMutation.isPending}>
              {uploadMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Upload />}
              Upload Image
            </Button>
          </>
        }
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : data && data.items.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {data.items.map((item) => (
              <Card key={item._id} className="overflow-hidden p-0">
                <div className="relative aspect-square bg-muted">
                  <Image src={item.url} alt={item.originalName} fill className="object-cover" unoptimized />
                </div>
                <CardContent className="space-y-2 p-2.5">
                  <p className="truncate text-xs font-medium" title={item.originalName}>
                    {item.originalName}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{formatSize(item.size)}</p>
                  <div className="flex gap-1">
                    <Button variant="outline" size="icon-sm" className="flex-1" onClick={() => handleCopy(item.url)}>
                      <Copy className="size-3.5" />
                    </Button>
                    <Button variant="outline" size="icon-sm" className="flex-1" onClick={() => handleDelete(item._id)}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {data.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {data.page} of {data.totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card py-20 text-center">
          <Upload className="size-8 text-muted-foreground" />
          <p className="font-medium text-foreground">No media uploaded yet</p>
          <p className="max-w-md text-sm text-muted-foreground">
            Upload an image to get a real, permanent URL you can paste into any pooja, festival, product or blog form.
          </p>
        </div>
      )}
    </div>
  );
}
