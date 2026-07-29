import { adminApiClient } from "@/lib/admin-api-client";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return "Only JPEG, PNG, WEBP, GIF or SVG images are allowed";
  if (file.size > MAX_SIZE_BYTES) return "Image must be 5MB or smaller";
  return null;
}

export async function uploadImageFile(file: File, onProgress?: (percent: number) => void): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await adminApiClient.post("/cms/media", formData, {
    headers: { "Content-Type": undefined },
    onUploadProgress: (event) => {
      if (onProgress && event.total) onProgress(Math.round((event.loaded / event.total) * 100));
    },
  });
  return res.data.data.url as string;
}
