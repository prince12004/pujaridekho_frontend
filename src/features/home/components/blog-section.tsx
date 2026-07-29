import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { MediaCard, MediaCardBody, MediaCardImage } from "@/components/shared/media-card";
import { env } from "@/lib/env";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=1600&auto=format&fit=crop";

interface PublicBlogPost {
  _id: string;
  slug: string;
  title: string;
  coverImage?: string;
  content: string;
  category?: { name: string };
}

function estimateReadTime(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

async function fetchBlogPosts(): Promise<PublicBlogPost[]> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/blogs?limit=3`, { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data?.items ?? [];
}

export async function BlogSection() {
  const posts = await fetchBlogPosts();
  if (posts.length === 0) return null;

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
          {posts.map((post, i) => (
            <Reveal key={post._id} delay={i * 0.08}>
              <MediaCard href={`/blog/${post.slug}`}>
                <MediaCardImage src={post.coverImage ?? FALLBACK_IMAGE} alt={post.title} height="h-55" />
                <MediaCardBody>
                  <div className="flex gap-2 text-xs font-semibold text-muted-foreground">
                    {post.category?.name && <span>{post.category.name}</span>}
                    {post.category?.name && <span>·</span>}
                    <span>{estimateReadTime(post.content)}</span>
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
