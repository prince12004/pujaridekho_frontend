import Image from "next/image";
import { images } from "@/lib/images";
import type { ImageKey } from "@/lib/images";

export function PoojaGallery({ images: gallery, alt }: { images: ImageKey[]; alt: string }) {
  if (gallery.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="relative col-span-2 row-span-2 h-full min-h-[220px] overflow-hidden rounded-2xl">
        <Image src={images[gallery[0]]} alt={alt} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 90vw" />
      </div>
      {gallery.slice(1, 3).map((key, i) => (
        <div key={key + i} className="relative h-[104px] overflow-hidden rounded-2xl sm:h-[128px]">
          <Image src={images[key]} alt={`${alt} detail ${i + 1}`} fill className="object-cover" sizes="25vw" />
        </div>
      ))}
    </div>
  );
}
