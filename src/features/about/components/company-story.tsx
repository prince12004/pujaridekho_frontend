import Image from "next/image";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { images } from "@/lib/images";

export function CompanyStory() {
  return (
    <section className="py-20 sm:py-15">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <span className="font-ui inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            <span className="h-[2px] w-5 rounded-full bg-accent" />
            Our Story
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold sm:text-4xl">
            Started from one frustrating Griha Pravesh search
          </h2>
          <div className="mt-5 flex flex-col gap-4 text-muted-foreground">
            <p>
              In 2025, our founder spent four days calling temples and asking neighbours just to
              find a pandit for a family Griha Pravesh in Noida — and still ended up with someone
              whose experience nobody could vouch for.
            </p>
            <p>
              That gap became PujariDekho: a place where every pandit is actually verified, every
              price is fixed before you book, and every ritual arrives with the samagri it needs —
              no separate trip to the market the morning of.
            </p>
            <p>
              A year on, we&apos;ve stayed close to that original problem. We&apos;re still run
              by people who plan their own family&apos;s poojas on the platform, and we measure
              ourselves by whether we&apos;d trust the pandit we just booked.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-lg" style={{ maxHeight: '500px' }}>
            <Image src={images.candleGroupTable} alt="Puja ceremony setting" fill className="object-cover" sizes="(min-width: 1024px) 40vw, 90vw" />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
