import { Sparkles } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";

const panchangItems = [
  { label: "Tithi", value: "Shukla Dashami" },
  { label: "Nakshatra", value: "Shravana" },
  { label: "Sunrise", value: "05:42 AM" },
  { label: "Sunset", value: "07:18 PM" },
  { label: "Rahu Kaal", value: "08:56–10:35 AM" },
  { label: "Paksha", value: "Shukla" },
];

export function PanchangCard() {
  return (
    <Reveal className="h-full">
      <div className="flex h-full flex-col rounded-2xl border border-border bg-gradient-to-br from-card to-muted/60 p-7 shadow-sm">
        <div className="mb-5 flex items-baseline justify-between">
          <span className="font-heading text-2xl text-secondary">25 July 2026</span>
          <span className="font-ui text-xs font-bold uppercase tracking-wide text-primary">Today</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {panchangItems.map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-card p-3.5">
              <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                {item.label}
              </div>
              <div className="text-sm font-bold">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-primary/25 bg-primary/8 px-4 py-3 text-sm font-bold text-primary">
          <Sparkles size={16} /> Sawan Somwar — auspicious day for Shiv Puja
        </div>
      </div>
    </Reveal>
  );
}
