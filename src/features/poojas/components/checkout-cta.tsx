"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePoojaBookingSelection } from "@/features/poojas/components/pooja-booking-context";
import { readCheckoutPrefillForSlug, saveCheckoutPrefill } from "@/features/checkout/checkout-storage";

const trustBadges = ["100% Verified Pandits", "No Hidden Charges", "Samagri Delivered on Time"];

export function CheckoutCta({
  slug,
  name,
  serviceType,
  basePrice,
  title,
  packages = [],
}: {
  slug: string;
  name: string;
  serviceType: "pooja" | "festival";
  basePrice: number;
  title?: string;
  packages?: { name: string; price: number }[];
}) {
  const router = useRouter();
  const { selectedPackage, selectedSamagri } = usePoojaBookingSelection();

  const samagriTotal = selectedSamagri.reduce((sum, item) => sum + item.price, 0);
  const bookingPrice = selectedPackage?.price ?? basePrice;

  const estimatedTotal = bookingPrice + samagriTotal;

  function handleBookNow() {
    readCheckoutPrefillForSlug(slug);
    saveCheckoutPrefill({
      selectedPackage: selectedPackage ?? null,
      selectedSamagri,
      slug,
    });
    router.push(`/booking-checkout?type=${serviceType}&slug=${slug}`);
  }

  return (
    <div className="font-heading relative overflow-hidden rounded-[1.75rem] bg-card p-6 shadow-2xl ring-1 ring-border">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />

      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-sm">
          <Sparkles size={20} />
        </span>
        <div>
          <h3 className="font-heading text-xl leading-tight">{title ?? `Book ${name}`}</h3>
          <p className="text-sm text-muted-foreground">Review your selection & proceed to checkout</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 rounded-xl border border-border bg-muted/40 p-4 text-sm">
        <div className="rounded-lg bg-primary/10 px-3 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <PackageCheck size={16} className="shrink-0 text-primary" />
              <p className="text-[10px] font-bold uppercase tracking-wide text-primary">Selected Package</p>
            </div>
            <span className="shrink-0 font-heading text-base font-bold text-secondary">₹{bookingPrice.toLocaleString("en-IN")}</span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-2">
            <p className="truncate font-semibold text-foreground">{selectedPackage ? selectedPackage.name : "Standard Booking"}</p>
            {packages.length > 1 ? (
              <a href="#packages" className="shrink-0 text-xs font-bold text-primary underline-offset-2 hover:underline">
                Change
              </a>
            ) : null}
          </div>
        </div>
        {selectedSamagri.length > 0 ? (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Samagri ({selectedSamagri.length} item{selectedSamagri.length === 1 ? "" : "s"})
            </span>
            <span className="font-semibold text-foreground">₹{samagriTotal.toLocaleString("en-IN")}</span>
          </div>
        ) : null}
        <div className="mt-1 flex items-center justify-between border-t border-dashed border-border pt-2">
          <span className="font-semibold text-foreground">Estimated Total</span>
          <span className="font-heading text-lg text-primary">₹{estimatedTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <Button type="button" size="lg" onClick={handleBookNow} className="mt-4 w-full font-ui font-bold">
        Book Now <ArrowRight size={16} />
      </Button>

      <div className="mt-4 flex flex-col gap-2 border-t border-dashed border-border pt-3.5">
        {trustBadges.map((label, i) => (
          <div key={label} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            {i === 0 ? <ShieldCheck size={15} className="text-primary" /> : <CheckCircle2 size={15} className="text-primary" />}
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
