"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImageFile, validateImageFile } from "@/features/admin/lib/upload-image";

export function SingleImageUpload({
  value,
  onChange,
  helperText = "PNG, JPG, WEBP or GIF up to 5MB",
  className,
}: {
  value?: string;
  onChange: (url: string) => void;
  helperText?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    const error = validateImageFile(file);
    if (error) {
      toast.error(error);
      return;
    }
    setIsUploading(true);
    setProgress(0);
    try {
      const url = await uploadImageFile(file, setProgress);
      onChange(url);
      toast.success("Image uploaded");
    } catch {
      toast.error("Could not upload image");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {value ? (
        <div className="relative w-full max-w-xs overflow-hidden rounded-xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="aspect-video w-full object-cover" />
          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 text-white">
              <Loader2 className="size-5 animate-spin" />
              <span className="text-xs font-semibold">{progress}%</span>
            </div>
          )}
          {!isUploading && (
            <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1.5 bg-gradient-to-t from-black/60 to-transparent p-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex size-7 items-center justify-center rounded-full bg-white/90 text-secondary hover:bg-white"
                title="Replace image"
              >
                <Pencil className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="flex size-7 items-center justify-center rounded-full bg-white/90 text-destructive hover:bg-white"
                title="Remove image"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          disabled={isUploading}
          className={cn(
            "flex w-full max-w-xs flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-input bg-muted/30 px-4 py-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/50",
            isDragging && "border-primary bg-primary/5",
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="size-6 animate-spin text-primary" />
              <span className="text-xs font-semibold text-muted-foreground">Uploading... {progress}%</span>
            </>
          ) : (
            <>
              <ImagePlus className="size-6 text-muted-foreground" />
              <span className="text-sm font-semibold text-secondary">Click to upload or drag and drop</span>
              <span className="text-xs text-muted-foreground">{helperText}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
