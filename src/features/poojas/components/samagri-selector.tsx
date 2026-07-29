"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, X } from "lucide-react";
import { usePoojaBookingSelection } from "@/features/poojas/components/pooja-booking-context";

export interface SamagriItem {
  name: string;
  description?: string;
  price: number;
  includedByDefault?: boolean;
}

export function SamagriSelector({ basePrice, samagri }: { basePrice: number; samagri: SamagriItem[] }) {
  const { setSelectedSamagri } = usePoojaBookingSelection();
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(samagri.filter((item) => item.includedByDefault).map((item) => item.name)),
  );

  const selectedItems = useMemo(() => samagri.filter((item) => selected.has(item.name)), [samagri, selected]);
  const samagriTotal = useMemo(() => selectedItems.reduce((sum, item) => sum + item.price, 0), [selectedItems]);

  useEffect(() => {
    setSelectedSamagri(selectedItems.map((item) => ({ name: item.name, price: item.price })));
  }, [selectedItems, setSelectedSamagri]);

  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  if (samagri.length === 0) {
    return <p className="text-sm text-muted-foreground">Samagri details for this pooja will be shared by your pandit ji.</p>;
  }

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Samagri is <span className="font-semibold text-foreground">not included</span> in the base price by default —
        select the items you&apos;d like PujariDekho to arrange, and see the total update live.
      </p>
      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {samagri.map((item) => {
          const isSelected = selected.has(item.name);
          return (
            <li key={item.name}>
              <button
                type="button"
                onClick={() => toggle(item.name)}
                className={`flex w-full items-start justify-between gap-3 rounded-xl border p-3 text-left transition-colors ${
                  isSelected ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted"
                }`}
              >
                <span className="flex items-start gap-2.5">
                  {isSelected ? (
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                  ) : (
                    <Circle size={18} className="mt-0.5 shrink-0 text-muted-foreground" />
                  )}
                  <span>
                    <span className="block text-sm font-medium text-foreground">{item.name}</span>
                    {item.description && <span className="block text-xs text-muted-foreground">{item.description}</span>}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold text-secondary">₹{item.price.toLocaleString("en-IN")}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {selectedItems.length > 0 && (
        <div className="mt-4 rounded-xl border border-primary/25 bg-primary/5 p-3">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Selected samagri</p>
          <ul className="flex flex-col gap-1.5">
            {selectedItems.map((item) => (
              <li key={item.name} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{item.name}</span>
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-secondary">₹{item.price.toLocaleString("en-IN")}</span>
                  <button
                    type="button"
                    onClick={() => toggle(item.name)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Remove ${item.name}`}
                  >
                    <X size={14} />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/50 p-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Price without samagri</p>
          <p className="font-heading text-xl text-secondary">₹{basePrice.toLocaleString("en-IN")}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Price with selected samagri ({selectedItems.length} item{selectedItems.length === 1 ? "" : "s"})
          </p>
          <p className="font-heading text-xl text-primary">₹{(basePrice + samagriTotal).toLocaleString("en-IN")}</p>
        </div>
      </div>
    </div>
  );
}
