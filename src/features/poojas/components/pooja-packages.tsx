"use client";

import { useEffect, useRef } from "react";
import { Check, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PoojaPackage } from "@/features/poojas/types";
import { usePoojaBookingSelection } from "@/features/poojas/components/pooja-booking-context";
import { readCheckoutPrefill } from "@/features/checkout/checkout-storage";
import { resolvePackagePrice } from "@/lib/pooja-pricing";

export function PoojaPackages({ packages }: { packages: PoojaPackage[] }) {
  const { selectedPackage, setSelectedPackage } = usePoojaBookingSelection();
  // Best-effort — only known this early if the customer already picked a
  // city on the homepage widget earlier in this session. Checkout re-resolves
  // authoritatively once the city is guaranteed to be known.
  const sessionCity = typeof window !== "undefined" ? readCheckoutPrefill()?.city : undefined;
  const priceFor = (pkg: PoojaPackage) => resolvePackagePrice(pkg, sessionCity);

  // Pre-select the first package on load so the price estimate and booking
  // widget always have a package to work with — guarded by a ref so it only
  // fires once and doesn't fight the customer's own choice afterwards
  // (including deliberately deselecting).
  const hasAutoSelected = useRef(false);
  useEffect(() => {
    if (hasAutoSelected.current || packages.length === 0) return;
    hasAutoSelected.current = true;
    if (!selectedPackage) {
      setSelectedPackage({ name: packages[0].name, price: priceFor(packages[0]) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packages, selectedPackage, setSelectedPackage]);

  return (
    <div className={`grid grid-cols-1 gap-5 ${packages.length > 1 ? "sm:grid-cols-2" : ""}`}>
      {packages.map((pkg) => {
        const isSelected = selectedPackage?.name === pkg.name;
        const price = priceFor(pkg);
        return (
          <div
            key={pkg.name}
            className={`flex flex-col gap-4 rounded-2xl border p-6 ${
              isSelected ? "border-primary bg-primary/5" : "border-border bg-card"
            }`}
          >
            <div>
              <h3 className="font-heading text-lg">{pkg.name}</h3>
              <span className="text-xs font-semibold text-muted-foreground">{pkg.duration}</span>
            </div>
            <div className="font-heading text-3xl text-secondary">₹{price.toLocaleString("en-IN")}</div>
            <ul className="flex flex-col gap-2.5">
              {pkg.features.map((feature) => (
                <li key={feature} className="flex gap-2 text-sm text-muted-foreground">
                  <Check size={16} className="mt-0.5 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              type="button"
              className="font-ui mt-auto font-bold"
              variant={isSelected ? "default" : "outline"}
              onClick={() => setSelectedPackage(isSelected ? null : { name: pkg.name, price })}
            >
              {isSelected ? (
                <>
                  <CheckCircle2 size={16} /> Selected
                </>
              ) : (
                "Select"
              )}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
