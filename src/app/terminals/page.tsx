// Revalidate every 24 hours (86400 seconds) - free on Vercel
export const revalidate = 86400;

import Header from "@/components/layout/Header";
import PageShell from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getTerminals } from "@/lib/seed";

const stageTone: Record<string, "emerald" | "amber" | "slate"> = {
  OPERATIONAL: "emerald",
  COMMISSIONING: "amber",
  CONSTRUCTION: "slate",
  DEVELOPMENT: "slate",
  PLANNED: "slate",
};

export default async function TerminalsPage() {
  const terminals = await getTerminals();

  return (
    <PageShell>
      <Header
        title="Terminal Operations"
        subtitle="Calcasieu Pass, Plaquemines, and next wave VG expansion milestones."
      />

      <section className="grid gap-6 lg:grid-cols-2">
        {terminals.map((terminal) => (
          <Card key={terminal.id}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{terminal.name}</h3>
                <p className="text-sm text-slate-500">{terminal.location}</p>
              </div>
              <Badge tone={stageTone[terminal.stage]}>{terminal.stage}</Badge>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Capacity</p>
                <p className="text-lg font-semibold text-slate-800">{terminal.capacityMtpa} MTPA</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Trains</p>
                <p className="text-lg font-semibold text-slate-800">{terminal.numberOfTrains}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Commissioned</p>
                <p className="text-lg font-semibold text-slate-800">
                  {terminal.operationalSince ? terminal.operationalSince.slice(0, 10) : "TBD"}
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-xl border border-slate-200/60 bg-slate-50/60 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-700">Cargo cadence (placeholder)</p>
              <p className="mt-1">Estimated 2.1 cargoes/week based on AIS dwell time rules.</p>
            </div>
          </Card>
        ))}
      </section>

      <section>
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Cargo Flow Notes</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>
              Loading inference uses geofenced terminal polygons with dwell time & speed thresholds. Current data is seeded; plug
              in AIS providers to activate live inference.
            </p>
            <p>
              Use the settings page (v1) to tune dwell hours, speed thresholds, and draught change confidence boosts.
            </p>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
