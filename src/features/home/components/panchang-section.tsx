import Image from "next/image";
import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { PanchangCard, type PanchangCardData } from "@/features/home/components/panchang-card";
import { images } from "@/lib/images";
import { env } from "@/lib/env";

async function fetchTodayPanchang(): Promise<PanchangCardData | null> {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/panchang`, { cache: "no-store" });
    if (!response.ok) return null;
    const json = await response.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function PanchangSection() {
  const panchang = await fetchTodayPanchang();
  const todayIso = panchang?.date ?? new Date().toISOString().slice(0, 10);

  return (
    <section className="py-20 sm:py-15">
      <Container>
        <SectionHeading
          eyebrow="Daily Guidance"
          title="Today's Panchang"
          description="Auspicious timings for today, drawn fresh every morning — plus expert guidance when you need it."
          className="mb-12"
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.85fr]">
          <PanchangCard initialPanchang={panchang} initialDate={todayIso} />

          <Reveal delay={0.1}>
            <Link
              href="/consultation"
              className="group relative flex h-full min-h-[260px] flex-col justify-end overflow-hidden rounded-2xl p-7 text-white shadow-sm"
            >
              <Image
                src={images.incenseSmoke}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-purple-deep via-brand-purple-deep/60 to-brand-purple-deep/10" />
              <span className="relative font-ui text-xs font-bold uppercase tracking-wide text-brand-gold-soft">
                Need Guidance?
              </span>
              <h3 className="white relative mt-1.5 font-heading text-2xl font-bold">
                Book a Consultation
              </h3>
              <p className="relative mt-2 max-w-xs text-sm text-white/85">
                Call, chat or video — get clarity on muhurat, doshas and life questions.
              </p>
              <Button className="font-ui relative mt-5 w-fit font-bold" variant="secondary" asChild>
                <span>
                  <PhoneCall size={16} /> Book a Consultation
                </span>
              </Button>
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
