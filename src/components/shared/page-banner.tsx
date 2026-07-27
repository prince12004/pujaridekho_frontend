import Image from "next/image";
import { Container } from "@/components/shared/container";
import { Breadcrumb, type BreadcrumbItem } from "@/components/shared/breadcrumb";
import { cn } from "@/lib/utils";

export function PageBanner({
  eyebrow,
  title,
  description,
  breadcrumbItems,
  image,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbItems: BreadcrumbItem[];
  image?: string;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden bg-brand-purple-deep py-14 sm:py-20", className)}>
      {image ? (
        <div className="absolute inset-0">
          <Image src={image} alt="" fill className="object-cover opacity-30" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-deep via-brand-purple-deep/90 to-brand-purple-deep/60" />
        </div>
      ) : (
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(217,164,65,0.16) 1.4px, transparent 1.6px)",
            backgroundSize: "26px 26px",
          }}
        />
      )}

      <Container className="relative">
        <Breadcrumb
          items={breadcrumbItems}
          className="[&_a]:text-brand-cream/70 [&_span]:text-brand-gold-soft [&_svg]:text-brand-cream/40"
        />
        {eyebrow ? (
          <span className="font-ui mt-5 block text-xs font-bold uppercase tracking-wide text-brand-gold-soft">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="font-heading mt-2 max-w-2xl text-balance text-3xl font-bold text-brand-cream sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-xl text-brand-cream/75">{description}</p>
        ) : null}
      </Container>
    </section>
  );
}
