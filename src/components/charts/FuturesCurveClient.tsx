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

export default function FuturesCurveClient() {
  return (
    <>
      {/* HH-TTF Spread - Link to TradingView (restricted symbol) */}
      <section>
        <Card className="p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            HH-TTF Spread Futures (THD1!)
          </h3>
          <p className="mb-4 text-xs text-slate-500">
            The Henry Hub to TTF spread is the primary signal for VG's spot cargo profitability.
            This symbol requires a TradingView account to view.
          </p>

          <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-sm font-semibold text-slate-700">View HH-TTF Spread Futures</p>
            <p className="mt-2 text-xs text-slate-500">
              THD1! (Henry Hub TTF Spread) requires TradingView to view interactively.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <a
                href="https://www.tradingview.com/symbols/NYMEX-THD1!/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Open THD1! on TradingView
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a
                href="https://www.tradingview.com/symbols/NYMEX-THD2!/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                THD2! (Month +2)
              </a>
              <a
                href="https://www.tradingview.com/symbols/NYMEX-THD3!/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                THD3! (Month +3)
              </a>
            </div>
            <p className="mt-4 text-[10px] text-slate-400">
              Free TradingView account required. Forward months (THD2-THD24) show the curve.
            </p>
          </div>
        </Card>
      </section>

      {/* Forward Curve Explanation */}
      <section>
        <Card className="p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Understanding the Forward Curve
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { month: "THD1!", label: "Front Month", desc: "Current month spread expectation" },
              { month: "THD2!", label: "Month +2", desc: "Next month spread" },
              { month: "THD3!", label: "Month +3", desc: "Quarter out" },
              { month: "THD6!", label: "Month +6", desc: "Half year out" },
              { month: "THD12!", label: "Month +12", desc: "1 year forward" },
              { month: "THD24!", label: "Month +24", desc: "2 years forward" },
            ].map((item) => (
              <a
                key={item.month}
                href={`https://www.tradingview.com/symbols/NYMEX-${item.month.replace("!", "")}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-200/60 bg-white/70 p-4 transition hover:border-slate-300 hover:shadow-sm"
              >
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-500">{item.month}</p>
                <p className="mt-2 text-xs text-slate-400">{item.desc}</p>
              </a>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Click any card to view that forward month on TradingView. Compare across months to see
            if the market expects spreads to widen (contango) or compress (backwardation).
          </p>
        </Card>
      </section>

      {/* Henry Hub Chart - This one works! */}
      <section>
        <Card className="p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Henry Hub Natural Gas Futures (NG1!)
          </h3>
          <p className="mb-4 text-xs text-slate-500">
            US feedgas benchmark — VG's input cost. Lower HH = higher spreads = better margins.
          </p>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px]">
              <TradingViewWidget
                symbol="NYMEX:NG1!"
                height={400}
                interval="D"
                allowSymbolChange={true}
              />
            </div>
          </div>
        </Card>
      </section>

      {/* TTF Chart */}
      <section>
        <Card className="p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            European Natural Gas (TTF)
          </h3>
          <p className="mb-4 text-xs text-slate-500">
            Dutch TTF — European LNG pricing benchmark. Higher TTF = wider spreads = VG profits.
          </p>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px]">
              <TradingViewWidget
                symbol="ICEEUR:TFM1!"
                height={400}
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
