// Revalidate every 24 hours (86400 seconds) - free on Vercel
export const revalidate = 86400;

import Header from "@/components/layout/Header";
import PageShell from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import FuturesCurveClient from "@/components/charts/FuturesCurveClient";

export default function FuturesPage() {
  return (
    <PageShell>
      <Header
        title="LNG Futures Curve"
        subtitle="Forward market pricing for HH-TTF spreads — the key driver of VG's valuation"
      />

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Why This Matters
          </h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>
              The <strong>HH-TTF spread futures curve</strong> shows what the market expects
              the difference between US natural gas (Henry Hub) and European gas (TTF) to be
              over the next 1-2 years.
            </p>
            <p>
              VG buys gas at Henry Hub and sells LNG at prices linked to TTF/JKM. The wider
              this spread, the more profitable each cargo. The futures curve tells you what
              traders expect VG's margins to look like going forward.
            </p>
            <p>
              <strong>Key insight:</strong> When the forward curve shows sustained wide spreads
              (e.g., $5+ for 12+ months), it signals strong expected cash flows for VG.
            </p>
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Reading the Curve
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>
              <strong>Contango:</strong> Later months higher than front month → market expects
              spreads to widen (bullish for VG)
            </li>
            <li>
              <strong>Backwardation:</strong> Later months lower → market expects spreads to
              compress (bearish signal)
            </li>
            <li>
              <strong>Flat curve:</strong> Stable expectations across all months
            </li>
            <li>
              <strong>Seasonality:</strong> Winter months often show higher spreads due to
              European heating demand
            </li>
          </ul>
        </Card>
      </section>

      <FuturesCurveClient />

      <section>
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Data Source
          </h3>
          <div className="mt-4 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <p className="font-semibold text-slate-800">NYMEX:THD1!</p>
              <p className="text-xs text-slate-500">
                Henry Hub TTF (ICIS Heren) Natural Gas Spread Futures. Front month contract.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-800">NYMEX:NG1!</p>
              <p className="text-xs text-slate-500">
                Henry Hub Natural Gas Futures. US feedgas benchmark.
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Charts powered by TradingView. Data is real-time during market hours.
          </p>
        </Card>
      </section>
    </PageShell>
  );
}
