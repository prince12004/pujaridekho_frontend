import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MediaCard, MediaCardBody, MediaCardFooter, MediaCardImage } from "@/components/shared/media-card";
import { images } from "@/lib/images";
import type { Pooja } from "@/features/home/types";
import type { ImageKey } from "@/lib/images";

function resolveImage(src: string) {
  return (src in images ? images[src as ImageKey] : src) || images.bowlWoodenTable;
}

export function PoojaCard({
  pooja,
  hrefBase = "/poojas",
}: {
  pooja: Pooja | { slug: string; name: string; duration?: string; location?: string; price: number; marketPrice?: number; image: string; tag?: string };
  hrefBase?: string;
}) {
  return (
    <MediaCard>
      <MediaCardImage
        src={resolveImage(pooja.image)}
        alt={pooja.name}
        height="h-60"
        overlay
        badge={
          pooja.tag ? (
            <Badge className="bg-brand-purple-deep/70 font-ui text-[11px] font-bold text-brand-gold-soft">
              {pooja.tag}
            </Badge>
          ) : undefined
        }
      />
      <MediaCardBody>
        <h3 className="font-heading text-lg leading-snug">{pooja.name}</h3>
        {(pooja.duration || pooja.location) && (
          <div className="flex flex-wrap gap-3 text-xs font-semibold text-muted-foreground">
            {pooja.duration && (
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-primary" /> {pooja.duration}
              </span>
            )}
            {pooja.location && (
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-primary" /> {pooja.location}
              </span>
            )}
          </div>
        )}
        <MediaCardFooter>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-lg text-secondary">₹{pooja.price.toLocaleString("en-IN")}</span>
              {pooja.marketPrice ? (
                <span className="text-xs text-muted-foreground line-through">
                  ₹{pooja.marketPrice.toLocaleString("en-IN")}
                </span>
              ) : null}
            </div>
            <div className="text-[11px] font-semibold text-muted-foreground">Fixed price · Samagri optional</div>
          </div>
          <Button size="sm" className="main_books font-ui font-bold" asChild>
            <Link href={`${hrefBase}/${pooja.slug}`}>Book Now</Link>
          </Button>
        </MediaCardFooter>
      </MediaCardBody>
    </MediaCard>
  );
}
