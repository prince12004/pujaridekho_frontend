import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { images } from "@/lib/images";

export function CompanyStory() {
  return (
    <section className="overflow-x-clip py-20 sm:py-15">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <span className="font-ui inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            <span className="h-[2px] w-5 rounded-full bg-accent" />
            Our Story
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold sm:text-4xl">
            Started from one difficult Griha Pravesh search
          </h2>
          <div className="mt-5 flex flex-col gap-4 text-muted-foreground">
            <p>
              In 2025, our founder spent four days calling temples and asking neighbours just to
              find a pandit for a family Griha Pravesh in Noida — and still ended up with someone
              whose experience nobody could vouch for.
            </p>
            <p>
              That gap became PujariDekho: a platform where every pandit is verified, every price
              is fixed before you book, and an optional samagri kit means no last-minute trip to
              the market on the morning of the puja.
            </p>
            <p>
              Today we serve families across Delhi NCR, and we still measure ourselves by one
              simple standard: would we trust this pandit with our own family&apos;s puja?
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          {/* Image collage: main photo, an overlapping detail photo and two trust badges. */}
          <div className="relative mx-auto w-full max-w-[540px] pb-10 pl-6 sm:pb-14 sm:pl-12">
            <span
              aria-hidden
              className="absolute -right-3 -top-5 h-32 w-32 rounded-3xl opacity-70 sm:-right-6 sm:h-40 sm:w-40"
              style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, rgba(217,164,65,0.55) 1.4px, transparent 1.6px)",
                backgroundSize: "14px 14px",
              }}
            />
            <div className="group relative aspect-[4/5] max-h-[560px] w-full overflow-hidden rounded-[1.75rem] shadow-[0_30px_60px_-30px_rgba(48,32,79,0.55)]">
              <Image
                src={images.ganeshIdol}
                alt="Ganesh idol decorated for a puja ceremony"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(min-width: 1024px) 540px, 90vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-purple-deep/45 via-transparent to-transparent" />
              <span className="font-ui absolute bottom-5 right-5 rounded-full bg-white/90 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary shadow-sm backdrop-blur">
                Since 2025 · Delhi NCR
              </span>
            </div>

            <div className="absolute bottom-0 left-0 aspect-square w-[42%] overflow-hidden rounded-2xl border-[5px] border-background shadow-xl">
              <Image
                src={images.candlesCircleFloor}
                alt="Diyas arranged in a flower rangoli"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 230px, 40vw"
              />
            </div>

            <div className="absolute -right-2 top-8 flex items-center gap-3 rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur sm:-right-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-brand-gold text-white">
                <ShieldCheck size={20} />
              </span>
              <span className="leading-tight">
                <span className="font-heading block text-sm font-bold text-foreground">Verified Pandits</span>
                <span className="block text-xs text-muted-foreground">Fixed, transparent pricing</span>
              </span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
