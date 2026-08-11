import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { BlogDetailContent } from "@/features/blog/components/blog-detail-content";
import { buildMetadata } from "@/lib/seo";
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

  const category = typeof post.category === "object" ? post.category?.name : post.category;

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
          datePublished: post.PublishedAt,
          author: { "@type": "Organization", name: post.author ?? "PujariDekho Team" },
          publisher: { "@type": "Organization", name: "PujariDekho" },
        }}
      />

      <BlogDetailContent
        title={post.title}
        excerpt={post.excerpt}
        category={category ?? undefined}
        coverImage={post.coverImage ?? FALLBACK_IMAGE}
        author={post.author ?? "PujariDekho Team"}
        date={post.PublishedAt ? new Date(post.PublishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""}
        readTime={estimateReadTime(post.content)}
        content={post.content}
        previous={previous ? { label: "Previous", title: previous.title, href: `/blog/${previous.slug}` } : undefined}
        next={next ? { label: "Next", title: next.title, href: `/blog/${next.slug}` } : undefined}
      />
    </>
  );
}
