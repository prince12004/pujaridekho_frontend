"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/shared/date-picker";
import { TimePicker } from "@/components/shared/time-picker";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

const kundliSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  dateOfBirth: z.string().min(1, "Please select your date of birth"),
  timeOfBirth: z.string().min(1, "Please select your time of birth"),
  placeOfBirth: z.string().min(2, "Please enter your place of birth"),
  question: z.string().optional(),
});

type KundliFormValues = z.infer<typeof kundliSchema>;

interface KundliPlanet {
  planet: string;
  rashi: string;
  nakshatra: string;
  pada: number;
}

interface KundliApiResult {
  ascendant: { rashi: string };
  planets: KundliPlanet[];
  moonRashi: string;
  moonNakshatra: string;
  moonPada: number;
  sunRashi: string;
  locationUsed: string;
  ayanamsa: number;
}

function useKundliCities() {
  return useQuery<string[]>({
    queryKey: ["public", "kundli-cities"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: string[] }>("/kundli/cities");
      return res.data.data;
    },
  });
}

export function KundliGenerator() {
  const [result, setResult] = useState<KundliApiResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data: cities } = useKundliCities();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<KundliFormValues>({
    resolver: zodResolver(kundliSchema),
    defaultValues: { name: "", dateOfBirth: "", timeOfBirth: "", placeOfBirth: "", question: "" },
  });

  const onSubmit = async (values: KundliFormValues) => {
    setError(null);
    try {
      const res = await apiClient.post("/kundli", {
        name: values.name,
        dob: values.dateOfBirth,
        tob: values.timeOfBirth,
        place: values.placeOfBirth,
      });
      setResult(res.data.data);
    } catch {
      setError("Could not generate Kundli right now. Please try again.");
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
      <div className="rounded-[1.75rem] border border-border bg-card p-8 shadow-sm">
        <h2 className="font-heading text-2xl font-bold">Generate Your Kundli</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Enter your birth details for a real Janam Kundli computed from planetary positions — Rashi, Nakshatra and
          Ascendant, using the Lahiri (Chitrapaksha) ayanamsa.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Full Name</Label>
              <Input {...register("name")} placeholder="Your name" />
              {errors.name ? <p className="mt-1 text-xs text-destructive">{errors.name.message}</p> : null}
            </div>
            <div>
              <Label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Place of Birth</Label>
              <Input {...register("placeOfBirth")} placeholder="City" list="kundli-cities" />
              <datalist id="kundli-cities">
                {cities?.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
              {errors.placeOfBirth ? <p className="mt-1 text-xs text-destructive">{errors.placeOfBirth.message}</p> : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Date of Birth</Label>
              <DatePicker
                value={watch("dateOfBirth")}
                onChange={(v) => setValue("dateOfBirth", v, { shouldValidate: true })}
                max={new Date().toISOString().split("T")[0]}
                placeholder="Choose your date of birth"
              />
              {errors.dateOfBirth ? <p className="mt-1 text-xs text-destructive">{errors.dateOfBirth.message}</p> : null}
            </div>
            <div>
              <Label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Time of Birth</Label>
              <TimePicker
                value={watch("timeOfBirth")}
                onChange={(v) => setValue("timeOfBirth", v, { shouldValidate: true })}
                stepMinutes={5}
                placeholder="Choose time of birth"
              />
              {errors.timeOfBirth ? <p className="mt-1 text-xs text-destructive">{errors.timeOfBirth.message}</p> : null}
            </div>
            <div className="sm:col-span-1">
              <Label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Your Question</Label>
              <Textarea {...register("question")} placeholder="Optional: Your main concern" rows={2} className="min-h-[72px]" />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" size="lg" className="font-ui font-bold" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Generate Kundli
          </Button>
        </form>
      </div>

      <div className="space-y-6">
        <div className="rounded-[1.75rem] border border-border bg-card p-8 shadow-sm">
          <h3 className="font-heading text-xl font-bold">What you get</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>• Real Janam Kundli computed from planetary positions (not a demo)</li>
            <li>• Moon Rashi, Nakshatra, Pada and Ascendant (Lagna)</li>
            <li>• Positions of all seven classical grahas</li>
            <li>• Suggested next step for a full astrology consultation</li>
          </ul>
        </div>

        {result ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[1.75rem] border border-border bg-gradient-to-br from-secondary/10 to-card p-8 shadow-sm"
          >
            <h3 className="font-heading text-xl font-bold">Your Kundli Summary</h3>
            <p className="mt-1 text-xs text-muted-foreground">Location used: {result.locationUsed}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { label: "Moon Rashi", value: result.moonRashi },
                { label: "Nakshatra", value: `${result.moonNakshatra} (Pada ${result.moonPada})` },
                { label: "Ascendant (Lagna)", value: result.ascendant.rashi },
                { label: "Sun Rashi", value: result.sunRashi },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-border bg-card p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-3xl border border-border bg-white/80 p-5 text-sm leading-6 text-muted-foreground">
              <p className="mb-3 font-semibold text-foreground">Planetary Positions</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {result.planets.map((planet) => (
                  <div key={planet.planet} className="rounded-xl bg-muted/60 p-2.5 text-xs">
                    <p className="font-bold text-foreground">{planet.planet}</p>
                    <p>{planet.rashi}</p>
                    <p className="text-muted-foreground/80">
                      {planet.nakshatra} · Pada {planet.pada}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground/75">Note</p>
              <p className="mt-2 text-sm">
                This Kundli is computed live using real planetary positions and the Lahiri ayanamsa — book a
                consultation with our team for a full interpretation and remedies.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="rounded-[1.75rem] border border-border bg-card p-8 shadow-sm">
            <h3 className="font-heading text-xl font-bold">Ready to generate?</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Enter your birth details to see your real Kundli and the next best step for a detailed astrology
              consultation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
