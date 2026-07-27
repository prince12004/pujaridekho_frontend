import type { Metadata } from "next";
import { PageBanner } from "@/components/shared/page-banner";
import { PolicyLayout } from "@/components/shared/policy-layout";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { privacyContent, privacyToc, lastUpdated } from "@/features/policies/data";
import { buildMetadata } from "@/lib/seo";
import { env } from "@/lib/env";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How PujariDekho collects, uses and protects your personal information.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Privacy Policy", path: "/privacy-policy" }], env.NEXT_PUBLIC_SITE_URL)} />
      <PageBanner
        eyebrow={`Last Updated: ${lastUpdated}`}
        title="Privacy Policy"
        breadcrumbItems={[{ label: "Privacy Policy" }]}
      />
      <PolicyLayout currentPath="/privacy-policy" tocItems={privacyToc}>
        <div className="prose-policy" dangerouslySetInnerHTML={{ __html: privacyContent }} />
      </PolicyLayout>
    </>
  );
}
