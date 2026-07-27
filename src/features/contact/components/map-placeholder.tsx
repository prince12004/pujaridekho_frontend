import { Navigation } from "lucide-react";
import { siteConfig } from "@/lib/constants";

export function MapPlaceholder() {
  const query = encodeURIComponent(siteConfig.contact.officeAddress);

  return (
    <div className="relative flex h-64 flex-col items-center justify-center gap-3 overflow-hidden rounded-[1.75rem] border border-border bg-muted/60 text-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg">
        <Navigation size={22} />
      </span>
      <p className="relative max-w-xs text-sm font-semibold text-muted-foreground">
        {siteConfig.contact.officeAddress}
      </p>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${query}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-ui relative text-sm font-bold text-primary hover:underline"
      >
        Get Directions →
      </a>
    </div>
  );
}
