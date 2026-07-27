import Link from "next/link";
import { Container } from "@/components/shared/container";
import { TableOfContents, type TocItem } from "@/components/shared/table-of-contents";
import { cn } from "@/lib/utils";

const policyPages = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Shipping Policy", href: "/shipping-policy" },
];

export function PolicyLayout({
  currentPath,
  tocItems,
  children,
}: {
  currentPath: string;
  tocItems: TocItem[];
  children: React.ReactNode;
}) {
  return (
    <section className="py-14 sm:py-20">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr_220px]">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 flex flex-col gap-1" aria-label="Policy pages">
            <span className="font-ui mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Policies
            </span>
            {policyPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                  currentPath === page.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted",
                )}
              >
                {page.label}
              </Link>
            ))}
          </nav>
        </aside>

        <article className="min-w-0 max-w-2xl">{children}</article>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents items={tocItems} />
          </div>
        </aside>
      </Container>
    </section>
  );
}
