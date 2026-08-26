"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ShoppingBasket } from "lucide-react";
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
    <div
      className={cn(
        "font-heading overflow-hidden rounded-2xl border-2 shadow-sm transition-colors",
        expanded ? "border-primary" : "border-primary/25 bg-primary/[0.035]",
      )}
    >
      <button
        type="button"
        onClick={toggleExpanded}
        className={cn(
          "flex w-full items-center justify-between gap-3 p-4 text-left transition-colors",
          expanded && "bg-gradient-to-r from-primary to-accent",
        )}
      >
        <span className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
              expanded ? "bg-white/20 text-white" : "bg-primary/12 text-primary",
            )}
          >
            <ShoppingBasket size={19} />
          </span>
          <span>
            <span className="flex items-center gap-2">
              <span className={cn("text-sm font-bold", expanded ? "text-white" : "text-foreground")}>Include Samagri</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  expanded ? "bg-white text-primary" : "border border-primary/30 bg-primary/10 text-primary",
                )}
              >
                {expanded ? "Included" : "Not included"}
              </span>
            </span>
            <span className={cn("block text-xs", expanded ? "text-white/85" : "text-muted-foreground")}>
              {expanded
                ? `${checkedItems.length} of ${includedItems.length} items selected — ₹${samagriTotal.toLocaleString("en-IN")}`
                : "Tap to add complete samagri kit to your order"}
            </span>
          </span>
        </span>
        <span
          role="switch"
          aria-checked={expanded}
          className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", expanded ? "bg-white/30" : "bg-primary/25")}
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
            {includedItems.map((item, index) => {
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
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="w-5 shrink-0 text-right text-xs font-medium text-muted-foreground/50">{index + 1}.</span>
                      <span className={cn("truncate", !checked && "line-through decoration-muted-foreground/40")}>
                        {item.itemName}
                        {item.quantity ? ` — ${item.quantity}${item.unit ?? ""}` : ""}
                      </span>
                      <span
                        className={cn(
                          "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border-2 transition-colors",
                          checked ? "border-primary bg-primary" : "border-muted-foreground/40 bg-transparent",
                        )}
                      >
                        {checked && <Check size={12} strokeWidth={3} className="text-white" />}
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
