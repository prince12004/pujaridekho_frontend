"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flame,
  Loader2,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMuhuratsForDate } from "@/lib/muhurat";
import { DatePicker } from "@/components/shared/date-picker";
import { PaymentOptionSelector, ADVANCE_AMOUNT, type PaymentOption } from "@/components/shared/payment-option-selector";
import { usePoojaBookingSelection } from "@/features/poojas/components/pooja-booking-context";
import { apiClient } from "@/lib/api-client";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface BookingOption {
  label: string;
  value: string;
}

const bookingSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  mobile: z.string().min(10, "Enter a valid mobile number"),
  city: z.string().min(1, "Please select a city"),
  address: z.string().min(5, "Please enter your full address"),
  pooja: z.string().min(1, "Please select a puja"),
  date: z.string().min(1, "Please select a date"),
  muhurat: z.string().optional(),
});

export type BookingValues = z.infer<typeof bookingSchema>;

// Carries the customer's details across the full-page navigation from the
// homepage widget (which only lets you pick a puja + book now) to the chosen
// puja's own detail page, so they aren't retyped from scratch.
const PREFILL_STORAGE_KEY = "pujaridekho_booking_prefill";

interface BookingPrefill {
  name: string;
  mobile: string;
  city: string;
  address: string;
  date: string;
}

const fieldControlClass =
  "w-full rounded-lg border border-input bg-background font-sans text-sm font-medium text-foreground shadow-xs outline-none transition-shadow focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/50 px-[12px] py-[10px]";

const trustBadges = [
  { icon: ShieldCheck, label: "100% Verified Pandits" },
  { icon: CheckCircle2, label: "No Hidden Charges" },
  { icon: CalendarDays, label: "Same-Day Booking Available" },
];

export function BookingWidget({
  cities,
  poojas,
  selectedPooja,
  selectedPoojaLabel,
  serviceType = "pooja",
  basePrice,
  title = "Book Your Puja",
  subtitle = "Takes less than a minute",
  onSubmit,
  navigateOnSubmit = false,
  className,
}: {
  cities: string[];
  poojas: BookingOption[];
  selectedPooja?: string;
  selectedPoojaLabel?: string;
  /** Whether `selectedPooja` refers to a Pooja slug or a Festival slug — the backend looks it up in the matching collection. */
  serviceType?: "pooja" | "festival";
  /** The service's starting price, used only to estimate the "Full Amount" label before the server computes the authoritative total. */
  basePrice?: number;
  title?: string;
  subtitle?: string;
  onSubmit?: (values: BookingValues) => void;
  /** When true, a successful booking navigates straight to the chosen pooja's detail page instead of showing a local confirmation. */
  navigateOnSubmit?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, openLogin } = useAuthModal();
  const { selectedPackage, setSelectedPackage, selectedSamagri, setSelectedSamagri } = usePoojaBookingSelection();
  const [paymentOption, setPaymentOption] = useState<PaymentOption>("advance");
  const [submitted, setSubmitted] = useState<BookingValues | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<{ id: string; amount: number } | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      mobile: "",
      city: "",
      address: "",
      pooja: selectedPooja ?? "",
      date: "",
      muhurat: "",
    },
  });

  const today = new Date().toISOString().split("T")[0];
  const selectedDate = watch("date");
  const selectedPoojaSlug = watch("pooja");
  const { data: muhuratOptions = [], isLoading: isLoadingMuhurats } = useMuhuratsForDate(
    serviceType === "pooja" ? selectedPoojaSlug : undefined,
    selectedDate,
  );

  const samagriTotal = selectedSamagri.reduce((sum, s) => sum + s.price, 0);
  const estimatedFullAmount = (selectedPackage?.price ?? basePrice ?? 0) + samagriTotal;

  useEffect(() => {
    setValue("muhurat", "");
  }, [selectedDate, setValue]);

  // Receiving side: on mount, apply and clear any prefill left by the
  // homepage widget's "Book Now" navigation. A pooja detail page renders
  // BOTH a mobile (lg:hidden) and a desktop (hidden lg:block) instance of
  // this widget — only the one actually visible at this viewport should
  // consume the prefill, otherwise the hidden instance eats it first and
  // the visible one is left blank.
  useEffect(() => {
    if (navigateOnSubmit) return;
    if (rootRef.current && rootRef.current.getClientRects().length === 0) return;
    const raw = window.sessionStorage.getItem(PREFILL_STORAGE_KEY);
    if (!raw) return;
    window.sessionStorage.removeItem(PREFILL_STORAGE_KEY);
    try {
      const prefill: BookingPrefill = JSON.parse(raw);
      setValue("name", prefill.name);
      setValue("mobile", prefill.mobile);
      setValue("city", prefill.city, { shouldValidate: true });
      setValue("address", prefill.address);
      setValue("date", prefill.date, { shouldValidate: true });
    } catch {
      // Malformed prefill payload — ignore and let the customer fill the form fresh.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  async function handleFormSubmit(values: BookingValues) {
    if (navigateOnSubmit) {
      setIsRedirecting(true);
      const prefill: BookingPrefill = { name: values.name, mobile: values.mobile, city: values.city, address: values.address, date: values.date };
      window.sessionStorage.setItem(PREFILL_STORAGE_KEY, JSON.stringify(prefill));
      const basePath = serviceType === "festival" ? "/festivals" : "/poojas";
      setTimeout(() => router.push(`${basePath}/${values.pooja}`), 550);
      return;
    }

    // The OTP modal renders as an overlay on this same page, so the already
    //-filled form values stay intact in this closure — no navigation, no
    // sessionStorage prefill needed to "return" the customer to their booking.
    if (!isLoggedIn) {
      openLogin(() => createBookingAndPay(values), values.mobile);
      return;
    }
    await createBookingAndPay(values);
  }

  async function createBookingAndPay(values: BookingValues) {
    setPaymentFailed(false);
    try {
      const muhuratLabel = muhuratOptions.find((m) => m.slotId === values.muhurat);
      const res = await apiClient.post("/bookings", {
        customer: { name: values.name, mobile: values.mobile },
        serviceType,
        poojaSlug: values.pooja,
        city: values.city,
        address: values.address,
        poojaDate: values.date,
        poojaTime: muhuratLabel?.timeRange,
        muhuratSlotId: muhuratLabel?.slotId,
        selectedSamagri,
      });
      const booking = res.data.data;
      const finalAmount = booking.pricing?.finalAmount ?? estimatedFullAmount;
      const amountToPay = paymentOption === "advance" ? ADVANCE_AMOUNT : finalAmount;
      setCreatedBooking({ id: booking._id, amount: amountToPay });

      // Book Now goes straight to the payment gateway — no extra confirmation
      // click in between.
      await redirectToPayU(booking._id, amountToPay, values.name, values.mobile);
      return;
    } catch {
      // Either booking creation or the PayU redirect failed — fall back to a
      // confirmation screen with a manual retry button rather than leaving
      // the customer stuck with no feedback.
      setPaymentFailed(true);
    }

    setSubmitted(values);
    onSubmit?.(values);
  }

  async function handlePayNow() {
    if (!createdBooking || !submitted) return;
    setIsPaying(true);
    try {
      await redirectToPayU(createdBooking.id, createdBooking.amount, submitted.name, submitted.mobile);
    } finally {
      setIsPaying(false);
    }
  }

  const submittedPoojaLabel = poojas.find((p) => p.value === submitted?.pooja)?.label ?? submitted?.pooja;
  const selectedMuhuratLabel = muhuratOptions.find((m) => m.slotId === submitted?.muhurat);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] bg-card p-6 shadow-2xl ring-1 ring-border booking_forms",
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 py-6 text-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 size={30} />
            </span>
            <h3 className="font-heading text-xl">{paymentFailed ? "Booking Created" : "Request Received"}</h3>
            {paymentFailed && (
              <p className="text-sm font-semibold text-destructive">
                We couldn&apos;t open the payment gateway automatically — please try again below.
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {selectedPoojaLabel ?? submittedPoojaLabel} in {submitted.city} on{" "}
              {new Date(submitted.date).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}
              {selectedMuhuratLabel ? (
                <>
                  {" "}during <span className="font-semibold text-foreground">{selectedMuhuratLabel.timeRange}</span>
                </>
              ) : null}
              {selectedPackage ? (
                <>
                  {" "}Package: <span className="font-semibold text-foreground">{selectedPackage.name}</span>.
                </>
              ) : null}
              {selectedSamagri.length > 0 ? (
                <>
                  {" "}Samagri: <span className="font-semibold text-foreground">{selectedSamagri.map((s) => s.name).join(", ")}</span>.
                </>
              ) : null}{" "}
              Our team will confirm your slot shortly.
            </p>
            {createdBooking ? (
              <Button className="font-ui mt-2 w-full font-bold" onClick={handlePayNow} disabled={isPaying}>
                {isPaying && <Loader2 size={16} className="animate-spin" />}
                Pay ₹{createdBooking.amount.toLocaleString("en-IN")} Now
              </Button>
            ) : null}
            <Button
              variant="outline"
              className="font-ui mt-2 font-bold"
              onClick={() => {
                setSubmitted(null);
                setSelectedPackage(null);
                setSelectedSamagri([]);
                setCreatedBooking(null);
              }}
            >
              Book Another Puja
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex flex-col gap-3.5"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-sm">
                <Sparkles size={20} />
              </span>
              <div>
                <h3 className="font-heading text-xl leading-tight">{title}</h3>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              </div>
            </div>

            {selectedPackage ? (
              <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/8 px-3 py-2 text-sm">
                <span>
                  Package: <span className="font-bold text-primary">{selectedPackage.name}</span> — ₹
                  {selectedPackage.price.toLocaleString("en-IN")}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedPackage(null)}
                  className="text-xs font-semibold text-muted-foreground underline-offset-2 hover:underline"
                >
                  Change
                </button>
              </div>
            ) : null}

            {selectedSamagri.length > 0 ? (
              <div className="rounded-lg border border-primary/30 bg-primary/8 px-3 py-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">
                    Samagri ({selectedSamagri.length} item{selectedSamagri.length === 1 ? "" : "s"})
                  </span>
                  <span className="font-bold text-primary">
                    ₹{selectedSamagri.reduce((sum, s) => sum + s.price, 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{selectedSamagri.map((s) => s.name).join(", ")}</p>
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1.5">
                <Label className="font-ui text-xs font-bold uppercase tracking-wide text-muted-foreground">Your Name</Label>
                <Input placeholder="Full name" className={fieldControlClass} {...register("name")} />
                {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="font-ui text-xs font-bold uppercase tracking-wide text-muted-foreground">Mobile</Label>
                <Input placeholder="10-digit number" className={fieldControlClass} {...register("mobile")} />
                {errors.mobile ? <p className="text-xs text-destructive">{errors.mobile.message}</p> : null}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="font-ui gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <MapPin size={14} className="text-primary" /> Select City
              </Label>
              <Select onValueChange={(v) => setValue("city", v, { shouldValidate: true })}>
                <SelectTrigger className={cn(fieldControlClass, "w-full")}>
                  <SelectValue placeholder="Choose your city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city ? <p className="text-xs text-destructive">{errors.city.message}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="font-ui gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <MapPin size={14} className="text-primary" /> Full Address
              </Label>
              <Textarea
                placeholder="House / flat no., street, area..."
                rows={2}
                className={cn(fieldControlClass, "min-h-[64px] resize-none")}
                {...register("address")}
              />
              {errors.address ? <p className="text-xs text-destructive">{errors.address.message}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="font-ui gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <Flame size={14} className="text-primary" /> Select Puja
              </Label>
              {selectedPooja ? (
                <div className={cn(fieldControlClass, "flex items-center justify-between")}>
                  <span>{selectedPoojaLabel ?? poojas.find((p) => p.value === selectedPooja)?.label ?? selectedPooja}</span>
                </div>
              ) : (
                <Select onValueChange={(v) => setValue("pooja", v, { shouldValidate: true })}>
                  <SelectTrigger className={cn(fieldControlClass, "w-full")}>
                    <SelectValue placeholder="Choose a puja" />
                  </SelectTrigger>
                  <SelectContent>
                    {poojas.map((pooja) => (
                      <SelectItem key={pooja.value} value={pooja.value}>
                        {pooja.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.pooja ? <p className="text-xs text-destructive">{errors.pooja.message}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="booking-date"
                className="font-ui gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground"
              >
                <CalendarDays size={14} className="text-primary" /> Select Date
              </Label>
              <DatePicker
                id="booking-date"
                value={watch("date")}
                onChange={(v) => setValue("date", v, { shouldValidate: true })}
                min={today}
                placeholder="Choose a date"
                className={fieldControlClass}
              />
              {errors.date ? <p className="text-xs text-destructive">{errors.date.message}</p> : null}
            </div>

            <AnimatePresence>
              {selectedDate && serviceType === "pooja" ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-1.5 overflow-hidden"
                >
                  <Label className="font-ui gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    <Clock3 size={14} className="text-primary" /> Select Muhurat
                  </Label>
                  {isLoadingMuhurats ? (
                    <p className="text-xs text-muted-foreground">Checking available Muhurat timings...</p>
                  ) : muhuratOptions.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-input bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
                      No Muhurat Available for the Selected Date.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {muhuratOptions.map((slot) => {
                        const active = watch("muhurat") === slot.slotId;
                        return (
                          <button
                            key={slot.slotId}
                            type="button"
                            onClick={() => setValue("muhurat", slot.slotId, { shouldValidate: true })}
                            className={cn(
                              "flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                              active
                                ? "border-primary bg-primary/8 font-bold text-primary"
                                : "border-input bg-background text-foreground hover:border-primary/40",
                            )}
                          >
                            <span>{slot.timeRange}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>

            {!navigateOnSubmit && (
              <div className="flex flex-col gap-1.5">
                <Label className="font-ui text-xs font-bold uppercase tracking-wide text-muted-foreground">Payment</Label>
                <PaymentOptionSelector
                  value={paymentOption}
                  onChange={setPaymentOption}
                  fullAmountLabel={estimatedFullAmount > 0 ? `₹${estimatedFullAmount.toLocaleString("en-IN")}` : "Full Amount"}
                />
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isRedirecting || isSubmitting}
              className="main_books font-ui mt-1 w-full font-bold"
            >
              {isRedirecting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Taking you there…
                </>
              ) : isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Redirecting to payment…
                </>
              ) : (
                "Book Now"
              )}
            </Button>

            <div className="flex flex-col gap-2 border-t border-dashed border-border pt-3.5">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <Icon size={15} className="text-primary" />
                  {label}
                </div>
              ))}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
