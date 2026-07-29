import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/shared/page-banner";
import { Container } from "@/components/shared/container";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { buildMetadata } from "@/lib/seo";
import { env } from "@/lib/env";

interface CmsPageData {
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
}

async function fetchPage(slug: string): Promise<CmsPageData | null> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/pages/${slug}`, { cache: "no-store" });
  if (!response.ok) return null;
  const json = await response.json();
  return json.data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchPage(slug);
  if (!page) return {};

  return buildMetadata({
    title: page.metaTitle ?? page.title,
    description: page.metaDescription ?? page.title,
    path: `/pages/${slug}`,
  });
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await fetchPage(slug);
  if (!page) notFound();

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: page.title, path: `/pages/${slug}` }], env.NEXT_PUBLIC_SITE_URL)} />
      <PageBanner title={page.title} breadcrumbItems={[{ label: page.title }]} />
      <Container className="max-w-[820px] py-16">
        <div className="prose-policy" dangerouslySetInnerHTML={{ __html: page.content }} />
      </Container>
    </>
  );
}
