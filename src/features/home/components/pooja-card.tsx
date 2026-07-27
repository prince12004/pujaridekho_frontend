import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MediaCard, MediaCardBody, MediaCardFooter, MediaCardImage } from "@/components/shared/media-card";
import { images } from "@/lib/images";
import type { Pooja } from "@/features/home/types";

export function PoojaCard({ pooja }: { pooja: Pooja }) {
  return (
    <MediaCard>
      <MediaCardImage
        src={images[pooja.image]}
        alt={pooja.name}
        height="h-40"
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
        <div className="flex flex-wrap gap-3 text-xs font-semibold text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock size={13} className="text-primary" /> {pooja.duration}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={13} className="text-primary" /> {pooja.location}
          </span>
        </div>
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
            <div className="text-[11px] font-semibold text-muted-foreground">Fixed · Samagri included</div>
          </div>
          <Button size="sm" className="main_books font-ui font-bold" asChild>
            <Link href={`/poojas/${pooja.slug}`}>Book Now</Link>
          </Button>
        </MediaCardFooter>
      </MediaCardBody>
    </MediaCard>
  );
}
