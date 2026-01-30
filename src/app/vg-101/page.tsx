// Revalidate every 24 hours (86400 seconds) - free on Vercel
export const revalidate = 86400;

import Header from "@/components/layout/Header";
import PageShell from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function Vg101Page() {
  return (
    <PageShell>
      <Header
        title="VG 101"
        subtitle="A newcomer-friendly overview of Venture Global LNG, updated for early 2026."
      />

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">What is Venture Global?</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>
              Venture Global (NYSE: VG) is a U.S. liquefied natural gas (LNG) exporter. It builds and operates LNG export
              terminals on the Gulf Coast and sells LNG globally under long-term contracts and spot cargoes.
            </p>
            <p>
              VG uses modular, factory-built liquefaction trains to build faster and cheaper than traditional projects.
              Its goal is to be one of the world’s largest LNG producers by the late 2020s.
            </p>
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Core Business Model</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>
              <strong>Feedgas:</strong> buys U.S. gas near Henry Hub.
            </li>
            <li>
              <strong>Liquefaction:</strong> charges fixed fees in long-term SPAs.
            </li>
            <li>
              <strong>Spot Sales:</strong> captures TTF/JKM spreads when commissioning volumes are flexible.
            </li>
            <li>
              <strong>Shipping:</strong> owns/charters LNG carriers to control logistics and margin.
            </li>
          </ul>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Key Projects (as of Jan 2026)</h3>
          <div className="mt-4 space-y-4">
            {[
              {
                name: "Calcasieu Pass",
                location: "Cameron Parish, LA",
                capacity: "10 MTPA",
                status: "Operational",
                note: "Online since 2022. Core export facility with arbitration disputes now mostly resolved.",
              },
              {
                name: "Plaquemines LNG",
                location: "Plaquemines Parish, LA",
                capacity: "20 MTPA",
                status: "Commissioning",
                note: "First cargoes late 2025; brownfield expansion announced in 2025.",
              },
              {
                name: "CP2 LNG",
                location: "Cameron Parish, LA",
                capacity: "20 MTPA",
                status: "Under construction",
                note: "FID July 2025; Phase 1 underway, Phase 2 expected 1H 2026.",
              },
              {
                name: "CP3 LNG",
                location: "Cameron Parish, LA",
                capacity: "30 MTPA",
                status: "Development",
                note: "Pre-FID. Longer-term expansion option post-2028.",
              },
            ].map((project) => (
              <div key={project.name} className="rounded-xl border border-slate-200/60 bg-white/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{project.name}</p>
                    <p className="text-xs text-slate-500">{project.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone="slate">{project.capacity}</Badge>
                    <Badge tone={project.status === "Operational" ? "emerald" : project.status === "Commissioning" ? "amber" : "slate"}>
                      {project.status}
                    </Badge>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">{project.note}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">How to Read This Dashboard</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>
              <strong>Pricing:</strong> The TTF-HH and JKM-HH spreads drive spot cargo profitability. Wider spreads
              generally improve margins.
            </p>
            <p>
              <strong>Fleet:</strong> Utilization (at sea or loading) signals how many cargoes are moving and whether
              terminals are loading smoothly.
            </p>
            <p>
              <strong>Terminals:</strong> Loading cadence shows whether projects are ramping on schedule.
            </p>
            <p>
              <strong>Insights:</strong> Rule-based alerts highlight unusual shifts (spread compression, loitering vessels,
              legal developments).
            </p>
          </div>
        </Card>
      </section>

      <section>
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Frequently Asked Questions</h3>
          <div className="mt-4 space-y-4">
            {[
              {
                q: "Why is VG stock volatile?",
                a: "VG is a growth company with heavy project execution risk. Stock moves on construction updates, legal news (arbitration with offtakers), and macro LNG spreads. High beta is normal until projects stabilize.",
              },
              {
                q: "What are the arbitration disputes about?",
                a: "Some buyers (Shell, BP, etc.) claimed VG sold commissioning cargoes at spot prices instead of delivering under contract. VG argues commissioning volumes are separate. Most disputes have been resolved or settled as of late 2025.",
              },
              {
                q: "How does VG make money?",
                a: "Two ways: (1) Fixed liquefaction fees from 20-year SPAs (~$2/MMBtu), providing stable cash flow. (2) Spot sales capturing TTF-HH or JKM-HH spreads during commissioning or when contracts allow flexibility.",
              },
              {
                q: "What happens if gas spreads collapse?",
                a: "Long-term SPAs are take-or-pay with fixed fees, so contracted revenue is protected. Spot upside shrinks, but debt service is covered. VG is less exposed than pure merchant LNG players.",
              },
              {
                q: "When will VG be profitable / cash flow positive?",
                a: "Calcasieu Pass is already generating cash. Plaquemines ramp through 2026 adds significant EBITDA. Consensus expects strong free cash flow by 2027 as capex winds down and more trains come online.",
              },
              {
                q: "What's the bear case?",
                a: "Execution delays, cost overruns, or major legal losses could hurt. Long-term, global LNG oversupply (Qatar, other US projects) could compress spreads. Regulatory risk if US restricts LNG exports.",
              },
              {
                q: "What's the bull case?",
                a: "VG becomes a top-3 global LNG exporter by 2028. Low-cost modular approach yields industry-leading margins. Europe/Asia demand stays strong, spreads remain wide, and spot premiums boost returns.",
              },
              {
                q: "How do I track VG performance?",
                a: "This dashboard! Watch spreads (Pricing), cargo cadence (LNG Dashboard), fleet movements (Fleet Tracker), and news for legal/regulatory updates.",
              },
            ].map((faq, i) => (
              <div key={i} className="rounded-xl border border-slate-200/60 bg-white/70 p-4">
                <p className="text-sm font-semibold text-slate-900">{faq.q}</p>
                <p className="mt-2 text-sm text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section>
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Glossary</h3>
          <div className="mt-4 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <p className="font-semibold text-slate-800">Henry Hub (HH)</p>
              <p className="text-xs text-slate-500">US natural gas benchmark price.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800">TTF</p>
              <p className="text-xs text-slate-500">Dutch gas hub, primary European LNG price signal.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800">JKM</p>
              <p className="text-xs text-slate-500">Japan-Korea Marker, Asian LNG spot benchmark.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800">MTPA</p>
              <p className="text-xs text-slate-500">Million tonnes per annum of LNG capacity.</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">Sources: internal VG deep dive notes (Jan 2026).</p>
        </Card>
      </section>
    </PageShell>
  );
}
