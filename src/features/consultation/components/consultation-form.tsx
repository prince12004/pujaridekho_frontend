"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/shared/date-picker";
import { TimePicker } from "@/components/shared/time-picker";
import { PaymentOptionSelector, ADVANCE_AMOUNT, type PaymentOption } from "@/components/shared/payment-option-selector";
import { apiClient } from "@/lib/api-client";
import { useAuthModal } from "@/providers/auth-modal-provider";

const CONSULTATION_FEE = 500;

const consultationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  mobile: z.string().min(10, "Enter a valid mobile number"),
  email: z.string().email().optional().or(z.literal("")),
  topic: z.string().optional(),
  message: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
});

type ConsultationValues = z.infer<typeof consultationSchema>;

export function ConsultationForm() {
  const { isLoggedIn, openLogin } = useAuthModal();
  const [paymentOption, setPaymentOption] = useState<PaymentOption>("advance");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ConsultationValues>({ resolver: zodResolver(consultationSchema) });

  const onSubmit = async (values: ConsultationValues) => {
    if (!isLoggedIn) {
      openLogin(() => submitConsultation(values), values.mobile);
      return;
    }
    await submitConsultation(values);
  };

  const submitConsultation = async (values: ConsultationValues) => {
    try {
      const res = await apiClient.post("/consultations", values);
      const consultation = res.data.data;
      const amount = paymentOption === "advance" ? ADVANCE_AMOUNT : (consultation.fee ?? CONSULTATION_FEE);

      setIsRedirecting(true);
      const payRes = await apiClient.post("/payments/payu/initiate", {
        entityType: "consultation",
        entityId: consultation._id,
        amount,
        name: values.name,
        email: values.email || "guest@pujaridekho.com",
        phone: values.mobile,
      });
      const { action, fields } = payRes.data.data;
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
    } catch {
      setIsRedirecting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="mobile">Mobile</Label>
        <Input id="mobile" {...register("mobile")} />
        {errors.mobile && <p className="text-xs text-destructive">{errors.mobile.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email (optional)</Label>
        <Input id="email" {...register("email")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="topic">What do you need help with?</Label>
        <Input id="topic" placeholder="e.g. Kundli review, Muhurat selection" {...register("topic")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="preferredDate">Preferred date</Label>
          <DatePicker
            id="preferredDate"
            value={watch("preferredDate") ?? ""}
            onChange={(v) => setValue("preferredDate", v)}
            min={new Date().toISOString().split("T")[0]}
            placeholder="Choose a date"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="preferredTime">Preferred time</Label>
          <TimePicker
            id="preferredTime"
            value={watch("preferredTime") ?? ""}
            onChange={(v) => setValue("preferredTime", v)}
            placeholder="Choose a time"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">Message (optional)</Label>
        <Textarea id="message" rows={3} {...register("message")} />
      </div>

      <div className="space-y-1.5">
        <Label>Payment</Label>
        <PaymentOptionSelector value={paymentOption} onChange={setPaymentOption} fullAmountLabel={`₹${CONSULTATION_FEE}`} />
      </div>

      <Button type="submit" size="lg" className="w-full font-ui font-bold" disabled={isSubmitting || isRedirecting}>
        {(isSubmitting || isRedirecting) && <Loader2 className="size-4 animate-spin" />}
        {isRedirecting
          ? "Redirecting to payment..."
          : `Pay ₹${paymentOption === "advance" ? ADVANCE_AMOUNT : CONSULTATION_FEE} & Request Consultation`}
      </Button>
    </form>
  );
}
