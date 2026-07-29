"use client";

import { Check, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PoojaPackage } from "@/features/poojas/types";
import { usePoojaBookingSelection } from "@/features/poojas/components/pooja-booking-context";

export function PoojaPackages({ packages }: { packages: PoojaPackage[] }) {
  const { selectedPackage, setSelectedPackage } = usePoojaBookingSelection();

  return (
    <div className={`grid grid-cols-1 gap-5 ${packages.length > 1 ? "sm:grid-cols-2" : ""}`}>
      {packages.map((pkg, i) => {
        const isSelected = selectedPackage?.name === pkg.name;
        return (
          <div
            key={pkg.name}
            className={`flex flex-col gap-4 rounded-2xl border p-6 ${
              isSelected || i === 1 ? "border-primary bg-primary/5" : "border-border bg-card"
            }`}
          >
            <div>
              <h3 className="font-heading text-lg">{pkg.name}</h3>
              <span className="text-xs font-semibold text-muted-foreground">{pkg.duration}</span>
            </div>
            <div className="font-heading text-3xl text-secondary">₹{pkg.price.toLocaleString("en-IN")}</div>
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
              variant={isSelected || i === 1 ? "default" : "outline"}
              onClick={() => setSelectedPackage(isSelected ? null : { name: pkg.name, price: pkg.price })}
            >
              {isSelected ? (
                <>
                  <CheckCircle2 size={16} /> Selected
                </>
              ) : (
                `Choose ${pkg.name}`
              )}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
