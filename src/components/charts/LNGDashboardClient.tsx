"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import type { LNGDashboardData } from "@/lib/lng-dashboard";
import type { Config, Data, Layout } from "plotly.js";

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[520px] items-center justify-center rounded-2xl border border-slate-200/60 bg-white/70 text-sm text-slate-500">
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

  const traces = useMemo<Data[]>(() => {
    const usTotals = data.weekly.map((item) => item.usTotalCargoes);
    const vgTotals = data.weekly.map((item) => item.vgTotalCargoes);
    const ttfSpread = data.weekly.map((item) => item.ttfHh);
    const jkmSpread = data.weekly.map((item) => item.jkmHh);
    const plaquemines = data.weekly.map((item) => item.plaqueminesCargoes);
    const calcasieu = data.weekly.map((item) => item.calcasieuCargoes);

    return [
      {
        x: dates,
        y: usTotals,
        type: "scatter",
        mode: "lines",
        name: "US Total Cargoes",
        stackgroup: "one",
        line: { color: "rgba(37, 99, 235, 0.9)" },
        fill: "tozeroy",
        hovertemplate: "%{x}<br>US Total: %{y} cargoes<extra></extra>",
      },
      {
        x: dates,
        y: vgTotals,
        type: "scatter",
        mode: "lines",
        name: "VG Total Deliveries",
        stackgroup: "one",
        line: { color: "rgba(239, 68, 68, 0.9)" },
        fill: "tonexty",
        hovertemplate: "%{x}<br>VG Total: %{y} cargoes<extra></extra>",
      },
      {
        x: dates,
        y: ttfSpread,
        type: "scatter",
        mode: "lines",
        name: "TTF-HH Spread",
        yaxis: "y2",
        line: { color: "rgba(239, 68, 68, 0.6)", dash: "dash" },
        hovertemplate: "%{x}<br>TTF-HH: $%{y:.2f}<extra></extra>",
      },
      {
        x: dates,
        y: plaquemines,
        type: "scatter",
        mode: "lines",
        name: "Plaquemines Cargoes",
        xaxis: "x2",
        yaxis: "y3",
        line: { color: "rgba(37, 99, 235, 0.9)" },
        hovertemplate: "%{x}<br>Plaquemines: %{y} cargoes<extra></extra>",
      },
      {
        x: dates,
        y: calcasieu,
        type: "scatter",
        mode: "lines",
        name: "Calcasieu Pass Cargoes",
        xaxis: "x2",
        yaxis: "y3",
        line: { color: "rgba(239, 68, 68, 0.9)" },
        hovertemplate: "%{x}<br>Calcasieu: %{y} cargoes<extra></extra>",
      },
      {
        x: dates,
        y: usTotals,
        type: "scatter",
        mode: "lines",
        name: "US Total Cargoes",
        xaxis: "x3",
        yaxis: "y4",
        line: { color: "rgba(34, 197, 94, 0.6)" },
        fill: "tozeroy",
        hovertemplate: "%{x}<br>US Total: %{y} cargoes<extra></extra>",
      },
      {
        x: dates,
        y: jkmSpread,
        type: "scatter",
        mode: "lines",
        name: "JKM-HH Spread",
        xaxis: "x3",
        yaxis: "y5",
        line: { color: "rgba(34, 197, 94, 0.9)", dash: "dash" },
        hovertemplate: "%{x}<br>JKM-HH: $%{y:.2f}<extra></extra>",
      },
    ];
  }, [dates, data.weekly]);

  const layout = useMemo<Partial<Layout>>(() => {
    return {
      height: 900,
      margin: { l: 50, r: 50, t: 30, b: 40 },
      legend: { orientation: "h", x: 0, y: 1.1 },
      grid: { rows: 3, columns: 1, pattern: "independent", roworder: "top to bottom" },
      xaxis: { title: { text: "Week" }, showgrid: false },
      xaxis2: { matches: "x", showgrid: false },
      xaxis3: {
        matches: "x",
        showgrid: false,
        rangeslider: { visible: true },
      },
      yaxis: { title: { text: "Cargoes" }, range: [0, 50] },
      yaxis2: {
        title: { text: "TTF-HH Spread" },
        overlaying: "y",
        side: "right",
        range: [0, 30],
        tickprefix: "$",
      },
      yaxis3: { title: { text: "VG Cargoes" }, range: [0, 15] },
      yaxis4: { title: { text: "Cargoes" }, range: [0, 50] },
      yaxis5: {
        title: { text: "JKM-HH Spread" },
        overlaying: "y4",
        side: "right",
        range: [0, 30],
        tickprefix: "$",
      },
      annotations: [
        {
          x: "2024-07-01",
          y: 12,
          xref: "x2",
          yref: "y3",
          text: "Plaquemines start",
          showarrow: true,
          arrowhead: 4,
          ax: -20,
          ay: -30,
        },
        {
          x: "2025-06-01",
          y: 12,
          xref: "x2",
          yref: "y3",
          text: "Legal wins",
          showarrow: true,
          arrowhead: 4,
          ax: 10,
          ay: -40,
        },
      ],
    };
  }, []);

  const config = useMemo<Partial<Config>>(
    () => ({
      displaylogo: false,
      responsive: true,
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
    } catch (error) {
      setStatus("Update failed. Try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Henry Hub</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">${data.kpis.hh.toFixed(2)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">TTF</p>
          <p className="mt-2 text-2xl font-semibold text-sky-600">${data.kpis.ttf.toFixed(2)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">JKM</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">${data.kpis.jkm.toFixed(2)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">TTF-HH</p>
          <p className="mt-2 text-2xl font-semibold text-rose-600">${data.kpis.ttfHh.toFixed(2)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Weekly VG Cargoes</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{data.kpis.weeklyVgCargoes}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">YoY VG Growth</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{data.kpis.yoyVgGrowthPct.toFixed(1)}%</p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Interactive LNG Export Dashboard</p>
            <p className="text-xs text-slate-500">Data sources: EIA Henry Hub (daily), TTF/JKM estimated spreads, cargoes modeled.</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>Last updated: {new Date(data.meta.lastPriceUpdate).toLocaleString()}</span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
            >
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
        {status ? <p className="mt-2 text-xs text-slate-500">{status}</p> : null}
        <div className="mt-6 h-[680px] w-full">
          <Plot data={traces} layout={layout} config={config} useResizeHandler style={{ width: "100%", height: "100%" }} />
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Last 10 Weeks</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-2">Week</th>
                <th className="py-2">US Total</th>
                <th className="py-2">VG Total</th>
                <th className="py-2">Plaquemines</th>
                <th className="py-2">Calcasieu</th>
                <th className="py-2">HH</th>
                <th className="py-2">TTF</th>
                <th className="py-2">JKM</th>
                <th className="py-2">TTF-HH</th>
                <th className="py-2">JKM-HH</th>
                <th className="py-2">Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {data.table.map((row) => (
                <tr key={row.week} className="text-slate-700">
                  <td className="py-2 font-medium text-slate-900">{row.week}</td>
                  <td className="py-2">{row.usTotalCargoes}</td>
                  <td className="py-2">{row.vgTotalCargoes}</td>
                  <td className="py-2">{row.plaqueminesCargoes}</td>
                  <td className="py-2">{row.calcasieuCargoes}</td>
                  <td className="py-2">${row.hh.toFixed(2)}</td>
                  <td className="py-2">${row.ttf.toFixed(2)}</td>
                  <td className="py-2">${row.jkm.toFixed(2)}</td>
                  <td className="py-2">${row.ttfHh.toFixed(2)}</td>
                  <td className="py-2">${row.jkmHh.toFixed(2)}</td>
                  <td className="py-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        row.profitabilityFlag
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {row.profitabilityFlag ? "Profitable" : "Flat"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
