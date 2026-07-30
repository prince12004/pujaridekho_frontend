"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarDays, CheckCircle2, Clock3, Flame, Loader2, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMuhuratsForDate } from "@/lib/muhurat";
import { DatePicker } from "@/components/shared/date-picker";
import { readCheckoutPrefillForSlug, saveCheckoutPrefill } from "@/features/checkout/checkout-storage";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mobileSchema } from "@/lib/validators";

export interface BookingOption {
  label: string;
  value: string;
}

const bookingSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  mobile: mobileSchema,
  city: z.string().min(1, "Please select a city"),
  address: z.string().min(5, "Please enter your full address"),
  pooja: z.string().min(1, "Please select a puja"),
  date: z.string().min(1, "Please select a date"),
  muhurat: z.string().optional(),
});

export type BookingValues = z.infer<typeof bookingSchema>;

const fieldControlClass =
  "w-full rounded-lg border border-input bg-background font-sans text-sm font-medium text-foreground shadow-xs outline-none transition-shadow focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/50 px-[12px] py-[10px]";

const trustBadges = [
  { icon: ShieldCheck, label: "100% Verified Pandits" },
  { icon: CheckCircle2, label: "No Hidden Charges" },
  { icon: CalendarDays, label: "Same-Day Booking Available" },
];

/** Homepage "quick start" widget — collects just enough to hand off to
 * /checkout, which is where the booking is actually created and paid for. */
export function BookingWidget({
  cities,
  poojas,
  title = "Book Your Puja",
  subtitle = "Takes less than a minute",
  className,
}: {
  cities: string[];
  poojas: BookingOption[];
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { name: "", mobile: "", city: "", address: "", pooja: "", date: "", muhurat: "" },
  });

  const today = new Date().toISOString().split("T")[0];
  const selectedDate = watch("date");
  const selectedPoojaSlug = watch("pooja");
  const { data: muhuratOptions = [], isLoading: isLoadingMuhurats } = useMuhuratsForDate(selectedPoojaSlug, selectedDate);

  useEffect(() => {
    setValue("muhurat", "");
  }, [selectedDate, setValue]);

  function handleFormSubmit(values: BookingValues) {
    setIsRedirecting(true);
    const muhuratSlot = muhuratOptions.find((m) => m.slotId === values.muhurat);
    // Drops any package/samagri left over from a previously-viewed, different
    // pooja before this fresh save — those don't apply to the one just picked.
    readCheckoutPrefillForSlug(values.pooja);
    saveCheckoutPrefill({
      name: values.name,
      mobile: values.mobile,
      city: values.city,
      address: values.address,
      date: values.date,
      muhuratSlotId: values.muhurat,
      muhuratLabel: muhuratSlot?.timeRange,
      slug: values.pooja,
    });
    router.push(`/poojas/${values.pooja}`);
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] bg-card p-6 shadow-2xl ring-1 ring-border booking_forms",
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />

      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-3.5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-sm">
            <Sparkles size={20} />
          </span>
          <div>
            <h3 className="font-heading text-xl leading-tight">{title}</h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

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

        {selectedDate ? (
          <div className="flex flex-col gap-1.5 overflow-hidden">
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
          </div>
        ) : null}

        <Button type="submit" size="lg" disabled={isRedirecting} className="main_books font-ui mt-1 w-full font-bold">
          {isRedirecting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Taking you there…
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
      </form>
    </div>
  );
}
