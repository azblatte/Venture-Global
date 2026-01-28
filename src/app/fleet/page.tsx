import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import PageShell from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getTerminals, getVesselPositions, getVessels } from "@/lib/seed";
import { formatNumber } from "@/lib/utils";

const FleetMap = dynamic(() => import("@/components/map/FleetMap"), { ssr: false });

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

export default async function FleetPage() {
  const [vessels, positions, terminals] = await Promise.all([
    getVessels(),
    getVesselPositions(),
    getTerminals(),
  ]);

  const latest = latestPositions(positions);

  return (
    <PageShell>
      <Header
        title="Fleet Tracker"
        subtitle="Owned + chartered LNG carriers with latest AIS position and delivery status."
      />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Fleet Map</h3>
          <p className="mt-2 text-sm text-slate-500">Live positions anchored to VG terminals.</p>
          <div className="mt-4">
            <FleetMap positions={positions} terminals={terminals} height="420px" />
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Fleet Summary</h3>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-3xl font-semibold text-slate-900">{vessels.length}</p>
              <p className="text-sm text-slate-500">Vessels in registry</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-slate-900">
                {vessels.filter((vessel) => vessel.isDelivered).length}
              </p>
              <p className="text-sm text-slate-500">Delivered</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-slate-900">
                {vessels.filter((vessel) => vessel.ownership === "CHARTERED").length}
              </p>
              <p className="text-sm text-slate-500">Chartered</p>
            </div>
          </div>
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
                  <th className="py-3">Last Position</th>
                  <th className="py-3">Destination</th>
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
                        <Badge tone={vessel.status === "AT_SEA" ? "emerald" : "slate"}>{vessel.status}</Badge>
                      </td>
                      <td className="py-4 text-slate-600">
                        {position ? `${position.latitude.toFixed(2)}, ${position.longitude.toFixed(2)}` : "-"}
                      </td>
                      <td className="py-4 text-slate-600">{position?.destination ?? "-"}</td>
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
