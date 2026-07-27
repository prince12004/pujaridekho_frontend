import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { WhatsappIcon } from "@/components/shared/whatsapp-icon";
import { siteConfig } from "@/lib/constants";

const items = [
  { icon: MapPin, label: "Office Address", value: siteConfig.contact.officeAddress },
  { icon: Phone, label: "Phone Numbers", value: siteConfig.contact.phone, href: `tel:${siteConfig.contact.phone.replace(/\s/g, "")}` },
  { icon: WhatsappIcon, label: "WhatsApp Support", value: siteConfig.contact.whatsapp, href: `https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, "")}` },
  { icon: Mail, label: "Email", value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
  { icon: Clock, label: "Office Hours", value: siteConfig.contact.officeHours },
];

export function OfficeInfo() {
  return (
    <div className="flex flex-col gap-4 rounded-[1.75rem] border border-border bg-card p-7 shadow-sm">
      <h3 className="font-heading text-xl">Office Information</h3>
      <div className="flex flex-col gap-4">
        {items.map((item) => {
          const content = (
            <div className="flex gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
                <item.icon size={17} />
              </span>
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{item.label}</div>
                <div className="text-sm font-semibold">{item.value}</div>
              </div>
            </div>
          );
          return item.href ? (
            <a key={item.label} href={item.href} className="transition-opacity hover:opacity-75">
              {content}
            </a>
          ) : (
            <div key={item.label}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}
