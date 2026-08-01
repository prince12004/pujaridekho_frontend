"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, ShoppingBasket } from "lucide-react";
import { usePoojaBookingSelection } from "@/features/poojas/components/pooja-booking-context";
import { cn } from "@/lib/utils";

export interface SamagriIncludedItem {
  itemName: string;
  quantity?: string;
  unit?: string;
  estimatedPrice: number;
  mrp?: number;
}

export function SamagriSelector({
  basePrice,
  includedItems,
  estimatedSamagriMrp,
}: {
  basePrice: number;
  includedItems: SamagriIncludedItem[];
  estimatedSamagriMrp?: number;
}) {
  const { setSelectedSamagri } = usePoojaBookingSelection();
  const [expanded, setExpanded] = useState(false);
  const [checkedNames, setCheckedNames] = useState<Set<string>>(new Set());

  const checkedItems = useMemo(() => includedItems.filter((item) => checkedNames.has(item.itemName)), [includedItems, checkedNames]);
  const samagriTotal = useMemo(() => checkedItems.reduce((sum, item) => sum + item.estimatedPrice, 0), [checkedItems]);
  const fullTotal = useMemo(() => includedItems.reduce((sum, item) => sum + item.estimatedPrice, 0), [includedItems]);

  useEffect(() => {
    setSelectedSamagri(checkedItems.map((item) => ({ name: item.itemName, price: item.estimatedPrice })));
  }, [checkedItems, setSelectedSamagri]);

  const toggleExpanded = () => {
    if (expanded) {
      setExpanded(false);
      setCheckedNames(new Set());
    } else {
      setExpanded(true);
      setCheckedNames(new Set(includedItems.map((item) => item.itemName)));
    }
  };

  const toggleItem = (name: string) => {
    setCheckedNames((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  if (includedItems.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
        Samagri details for this pooja will be shared by your pandit ji.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <button type="button" onClick={toggleExpanded} className="flex w-full items-center justify-between gap-3 p-4 text-left">
        <span className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
              expanded ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
            )}
          >
            <ShoppingBasket size={19} />
          </span>
          <span>
            <span className="block text-sm font-bold text-foreground">Include Samagri</span>
            <span className="block text-xs text-muted-foreground">
              {expanded
                ? `${checkedItems.length} of ${includedItems.length} items selected — ₹${samagriTotal.toLocaleString("en-IN")}`
                : "Not included by default — tap to add complete samagri"}
            </span>
          </span>
        </span>
        <span
          role="switch"
          aria-checked={expanded}
          className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", expanded ? "bg-primary" : "bg-muted-foreground/30")}
        >
          <span
            className={cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
              expanded ? "translate-x-[22px]" : "translate-x-0.5",
            )}
          />
        </span>
      </button>

      {expanded && (
        <div className="border-t border-border p-4 pt-3.5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">Untick anything you already have — the price updates automatically.</p>
            {checkedItems.length < includedItems.length ? (
              <button
                type="button"
                onClick={() => setCheckedNames(new Set(includedItems.map((i) => i.itemName)))}
                className="shrink-0 text-xs font-semibold text-primary underline-offset-2 hover:underline"
              >
                Select all
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCheckedNames(new Set())}
                className="shrink-0 text-xs font-semibold text-primary underline-offset-2 hover:underline"
              >
                Deselect all
              </button>
            )}
          </div>
          <ul className="samagiri_selct grid grid-cols-1 gap-2 sm:grid-cols-2">
            {includedItems.map((item) => {
              const checked = checkedNames.has(item.itemName);
              return (
                <li key={item.itemName}>
                  <button
                    type="button"
                    onClick={() => toggleItem(item.itemName)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                      checked ? "text-foreground" : "text-muted-foreground/60",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {checked ? (
                        <CheckCircle2 size={15} className="shrink-0 text-primary" />
                      ) : (
                        <Circle size={15} className="shrink-0 text-muted-foreground/40" />
                      )}
                      <span className={cn(!checked && "line-through decoration-muted-foreground/40")}>
                        {item.itemName}
                        {item.quantity ? ` — ${item.quantity}${item.unit ?? ""}` : ""}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-baseline gap-1.5">
                      {item.mrp && item.mrp > item.estimatedPrice ? (
                        <span className="text-[10px] text-muted-foreground/60 line-through">
                          ₹{item.mrp.toLocaleString("en-IN")}
                        </span>
                      ) : null}
                      <span className={cn("text-xs font-semibold", checked ? "text-secondary" : "text-muted-foreground/50")}>
                        ₹{item.estimatedPrice.toLocaleString("en-IN")}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/50 p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Price without samagri</p>
              <p className="font-heading text-xl text-secondary">₹{basePrice.toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Price with {checkedItems.length < includedItems.length ? "selected" : "full"} samagri
              </p>
              {estimatedSamagriMrp &&
              checkedItems.length === includedItems.length &&
              estimatedSamagriMrp > fullTotal ? (
                <span className="block text-xs text-muted-foreground line-through">
                  ₹{(basePrice + estimatedSamagriMrp).toLocaleString("en-IN")}
                </span>
              ) : null}
              <p className="font-heading text-xl text-primary">₹{(basePrice + samagriTotal).toLocaleString("en-IN")}</p>
            </div>
          </div>
          {checkedItems.length < includedItems.length && checkedItems.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">Full kit price would be ₹{(basePrice + fullTotal).toLocaleString("en-IN")}.</p>
          )}
        </div>
      )}
    </div>
  );
}
