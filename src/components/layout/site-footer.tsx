"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronDown, Headphones, Loader2, Lock, Mail, MapPin, Phone, Send, ShieldCheck, Users } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/layout/social-icons";
import { WhatsappIcon } from "@/components/shared/whatsapp-icon";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/lib/constants";
import { useSiteSettings } from "@/lib/use-site-settings";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { fillPlaceholders, type FooterGroup, type PublicContactSettings, type SeoSettings } from "@/features/seo-pages/api";

// Icons for the admin-editable trust badges (by position).
const TRUST_ICONS = [ShieldCheck, Lock, Users, Headphones];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Refund Policy", href: "/refund-policy" },
];

const linkClass =
  "inline-block py-0.5 text-sm text-brand-cream/75 transition-all duration-200 hover:translate-x-0.5 hover:text-brand-gold-soft focus-visible:text-brand-gold-soft focus-visible:outline-none";
const headingClass = "font-heading text-xs font-bold uppercase tracking-[0.14em] text-brand-gold-soft";

const newsletterSchema = z.object({ email: z.string().email("Enter a valid email") });
type NewsletterValues = z.infer<typeof newsletterSchema>;

export function SiteFooter({
  groups,
  contactSettings,
  copy,
}: {
  groups: FooterGroup[];
  contactSettings: PublicContactSettings | null;
  copy: SeoSettings["footer"];
}) {
  // Server-provided settings render in the first HTML; the client hook keeps
  // them fresh afterwards.
  const { data: liveSettings } = useSiteSettings();
  const settings = liveSettings ?? contactSettings ?? undefined;
  const [subscribed, setSubscribed] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const textBlocks = groups.filter((g) => g.kind === "text" && g.body);
  const linkGroups = groups.filter((g) => g.kind !== "text");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterValues>({ resolver: zodResolver(newsletterSchema) });

  const phone = settings?.contactPhone || siteConfig.contact.phone;
  const whatsapp = settings?.contactWhatsapp || siteConfig.contact.whatsapp;
  const email = settings?.contactEmail || siteConfig.contact.email;
  const address = settings?.officeAddress || siteConfig.contact.officeAddress;

  const socialLinks = [
    { Icon: WhatsappIcon, href: `https://wa.me/${whatsapp.replace(/\D/g, "")}`, label: "WhatsApp" },
    { Icon: FacebookIcon, href: settings?.socialLinks?.facebook, label: "Facebook" },
    { Icon: InstagramIcon, href: settings?.socialLinks?.instagram, label: "Instagram" },
    { Icon: YoutubeIcon, href: settings?.socialLinks?.youtube, label: "YouTube" },
  ].filter((link) => link.href);

  const onSubscribe = async (values: NewsletterValues) => {
    try {
      await apiClient.post("/newsletter/subscribe", values);
      setSubscribed(true);
      reset();
    } catch {
      // Network failure leaves the form as-is for a retry.
    }
  };

  return (
    <div className="relative">
      <Container className="relative z-10 -mb-16">
        <Reveal>
          <div className="flex flex-col items-start gap-6 rounded-[1.75rem] bg-gradient-to-r from-brand-purple-deep to-brand-cocoa-deep p-8 shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <h2 className="font-heading text-2xl font-bold text-brand-cream sm:text-[1.75rem]">{copy.newsletterTitle}</h2>
              <p className="mt-2 max-w-md text-sm text-brand-cream/75">{copy.newsletterText}</p>
            </div>
            {subscribed ? (
              <p className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-bold text-brand-gold-soft">
                You&apos;re subscribed — welcome aboard!
              </p>
            ) : (
              <form onSubmit={handleSubmit(onSubscribe)} className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    aria-label="Email address"
                    className="h-12 w-full border-white/15 bg-white/10 text-brand-cream placeholder:text-brand-cream/60 sm:w-64"
                    {...register("email")}
                  />
                  {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 bg-brand-gold font-ui font-bold text-brand-cocoa-deep hover:bg-brand-gold-soft sm:w-auto"
                >
                  {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </Reveal>
      </Container>

      <footer className="footers relative overflow-hidden bg-brand-cocoa-deep pt-28 text-brand-cream">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(217,164,65,0.14) 1.4px, transparent 1.6px)",
            backgroundSize: "26px 26px",
          }}
        />

        {/* Brand row */}
        <Container className="relative flex flex-col gap-6 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Logo light />
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-cream/75">{copy.blurb}</p>
          </div>
          {socialLinks.length > 0 ? (
            <div className="flex gap-2.5">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-brand-gold-soft transition-all hover:-translate-y-0.5 hover:bg-brand-gold hover:text-brand-cocoa-deep"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          ) : null}
        </Container>

        {/* About blocks (admin-editable), e.g. "Verified Pandits", "Pandit Ji Near Me". */}
        {textBlocks.length > 0 ? (
          <Container className="relative grid gap-x-12 gap-y-7 border-b border-white/10 py-10 md:grid-cols-2">
            {textBlocks.map((block) => (
              <section key={block.key}>
                <h2 className={headingClass}>{block.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-brand-cream/70">{block.body}</p>
              </section>
            ))}
          </Container>
        ) : null}

        {/* Link columns: collapsible on mobile, open on desktop. Links stay in
            the HTML either way so search engines always see them. */}
        <Container className="relative grid gap-x-8 gap-y-0 py-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-10 lg:py-12 xl:grid-cols-6">
          {linkGroups.map((group) => {
            const isOpen = openGroup === group.key;
            return (
              <nav key={group.key} aria-label={group.title} className="border-b border-white/10 lg:border-0">
                <button
                  type="button"
                  onClick={() => setOpenGroup(isOpen ? null : group.key)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between py-4 text-left lg:pointer-events-none lg:py-0"
                >
                  <h3 className={headingClass}>{group.title}</h3>
                  <ChevronDown
                    size={16}
                    className={cn("text-brand-gold-soft transition-transform lg:hidden", isOpen && "rotate-180")}
                  />
                </button>
                <ul className={cn("flex-col gap-1.5 pb-4 lg:mt-4 lg:flex lg:pb-0", isOpen ? "flex" : "hidden")}>
                  {group.links.map((link) => (
                    <li key={link.url + link.label}>
                      <Link href={link.url} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            );
          })}

          <div className="py-6 sm:col-span-2 lg:col-span-1 lg:py-0">
            <h3 className={headingClass}>Contact</h3>
            <ul className="mt-4 flex flex-col gap-3.5">
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-brand-gold-soft">
                  <MapPin size={16} />
                </span>
                <address className="pt-1.5 text-sm not-italic text-brand-cream/78">{address}</address>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-brand-gold-soft">
                  <Phone size={16} />
                </span>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className={linkClass}>
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-brand-gold-soft">
                  <WhatsappIcon size={16} />
                </span>
                <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  WhatsApp {whatsapp}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-brand-gold-soft">
                  <Mail size={16} />
                </span>
                <a href={`mailto:${email}`} className={linkClass}>
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </Container>

        <Container className="relative border-t border-white/10 py-6">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-xs font-semibold text-brand-cream/75 sm:justify-between">
            {copy.trustBadges.filter(Boolean).map((label, i) => {
              const Icon = TRUST_ICONS[i % TRUST_ICONS.length];
              return (
                <span key={label + i} className="flex items-center gap-2">
                  <Icon size={15} className="text-accent" /> {label}
                </span>
              );
            })}
          </div>
        </Container>

        <Container className="relative flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-brand-cream/60 sm:flex-row">
          <span>{fillPlaceholders(copy.copyright, {})}</span>
          <div className="flex flex-wrap justify-center gap-5">
            {copy.showAllLocationsLink ? (
              <Link href="/seo-pages" className="hover:text-brand-gold-soft">
                All Locations
              </Link>
            ) : null}
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-brand-gold-soft">
                {link.label}
              </Link>
            ))}
          </div>
        </Container>
      </footer>
    </div>
  );
}
