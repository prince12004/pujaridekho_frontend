import type { Metadata } from "next";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { PageBanner } from "@/components/shared/page-banner";
import { PolicyLayout } from "@/components/shared/policy-layout";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { refundContent, refundFaq, refundScenarios, refundToc, lastUpdated } from "@/features/policies/data";
import { buildMetadata } from "@/lib/seo";
import { env } from "@/lib/env";

export const metadata: Metadata = buildMetadata({
  title: "Refund Policy",
  description: "When PujariDekho bookings are eligible for a full, partial or no refund, and how the process works.",
  path: "/refund-policy",
});

const scenarioStyles = {
  full: { icon: CheckCircle2, className: "bg-emerald-500/10 text-emerald-600" },
  partial: { icon: AlertTriangle, className: "bg-accent/15 text-accent" },
  none: { icon: XCircle, className: "bg-destructive/10 text-destructive" },
} as const;

export default function RefundPolicyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Refund Policy", path: "/refund-policy" }], env.NEXT_PUBLIC_SITE_URL)} />
      <PageBanner
        eyebrow={`Last Updated: ${lastUpdated}`}
        title="Refund Policy"
        breadcrumbItems={[{ label: "Refund Policy" }]}
      />
      <PolicyLayout currentPath="/refund-policy" tocItems={refundToc}>
        <div id="refund-scenarios" className="mb-10 grid grid-cols-1 gap-4 scroll-mt-24 sm:grid-cols-3">
          {refundScenarios.map((scenario) => {
            const style = scenarioStyles[scenario.icon];
            return (
              <div key={scenario.title} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.className}`}>
                  <style.icon size={20} />
                </span>
                <h3 className="font-heading text-base">{scenario.title}</h3>
                <p className="text-sm text-muted-foreground">{scenario.description}</p>
              </div>
            );
          })}
        </div>

        <div className="prose-policy" dangerouslySetInnerHTML={{ __html: refundContent }} />

        <div id="refund-faq" className="mt-10 scroll-mt-24">
          <h2 className="font-heading mb-5 text-2xl">Frequently Asked Questions</h2>
          <FaqAccordion items={refundFaq} />
        </div>
      </PolicyLayout>
    </>
  );
}
