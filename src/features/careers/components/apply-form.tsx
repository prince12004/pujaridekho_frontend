"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, LinkIcon, Upload } from "lucide-react";
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
import { openPositions } from "@/features/careers/data";
import { mobileSchema } from "@/lib/validators";

const applySchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: mobileSchema,
  position: z.string().min(1, "Please select a position"),
  resumeUrl: z.string().url("Share a valid link (Google Drive, LinkedIn, portfolio, etc.)"),
  message: z.string().optional(),
});

type ApplyValues = z.infer<typeof applySchema>;

export function ApplyForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ApplyValues>({ resolver: zodResolver(applySchema) });

  function onSubmit() {
    setSubmitted(true);
  }

  return (
    <section id="apply" className="py-20 sm:py-15">
      <Container className="max-w-2xl">
        <SectionHeading
          eyebrow="Ready to Join?"
          title="Apply Now"
          description="Tell us a little about yourself — we read every application."
          align="center"
          className="mx-auto mb-10"
        />

        <div className="rounded-[1.75rem] border border-border bg-card p-7 shadow-sm sm:p-9">
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
                <h3 className="font-heading text-xl">Application Submitted</h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Thank you for applying — our team will reach out within a week if there&apos;s a fit.
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
                    <input {...register("name")} placeholder="Your name" className="h-11 w-full rounded-lg border border-input bg-muted/60 px-3.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50" />
                    {errors.name ? <p className="mt-1 text-xs text-destructive">{errors.name.message}</p> : null}
                  </div>
                  <div>
                    <Label className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Mobile Number</Label>
                    <input {...register("phone")} inputMode="numeric" placeholder="98765 43210" className="h-11 w-full rounded-lg border border-input bg-muted/60 px-3.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50" />
                    {errors.phone ? <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p> : null}
                  </div>
                </div>

                <div>
                  <Label className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Email Address</Label>
                  <input {...register("email")} type="email" placeholder="you@example.com" className="h-11 w-full rounded-lg border border-input bg-muted/60 px-3.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50" />
                  {errors.email ? <p className="mt-1 text-xs text-destructive">{errors.email.message}</p> : null}
                </div>

                <div>
                  <Label className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Position</Label>
                  <Select onValueChange={(v) => setValue("position", v, { shouldValidate: true })}>
                    <SelectTrigger className="h-11 w-full bg-muted/60 px-3.5">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {openPositions.map((job) => (
                        <SelectItem key={job.title} value={job.title}>{job.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.position ? <p className="mt-1 text-xs text-destructive">{errors.position.message}</p> : null}
                </div>

                <div>
                  <Label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    <LinkIcon size={12} /> Resume / Portfolio Link
                  </Label>
                  <input {...register("resumeUrl")} placeholder="https://…" className="h-11 w-full rounded-lg border border-input bg-muted/60 px-3.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50" />
                  {errors.resumeUrl ? <p className="mt-1 text-xs text-destructive">{errors.resumeUrl.message}</p> : null}
                </div>

                <div>
                  <Label className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Why are you interested?</Label>
                  <Textarea {...register("message")} placeholder="A couple of lines is plenty" rows={3} className="bg-muted/60" />
                </div>

                <div className="flex items-center gap-2.5 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3 text-xs font-semibold text-muted-foreground">
                  <Upload size={15} className="text-primary" />
                  Share your resume as a link — direct file upload isn&apos;t needed for this application.
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
