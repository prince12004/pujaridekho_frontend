import type { Metadata } from "next";
import { env } from "@/lib/env";

export function buildMetadata({
  title,
  description,
  path,
  image,
  canonical,
  noindex,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  // Absolute URL or site path; defaults to the page's own URL.
  canonical?: string;
  noindex?: boolean;
}): Metadata {
  const url = `${env.NEXT_PUBLIC_SITE_URL}${path}`;
  const canonicalUrl = canonical
    ? canonical.startsWith("http")
      ? canonical
      : `${env.NEXT_PUBLIC_SITE_URL}${canonical}`
    : url;
  const ogImage = image ?? `${env.NEXT_PUBLIC_SITE_URL}/og-default.jpg`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title,
      description,
      url,
      siteName: "PujariDekho",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
