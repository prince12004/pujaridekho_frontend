import { StatsBand } from "@/components/shared/stats-band";
import { trustStats } from "@/features/home/data";

export function TrustNumbers() {
  return <StatsBand stats={trustStats} />;
}
