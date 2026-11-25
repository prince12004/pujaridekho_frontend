import { StatsBand } from "@/components/shared/stats-band";
import { fetchSiteStats, plus, stars, type SiteStats } from "@/features/home/site-stats";

// Homepage counters — live database numbers (see GET /stats). A stat is only
// shown when there is real data behind it.
export function buildTrustStats(stats: SiteStats | null) {
  if (!stats) return [];
  return [
    stats.verifiedPandits > 0 ? { value: plus(stats.verifiedPandits), label: "Verified Pandits" } : null,
    stats.rating ? { value: stars(stats.rating.value), label: "Customer Rating" } : null,
    stats.poojasCompleted > 0 ? { value: plus(stats.poojasCompleted), label: "Completed Poojas" } : null,
    stats.cities > 0 ? { value: String(stats.cities), label: "Cities Served" } : null,
    { value: "100%", label: "Verified Priests" },
  ].filter((s): s is { value: string; label: string } => !!s);
}

export async function TrustNumbers() {
  const stats = buildTrustStats(await fetchSiteStats());
  if (stats.length === 0) return null;
  return <StatsBand stats={stats} />;
}
