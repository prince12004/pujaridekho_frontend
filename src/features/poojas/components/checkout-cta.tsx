"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePoojaBookingSelection } from "@/features/poojas/components/pooja-booking-context";
import { readCheckoutPrefillForSlug, saveCheckoutPrefill } from "@/features/checkout/checkout-storage";

const trustBadges = ["100% Verified Pandits", "No Hidden Charges", "Samagri Delivered on Time"];

/** Replaces the old inline booking form on Pooja/Festival detail pages — no
 * personal-detail fields here (those live on /booking-checkout). This just
 * carries forward whatever package/samagri the customer already picked on
 * this page and sends them straight to checkout — if their contact/address
 * details aren't in session storage yet (e.g. they landed here without
 * going through the homepage form first), CheckoutClient opens straight into
 * its own inline edit form instead of showing an empty summary. */
export function CheckoutCta({
  slug,
  name,
  serviceType,
  basePrice,
  title,
}: {
  slug: string;
  name: string;
  serviceType: "pooja" | "festival";
  basePrice: number;
  title?: string;
}) {
  const router = useRouter();
  const { selectedPackage, selectedSamagri } = usePoojaBookingSelection();

  const samagriTotal = selectedSamagri.reduce((sum, item) => sum + item.price, 0);
  const bookingPrice = selectedPackage?.price ?? basePrice;
  // Platform fee is only itemized on the Checkout page's Booking Summary —
  // this preview card sticks to pooja + samagri so it doesn't show a charge
  // it doesn't explain.
  const estimatedTotal = bookingPrice + samagriTotal;

  function handleBookNow() {
    // If session storage is still holding a different pooja's date/muhurat
    // from an earlier booking attempt, trim it before layering this pooja's
    // package/samagri on top — otherwise that stale date would silently
    // survive the merge and show up on checkout for the wrong service.
    readCheckoutPrefillForSlug(slug);
    saveCheckoutPrefill({
      selectedPackage: selectedPackage ?? null,
      selectedSamagri,
      slug,
    });
    router.push(`/booking-checkout?type=${serviceType}&slug=${slug}`);
  }

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] bg-card p-6 shadow-2xl ring-1 ring-border">
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
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">{selectedPackage ? selectedPackage.name : "Base Price"}</span>
          <span className="font-semibold text-foreground">₹{bookingPrice.toLocaleString("en-IN")}</span>
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
