// Revalidate every 24 hours (86400 seconds) - free on Vercel
export const revalidate = 86400;

import Header from "@/components/layout/Header";
import PageShell from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import FleetMapClient from "@/components/map/FleetMapClient";
import { getTerminals, getVesselPositions, getVessels } from "@/lib/seed";
import { formatNumber } from "@/lib/utils";

function latestPositions(positions: Awaited<ReturnType<typeof getVesselPositions>>) {
  const map = new Map<string, (typeof positions)[number]>();
  for (const position of positions) {
    const existing = map.get(position.vesselId);
    if (!existing || position.recordedAt > existing.recordedAt) {
      map.set(position.vesselId, position);
    }
  }
  return map;
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  return "Just now";
}

export default async function FleetPage() {
  const [vessels, positions, terminals] = await Promise.all([
    getVessels(),
    getVesselPositions(),
    getTerminals(),
  ]);

  const latest = latestPositions(positions);
  const positionsArray = Array.from(latest.values());
  const ownedCount = vessels.filter((v) => v.ownership === "OWNED").length;
  const charteredCount = vessels.filter((v) => v.ownership === "CHARTERED").length;
  const atSeaCount = vessels.filter((v) => v.status === "AT_SEA").length;

  return (
    <PageShell>
      <Header
        title="Fleet Tracker"
        subtitle="Owned + chartered LNG carriers with latest AIS position and delivery status."
      />

      <section>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Fleet Map</h3>
              <p className="mt-1 text-sm text-slate-500">
                {atSeaCount} vessels at sea, {vessels.length - atSeaCount} in port/unknown
              </p>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-sky-500" />
                <span className="text-slate-500">Vessels</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-orange-500" />
                <span className="text-slate-500">Terminals</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <FleetMapClient positions={positionsArray} terminals={terminals} height="500px" />
          </div>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-4">
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Total Fleet</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{vessels.length}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Owned</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600">{ownedCount}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Chartered</p>
          <p className="mt-2 text-3xl font-semibold text-sky-600">{charteredCount}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">At Sea</p>
          <p className="mt-2 text-3xl font-semibold text-orange-500">{atSeaCount}</p>
        </Card>
      </section>

      <section>
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Fleet Registry</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3">Vessel</th>
                  <th className="py-3">IMO</th>
                  <th className="py-3">Capacity</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Position</th>
                  <th className="py-3">Destination</th>
                  <th className="py-3">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60">
                {vessels.map((vessel) => {
                  const position = latest.get(vessel.id);
                  return (
                    <tr key={vessel.id} className="text-slate-700">
                      <td className="py-4">
                        <p className="font-semibold text-slate-900">{vessel.name}</p>
                        <p className="text-xs text-slate-500">{vessel.ownership}</p>
                      </td>
                      <td className="py-4 text-slate-600">{vessel.imo ?? "TBD"}</td>
                      <td className="py-4 text-slate-600">{formatNumber(vessel.capacityCbm)} cbm</td>
                      <td className="py-4">
                        <Badge tone={vessel.status === "AT_SEA" ? "emerald" : vessel.status === "IN_PORT" ? "sky" : "slate"}>
                          {vessel.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-4 text-slate-600">
                        {position ? `${position.latitude.toFixed(2)}, ${position.longitude.toFixed(2)}` : "-"}
                      </td>
                      <td className="py-4 text-slate-600">{position?.destination ?? "-"}</td>
                      <td className="py-4 text-slate-500 text-xs">
                        {position?.recordedAt ? formatTimeAgo(position.recordedAt) : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
