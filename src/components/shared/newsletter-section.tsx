"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Mail } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type NewsletterValues = z.infer<typeof newsletterSchema>;

export function NewsletterSection({
  title = "Never Miss a Muhurat",
  description = "Vidhi guides, festival dates and puja tips — straight to your inbox.",
  className,
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  const [subscribed, setSubscribed] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewsletterValues>({ resolver: zodResolver(newsletterSchema) });

  function onSubmit() {
    setSubscribed(true);
  }

  return (
    <section className={cn("py-16", className)}>
      <Container>
        <div className="flex flex-col items-center gap-5 rounded-[1.75rem] border border-border bg-card px-7 py-12 text-center shadow-sm">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white">
            <Mail size={22} />
          </span>
          <div>
            <h2 className="font-heading text-2xl">{title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
          </div>

          {subscribed ? (
            <p className="flex items-center gap-2 font-bold text-emerald-600">
              <CheckCircle2 size={18} /> You&apos;re subscribed — welcome aboard!
            </p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
              <div className="flex-1">
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-lg border border-input bg-muted/60 px-4 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                />
                {errors.email ? <p className="mt-1 text-left text-xs text-destructive">{errors.email.message}</p> : null}
              </div>
              <Button type="submit" className="font-ui h-11 font-bold">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
