"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/shared/date-picker";
import { TimePicker } from "@/components/shared/time-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useCreateOfflineBooking } from "@/features/admin/api/use-bookings";
import { usePoojas } from "@/features/admin/api/use-poojas";
import { useFestivals } from "@/features/admin/api/use-festivals";
import { usePandits } from "@/features/admin/api/use-pandits";
import { BOOKING_SERVICE_TYPES, BOOKING_SOURCES, PAYMENT_METHODS } from "@/features/admin/lib/booking-status";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const offlineBookingSchema = z.object({
  customerName: z.string().min(1, "Required"),
  customerMobile: z.string().min(10, "Enter a valid mobile number"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  serviceType: z.enum(BOOKING_SERVICE_TYPES),
  pooja: z.string().optional(),
  festival: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  landmark: z.string().optional(),
  pincode: z.string().optional(),
  gotra: z.string().optional(),
  specialInstructions: z.string().optional(),
  poojaDate: z.string().min(1, "Required"),
  poojaTime: z.string().optional(),
  pandit: z.string().optional(),
  packagePrice: z.coerce.number().min(0).optional(),
  marketPrice: z.coerce.number().min(0).optional(),
  discount: z.coerce.number().min(0).optional(),
  finalAmount: z.coerce.number().min(0, "Required"),
  advanceAmount: z.coerce.number().min(0).optional(),
  initialPaymentAmount: z.coerce.number().min(0).optional(),
  paymentMethod: z.enum(PAYMENT_METHODS),
  bookingSource: z.enum(BOOKING_SOURCES),
  referredBy: z.string().optional(),
});

type OfflineBookingValues = z.infer<typeof offlineBookingSchema>;

export default function CreateOfflineBookingPage() {
  const router = useRouter();
  const [poojaSearch, setPoojaSearch] = useState("");
  const { data: poojasResult } = usePoojas({ search: poojaSearch || undefined, status: "Published" });
  const { data: festivalsResult } = useFestivals({ status: "Published" });
  const { data: panditsResult } = usePandits({ verificationStatus: "verified" });
  const createOfflineBooking = useCreateOfflineBooking();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof offlineBookingSchema>, unknown, OfflineBookingValues>({
    resolver: zodResolver(offlineBookingSchema),
    defaultValues: {
      serviceType: "pooja",
      paymentMethod: "cash",
      bookingSource: "phone",
    },
  });

  const serviceType = watch("serviceType");
  const selectedPoojaId = watch("pooja");
  const selectedFestivalId = watch("festival");
  const selectedPooja = useMemo(
    () => poojasResult?.items.find((p) => p._id === selectedPoojaId),
    [poojasResult, selectedPoojaId],
  );
  const selectedFestival = useMemo(
    () => festivalsResult?.items.find((f) => f._id === selectedFestivalId),
    [festivalsResult, selectedFestivalId],
  );
  const selectedService = serviceType === "festival" ? selectedFestival : selectedPooja;

  const onSubmit = async (values: OfflineBookingValues) => {
    try {
      const payments = values.initialPaymentAmount
        ? [{ amount: values.initialPaymentAmount, method: values.paymentMethod, status: "success" as const }]
        : [];

      await createOfflineBooking.mutateAsync({
        customer: { name: values.customerName, mobile: values.customerMobile, email: values.customerEmail || undefined },
        serviceType: values.serviceType,
        pooja: values.serviceType === "pooja" ? values.pooja || undefined : undefined,
        festival: values.serviceType === "festival" ? values.festival || undefined : undefined,
        package: selectedService
          ? { name: "Standard", price: values.packagePrice ?? selectedService.startingPrice }
          : undefined,
        address: values.address,
        city: values.city,
        landmark: values.landmark,
        pincode: values.pincode,
        gotra: values.gotra,
        specialInstructions: values.specialInstructions,
        poojaDate: values.poojaDate,
        poojaTime: values.poojaTime,
        pandit: values.pandit || undefined,
        pricing: {
          packagePrice: values.packagePrice ?? 0,
          marketPrice: values.marketPrice ?? undefined,
          discount: values.discount ?? 0,
          finalAmount: values.finalAmount,
          advanceAmount: values.advanceAmount ?? 0,
          remainingAmount: Math.max(values.finalAmount - (values.advanceAmount ?? 0), 0),
        },
        payments,
        bookingSource: values.bookingSource,
        referral: values.referredBy ? { referredBy: values.referredBy } : undefined,
      });
      toast.success("Offline booking created");
      router.push("/admin/bookings");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Create Offline Booking"
        description="For bookings taken over phone, WhatsApp, or in person. Uses the same booking pipeline as the website."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Customer</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input {...register("customerName")} />
              {errors.customerName && <p className="text-xs text-destructive">{errors.customerName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Mobile</Label>
              <Input {...register("customerMobile")} />
              {errors.customerMobile && <p className="text-xs text-destructive">{errors.customerMobile.message}</p>}
              <p className="text-xs text-muted-foreground">Existing customers are matched automatically by mobile number.</p>
            </div>
            <div className="space-y-1.5">
              <Label>Email (optional)</Label>
              <Input {...register("customerEmail")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Service</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Service type</Label>
              <select {...register("serviceType")} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none">
                {BOOKING_SERVICE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            {serviceType === "festival" ? (
              <div className="space-y-1.5 md:col-span-2">
                <Label>Festival Pooja</Label>
                <select {...register("festival")} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none">
                  <option value="">Select a festival pooja (optional)</option>
                  {festivalsResult?.items.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name} — ₹{f.startingPrice}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-1.5 md:col-span-2">
                <Label>Pooja</Label>
                <Input placeholder="Search poojas..." value={poojaSearch} onChange={(e) => setPoojaSearch(e.target.value)} className="mb-1.5" />
                <select {...register("pooja")} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none">
                  <option value="">Select a pooja (optional)</option>
                  {poojasResult?.items.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} — ₹{p.startingPrice}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Date & Location</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Pooja date</Label>
              <DatePicker value={watch("poojaDate") ?? ""} onChange={(v) => setValue("poojaDate", v, { shouldValidate: true })} />
              {errors.poojaDate && <p className="text-xs text-destructive">{errors.poojaDate.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Pooja time</Label>
              <TimePicker value={watch("poojaTime") ?? ""} onChange={(v) => setValue("poojaTime", v)} />
            </div>
            <div className="space-y-1.5">
              <Label>Gotra</Label>
              <Input {...register("gotra")} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>Address</Label>
              <Input {...register("address")} />
            </div>
            <div className="space-y-1.5">
              <Label>City</Label>
              <Input {...register("city")} />
            </div>
            <div className="space-y-1.5">
              <Label>Landmark</Label>
              <Input {...register("landmark")} />
            </div>
            <div className="space-y-1.5">
              <Label>Pincode</Label>
              <Input {...register("pincode")} />
            </div>
            <div className="space-y-1.5 md:col-span-3">
              <Label>Special instructions</Label>
              <Textarea rows={2} {...register("specialInstructions")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Pricing & Payment</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Package price (₹)</Label>
              <Input type="number" {...register("packagePrice")} placeholder={selectedService ? String(selectedService.startingPrice) : ""} />
            </div>
            <div className="space-y-1.5">
              <Label>Market price (₹, optional)</Label>
              <Input type="number" {...register("marketPrice")} placeholder="MRP shown as a strikethrough" />
            </div>
            <div className="space-y-1.5">
              <Label>Discount (₹)</Label>
              <Input type="number" {...register("discount")} />
            </div>
            <div className="space-y-1.5">
              <Label>Final amount (₹)</Label>
              <Input type="number" {...register("finalAmount")} />
              {errors.finalAmount && <p className="text-xs text-destructive">{errors.finalAmount.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Advance / agreed amount (₹)</Label>
              <Input type="number" {...register("advanceAmount")} />
            </div>
            <div className="space-y-1.5">
              <Label>Amount received now (₹)</Label>
              <Input type="number" {...register("initialPaymentAmount")} />
            </div>
            <div className="space-y-1.5">
              <Label>Payment method</Label>
              <select {...register("paymentMethod")} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none">
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Booking Source & Pandit</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Booking source</Label>
              <select {...register("bookingSource")} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none">
                {BOOKING_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Referred by (optional)</Label>
              <Input {...register("referredBy")} />
            </div>
            <div className="space-y-1.5">
              <Label>Assign pandit (optional)</Label>
              <select {...register("pandit")} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none">
                <option value="">Assign later</option>
                {panditsResult?.items.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.fullName} ({p.mobile})
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Create booking
          </Button>
        </div>
      </form>
    </div>
  );
}
