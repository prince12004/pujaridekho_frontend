"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Headphones, Loader2, Lock, Mail, MapPin, Phone, Send, ShieldCheck, Users } from "lucide-react";
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

const quickLinks = [
  { label: "Poojas", href: "/poojas" },
  { label: "Pandit Ji", href: "/pandits" },
  { label: "Festival Pooja", href: "/festivals" },
  { label: "Shop", href: "/products" },
  { label: "Blog", href: "/blog" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQs", href: "/faq" },
  { label: "Become a Pandit", href: "/become-a-pandit" },
  { label: "Refund Policy", href: "/refund-policy" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];

const trustBadges = [
  { Icon: ShieldCheck, label: "Verified & Experienced Pandits" },
  { Icon: Lock, label: "Secure & Encrypted Payments" },
  { Icon: Users, label: "Trusted by Thousands of Families" },
  { Icon: Headphones, label: "24/7 Customer Support" },
];

const linkClass = "text-sm text-brand-cream/78 transition-all hover:translate-x-0.5 hover:text-brand-gold-soft";

const newsletterSchema = z.object({ email: z.string().email("Enter a valid email") });
type NewsletterValues = z.infer<typeof newsletterSchema>;

export function SiteFooter() {
  const { data: settings } = useSiteSettings();
  const [subscribed, setSubscribed] = useState(false);
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
    { Icon: WhatsappIcon, href: `https://wa.me/${whatsapp.replace(/\D/g, "")}` },
    { Icon: FacebookIcon, href: settings?.socialLinks?.facebook },
    { Icon: InstagramIcon, href: settings?.socialLinks?.instagram },
    { Icon: YoutubeIcon, href: settings?.socialLinks?.youtube },
  ].filter((link) => link.href);

  const onSubscribe = async (values: NewsletterValues) => {
    try {
      await apiClient.post("/newsletter/subscribe", values);
      setSubscribed(true);
      reset();
    } catch {
      // Swallow — the form's error state below is reserved for validation only;
      // a transient network failure just leaves the form as-is for a retry.
    }
  };

  return (
    <div className="relative">
      <Container className="relative z-10 -mb-16">
        <Reveal>
          <div className="flex flex-col items-start gap-6 rounded-[1.75rem] bg-gradient-to-r from-brand-purple-deep to-brand-cocoa-deep p-8 shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <h2 className="font-heading text-2xl font-bold text-brand-cream sm:text-[1.75rem]">Subscribe to Our Newsletter</h2>
              <p className="mt-2 max-w-md text-sm text-brand-cream/75">
                Vidhi guides, festival muhurat dates and special offers — straight to your inbox.
              </p>
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
        <Container className="relative grid grid-cols-2 gap-8 pb-12 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.1fr] lg:gap-10">
          <div className="col-span-2 lg:col-span-1">
            <Logo light />
            <p className="mt-4 max-w-sm text-sm text-brand-cream/75">
              PujariDekho connects families across Delhi, Noida, Greater Noida, Ghaziabad, Gurgaon and
              Faridabad with verified, experienced pandits for every ritual — fixed pricing, always.
            </p>
            <div className="mt-5 flex gap-2.5">
              {socialLinks.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target={href?.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label="Contact link"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-brand-gold-soft transition-all hover:-translate-y-0.5 hover:bg-brand-gold hover:text-brand-cocoa-deep"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn heading="Quick Links" links={quickLinks} />

          <div>
            <FooterColumn heading="Company" links={companyLinks} />
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h5 className="font-heading mb-4 text-xs font-bold uppercase tracking-wider text-brand-gold-soft">
              Get In Touch
            </h5>
            <ul className="flex flex-col gap-3.5">
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-brand-gold-soft">
                  <MapPin size={16} />
                </span>
                <span className="pt-1.5 text-sm text-brand-cream/78">{address}</span>
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
            {trustBadges.map(({ Icon, label }) => (
              <span key={label} className="flex items-center gap-2">
                <Icon size={15} className="text-accent" /> {label}
              </span>
            ))}
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
    </div>
  );
}

function FooterColumn({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h5 className="font-heading mb-4 text-xs font-bold uppercase tracking-wider text-brand-gold-soft">{heading}</h5>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={linkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
