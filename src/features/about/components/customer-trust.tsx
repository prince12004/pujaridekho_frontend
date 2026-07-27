import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { ReviewCard } from "@/components/shared/review-card";
import { testimonials } from "@/features/home/data";

export function CustomerTrust() {
  const featured = testimonials.slice(0, 3);

  return (
    <section className="bg-muted/40 py-20 sm:py-15">
      <Container>
        <SectionHeading
          eyebrow="Customer Trust"
          title="Families who booked, and stayed"
          description="A sample of the reviews our pandits and services have earned."
          align="center"
          className="mx-auto mb-12"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {featured.map((testimonial, i) => (
            <Reveal key={testimonial.name} delay={i * 0.08}>
              <ReviewCard
                name={testimonial.name}
                subtitle={testimonial.location}
                rating={testimonial.rating}
                quote={testimonial.quote}
                seed={i}
                className="h-full"
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
