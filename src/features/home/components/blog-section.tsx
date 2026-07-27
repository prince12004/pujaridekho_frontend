import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { MediaCard, MediaCardBody, MediaCardImage } from "@/components/shared/media-card";
import { images } from "@/lib/images";
import { blogPosts } from "@/features/home/data";

export function BlogSection() {
  return (
    <section id="blog" className="bg-muted/40 py-20 sm:py-15">
      <Container>
        <SectionHeading
          eyebrow="Learn & Prepare"
          title="From the Blog"
          description="Vidhi guides, muhurat dates and festival explainers."
          className="mb-12"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.08}>
              <MediaCard href={`/blog/${post.slug}`}>
                <MediaCardImage src={images[post.image]} alt={post.title} height="h-44" />
                <MediaCardBody>
                  <div className="flex gap-2 text-xs font-semibold text-muted-foreground">
                    <span>{post.category}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-heading text-lg leading-snug">{post.title}</h3>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                    Read More <ArrowRight size={14} />
                  </span>
                </MediaCardBody>
              </MediaCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
