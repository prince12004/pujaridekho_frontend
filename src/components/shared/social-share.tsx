"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { FacebookIcon } from "@/components/layout/social-icons";
import { XIcon, LinkedInIcon } from "@/components/shared/share-icons";
import { WhatsappIcon } from "@/components/shared/whatsapp-icon";
import { cn } from "@/lib/utils";

export function SocialShare({
  url,
  title,
  className,
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { label: "WhatsApp", icon: WhatsappIcon, href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: "Facebook", icon: FacebookIcon, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "X", icon: XIcon, href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    { label: "LinkedIn", icon: LinkedInIcon, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
  ];

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${link.label}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-secondary transition-colors hover:bg-muted"
        >
          <link.icon size={15} />
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-secondary transition-colors hover:bg-muted"
      >
        {copied ? <Check size={15} className="text-emerald-600" /> : <Link2 size={15} />}
      </button>
    </div>
  );
}
