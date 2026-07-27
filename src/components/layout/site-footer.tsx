import Link from "next/link";
import { Container } from "@/components/shared/container";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/layout/social-icons";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cities } from "@/features/home/data";
import { siteConfig } from "@/lib/constants";

const quickLinks = [
  { label: "Poojas", href: "/poojas" },
  { label: "Pandit Ji", href: "/pandits" },
  { label: "Festival Pooja", href: "/festivals" },
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
];

const supportLinks = [
  { label: "FAQs", href: "/faq" },
  { label: "Call Support", href: `tel:${siteConfig.contact.phone.replace(/\s/g, "")}` },
  { label: "WhatsApp Us", href: `https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, "")}` },
  { label: "Become a Pandit", href: "/become-a-pandit" },
  { label: "Refund Policy", href: "/refund-policy" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-brand-purple-deep pt-16 text-brand-cream">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(217,164,65,0.14) 1.4px, transparent 1.6px)",
          backgroundSize: "26px 26px",
        }}
      />
      <Container className="relative grid grid-cols-2 gap-10 pb-12 md:grid-cols-5">
        <div className="col-span-2">
          <Logo light />
          <p className="mt-4 max-w-xs text-sm text-brand-cream/75">
            PujariDekho connects families across Delhi NCR with verified, experienced pandits for
            every ritual — with fixed pricing and complete samagri, always.
          </p>
          <div className="mt-5 flex gap-2.5">
            {[FacebookIcon, InstagramIcon, YoutubeIcon].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-gold/35 text-brand-gold-soft transition-colors hover:bg-brand-gold hover:text-brand-purple-deep"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <FooterColumn heading="Quick Links" links={quickLinks} />

        <div>
          <h5 className="font-heading mb-4 text-xs font-bold uppercase tracking-wider text-brand-gold-soft">
            Cities
          </h5>
          <ul className="flex flex-col gap-2.5">
            {cities.slice(0, 6).map((city) => (
              <li key={city.slug}>
                <Link href={`/cities/${city.slug}`} className="text-sm text-brand-cream/78 hover:text-brand-gold-soft">
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <FooterColumn heading="Support" links={supportLinks} />
          <div className="mt-6">
            <h5 className="font-heading mb-3 text-xs font-bold uppercase tracking-wider text-brand-gold-soft">
              Newsletter
            </h5>
            <form className="flex flex-col gap-2.5">
              <Input
                type="email"
                placeholder="Your email address"
                className="border-white/20 bg-white/6 text-brand-cream placeholder:text-brand-cream/50"
              />
              <Button type="submit" className="font-ui bg-gradient-to-r from-accent to-brand-gold-soft font-bold text-secondary hover:opacity-90">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </Container>

      <Container className="relative flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-brand-cream/60 sm:flex-row">
        <span>© 2026 PujariDekho. All rights reserved.</span>
        <div className="flex gap-5">
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand-gold-soft">
              {link.label}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h5 className="font-heading mb-4 text-xs font-bold uppercase tracking-wider text-brand-gold-soft">
        {heading}
      </h5>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-brand-cream/78 hover:text-brand-gold-soft">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
