import type { Metadata } from "next";
import { PageBanner } from "@/components/shared/page-banner";
import { Container } from "@/components/shared/container";
import { CtaBanner } from "@/components/shared/cta-banner";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { buildMetadata } from "@/lib/seo";
import { images } from "@/lib/images";
import { env } from "@/lib/env";
import { ConsultationForm } from "@/features/consultation/components/consultation-form";

export const metadata: Metadata = buildMetadata({
    title: "Book a Consultation — Kundli, Muhurat & Graha Shanti Guidance",
    description: "Request a consultation for Kundli review, muhurat selection and Graha Shanti guidance for a fixed ₹500 fee.",
    path: "/consultation",
});

export default function ConsultationPage() {
    return (
        <>
            <JsonLd data={breadcrumbSchema([{ name: "Consultation", path: "/consultation" }], env.NEXT_PUBLIC_SITE_URL)} />
            <PageBanner
                eyebrow="Guidance & Muhurat"
                title="Book a Consultation for Your Kundli & Muhurat"
                description="Tell us what you need — Kundli review, muhurat selection, or Graha Shanti guidance — for a fixed ₹500 consultation fee."
                breadcrumbItems={[{ label: "Consultation" }]}
                image={images.bowlWoodenTable}
            />

            <section className="py-16 sm:py-20">
                <Container className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-8">
                        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
                            <h2 className="font-heading text-2xl font-bold">What our consultation covers</h2>
                            <ul className="mt-6 grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
                                {[
                                    "Kundli review and chart interpretation",
                                    "Auspicious dates and muhurat selection",
                                    "Graha Shanti and Dosha remedies",
                                    "Tie consultation to your chosen puja or festival",
                                ].map((item) => (
                                    <li key={item} className="flex gap-3 rounded-2xl bg-muted/60 p-4">
                                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-4 rounded-3xl border border-border bg-card p-8 shadow-sm">
                            <h2 className="font-heading text-2xl font-bold">Prepare for your session</h2>
                            <p className="text-muted-foreground">
                                Have your date, time and place of birth ready to make the consultation accurate. Our team can also help you understand the results and recommend the right rituals or samagri.
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Date of birth</li>
                                <li>• Time of birth</li>
                                <li>• Place of birth</li>
                                <li>• Your main question or concern</li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-6 rounded-3xl border border-border bg-card p-8 shadow-sm">
                        <div>
                            <h3 className="font-heading text-xl font-bold">Ready to consult?</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Share a few details and our team will call you back to schedule your session.
                            </p>
                        </div>
                        <ConsultationForm />
                    </div>
                </Container>
            </section>

            <CtaBanner
                eyebrow="Need a Birth Chart?"
                title="Generate Your Free Kundli"
                description="Start with a free birth chart and then book a live consultation for a full interpretation."
                primaryAction={{ label: "Generate Kundli", href: "/kundli" }}
                secondaryAction={{ label: "Contact Support", href: "/contact" }}
            />
        </>
    );
}
