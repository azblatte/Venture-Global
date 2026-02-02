"use client";

import dynamic from "next/dynamic";
import { Card } from "@/components/ui/Card";

const TradingViewWidget = dynamic(
  () => import("./TradingViewWidget").then((mod) => mod.TradingViewWidget),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[300px] items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500">
        Loading live chart...
      </div>
    ),
  }
);

export default function LivePriceWidgets() {
  return (
    <section>
      <Card className="p-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Live Market Prices (TradingView)
        </h3>
        <p className="mb-4 text-xs text-slate-500">
          Real-time futures prices. No API key required — powered by TradingView widgets.
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold text-slate-700">Henry Hub Natural Gas (NG1!)</p>
            <div className="overflow-hidden rounded-lg">
              <TradingViewWidget symbol="NYMEX:NG1!" height={300} interval="D" />
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-slate-700">European TTF Gas (TFM1!)</p>
            <div className="overflow-hidden rounded-lg">
              <TradingViewWidget symbol="ICEEUR:TFM1!" height={300} interval="D" />
            </div>
          </div>
        </div>
        <p className="mt-4 text-[10px] text-slate-400">
          Charts update in real-time during market hours. Click charts to interact.
        </p>
      </Card>
    </section>
  );
}
