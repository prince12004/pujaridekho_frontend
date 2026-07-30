"use client";

import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CalendarDays, Clock3, MapPinned, Phone, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/shared/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bookingCities } from "@/features/home/data";
import type { MuhuratSlot } from "@/lib/muhurat";
import type { ContactDetailsValues } from "@/features/checkout/contact-details-schema";
import { cn } from "@/lib/utils";

export function FieldSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon size={13} />
        </span>
        <span className="text-xs font-bold uppercase tracking-wide text-foreground">{title}</span>
      </div>
      {children}
    </div>
  );
}

const fieldLabelClass = "text-xs font-semibold text-muted-foreground";
const inputClass = "bg-card";

/** Shared field set behind both the standalone "Your Details" step and the
 * inline edit mode on the Checkout review page — one place to keep them
 * visually and behaviorally identical. */
export function ContactDetailsFields({
  register,
  errors,
  watch,
  setValue,
  serviceType,
  muhuratOptions,
  isLoadingMuhurats,
}: {
  register: UseFormRegister<ContactDetailsValues>;
  errors: FieldErrors<ContactDetailsValues>;
  watch: UseFormWatch<ContactDetailsValues>;
  setValue: UseFormSetValue<ContactDetailsValues>;
  serviceType: "pooja" | "festival";
  muhuratOptions: MuhuratSlot[];
  isLoadingMuhurats: boolean;
}) {
  const today = new Date().toISOString().split("T")[0];
  const selectedDate = watch("date");

  return (
    <div className="flex flex-col gap-4">
      <FieldSection icon={User} title="Contact Information">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className={fieldLabelClass}>Your Name</Label>
            <Input placeholder="Full name" className={inputClass} {...register("name")} />
            {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className={cn(fieldLabelClass, "flex items-center gap-1.5")}>
              <Phone size={12} /> Mobile Number
            </Label>
            <Input placeholder="10-digit number" className={inputClass} {...register("mobile")} />
            {errors.mobile ? <p className="text-xs text-destructive">{errors.mobile.message}</p> : null}
          </div>
        </div>
      </FieldSection>

      <FieldSection icon={MapPinned} title="Address">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className={fieldLabelClass}>City</Label>
            <Select value={watch("city")} onValueChange={(v) => setValue("city", v, { shouldValidate: true })}>
              <SelectTrigger className={cn("w-full", inputClass)}>
                <SelectValue placeholder="Choose your city" />
              </SelectTrigger>
              <SelectContent>
                {bookingCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.city ? <p className="text-xs text-destructive">{errors.city.message}</p> : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className={fieldLabelClass}>Full Address</Label>
            <Textarea placeholder="House / flat no., street, area..." rows={3} className={inputClass} {...register("address")} />
            {errors.address ? <p className="text-xs text-destructive">{errors.address.message}</p> : null}
          </div>
        </div>
      </FieldSection>

      <FieldSection icon={CalendarDays} title="Schedule">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className={fieldLabelClass}>Pooja Date</Label>
            <DatePicker
              value={watch("date")}
              onChange={(v) => setValue("date", v, { shouldValidate: true })}
              min={today}
              placeholder="Choose a date"
              className={inputClass}
            />
            {errors.date ? <p className="text-xs text-destructive">{errors.date.message}</p> : null}
          </div>

          {serviceType === "pooja" && selectedDate ? (
            <div className="flex flex-col gap-1.5">
              <Label className={cn(fieldLabelClass, "flex items-center gap-1.5")}>
                <Clock3 size={12} /> Muhurat
              </Label>
              {isLoadingMuhurats ? (
                <p className="text-xs text-muted-foreground">Checking availability...</p>
              ) : muhuratOptions.length === 0 ? (
                <p className="rounded-lg border border-dashed border-input bg-card px-3 py-2.5 text-xs text-muted-foreground">
                  No Muhurat available for this date.
                </p>
              ) : (
                <Select value={watch("muhurat")} onValueChange={(v) => setValue("muhurat", v, { shouldValidate: true })}>
                  <SelectTrigger className={cn("w-full", inputClass)}>
                    <SelectValue placeholder="Choose a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {muhuratOptions.map((slot) => (
                      <SelectItem key={slot.slotId} value={slot.slotId}>
                        {slot.timeRange}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ) : null}
        </div>
      </FieldSection>
    </div>
  );
}
