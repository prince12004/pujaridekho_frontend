"use client";

import { SingleImageUpload } from "@/features/admin/components/single-image-upload";

export function ImageUploadInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  return <SingleImageUpload value={value} onChange={onChange} />;
}
