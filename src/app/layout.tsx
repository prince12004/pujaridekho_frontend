import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { fontVariables } from "@/lib/fonts";
import { AppProviders } from "@/providers/app-providers";
import { ConditionalPublicChrome } from "@/components/layout/conditional-public-chrome";
import { Toaster } from "@/components/ui/sonner";
import { SERVER_API_URL } from "@/lib/server-env";
import { fetchContactSettings, fetchFooterGroups, fetchSeoSettings } from "@/features/seo-pages/api";
import "./globals.css";
import { ClarityAnalytics } from "@/components/shared/clarity-analytics";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const DEFAULT_TITLE = "PujariDekho — Book Verified Pandits & Puja's Online";
const DEFAULT_DESCRIPTION =
  "PujariDekho is a premium Hindu religious services marketplace — verified pandits, fixed pricing and optional puja samagri kits across Delhi NCR.";

interface HomeSeoOverride {
  title?: string;
  description?: string;
}

async function fetchHomeSeoOverride(): Promise<HomeSeoOverride | null> {
  try {
    const res = await fetch(`${SERVER_API_URL}/seo/by-path?path=/`, { next: { revalidate: 45 } });
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
    // Google Search Console ownership (also verified via public/googlec020e19dd17ec6bc.html).
    verification: {
      google: "2jB01OmFE_DFxdXfx9IlfgqxlVmtbGGjhjAnazGUe9o",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetched on the server so every footer link is in the initial HTML.
  const [footerGroups, contactSettings, seoSettings] = await Promise.all([fetchFooterGroups(), fetchContactSettings(), fetchSeoSettings()]);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontVariables} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <AppProviders>
          <ConditionalPublicChrome footerGroups={footerGroups ?? []} contactSettings={contactSettings} footerCopy={seoSettings.footer}>
            {children}
          </ConditionalPublicChrome>
          <Toaster />
        </AppProviders>
        <ClarityAnalytics />
      </body>
    </html>
  );
}
