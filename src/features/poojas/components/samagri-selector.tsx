"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, ShoppingBasket, X } from "lucide-react";
import { usePoojaBookingSelection } from "@/features/poojas/components/pooja-booking-context";
import { cn } from "@/lib/utils";

export interface SamagriItem {
  name: string;
  description?: string;
  price: number;
  includedByDefault?: boolean;
}

export function SamagriSelector({ basePrice, samagri }: { basePrice: number; samagri: SamagriItem[] }) {
  const { setSelectedSamagri } = usePoojaBookingSelection();
  const [samagriIncluded, setSamagriIncluded] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(samagri.filter((item) => item.includedByDefault).map((item) => item.name)),
  );

  const selectedItems = useMemo(
    () => (samagriIncluded ? samagri.filter((item) => selected.has(item.name)) : []),
    [samagri, selected, samagriIncluded],
  );
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
    return (
      <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
        Samagri details for this pooja will be shared by your pandit ji.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <button
        type="button"
        onClick={() => setSamagriIncluded((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
      >
        <span className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
              samagriIncluded ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
            )}
          >
            <ShoppingBasket size={19} />
          </span>
          <span>
            <span className="block text-sm font-bold text-foreground">Samagri Included</span>
            <span className="block text-xs text-muted-foreground">
              {samagriIncluded ? "Selected samagri will be added to your booking" : "Not included by default — tap to add ritual items"}
            </span>
          </span>
        </span>
        <span
          role="switch"
          aria-checked={samagriIncluded}
          className={cn(
            "relative h-6 w-11 shrink-0 rounded-full transition-colors",
            samagriIncluded ? "bg-primary" : "bg-muted-foreground/30",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
              samagriIncluded ? "translate-x-[22px]" : "translate-x-0.5",
            )}
          />
        </span>
      </button>

      {samagriIncluded && (
        <div className="border-t border-border p-4 pt-3.5">
          <p className="mb-4 text-sm text-muted-foreground">
            Select the items you&apos;d like PujariDekho to arrange, and see the total update live.
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
      )}
    </div>
  );
}
