import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { fontVariables } from "@/lib/fonts";
import { AppProviders } from "@/providers/app-providers";
import { ConditionalPublicChrome } from "@/components/layout/conditional-public-chrome";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/lib/env";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DEFAULT_TITLE = "PujariDekho — Book Verified Pandits & Poojas Online";
const DEFAULT_DESCRIPTION =
  "PujariDekho is a premium Hindu religious services marketplace — verified pandits, complete puja samagri, fixed pricing and same-day booking.";

interface HomeSeoOverride {
  title?: string;
  description?: string;
}

async function fetchHomeSeoOverride(): Promise<HomeSeoOverride | null> {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/seo/by-path?path=/`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const override = await fetchHomeSeoOverride();
  return {
    title: {
      default: override?.title ?? DEFAULT_TITLE,
      template: "%s | PujariDekho",
    },
    description: override?.description ?? DEFAULT_DESCRIPTION,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontVariables} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <AppProviders>
          <ConditionalPublicChrome>{children}</ConditionalPublicChrome>
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
