import type { Metadata } from "next";
import { PageBanner } from "@/components/shared/page-banner";
import { Container } from "@/components/shared/container";
import { imageCredits } from "@/features/policies/image-credits";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Image Credits",
  description: "Credits for the freely licensed photos used on PujariDekho.",
  path: "/image-credits",
});

export default function ImageCreditsPage() {
  return (
    <>
      <PageBanner title="Image Credits" breadcrumbItems={[{ label: "Image Credits" }]} />
      <section className="py-12">
        <Container className="max-w-4xl">
          <p className="mb-6 text-muted-foreground">
            Most product and samagri photos are our own. The photos below are from Wikimedia Commons and are used under the licence
            shown, with thanks to their authors.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3">Used for</th>
                  <th className="px-4 py-3">Author · Licence</th>
                  <th className="px-4 py-3">Source</th>
                </tr>
              </thead>
              <tbody>
                {imageCredits.map((c) => (
                  <tr key={c.used} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 font-medium">{c.used}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{c.credit}</td>
                    <td className="px-4 py-2.5">
                      <a href={c.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Wikimedia Commons
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>
    </>
  );
}
