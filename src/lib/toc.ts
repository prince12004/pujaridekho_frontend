import type { TocItem } from "@/components/shared/table-of-contents";

/** Extracts <h2 id="..."> headings from an HTML string to build a table of contents. */
export function extractToc(html: string): TocItem[] {
  const matches = [...html.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)];
  return matches.map((match) => ({ id: match[1], label: match[2] }));
}
