import type { Metadata } from "next";
import { PageBanner } from "@/components/shared/page-banner";
import { Container } from "@/components/shared/container";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { buildMetadata } from "@/lib/seo";
import { images } from "@/lib/images";
import { env } from "@/lib/env";
import { KundliGenerator } from "@/features/kundli/components/kundli-generator";

export const metadata: Metadata = buildMetadata({
    title: "Free Kundli Generator — Janam Kundli Online",
    description: "Generate a free Kundli preview with birth chart insights, then book a live astrology consultation for personalised guidance.",
    path: "/kundli",
});

export default function KundliPage() {
    return (
        <>
            <JsonLd data={breadcrumbSchema([{ name: "Kundli", path: "/kundli" }], env.NEXT_PUBLIC_SITE_URL)} />
            <PageBanner
                eyebrow="Free Kundli"
                title="Generate Your Janam Kundli"
                description="Use your birth details to generate a free horoscope preview, and then book a consultation for a full reading."
                breadcrumbItems={[{ label: "Kundli" }]}
                image={images.bowlWoodenTable}
            />

            <section className="py-16 sm:py-20">
                <Container>
                    <KundliGenerator />
                </Container>
            </section>
        </>
    );
}
