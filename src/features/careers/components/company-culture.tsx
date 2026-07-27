import Image from "next/image";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { images } from "@/lib/images";
import { cultureValues } from "@/features/careers/data";

export function CompanyCulture() {
  return (
    <section className="bg-muted/40 py-20 sm:py-15">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <Reveal delay={0.1} className="order-2 lg:order-1">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-lg">
            <Image src={images.marigold} alt="Marigold flowers, a symbol of the culture we build around" fill className="object-cover" sizes="(min-width: 1024px) 40vw, 90vw" />
          </div>
        </Reveal>
        <Reveal className="order-1 lg:order-2">
          <span className="font-ui inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            <span className="h-[2px] w-5 rounded-full bg-accent" />
            Company Culture
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold sm:text-4xl">
            We work the way we&apos;d want a pandit to show up at our own door
          </h2>
          <ul className="mt-5 flex flex-col gap-4">
            {cultureValues.map((value) => (
              <li key={value} className="flex gap-3 text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {value}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
