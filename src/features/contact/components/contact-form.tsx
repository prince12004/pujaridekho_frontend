"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";
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
import { contactSubjects } from "@/features/contact/data";
import { mobileSchema } from "@/lib/validators";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email address"),
  phone: mobileSchema,
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message should be at least 10 characters"),
});

type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  function onSubmit() {
    setSubmitted(true);
  }

  return (
    <div className="rounded-[1.75rem] border border-border bg-card p-7 shadow-sm" style={{ maxHeight: 'fit-content' }}>
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
            <h3 className="font-heading text-xl">Message Sent</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Thank you for reaching out — our team typically replies within a few hours.
            </p>
            <Button variant="outline" className="font-ui mt-2 font-bold" onClick={() => setSubmitted(false)}>
              Send Another Message
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <h3 className="font-heading text-xl">Send Us a Message</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Full Name
                </Label>
                <input
                  {...register("name")}
                  placeholder="Your name"
                  className="h-11 w-full rounded-lg border border-input bg-muted/60 px-3.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                />
                {errors.name ? <p className="mt-1 text-xs text-destructive">{errors.name.message}</p> : null}
              </div>
              <div>
                <Label className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Mobile Number
                </Label>
                <input
                  {...register("phone")}
                  inputMode="numeric"
                  placeholder="98765 43210"
                  className="h-11 w-full rounded-lg border border-input bg-muted/60 px-3.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                />
                {errors.phone ? <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p> : null}
              </div>
            </div>

            <div>
              <Label className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Email Address
              </Label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="h-11 w-full rounded-lg border border-input bg-muted/60 px-3.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              {errors.email ? <p className="mt-1 text-xs text-destructive">{errors.email.message}</p> : null}
            </div>

            <div>
              <Label className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Subject
              </Label>
              <Select onValueChange={(v) => setValue("subject", v, { shouldValidate: true })}>
                <SelectTrigger className="h-11 w-full bg-muted/60 px-3.5">
                  <SelectValue placeholder="What is this about?" />
                </SelectTrigger>
                <SelectContent>
                  {contactSubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subject ? <p className="mt-1 text-xs text-destructive">{errors.subject.message}</p> : null}
            </div>

            <div>
              <Label className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Message
              </Label>
              <Textarea
                {...register("message")}
                placeholder="Tell us how we can help…"
                rows={5}
                className="bg-muted/60"
              />
              {errors.message ? <p className="mt-1 text-xs text-destructive">{errors.message.message}</p> : null}
            </div>

            <Button type="submit" size="lg" className="font-ui mt-1 font-bold">
              <Send size={16} /> Send Message
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
