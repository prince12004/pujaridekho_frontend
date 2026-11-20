import { SERVER_API_URL } from "@/lib/server-env";

// Live business numbers from GET /stats (database counts + the base numbers
// set in Admin → Website Settings). Fetched on the server so the real values
// are in the HTML.
export interface SiteStats {
  verifiedPandits: number;
  poojasCompleted: number;
  familiesServed: number;
  poojasLast30Days: number;
  cities: number;
  rating: { value: number; count: number; source: "reviews" | "testimonials" } | null;
}

export async function fetchSiteStats(): Promise<SiteStats | null> {
  try {
    const res = await fetch(`${SERVER_API_URL}/stats`, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    return (await res.json()).data as SiteStats;
  } catch {
    return null;
  }
}

export { plus, stars } from "./stats-format";
