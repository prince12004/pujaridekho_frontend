import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { ReviewCard } from "@/components/shared/review-card";
import { SERVER_API_URL } from "@/lib/server-env";

// Published testimonials from Admin → Testimonials (same source as the homepage).
interface PublicTestimonial {
  _id: string;
  name: string;
  location?: string;
  rating: number;
  quote: string;
}

async function fetchTestimonials(): Promise<PublicTestimonial[]> {
  try {
    const res = await fetch(`${SERVER_API_URL}/testimonials`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return ((await res.json()).data ?? []) as PublicTestimonial[];
  } catch {
    return [];
  }
}

export async function CustomerTrust() {
  const featured = (await fetchTestimonials()).slice(0, 3);
  if (featured.length === 0) return null;

  return (
    <section className="bg-muted/40 py-20 sm:py-15">
      <Container>
        <SectionHeading
          eyebrow="Customer Trust"
          title="What Families Say About Us"
          description="Reviews from families who have booked their pujas with PujariDekho."
          align="center"
          className="mx-auto mb-12"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {featured.map((testimonial, i) => (
            <Reveal key={testimonial._id} delay={i * 0.08}>
              <ReviewCard
                name={testimonial.name}
                subtitle={testimonial.location ?? ""}
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
