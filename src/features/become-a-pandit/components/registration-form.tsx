"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Upload } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bookingCities } from "@/features/home/data";
import { mobileSchema } from "@/lib/validators";

const registrationSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  mobile: mobileSchema,
  email: z.string().email("Enter a valid email address"),
  city: z.string().min(1, "Please select your city"),
  experience: z.string().min(1, "Please select your experience"),
  specialization: z.string().min(2, "Tell us your specialization"),
  message: z.string().optional(),
});

type RegistrationValues = z.infer<typeof registrationSchema>;

const experienceOptions = ["3–5 years", "6–10 years", "11–20 years", "20+ years"];

export function RegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegistrationValues>({ resolver: zodResolver(registrationSchema) });

  function onSubmit() {
    setSubmitted(true);
  }

  return (
    <section className="py-20 sm:py-15">
      <Container className="max-w-2xl">
        <SectionHeading
          eyebrow="Join Us"
          title="Register as a Pandit"
          description="Takes about 3 minutes — our team reviews every application personally."
          align="center"
          className="mx-auto mb-10"
        />

        <div className="rounded-[1.75rem] border border-border bg-card p-7 shadow-sm sm:p-9" >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-3 py-10 text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <CheckCircle2 size={30} />
                </span>
                <h3 className="font-heading text-xl">Application Received</h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Our team will review your details and call you within 2–3 business days for verification.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Full Name</Label>
                    <input {...register("name")} placeholder="Pandit Ji's name" className="h-11 w-full rounded-lg border border-input bg-muted/60 px-3.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50" />
                    {errors.name ? <p className="mt-1 text-xs text-destructive">{errors.name.message}</p> : null}
                  </div>
                  <div>
                    <Label className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Mobile Number</Label>
                    <input {...register("mobile")} inputMode="numeric" placeholder="98765 43210" className="h-11 w-full rounded-lg border border-input bg-muted/60 px-3.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50" />
                    {errors.mobile ? <p className="mt-1 text-xs text-destructive">{errors.mobile.message}</p> : null}
                  </div>
                </div>

                <div>
                  <Label className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Email Address</Label>
                  <input {...register("email")} type="email" placeholder="you@example.com" className="h-11 w-full rounded-lg border border-input bg-muted/60 px-3.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50" />
                  {errors.email ? <p className="mt-1 text-xs text-destructive">{errors.email.message}</p> : null}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">City</Label>
                    <Select onValueChange={(v) => setValue("city", v, { shouldValidate: true })}>
                      <SelectTrigger className="h-11 w-full bg-muted/60 px-3.5">
                        <SelectValue placeholder="Select your city" />
                      </SelectTrigger>
                      <SelectContent>
                        {bookingCities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.city ? <p className="mt-1 text-xs text-destructive">{errors.city.message}</p> : null}
                  </div>
                  <div>
                    <Label className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Experience</Label>
                    <Select onValueChange={(v) => setValue("experience", v, { shouldValidate: true })}>
                      <SelectTrigger className="h-11 w-full bg-muted/60 px-3.5">
                        <SelectValue placeholder="Years of experience" />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.experience ? <p className="mt-1 text-xs text-destructive">{errors.experience.message}</p> : null}
                  </div>
                </div>

                <div>
                  <Label className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Specialization</Label>
                  <input {...register("specialization")} placeholder="e.g. Satyanarayan Puja, Griha Pravesh, Vivah" className="h-11 w-full rounded-lg border border-input bg-muted/60 px-3.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50" />
                  {errors.specialization ? <p className="mt-1 text-xs text-destructive">{errors.specialization.message}</p> : null}
                </div>

                <div>
                  <Label className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Anything else we should know?</Label>
                  <Textarea {...register("message")} placeholder="Optional — training lineage, temple affiliation, etc." rows={3} className="bg-muted/60" />
                </div>

                <div className="flex items-center gap-2.5 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3 text-xs font-semibold text-muted-foreground">
                  <Upload size={15} className="text-primary" />
                  You&apos;ll be asked to share ID and address proof over WhatsApp after this form is reviewed.
                </div>

                <Button type="submit" size="lg" className="font-ui mt-1 font-bold">
                  Submit Application
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
