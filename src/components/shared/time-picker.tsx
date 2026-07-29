"use client";

import { useMemo, useRef, useState } from "react";
import { Clock3 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function formatDisplay(value: string): string {
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return value;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function buildSlots(stepMinutes: number, min?: string, max?: string) {
  const slots: string[] = [];
  const minMinutes = min ? Number(min.split(":")[0]) * 60 + Number(min.split(":")[1]) : 0;
  const maxMinutes = max ? Number(max.split(":")[0]) * 60 + Number(max.split(":")[1]) : 24 * 60 - stepMinutes;
  for (let mins = minMinutes; mins <= maxMinutes; mins += stepMinutes) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
  return slots;
}

export interface TimePickerProps {
  /** 24-hour "HH:mm" — same convention as a native <input type="time">. */
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  stepMinutes?: number;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function TimePicker({
  value,
  onChange,
  min,
  max,
  stepMinutes = 30,
  placeholder = "Select time",
  className,
  id,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const slots = useMemo(() => buildSlots(stepMinutes, min, max), [stepMinutes, min, max]);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          requestAnimationFrame(() => {
            const activeEl = listRef.current?.querySelector('[data-active="true"]');
            activeEl?.scrollIntoView({ block: "center" });
          });
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 py-2.5 text-left text-sm font-medium text-foreground shadow-xs outline-none transition-shadow focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/50",
            className,
          )}
        >
          <span className={cn(!value && "text-muted-foreground")}>{value ? formatDisplay(value) : placeholder}</span>
          <Clock3 size={16} className="shrink-0 text-primary" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-1.5">
        <div ref={listRef} className="max-h-64 overflow-y-auto">
          {slots.map((slot) => {
            const active = slot === value;
            return (
              <button
                key={slot}
                type="button"
                data-active={active}
                onClick={() => {
                  onChange(slot);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center rounded-md px-2.5 py-1.5 text-left text-sm transition-colors",
                  active ? "bg-primary font-bold text-primary-foreground" : "hover:bg-muted",
                )}
              >
                {formatDisplay(slot)}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
