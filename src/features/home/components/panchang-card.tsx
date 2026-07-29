"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { DatePicker } from "@/components/shared/date-picker";
import { apiClient } from "@/lib/api-client";

export interface PanchangCardData {
  date: string;
  vara: string;
  tithi: { name: string; paksha: "Shukla" | "Krishna"; number: number };
  nakshatra: { name: string; pada: number };
  sunrise: string | null;
  sunset: string | null;
  rahuKaal: { start: string; end: string } | null;
}

function shiftDate(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function PanchangCard({
  initialPanchang,
  initialDate,
}: {
  initialPanchang: PanchangCardData | null;
  initialDate: string;
}) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [panchang, setPanchang] = useState(initialPanchang);
  const [isLoading, setIsLoading] = useState(false);

  async function loadDate(date: string) {
    setSelectedDate(date);
    setIsLoading(true);
    try {
      const res = await apiClient.get("/panchang", { params: { date } });
      setPanchang(res.data.data);
    } catch {
      setPanchang(null);
    } finally {
      setIsLoading(false);
    }
  }

  const isToday = selectedDate === initialDate;

  return (
    <Reveal className="h-full">
      <div className="flex h-full flex-col rounded-2xl border border-border bg-gradient-to-br from-card to-muted/60 p-7 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => loadDate(shiftDate(selectedDate, -1))}
              className="flex size-8 items-center justify-center rounded-full hover:bg-muted"
              aria-label="Previous day"
            >
              <ChevronLeft size={16} />
            </button>
            <DatePicker value={selectedDate} onChange={loadDate} min={initialDate} className="w-44" />
            <button
              type="button"
              onClick={() => loadDate(shiftDate(selectedDate, 1))}
              className="flex size-8 items-center justify-center rounded-full hover:bg-muted"
              aria-label="Next day"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          {panchang && <span className="font-ui text-xs font-bold uppercase tracking-wide text-primary">{panchang.vara}</span>}
        </div>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center py-10">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : !panchang ? (
          <div className="flex flex-1 items-center justify-center py-10 text-sm text-muted-foreground">
            Panchang is unavailable for this date.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Tithi", value: panchang.tithi.name },
                { label: "Nakshatra", value: panchang.nakshatra.name },
                { label: "Sunrise", value: panchang.sunrise ?? "—" },
                { label: "Sunset", value: panchang.sunset ?? "—" },
                { label: "Rahu Kaal", value: panchang.rahuKaal ? `${panchang.rahuKaal.start}–${panchang.rahuKaal.end}` : "—" },
                { label: "Paksha", value: panchang.tithi.paksha },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-card p-3.5">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{item.label}</div>
                  <div className="text-sm font-bold">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-primary/25 bg-primary/8 px-4 py-3 text-sm font-bold text-primary">
              <Sparkles size={16} /> {panchang.tithi.paksha} Paksha, {panchang.tithi.name}
              {isToday ? " — computed live for today" : ` — ${selectedDate}`}
            </div>
          </>
        )}
      </div>
    </Reveal>
  );
}
