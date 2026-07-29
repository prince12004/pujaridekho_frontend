import type { Metadata } from "next";
import { PageBanner } from "@/components/shared/page-banner";
import { Container } from "@/components/shared/container";
import { CtaBanner } from "@/components/shared/cta-banner";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { PanditsListingClient } from "@/features/pandits/components/pandits-listing-client";
import { buildMetadata } from "@/lib/seo";
import { images } from "@/lib/images";
import { env } from "@/lib/env";

export const metadata: Metadata = buildMetadata({
    title: "Book Verified Pandit Ji — Delhi NCR",
    description: "Browse verified pandits across Delhi NCR, view their languages and specializations, and book a puja visit.",
    path: "/pandits",
});

export default function PanditsPage() {
    return (
        <>
            <JsonLd data={breadcrumbSchema([{ name: "Pandit Ji", path: "/pandits" }], env.NEXT_PUBLIC_SITE_URL)} />
            <PageBanner
                eyebrow="Verified Priests"
                title="Book the Right Pandit Ji for Your Ritual"
                description="Search verified, experienced pandits across Delhi NCR and book them for puja and rituals."
                breadcrumbItems={[{ label: "Pandit Ji" }]}
                image={images.candleGroupTable}
            />

            <section className="py-16 sm:py-20">
                <Container>
                    <PanditsListingClient />
                </Container>
            </section>

            <CtaBanner
                eyebrow="Need Help Choosing?"
                title="Our team can match you with the right priest"
                description="Tell us your ritual and location, and we’ll recommend a verified pandit who fits your needs."
                primaryAction={{ label: "Contact Support", href: "/contact" }}
                secondaryAction={{ label: "Book a Consultation", href: "/consultation" }}
            />
        </>
    );
}
