import type { Metadata } from "next";
import { PageBanner } from "@/components/shared/page-banner";
import { PolicyLayout } from "@/components/shared/policy-layout";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { termsContent, termsToc, lastUpdated } from "@/features/policies/data";
import { buildMetadata } from "@/lib/seo";
import { env } from "@/lib/env";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description: "The terms governing your use of PujariDekho's bookings, shop and platform.",
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Terms & Conditions", path: "/terms-and-conditions" }], env.NEXT_PUBLIC_SITE_URL)} />
      <PageBanner
        eyebrow={`Last Updated: ${lastUpdated}`}
        title="Terms & Conditions"
        breadcrumbItems={[{ label: "Terms & Conditions" }]}
      />
      <PolicyLayout currentPath="/terms-and-conditions" tocItems={termsToc}>
        <div className="prose-policy" dangerouslySetInnerHTML={{ __html: termsContent }} />
      </PolicyLayout>
    </>
  );
}
