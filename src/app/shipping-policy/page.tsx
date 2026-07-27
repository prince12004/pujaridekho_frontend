import type { Metadata } from "next";
import { Package, PackageCheck, PackageOpen, Truck } from "lucide-react";
import { PageBanner } from "@/components/shared/page-banner";
import { PolicyLayout } from "@/components/shared/policy-layout";
import { Timeline } from "@/components/shared/timeline";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { shippingContent, shippingFaq, shippingSteps, shippingToc, shippingZones, lastUpdated } from "@/features/policies/data";
import { buildMetadata } from "@/lib/seo";
import { env } from "@/lib/env";

export const metadata: Metadata = buildMetadata({
  title: "Shipping Policy",
  description: "Delivery timelines, charges and process for PujariDekho shop orders across Delhi NCR.",
  path: "/shipping-policy",
});

const stepIcons = [PackageOpen, Package, Truck, Truck, PackageCheck];

export default function ShippingPolicyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Shipping Policy", path: "/shipping-policy" }], env.NEXT_PUBLIC_SITE_URL)} />
      <PageBanner
        eyebrow={`Last Updated: ${lastUpdated}`}
        title="Shipping Policy"
        breadcrumbItems={[{ label: "Shipping Policy" }]}
      />
      <PolicyLayout currentPath="/shipping-policy" tocItems={shippingToc}>
        <div id="shipping-process" className="mb-10 scroll-mt-24">
          <h2 className="font-heading mb-6 text-2xl">Shipping Process</h2>
          <Timeline
            items={shippingSteps.map((step, i) => ({ ...step, icon: stepIcons[i] }))}
          />
        </div>

        <div className="prose-policy" dangerouslySetInnerHTML={{ __html: shippingContent }} />

        <div id="delivery-zones" className="my-10 scroll-mt-24">
          <h2 className="font-heading mb-4 text-2xl">Delivery Zones &amp; Charges</h2>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/60">
                <tr>
                  <th className="px-4 py-3 font-heading text-xs uppercase tracking-wide">Zone</th>
                  <th className="px-4 py-3 font-heading text-xs uppercase tracking-wide">Delivery Time</th>
                  <th className="px-4 py-3 font-heading text-xs uppercase tracking-wide">Charge</th>
                </tr>
              </thead>
              <tbody>
                {shippingZones.map((zone) => (
                  <tr key={zone.zone} className="border-t border-border">
                    <td className="px-4 py-3 font-semibold">{zone.zone}</td>
                    <td className="px-4 py-3 text-muted-foreground">{zone.time}</td>
                    <td className="px-4 py-3 text-muted-foreground">{zone.charge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div id="shipping-faq" className="mt-10 scroll-mt-24">
          <h2 className="font-heading mb-5 text-2xl">Frequently Asked Questions</h2>
          <FaqAccordion items={shippingFaq} />
        </div>
      </PolicyLayout>
    </>
  );
}
