import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { AuthorByline } from "@/components/shared/author-byline";
import { SocialShare } from "@/components/shared/social-share";
import { TableOfContents } from "@/components/shared/table-of-contents";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { RelatedSection } from "@/components/shared/related-section";
import { NewsletterSection } from "@/components/shared/newsletter-section";
import { CommentsSection } from "@/components/shared/comments-section";
import { PrevNextNav } from "@/components/shared/prev-next-nav";
import { Container } from "@/components/shared/container";
import { MediaCard, MediaCardBody, MediaCardImage } from "@/components/shared/media-card";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { PoojaCard } from "@/features/home/components/pooja-card";
import { featuredPoojas, religiousProducts } from "@/features/home/data";
import { blogPosts, getAdjacentPosts, getPostBySlug } from "@/features/blog/data";
import { buildMetadata } from "@/lib/seo";
import { extractToc } from "@/lib/toc";
import { images } from "@/lib/images";
import { env } from "@/lib/env";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: images[post.image],
  });
}

const demoComments = [
  { name: "Sunita Rao", date: "2 days ago", message: "This was so helpful — we followed the vidhi order exactly and our pandit said we'd prepared well." },
  { name: "Manoj Gupta", date: "5 days ago", message: "Didn't know about the Shunya Maas restriction, glad I checked before finalising our date." },
];

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const toc = extractToc(post.contentHtml);
  const { prev, next } = getAdjacentPosts(post.slug);
  const relatedPoojas = featuredPoojas.filter((p) => post.relatedPoojaSlugs.includes(p.slug));
  const relatedProducts = religiousProducts.filter((p) => post.relatedProductSlugs.includes(p.slug));
  const relatedBlogs = blogPosts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 3);
  const postUrl = `${env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ],
          env.NEXT_PUBLIC_SITE_URL,
        )}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          image: images[post.image],
          datePublished: post.publishDate,
          author: { "@type": "Person", name: post.author.name },
          publisher: { "@type": "Organization", name: "PujariDekho" },
        }}
      />
      {post.faq.length > 0 ? <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: post.faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }} /> : null}

      <div className="relative h-[350px] w-full overflow-hidden sm:h-[420px]">
        <Image src={images[post.image]} alt={post.title} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-purple-deep/85 via-brand-purple-deep/20 to-transparent" />
        <Container className="absolute inset-0 flex flex-col justify-end pb-10">
          <Breadcrumb
            items={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
            className="mb-4 [&_a]:text-brand-cream/70 [&_span]:text-brand-gold-soft [&_svg]:text-brand-cream/40"
          />
          <span className="font-ui text-xs font-bold uppercase tracking-wide text-brand-gold-soft">{post.category}</span>
          <h1 className="mt-2 max-w-3xl text-balance font-heading text-3xl font-bold text-brand-cream sm:text-4xl">
            {post.title}
          </h1>
        </Container>
      </div>

      <Container className="py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <AuthorByline name={post.author.name} role={post.author.role} date={new Date(post.publishDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} readTime={post.readTime} />
          <SocialShare url={postUrl} title={post.title} />
        </div>
      </Container>

      <Container className="grid grid-cols-1 gap-12 pb-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents items={toc} />
          </div>
        </aside>

        <div className="min-w-0 max-w-2xl">
          <div className="prose-policy" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

          {post.faq.length > 0 ? (
            <div className="mt-12">
              <h2 className="font-heading mb-5 text-2xl">Frequently Asked Questions</h2>
              <FaqAccordion items={post.faq} />
            </div>
          ) : null}

          {relatedPoojas.length > 0 ? (
            <RelatedSection title="Related Poojas">
              {relatedPoojas.map((pooja) => (
                <PoojaCard key={pooja.slug} pooja={pooja} />
              ))}
            </RelatedSection>
          ) : null}

          {relatedProducts.length > 0 ? (
            <RelatedSection title="Related Products">
              {relatedProducts.map((product) => (
                <MediaCard key={product.slug}>
                  <MediaCardImage src={images[product.image]} alt={product.name} height="h-36" />
                  <MediaCardBody>
                    <span className="font-heading text-sm">{product.name}</span>
                    <span className="font-heading text-base text-secondary">₹{product.price.toLocaleString("en-IN")}</span>
                  </MediaCardBody>
                </MediaCard>
              ))}
            </RelatedSection>
          ) : null}

          {relatedBlogs.length > 0 ? (
            <RelatedSection title="Related Blogs">
              {relatedBlogs.map((blog) => (
                <MediaCard key={blog.slug} href={`/blog/${blog.slug}`}>
                  <MediaCardImage src={images[blog.image]} alt={blog.title} height="h-36" />
                  <MediaCardBody>
                    <span className="text-xs font-semibold text-muted-foreground">{blog.readTime}</span>
                    <span className="font-heading text-sm leading-snug">{blog.title}</span>
                  </MediaCardBody>
                </MediaCard>
              ))}
            </RelatedSection>
          ) : null}

          <PrevNextNav
            prev={prev ? { label: "Previous", title: prev.title, href: `/blog/${prev.slug}` } : undefined}
            next={next ? { label: "Next", title: next.title, href: `/blog/${next.slug}` } : undefined}
            className="mt-12"
          />

          <CommentsSection initialComments={demoComments} className="mt-14" />
        </div>
      </Container>

      <NewsletterSection />
    </>
  );
}
