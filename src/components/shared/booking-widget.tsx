"use client";

import { useEffect, useMemo, useState } from "react";
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
import { getMuhuratsForDate } from "@/lib/muhurat";
import { cn } from "@/lib/utils";

export interface BookingOption {
  label: string;
  value: string;
}

const bookingSchema = z.object({
  city: z.string().min(1, "Please select a city"),
  pooja: z.string().min(1, "Please select a puja"),
  date: z.string().min(1, "Please select a date"),
  muhurat: z.string().min(1, "Please select a muhurat"),
});

export type BookingValues = z.infer<typeof bookingSchema>;

const fieldControlClass =
  "h-11 w-full rounded-lg border border-input bg-background px-3.5 font-sans text-sm font-medium text-foreground shadow-xs outline-none transition-shadow focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/50";

const trustBadges = [
  { icon: ShieldCheck, label: "100% Verified Pandits" },
  { icon: CheckCircle2, label: "No Hidden Charges" },
  { icon: CalendarDays, label: "Same-Day Booking Available" },
];

export function BookingWidget({
  cities,
  poojas,
  title = "Book Your Puja",
  subtitle = "Takes less than a minute",
  onSubmit,
  navigateOnSubmit = false,
  className,
}: {
  cities: string[];
  poojas: BookingOption[];
  title?: string;
  subtitle?: string;
  onSubmit?: (values: BookingValues) => void;
  /** When true, a successful booking navigates straight to the chosen pooja's detail page instead of showing a local confirmation. */
  navigateOnSubmit?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState<BookingValues | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { city: "", pooja: "", date: "", muhurat: "" },
  });

  const today = new Date().toISOString().split("T")[0];
  const selectedDate = watch("date");
  const muhuratOptions = useMemo(() => getMuhuratsForDate(selectedDate), [selectedDate]);

  useEffect(() => {
    setValue("muhurat", "");
  }, [selectedDate, setValue]);

  function handleFormSubmit(values: BookingValues) {
    if (navigateOnSubmit) {
      setIsRedirecting(true);
      setTimeout(() => router.push(`/poojas/${values.pooja}`), 550);
      return;
    }
    setSubmitted(values);
    onSubmit?.(values);
  }

  const selectedPoojaLabel = poojas.find((p) => p.value === submitted?.pooja)?.label ?? submitted?.pooja;
  const selectedMuhuratLabel = muhuratOptions.find((m) => m.id === submitted?.muhurat);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] bg-card p-6 shadow-2xl ring-1 ring-border",
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
            <h3 className="font-heading text-xl">Request Received</h3>
            <p className="text-sm text-muted-foreground">
              {selectedPoojaLabel} in {submitted.city} on{" "}
              {new Date(submitted.date).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}
              {selectedMuhuratLabel ? (
                <>
                  {" "}during <span className="font-semibold text-foreground">{selectedMuhuratLabel.name}</span> (
                  {selectedMuhuratLabel.timeRange})
                </>
              ) : null}
              . Our team will confirm your slot shortly.
            </p>
            <Button variant="outline" className="font-ui mt-2 font-bold" onClick={() => setSubmitted(null)}>
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
              <input
                id="booking-date"
                type="date"
                min={today}
                {...register("date")}
                className={fieldControlClass}
              />
              {errors.date ? <p className="text-xs text-destructive">{errors.date.message}</p> : null}
            </div>

            <AnimatePresence>
              {selectedDate ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-1.5 overflow-hidden"
                >
                  <Label className="font-ui gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    <Clock3 size={14} className="text-primary" /> Select Muhurat
                  </Label>
                  <div className="grid grid-cols-1 gap-2">
                    {muhuratOptions.map((slot) => {
                      const active = watch("muhurat") === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setValue("muhurat", slot.id, { shouldValidate: true })}
                          className={cn(
                            "flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                            active
                              ? "border-primary bg-primary/8 font-bold text-primary"
                              : "border-input bg-background text-foreground hover:border-primary/40",
                          )}
                        >
                          <span>{slot.name}</span>
                          <span className="text-xs font-semibold text-muted-foreground">{slot.timeRange}</span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.muhurat ? <p className="text-xs text-destructive">{errors.muhurat.message}</p> : null}
                </motion.div>
              ) : null}
            </AnimatePresence>

            <Button
              type="submit"
              size="lg"
              disabled={isRedirecting}
              className="main_books font-ui mt-1 w-full font-bold"
            >
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
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
