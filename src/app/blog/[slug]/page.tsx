import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { AuthorByline } from "@/components/shared/author-byline";
import { SocialShare } from "@/components/shared/social-share";
import { TableOfContents } from "@/components/shared/table-of-contents";
import { PrevNextNav } from "@/components/shared/prev-next-nav";
import { Container } from "@/components/shared/container";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { buildMetadata } from "@/lib/seo";
import { extractToc } from "@/lib/toc";
import { env } from "@/lib/env";
import type { PublicBlogDetail } from "@/features/blog/api/use-blogs";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=1600&auto=format&fit=crop";

async function fetchBlog(slug: string): Promise<PublicBlogDetail | null> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/blogs/${slug}`, { cache: "no-store" });
  if (!response.ok) return null;
  const json = await response.json();
  return json.data;
}

function estimateReadTime(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchBlog(slug);
  if (!data) return {};

  return buildMetadata({
    title: data.blog.title,
    description: data.blog.excerpt ?? data.blog.title,
    path: `/blog/${data.blog.slug}`,
    image: data.blog.coverImage ?? FALLBACK_IMAGE,
  });
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await fetchBlog(slug);
  if (!data) notFound();
  const { blog: post, previous, next } = data;

  const toc = extractToc(post.content);
  const category = typeof post.category === "object" ? post.category?.name : post.category;
  const postUrl = `${env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(
          [{ name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }],
          env.NEXT_PUBLIC_SITE_URL,
        )}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          image: post.coverImage ?? FALLBACK_IMAGE,
          datePublished: post.publishedAt,
          author: { "@type": "Organization", name: post.author ?? "PujariDekho Team" },
          publisher: { "@type": "Organization", name: "PujariDekho" },
        }}
      />

      <div className="relative h-[350px] w-full overflow-hidden sm:h-[420px]">
        <img src={post.coverImage ?? FALLBACK_IMAGE} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-purple-deep/85 via-brand-purple-deep/20 to-transparent" />
        <Container className="absolute inset-0 flex flex-col justify-end pb-10">
          <Breadcrumb
            items={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
            className="mb-4 [&_a]:text-brand-cream/70 [&_span]:text-brand-gold-soft [&_svg]:text-brand-cream/40"
          />
          {category && <span className="font-ui text-xs font-bold uppercase tracking-wide text-brand-gold-soft">{category}</span>}
          <h1 className="mt-2 max-w-3xl text-balance font-heading text-3xl font-bold text-brand-cream sm:text-4xl">
            {post.title}
          </h1>
        </Container>
      </div>

      <Container className="py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <AuthorByline
            name={post.author ?? "PujariDekho Team"}
            role="Ritual Experts"
            date={post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""}
            readTime={estimateReadTime(post.content)}
          />
          <SocialShare url={postUrl} title={post.title} />
        </div>
      </Container>

      <Container className="grid grid-cols-1 gap-12 pb-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents items={toc} />
          </div>
        </aside>

        <div className="min-w-0 max-w-6xl">
          <div className="prose-policy" dangerouslySetInnerHTML={{ __html: post.content }} />

          <PrevNextNav
            prev={previous ? { label: "Previous", title: previous.title, href: `/blog/${previous.slug}` } : undefined}
            next={next ? { label: "Next", title: next.title, href: `/blog/${next.slug}` } : undefined}
            className="mt-12"
          />
        </div>
      </Container>
    </>
  );
}
