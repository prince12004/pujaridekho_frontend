"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CalendarDays, ChevronDown, ChevronUp, Loader2, MapPinned, Pencil, Sparkles, User, X } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { PaymentOptionSelector, ADVANCE_AMOUNT, DISTANCE_CHARGE, type PaymentOption } from "@/components/shared/payment-option-selector";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { useMuhuratsForDate } from "@/lib/muhurat";
import { apiClient } from "@/lib/api-client";
import { getCustomerAccessToken } from "@/lib/customer-api-client";
import { getErrorMessage } from "@/lib/get-error-message";
import { useCheckoutService } from "@/features/checkout/use-checkout-service";
import { readCheckoutPrefillForSlug, saveCheckoutPrefill, clearCheckoutPrefill, type CheckoutPrefill } from "@/features/checkout/checkout-storage";
import { contactDetailsSchema, type ContactDetailsValues } from "@/features/checkout/contact-details-schema";
import { ContactDetailsFields, FieldSection } from "@/features/checkout/contact-details-fields";
import { CheckoutSteps } from "@/features/checkout/checkout-steps";

async function redirectToPayU(entityId: string, amount: number, name: string, mobile: string) {
  const res = await apiClient.post("/payments/payu/initiate", {
    entityType: "booking",
    entityId,
    amount,
    name,
    email: "guest@pujaridekho.com",
    phone: mobile,
  });
  const { action, fields } = res.data.data;
  const form = document.createElement("form");
  form.method = "POST";
  form.action = action;
  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = String(value);
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
}

type CompleteCheckoutPrefill = CheckoutPrefill & Required<Pick<CheckoutPrefill, "name" | "mobile" | "city" | "address" | "date">>;

// A booking can't be created without these — when they're missing (first
// visit with nothing saved yet, or coming back after a payment attempt
// cleared the saved details), the page opens straight into edit mode
// instead of bouncing to a separate route.
function hasRequiredDetails(prefill: CheckoutPrefill | null): prefill is CompleteCheckoutPrefill {
  return !!(prefill?.name && prefill.mobile && prefill.city && prefill.address && prefill.date);
}

function YourDetailsSummary({ prefill }: { prefill: CompleteCheckoutPrefill }) {
  return (
    <div className="flex flex-col gap-4">
      <FieldSection icon={User} title="Contact Information">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Your Name</p>
            <p className="font-medium">{prefill.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Mobile Number</p>
            <p className="font-medium">{prefill.mobile}</p>
          </div>
        </div>
      </FieldSection>

      <FieldSection icon={MapPinned} title="Address">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs text-muted-foreground">City</p>
            <p className="font-medium">{prefill.city}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Full Address</p>
            <p className="font-medium">{prefill.address}</p>
          </div>
        </div>
      </FieldSection>

      <FieldSection icon={CalendarDays} title="Schedule">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Pooja Date</p>
            <p className="font-medium">
              {new Date(prefill.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          {prefill.muhuratLabel ? (
            <div>
              <p className="text-xs text-muted-foreground">Muhurat</p>
              <p className="font-medium">{prefill.muhuratLabel}</p>
            </div>
          ) : null}
        </div>
      </FieldSection>
    </div>
  );
}

export function CheckoutClient() {
  const searchParams = useSearchParams();
  const { isLoggedIn, openLogin } = useAuthModal();

  const type = searchParams.get("type") === "festival" ? "festival" : "pooja";
  const slug = searchParams.get("slug") ?? undefined;

  const { data: service, isLoading: isLoadingService } = useCheckoutService(type, slug);
  const [prefill, setPrefill] = useState<CheckoutPrefill | null>(null);
  const [checkedPrefill, setCheckedPrefill] = useState(false);
  const [paymentOption, setPaymentOption] = useState<PaymentOption>("advance");
  const [isBooking, setIsBooking] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSamagriDetails, setShowSamagriDetails] = useState(false);

  useEffect(() => {
    setPrefill(readCheckoutPrefillForSlug(slug));
    setCheckedPrefill(true);
  }, [slug]);

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    setValue: setEditValue,
    watch: watchEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<ContactDetailsValues>({ resolver: zodResolver(contactDetailsSchema) });

  const editSelectedDate = watchEdit("date");
  const { data: editMuhuratOptions = [], isLoading: isLoadingEditMuhurats } = useMuhuratsForDate(
    type === "pooja" ? slug : undefined,
    editSelectedDate,
  );

  function openEdit(basis: CheckoutPrefill | null) {
    resetEdit({
      name: basis?.name ?? "",
      mobile: basis?.mobile ?? "",
      city: basis?.city ?? "",
      address: basis?.address ?? "",
      date: basis?.date ?? "",
      muhurat: basis?.muhuratSlotId ?? "",
    });
    setIsEditing(true);
  }

  // Open the details form automatically the moment we know it's needed —
  // covers both a genuine first-time visit and landing back on this page
  // with nothing saved (e.g. the browser "back" button after a payment
  // attempt, since a successful attempt clears the saved details).
  useEffect(() => {
    if (checkedPrefill && !hasRequiredDetails(prefill)) {
      openEdit(prefill);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedPrefill]);

  function saveEdit(values: ContactDetailsValues): CheckoutPrefill {
    const muhuratSlot = editMuhuratOptions.find((m) => m.slotId === values.muhurat);
    const updated: CheckoutPrefill = {
      ...prefill,
      name: values.name,
      mobile: values.mobile,
      city: values.city,
      address: values.address,
      date: values.date,
      muhuratSlotId: values.muhurat,
      muhuratLabel: muhuratSlot?.timeRange ?? (values.date === prefill?.date ? prefill?.muhuratLabel : undefined),
    };
    saveCheckoutPrefill(updated);
    setPrefill(updated);
    setIsEditing(false);
    return updated;
  }

  const selectedSamagriItems = prefill?.selectedSamagri ?? [];
  const samagriTotal = selectedSamagriItems.reduce((sum, item) => sum + item.price, 0);
  const poojaPrice = prefill?.selectedPackage?.price ?? Number(service?.startingPrice ?? 0);
  // Shown struck-through as a waived charge — the customer is never actually charged for it.
  const distanceChargeMrp = DISTANCE_CHARGE;
  const distanceCharge = 0;
  // The platform fee is what's paid upfront to confirm the booking — the same
  // ₹99 as the "Booking Amount" payment option, just itemized in the summary
  // too so the full-amount total is transparent about what it's made of.
  const platformFee = ADVANCE_AMOUNT;
  const estimatedTotal = poojaPrice + samagriTotal + distanceCharge + platformFee;
  const advanceAmount = ADVANCE_AMOUNT;

  async function handleBookNow() {
    if (showEditForm) {
      await handleEditSubmit(async (values) => {
        const updated = saveEdit(values);
        if (!isLoggedIn) {
          openLogin(() => proceedToPayment(updated), updated.mobile);
          return;
        }
        await proceedToPayment(updated);
      })();
      return;
    }
    if (!hasRequiredDetails(prefill)) {
      openEdit(prefill);
      return;
    }
    if (!isLoggedIn) {
      openLogin(() => proceedToPayment(prefill), prefill.mobile);
      return;
    }
    await proceedToPayment(prefill);
  }

  async function proceedToPayment(details: CheckoutPrefill) {
    setIsBooking(true);
    try {
      const res = await apiClient.post(
        "/bookings",
        {
          customer: { name: details.name, mobile: details.mobile },
          serviceType: type,
          poojaSlug: slug,
          city: details.city,
          address: details.address,
          poojaDate: details.date,
          poojaTime: details.muhuratLabel,
          muhuratSlotId: details.muhuratSlotId,
          selectedSamagri: details.selectedSamagri ?? [],
        },
        // /bookings now requires a logged-in customer — apiClient (unlike
        // customerApiClient) doesn't auto-attach this token since it's the
        // shared client for public, unauthenticated browsing endpoints too.
        { headers: { Authorization: `Bearer ${getCustomerAccessToken()}` } },
      );
      const booking = res.data.data;
      // The backend's own pricing only knows pooja + samagri — the platform
      // fee and distance charge are front-end-only additions, so the "full"
      // amount charged has to be our own total, not booking.pricing.finalAmount,
      // or the customer would be charged less than the summary promised.
      const amountToPay = paymentOption === "advance" ? advanceAmount : estimatedTotal;
      clearCheckoutPrefill();
      await redirectToPayU(booking._id, amountToPay, details.name!, details.mobile!);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't create your booking. Please try again."));
      setIsBooking(false);
    }
  }

  if (!slug) {
    return (
      <Container className="flex min-h-[50vh] flex-col items-center justify-center gap-3 py-16 text-center">
        <h1 className="font-heading text-2xl">No puja selected for checkout</h1>
        <p className="text-sm text-muted-foreground">Please choose a puja to book first.</p>
        <Button asChild className="mt-2">
          <Link href="/poojas">Browse Poojas</Link>
        </Button>
      </Container>
    );
  }

  if (isLoadingService || !checkedPrefill) {
    return (
      <Container className="flex min-h-[50vh] items-center justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </Container>
    );
  }

  if (!service) {
    return (
      <Container className="flex min-h-[50vh] flex-col items-center justify-center gap-3 py-16 text-center">
        <h1 className="font-heading text-2xl">We couldn&apos;t find that puja</h1>
        <Button asChild className="mt-2">
          <Link href="/poojas">Browse Poojas</Link>
        </Button>
      </Container>
    );
  }

  const detailsComplete = hasRequiredDetails(prefill);
  const showEditForm = isEditing || !detailsComplete;
  const isEditFormValid = contactDetailsSchema.safeParse(watchEdit()).success;

  return (
    <Container className="py-8">
      <Breadcrumb items={[{ label: "Checkout" }]} />

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-sm">
            <Sparkles size={20} />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-bold sm:text-3xl">Checkout</h1>
            <p className="text-sm text-muted-foreground">Booking {service.name}</p>
          </div>
        </div>
        <CheckoutSteps current={showEditForm ? 1 : 2} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
            <h2 className="font-heading flex items-center gap-2 text-lg">
              <User size={18} className="text-primary" /> Your Details
            </h2>
            {showEditForm ? (
              detailsComplete ? (
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                  <X size={14} /> Cancel
                </Button>
              ) : null
            ) : (
              <Button type="button" variant="ghost" size="sm" onClick={() => openEdit(prefill)}>
                <Pencil size={14} /> Edit
              </Button>
            )}
          </div>

          <div className="p-6">
            {showEditForm ? (
              <ContactDetailsFields
                register={registerEdit}
                errors={editErrors}
                watch={watchEdit}
                setValue={setEditValue}
                serviceType={type}
                muhuratOptions={editMuhuratOptions}
                isLoadingMuhurats={isLoadingEditMuhurats}
              />
            ) : hasRequiredDetails(prefill) ? (
              <YourDetailsSummary prefill={prefill} />
            ) : null}
          </div>
        </div>

        <div className="h-fit overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:sticky lg:top-24">
          <div className="border-b border-border bg-muted/30 px-6 py-4">
            <h2 className="font-heading text-lg">Booking Summary</h2>
          </div>

          <div className="p-6">
            <div className="flex flex-col gap-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Pooja Price</span>
                <span className="font-semibold text-foreground">₹{poojaPrice.toLocaleString("en-IN")}</span>
              </div>
              {selectedSamagriItems.length > 0 ? (
                <div className="flex flex-col gap-1.5 rounded-lg border border-dashed border-border bg-muted/30 px-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => setShowSamagriDetails((prev) => !prev)}
                    className="flex items-center justify-between gap-2 text-left"
                  >
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      Samagri Price ({selectedSamagriItems.length} item{selectedSamagriItems.length === 1 ? "" : "s"})
                      {showSamagriDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                    <span className="font-semibold text-foreground">₹{samagriTotal.toLocaleString("en-IN")}</span>
                  </button>
                  {showSamagriDetails && (
                    <ul className="flex flex-col gap-1">
                      {selectedSamagriItems.map((item) => (
                        <li key={item.name} className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{item.name}</span>
                          <span>₹{item.price.toLocaleString("en-IN")}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Samagri Price</span>
                  <span className="text-xs font-semibold text-muted-foreground">Not Included</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Distance Charge</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground line-through">₹{distanceChargeMrp.toLocaleString("en-IN")}</span>
                  <span className="font-semibold text-emerald-600">FREE</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Platform Fee</span>
                <span className="font-semibold text-foreground">₹{platformFee.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3.5">
              <span className="font-heading text-base">Total Amount</span>
              <span className="font-heading text-2xl text-primary">₹{estimatedTotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="mt-5 flex flex-col gap-1.5">
              <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Payment</Label>
              <PaymentOptionSelector
                value={paymentOption}
                onChange={setPaymentOption}
                fullAmountLabel={estimatedTotal > 0 ? `₹${estimatedTotal.toLocaleString("en-IN")}` : "Full Amount"}
              />
            </div>

            <Button
              type="button"
              size="lg"
              disabled={isBooking || (showEditForm && !isEditFormValid)}
              onClick={handleBookNow}
              className="mt-5 w-full font-ui font-bold"
            >
              {isBooking ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Redirecting to payment…
                </>
              ) : (
                `Book Now — Pay ₹${(paymentOption === "advance" ? advanceAmount : estimatedTotal).toLocaleString("en-IN")}`
              )}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
