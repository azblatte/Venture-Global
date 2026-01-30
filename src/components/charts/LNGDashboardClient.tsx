"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import type { LNGDashboardData } from "@/lib/lng-dashboard";
import type { Config, Data, Layout } from "plotly.js";

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
    <div className="flex h-80 items-center justify-center rounded-2xl border border-slate-200/60 bg-white/70 text-sm text-slate-500">
      Loading interactive chart…
    </div>
  ),
});

interface LNGDashboardClientProps {
  initialData: LNGDashboardData;
}

export default function LNGDashboardClient({ initialData }: LNGDashboardClientProps) {
  const [data, setData] = useState(initialData);
  const [status, setStatus] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dates = data.weekly.map((item) => item.week);

  // Chart 1: US Total Cargoes + VG Total + TTF-HH Spread
  const chart1Traces = useMemo<Data[]>(() => {
    const usTotals = data.weekly.map((item) => item.usTotalCargoes);
    const vgTotals = data.weekly.map((item) => item.vgTotalCargoes);
    const ttfSpread = data.weekly.map((item) => item.ttfHh);

    return [
      {
        x: dates,
        y: usTotals,
        type: "scatter",
        mode: "lines",
        name: "US Total Cargoes",
        line: { color: "rgba(37, 99, 235, 0.9)", width: 2 },
        fill: "tozeroy",
        fillcolor: "rgba(37, 99, 235, 0.15)",
        hovertemplate: "%{x}<br>US Total: %{y} cargoes<extra></extra>",
      },
      {
        x: dates,
        y: vgTotals,
        type: "scatter",
        mode: "lines",
        name: "VG Deliveries",
        line: { color: "rgba(239, 68, 68, 0.95)", width: 2 },
        fill: "tozeroy",
        fillcolor: "rgba(239, 68, 68, 0.1)",
        hovertemplate: "%{x}<br>VG Total: %{y} cargoes<extra></extra>",
      },
      {
        x: dates,
        y: ttfSpread,
        type: "scatter",
        mode: "lines",
        name: "TTF-HH Spread",
        yaxis: "y2",
        line: { color: "rgba(16, 185, 129, 0.8)", width: 2, dash: "dot" },
        hovertemplate: "%{x}<br>TTF-HH: $%{y:.2f}<extra></extra>",
      },
    ];
  }, [dates, data.weekly]);

  const chart1Layout = useMemo<Partial<Layout>>(
    () => ({
      height: 320,
      margin: { l: 50, r: 50, t: 30, b: 40 },
      legend: { orientation: "h", x: 0, y: 1.12, font: { size: 11 } },
      hovermode: "x unified",
      xaxis: { showgrid: false, tickformat: "%b %y" },
      yaxis: { title: { text: "Cargoes", font: { size: 11 } }, range: [0, 55], gridcolor: "rgba(0,0,0,0.05)" },
      yaxis2: {
        title: { text: "Spread ($/MMBtu)", font: { size: 11 } },
        overlaying: "y",
        side: "right",
        range: [0, 20],
        tickprefix: "$",
        gridcolor: "transparent",
      },
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
    }),
    []
  );

  // Chart 2: VG Terminal Breakdown (Plaquemines vs Calcasieu)
  const chart2Traces = useMemo<Data[]>(() => {
    const plaquemines = data.weekly.map((item) => item.plaqueminesCargoes);
    const calcasieu = data.weekly.map((item) => item.calcasieuCargoes);

    return [
      {
        x: dates,
        y: plaquemines,
        type: "scatter",
        mode: "lines",
        name: "Plaquemines",
        line: { color: "rgba(37, 99, 235, 0.9)", width: 2 },
        fill: "tozeroy",
        fillcolor: "rgba(37, 99, 235, 0.15)",
        hovertemplate: "%{x}<br>Plaquemines: %{y} cargoes<extra></extra>",
      },
      {
        x: dates,
        y: calcasieu,
        type: "scatter",
        mode: "lines",
        name: "Calcasieu Pass",
        line: { color: "rgba(249, 115, 22, 0.9)", width: 2 },
        fill: "tozeroy",
        fillcolor: "rgba(249, 115, 22, 0.1)",
        hovertemplate: "%{x}<br>Calcasieu: %{y} cargoes<extra></extra>",
      },
    ];
  }, [dates, data.weekly]);

  const chart2Layout = useMemo<Partial<Layout>>(
    () => ({
      height: 280,
      margin: { l: 50, r: 50, t: 30, b: 40 },
      legend: { orientation: "h", x: 0, y: 1.12, font: { size: 11 } },
      hovermode: "x unified",
      xaxis: { showgrid: false, tickformat: "%b %y" },
      yaxis: { title: { text: "Cargoes", font: { size: 11 } }, range: [0, 12], gridcolor: "rgba(0,0,0,0.05)" },
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
    }),
    []
  );

  // Chart 3: JKM-HH Spread
  const chart3Traces = useMemo<Data[]>(() => {
    const jkmSpread = data.weekly.map((item) => item.jkmHh);
    const ttfSpread = data.weekly.map((item) => item.ttfHh);

    return [
      {
        x: dates,
        y: jkmSpread,
        type: "scatter",
        mode: "lines",
        name: "JKM-HH (Asia)",
        line: { color: "rgba(34, 197, 94, 0.9)", width: 2 },
        fill: "tozeroy",
        fillcolor: "rgba(34, 197, 94, 0.15)",
        hovertemplate: "%{x}<br>JKM-HH: $%{y:.2f}<extra></extra>",
      },
      {
        x: dates,
        y: ttfSpread,
        type: "scatter",
        mode: "lines",
        name: "TTF-HH (Europe)",
        line: { color: "rgba(239, 68, 68, 0.7)", width: 2, dash: "dash" },
        hovertemplate: "%{x}<br>TTF-HH: $%{y:.2f}<extra></extra>",
      },
    ];
  }, [dates, data.weekly]);

  const chart3Layout = useMemo<Partial<Layout>>(
    () => ({
      height: 280,
      margin: { l: 50, r: 50, t: 30, b: 40 },
      legend: { orientation: "h", x: 0, y: 1.12, font: { size: 11 } },
      hovermode: "x unified",
      xaxis: { showgrid: false, tickformat: "%b %y", rangeslider: { visible: true } },
      yaxis: { title: { text: "Spread ($/MMBtu)", font: { size: 11 } }, range: [0, 20], tickprefix: "$", gridcolor: "rgba(0,0,0,0.05)" },
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
    }),
    []
  );

  const config = useMemo<Partial<Config>>(
    () => ({
      displaylogo: false,
      responsive: true,
      modeBarButtonsToRemove: ["lasso2d", "select2d"],
    }),
    []
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setStatus("Refreshing data...");
    try {
      await fetch("/api/cron/update-prices?manual=1");
      const res = await fetch("/api/lng-dashboard");
      const payload = await res.json();
      if (payload?.data) {
        setData(payload.data as LNGDashboardData);
        setStatus(`Updated ${new Date().toLocaleTimeString()}`);
      } else {
        setStatus("Update failed. Try again.");
      }
    } catch {
      setStatus("Update failed. Try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        <Card className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-slate-400">Henry Hub</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">${data.kpis.hh.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400">US Gas</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-slate-400">TTF</p>
          <p className="mt-1 text-xl font-semibold text-sky-600">${data.kpis.ttf.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400">Europe</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-slate-400">JKM</p>
          <p className="mt-1 text-xl font-semibold text-emerald-600">${data.kpis.jkm.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400">Asia</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-slate-400">TTF-HH Spread</p>
          <p className="mt-1 text-xl font-semibold text-rose-600">${data.kpis.ttfHh.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400">EU Margin</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-slate-400">JKM-HH Spread</p>
          <p className="mt-1 text-xl font-semibold text-green-600">${data.kpis.jkmHh.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400">Asia Margin</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-slate-400">VG Cargoes</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{data.kpis.weeklyVgCargoes}/wk</p>
          <p className="text-[10px] text-emerald-600">+{data.kpis.yoyVgGrowthPct.toFixed(0)}% YoY</p>
        </Card>
      </div>

      {/* Refresh Controls */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">LNG Export Analytics</p>
            <p className="text-xs text-slate-500">EIA Henry Hub + estimated TTF/JKM spreads</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              {new Date(data.meta.lastPriceUpdate).toLocaleDateString()}
            </span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {isRefreshing ? "..." : "Refresh"}
            </button>
          </div>
        </div>
        {status && <p className="mt-2 text-xs text-slate-500">{status}</p>}
      </Card>

      {/* Chart 1: US Total + VG Deliveries + TTF Spread */}
      <Card className="p-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          US LNG Cargoes vs VG Deliveries
        </h3>
        <p className="mb-4 text-xs text-slate-500">
          Total US LNG exports (blue area), VG deliveries (red), and TTF-HH spread (green dotted, right axis)
        </p>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <Plot
              data={chart1Traces}
              layout={chart1Layout}
              config={config}
              useResizeHandler
              style={{ width: "100%", height: "320px" }}
            />
          </div>
        </div>
      </Card>

      {/* Chart 2: VG Terminal Breakdown */}
      <Card className="p-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          VG Terminal Cargo Cadence
        </h3>
        <p className="mb-4 text-xs text-slate-500">
          Weekly cargoes from Plaquemines LNG (blue) vs Calcasieu Pass (orange)
        </p>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <Plot
              data={chart2Traces}
              layout={chart2Layout}
              config={config}
              useResizeHandler
              style={{ width: "100%", height: "280px" }}
            />
          </div>
        </div>
      </Card>

      {/* Chart 3: Regional Spreads */}
      <Card className="p-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Regional Arbitrage Spreads
        </h3>
        <p className="mb-4 text-xs text-slate-500">
          JKM-HH (Asia, green) vs TTF-HH (Europe, red dashed). Use slider to zoom.
        </p>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <Plot
              data={chart3Traces}
              layout={chart3Layout}
              config={config}
              useResizeHandler
              style={{ width: "100%", height: "280px" }}
            />
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card className="p-4">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Recent Weekly Data
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-2 pr-4">Week</th>
                <th className="py-2 pr-4">US Total</th>
                <th className="py-2 pr-4">VG Total</th>
                <th className="py-2 pr-4">PLQ</th>
                <th className="py-2 pr-4">CP1</th>
                <th className="py-2 pr-4">HH</th>
                <th className="py-2 pr-4">TTF</th>
                <th className="py-2 pr-4">JKM</th>
                <th className="py-2 pr-4">TTF-HH</th>
                <th className="py-2 pr-4">JKM-HH</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.table.map((row) => (
                <tr key={row.week} className="text-slate-600">
                  <td className="py-2 pr-4 font-medium text-slate-900">{row.week}</td>
                  <td className="py-2 pr-4">{row.usTotalCargoes}</td>
                  <td className="py-2 pr-4 font-medium">{row.vgTotalCargoes}</td>
                  <td className="py-2 pr-4 text-blue-600">{row.plaqueminesCargoes}</td>
                  <td className="py-2 pr-4 text-orange-600">{row.calcasieuCargoes}</td>
                  <td className="py-2 pr-4">${row.hh.toFixed(2)}</td>
                  <td className="py-2 pr-4">${row.ttf.toFixed(2)}</td>
                  <td className="py-2 pr-4">${row.jkm.toFixed(2)}</td>
                  <td className="py-2 pr-4 text-rose-600">${row.ttfHh.toFixed(2)}</td>
                  <td className="py-2 pr-4 text-green-600">${row.jkmHh.toFixed(2)}</td>
                  <td className="py-2">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        row.profitabilityFlag
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {row.profitabilityFlag ? "Strong" : "Neutral"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Legend / Notes */}
      <Card className="p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Data Sources & Notes
        </h3>
        <div className="grid gap-4 text-xs text-slate-600 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-slate-700">Henry Hub (HH)</p>
            <p>EIA Natural Gas Spot Price, daily, 1-day delayed</p>
          </div>
          <div>
            <p className="font-semibold text-slate-700">TTF & JKM</p>
            <p>Estimated from historical spreads. Production use requires ICE/Platts.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-700">Cargo Counts</p>
            <p>Modeled estimates based on VG capacity ramp schedule.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-700">Refresh</p>
            <p>Auto: daily 6AM UTC via Vercel cron. Manual: button above.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
