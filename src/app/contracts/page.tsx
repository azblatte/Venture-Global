// Revalidate every 24 hours (86400 seconds) - free on Vercel
export const revalidate = 86400;

import Header from "@/components/layout/Header";
import PageShell from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getSpaDeals } from "@/lib/seed";

export default async function ContractsPage() {
  const deals = await getSpaDeals();

  const totalVolume = deals.reduce((sum, deal) => sum + deal.volumeMtpa, 0);
  const byRegion = deals.reduce(
    (acc, deal) => {
      acc[deal.region] = (acc[deal.region] || 0) + deal.volumeMtpa;
      return acc;
    },
    {} as Record<string, number>
  );

  const byProject = deals.reduce(
    (acc, deal) => {
      acc[deal.project] = (acc[deal.project] || 0) + deal.volumeMtpa;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <PageShell>
      <Header
        title="SPA Contracts"
        subtitle="Long-term Sales & Purchase Agreements securing VG's revenue for 20+ years."
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Total Contracted</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{totalVolume.toFixed(1)} MTPA</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Europe</p>
          <p className="mt-2 text-3xl font-semibold text-sky-600">{(byRegion.EUROPE || 0).toFixed(1)} MTPA</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Asia</p>
          <p className="mt-2 text-3xl font-semibold text-orange-500">{(byRegion.ASIA || 0).toFixed(1)} MTPA</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Global Majors</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600">{(byRegion.GLOBAL || 0).toFixed(1)} MTPA</p>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">By Project</h3>
          <div className="mt-4 space-y-3">
            {Object.entries(byProject)
              .sort((a, b) => b[1] - a[1])
              .map(([project, volume]) => (
                <div key={project} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{project}</span>
                  <span className="text-sm font-semibold text-slate-900">{volume.toFixed(1)} MTPA</span>
                </div>
              ))}
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Contract Economics</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>
              <strong>Pricing Formula:</strong> (115% x Henry Hub) + Liquefaction Fee
            </p>
            <p>
              <strong>Avg Liquefaction Fee:</strong> $1.76 - $2.30/MMBtu
            </p>
            <p>
              <strong>Contract Term:</strong> 20 years (FOB basis)
            </p>
            <p className="mt-3 text-xs text-slate-500">
              These contracts provide guaranteed cash flow for debt service on $30B+ project financing.
            </p>
          </div>
        </Card>
      </section>

      <section>
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">All SPA Deals</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3">Buyer</th>
                  <th className="py-3">Country</th>
                  <th className="py-3">Volume</th>
                  <th className="py-3">Term</th>
                  <th className="py-3">Start</th>
                  <th className="py-3">Project</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60">
                {deals
                  .sort((a, b) => a.startYear - b.startYear)
                  .map((deal) => (
                    <tr key={deal.id} className="text-slate-700">
                      <td className="py-3 font-medium text-slate-900">{deal.buyer}</td>
                      <td className="py-3 text-slate-600">{deal.country}</td>
                      <td className="py-3 font-semibold">{deal.volumeMtpa} MTPA</td>
                      <td className="py-3 text-slate-600">{deal.termYears} yr</td>
                      <td className="py-3">
                        <Badge tone={deal.startYear <= 2025 ? "emerald" : "slate"}>{deal.startYear}</Badge>
                      </td>
                      <td className="py-3 text-slate-600">{deal.project}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
