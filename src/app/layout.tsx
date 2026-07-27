import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { fontVariables } from "@/lib/fonts";
import { AppProviders } from "@/providers/app-providers";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { WhatsappFloatButton } from "@/components/shared/whatsapp-float-button";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PujariDekho — Book Verified Pandits & Poojas Online",
    template: "%s | PujariDekho",
  },
  description:
    "PujariDekho is a premium Hindu religious services marketplace — verified pandits, complete puja samagri, fixed pricing and same-day booking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontVariables} ${geistMono.variable} antialiased`}>
        <AppProviders>
          <AnnouncementBar />
          <SiteHeader />
          <main className="pb-16 md:pb-0">{children}</main>
          <SiteFooter />
          <StickyMobileCta />
          <WhatsappFloatButton />
        </AppProviders>
      </body>
    </html>
  );
}
