import { Play } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { HorizontalScroller } from "@/components/shared/horizontal-scroller";
import { ReviewCard } from "@/components/shared/review-card";
import { testimonials } from "@/features/home/data";

export function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-15">
      <Container>
        <SectionHeading
          eyebrow="Real Stories"
          title="What Families Say"
          description="Ratings and reviews from families across Delhi NCR."
          className="mb-10"
        />

        <HorizontalScroller>
          {testimonials.map((testimonial, i) => (
            <div key={testimonial.name} className="w-[340px] shrink-0" style={{ scrollSnapAlign: "start" }}>
              <ReviewCard
                name={testimonial.name}
                subtitle={testimonial.location}
                rating={testimonial.rating}
                quote={testimonial.quote}
                seed={i}
                className="h-full"
              />
            </div>
          ))}

          <div
            className="flex w-[220px] shrink-0 flex-col items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-secondary to-brand-purple-deep p-6 text-center text-white shadow-sm"
            style={{ scrollSnapAlign: "start" }}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-brand-gold-soft text-brand-gold-soft">
              <Play size={22} className="fill-current" />
            </span>
            <span className="text-sm font-bold text-brand-gold-soft">Watch Their Story</span>
            <span className="text-xs text-white/70">Rajesh &amp; Kavita Oberoi · Faridabad</span>
          </div>
        </HorizontalScroller>
      </Container>
    </section>
  );
}
