"use client";

import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { WhatsappFloatButton } from "@/components/shared/whatsapp-float-button";

// The Admin Panel and the customer Account dashboard each render their own
// dedicated shell (sidebar/header) and must never show the public marketing
// chrome. Kept as a client-side pathname check rather than a route-group
// restructure, so the existing public tree is untouched.
export function ConditionalPublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isAccountRoute = pathname?.startsWith("/account");

  if (isAdminRoute || isAccountRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main className="pb-16 md:pb-0">{children}</main>
      <SiteFooter />
      <StickyMobileCta />
      <WhatsappFloatButton />
    </>
  );
}
