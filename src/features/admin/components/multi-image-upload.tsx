"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImageFile, validateImageFile } from "@/features/admin/lib/upload-image";

export function MultiImageUpload({
  value,
  onChange,
  helperText = "PNG, JPG, WEBP or GIF up to 5MB each",
  className,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  helperText?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFiles(files: FileList | File[] | null | undefined) {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      const error = validateImageFile(file);
      if (error) {
        toast.error(`${file.name}: ${error}`);
        return;
      }
    }

    setIsUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of fileArray) {
        uploaded.push(await uploadImageFile(file));
      }
      onChange([...value, ...uploaded]);
      toast.success(uploaded.length > 1 ? `${uploaded.length} images uploaded` : "Image uploaded");
    } catch {
      toast.error("Could not upload one or more images");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {value.map((url, index) => (
          <div key={`${url}-${index}`} className="group relative aspect-square overflow-hidden rounded-xl border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="size-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              title="Remove image"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}

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
            handleFiles(e.dataTransfer.files);
          }}
          disabled={isUploading}
          className={cn(
            "flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-input bg-muted/30 p-3 text-center transition-colors hover:border-primary/50 hover:bg-muted/50",
            isDragging && "border-primary bg-primary/5",
          )}
        >
          {isUploading ? (
            <Loader2 className="size-5 animate-spin text-primary" />
          ) : (
            <>
              <ImagePlus className="size-5 text-muted-foreground" />
              <span className="text-[11px] font-semibold text-secondary">Add Image</span>
            </>
          )}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">{helperText}</p>
    </div>
  );
}
