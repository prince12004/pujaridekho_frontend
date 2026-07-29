"use client";

import { MapPin, Phone } from "lucide-react";
import { Container } from "@/components/shared/container";
import { LanguageSwitch } from "@/components/layout/language-switch";
import { WhatsappIcon } from "@/components/shared/whatsapp-icon";
import { siteConfig } from "@/lib/constants";
import { useSiteSettings } from "@/lib/use-site-settings";

export function AnnouncementBar() {
  const { data: settings } = useSiteSettings();
  const phone = settings?.contactPhone || siteConfig.contact.phone;
  const whatsapp = settings?.contactWhatsapp || siteConfig.contact.whatsapp;

  return (
    <div className="bg-brand-purple-deep text-[13px] text-brand-cream">
      <Container className="flex h-10 items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="flex items-center gap-1.5 opacity-90 transition-opacity hover:opacity-100 hover:text-brand-gold-soft"
          >
            <Phone size={14} />
            <span>{phone}</span>
          </a>
          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
            className="hidden items-center gap-1.5 opacity-90 transition-opacity hover:opacity-100 hover:text-brand-gold-soft md:flex"
          >
            <WhatsappIcon size={14} />
            <span>WhatsApp Support</span>
          </a>
          <span className="hidden items-center gap-2 md:flex">
            <MapPin size={13} className="text-brand-gold-soft" />

            {siteConfig.contact.serviceAreas.map((area) => (
              <span
                key={area}
                className="rounded-full border border-brand-gold/35 bg-brand-gold/15 px-2.5 py-0.5 font-semibold text-brand-gold-soft"
              >
                {area}
              </span>
            ))}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/become-a-pandit"
            className="hidden opacity-90 transition-opacity hover:opacity-100 hover:text-brand-gold-soft md:inline"
          >
            Become a Pandit
          </a>
          <LanguageSwitch />
        </div>
      </Container>
    </div>
  );
}
