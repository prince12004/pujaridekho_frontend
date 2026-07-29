"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toDateOnly(value: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplay(date: Date): string {
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function DatePicker({ value, onChange, min, max, placeholder = "Select date", className, id }: DatePickerProps) {
  const selected = toDateOnly(value);
  const minDate = min ? toDateOnly(min) : null;
  const maxDate = max ? toDateOnly(max) : null;

  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => selected ?? minDate ?? new Date());

  const days = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [viewMonth]);

  const isDisabled = (date: Date) => {
    if (minDate && startOfDay(date) < startOfDay(minDate)) return true;
    if (maxDate && startOfDay(date) > startOfDay(maxDate)) return true;
    return false;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 py-2.5 text-left text-sm font-medium text-foreground shadow-xs outline-none transition-shadow focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/50",
            className,
          )}
        >
          <span className={cn(!selected && "text-muted-foreground")}>
            {selected ? formatDisplay(selected) : placeholder}
          </span>
          <CalendarDays size={16} className="shrink-0 text-primary" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
            className="flex size-7 items-center justify-center rounded-md hover:bg-muted"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-bold">
            {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
          </span>
          <button
            type="button"
            onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
            className="flex size-7 items-center justify-center rounded-md hover:bg-muted"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((day) => (
            <span key={day} className="text-[11px] font-bold uppercase text-muted-foreground">
              {day}
            </span>
          ))}
          {days.map((date, i) => {
            if (!date) return <span key={`empty-${i}`} />;
            const disabled = isDisabled(date);
            const active = selected ? isSameDay(date, selected) : false;
            const today = isSameDay(date, new Date());
            return (
              <button
                key={date.toISOString()}
                type="button"
                disabled={disabled}
                onClick={() => {
                  onChange(formatValue(date));
                  setOpen(false);
                }}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm transition-colors",
                  disabled && "cursor-not-allowed text-muted-foreground/40",
                  !disabled && !active && "hover:bg-muted",
                  !disabled && today && !active && "font-bold text-primary",
                  active && "bg-primary font-bold text-primary-foreground",
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
