"use client";

import { use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AccountPageHeader } from "@/features/account/components/account-page-header";
import { AccountLoadingSkeleton, AccountErrorState } from "@/features/account/components/state-blocks";
import { useMyKundli } from "@/features/account/api/use-kundli";
import { formatDate } from "@/features/account/lib/format";

export default function KundliDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: record, isLoading, isError, refetch } = useMyKundli(id);

  if (isLoading) return <AccountLoadingSkeleton rows={4} />;
  if (isError || !record) return <AccountErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <AccountPageHeader title={`${record.personName}'s Kundli`} description={`Born ${formatDate(record.dob)} at ${record.tob} in ${record.place}`} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-2 p-5">
            <p className="mb-1 font-heading text-sm font-bold text-secondary">Ascendant (Lagna)</p>
            <Row label="Rashi" value={record.ascendant.rashi} />
            <Row label="Sidereal Longitude" value={`${record.ascendant.siderealLongitude.toFixed(2)}°`} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 p-5">
            <p className="mb-1 font-heading text-sm font-bold text-secondary">Moon & Sun</p>
            <Row label="Moon Rashi" value={record.moonRashi} />
            <Row label="Moon Nakshatra" value={`${record.moonNakshatra} (Pada ${record.moonPada})`} />
            <Row label="Sun Rashi" value={record.sunRashi} />
            <Row label="Ayanamsa" value={`${record.ayanamsa.toFixed(4)}°`} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-5">
          <p className="mb-3 font-heading text-sm font-bold text-secondary">Planetary Positions</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Planet</th>
                  <th className="py-2 pr-4 font-medium">Rashi</th>
                  <th className="py-2 pr-4 font-medium">Nakshatra</th>
                  <th className="py-2 pr-4 font-medium">Pada</th>
                  <th className="py-2 font-medium">Longitude</th>
                </tr>
              </thead>
              <tbody>
                {record.planets.map((planet) => (
                  <tr key={planet.planet} className="border-b border-border/60 last:border-0">
                    <td className="py-2 pr-4 font-medium text-secondary">{planet.planet}</td>
                    <td className="py-2 pr-4">{planet.rashi}</td>
                    <td className="py-2 pr-4">{planet.nakshatra}</td>
                    <td className="py-2 pr-4">{planet.pada}</td>
                    <td className="py-2">{planet.siderealLongitude.toFixed(2)}°</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-secondary">{value}</span>
    </div>
  );
}
