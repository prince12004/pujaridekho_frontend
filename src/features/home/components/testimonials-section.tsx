import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { HorizontalScroller } from "@/components/shared/horizontal-scroller";
import { ReviewCard } from "@/components/shared/review-card";
import { env } from "@/lib/env";

interface PublicTestimonial {
  _id: string;
  name: string;
  location?: string;
  rating: number;
  quote: string;
}

async function fetchTestimonials(): Promise<PublicTestimonial[]> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/testimonials`, { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export async function TestimonialsSection() {
  const testimonials = await fetchTestimonials();
  if (testimonials.length === 0) return null;

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
            <div key={testimonial._id} className="w-[340px] shrink-0" style={{ scrollSnapAlign: "start" }}>
              <ReviewCard
                name={testimonial.name}
                subtitle={testimonial.location ?? ""}
                rating={testimonial.rating}
                quote={testimonial.quote}
                seed={i}
                className="h-full"
              />
            </div>
          ))}
        </HorizontalScroller>
      </Container>
    </section>
  );
}
