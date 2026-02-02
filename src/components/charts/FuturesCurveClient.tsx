"use client";

import dynamic from "next/dynamic";
import { Card } from "@/components/ui/Card";

const TradingViewWidget = dynamic(
  () => import("./TradingViewWidget").then((mod) => mod.TradingViewWidget),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500">
        Loading chart...
      </div>
    ),
  }
);

const TradingViewMiniWidget = dynamic(
  () => import("./TradingViewWidget").then((mod) => mod.TradingViewMiniWidget),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[180px] items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500">
        Loading...
      </div>
    ),
  }
);

const forwardMonths = [
  { symbol: "NYMEX:THD1!", label: "Front Month" },
  { symbol: "NYMEX:THD2!", label: "Month +2" },
  { symbol: "NYMEX:THD3!", label: "Month +3" },
  { symbol: "NYMEX:THD4!", label: "Month +4" },
  { symbol: "NYMEX:THD5!", label: "Month +5" },
  { symbol: "NYMEX:THD6!", label: "Month +6" },
];

export default function FuturesCurveClient() {
  return (
    <>
      {/* Main HH-TTF Spread Chart */}
      <section>
        <Card className="p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            HH-TTF Spread Futures (THD1!)
          </h3>
          <p className="mb-4 text-xs text-slate-500">
            Front month Henry Hub to TTF spread. This is the primary signal for VG's spot cargo
            profitability.
          </p>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px]">
              <TradingViewWidget
                symbol="NYMEX:THD1!"
                height={450}
                interval="D"
                allowSymbolChange={true}
              />
            </div>
          </div>
        </Card>
      </section>

      {/* Forward Curve Grid */}
      <section>
        <Card className="p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Forward Curve (6-Month View)
          </h3>
          <p className="mb-4 text-xs text-slate-500">
            Compare spread expectations across the next 6 months. Click any chart to explore.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {forwardMonths.map((month) => (
              <div
                key={month.symbol}
                className="rounded-xl border border-slate-200/60 bg-white/70 p-3"
              >
                <p className="mb-2 text-xs font-semibold text-slate-700">{month.label}</p>
                <p className="mb-2 text-[10px] text-slate-400">{month.symbol}</p>
                <TradingViewMiniWidget symbol={month.symbol} height={180} />
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Henry Hub Reference */}
      <section>
        <Card className="p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Henry Hub Natural Gas (NG1!)
          </h3>
          <p className="mb-4 text-xs text-slate-500">
            US feedgas benchmark. VG's input cost. Lower HH means higher spreads (good for margins).
          </p>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px]">
              <TradingViewWidget
                symbol="NYMEX:NG1!"
                height={350}
                interval="D"
                allowSymbolChange={true}
              />
            </div>
          </div>
        </Card>
      </section>
    </>
  );
}
