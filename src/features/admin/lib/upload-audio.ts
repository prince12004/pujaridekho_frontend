import { adminApiClient } from "@/lib/admin-api-client";

const MAX_BYTES = 10 * 1024 * 1024;

export function validateAudioFile(file: File): string | null {
  if (!/\.(mp3|m4a)$/i.test(file.name) && !/^audio\/(mpeg|mp3|mp4|x-m4a|m4a|aac)$/.test(file.type)) {
    return "Only MP3 or M4A audio files are allowed";
  }
  if (file.size > MAX_BYTES) return "Audio must be 10 MB or smaller";
  return null;
}

/** Uploads to Cloudinary (via the API); returns the URL and, when Cloudinary reports it, the duration. */
export async function uploadAudioFile(file: File, onProgress?: (percent: number) => void) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await adminApiClient.post("/uploads/audio", formData, {
    headers: { "Content-Type": undefined },
    onUploadProgress: (event) => {
      if (onProgress && event.total) onProgress(Math.round((event.loaded / event.total) * 100));
    },
  });
  return res.data.data as { url: string; durationSec: number | null };
}

/** Reads the duration in the browser — used when the server can't (local-disk uploads). */
export function readAudioDuration(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const audio = document.createElement("audio");
    const url = URL.createObjectURL(file);
    audio.preload = "metadata";
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(audio.duration) ? Math.round(audio.duration) : null);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    audio.src = url;
  });
}
