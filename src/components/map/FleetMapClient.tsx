"use client";

import dynamic from "next/dynamic";
import type { FleetMapProps } from "./FleetMap";
import MapErrorBoundary from "./MapErrorBoundary";

const FleetMap = dynamic(() => import("./FleetMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[360px] items-center justify-center rounded-2xl border border-slate-200/70 bg-slate-50">
      <div className="text-center">
        <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
        <p className="mt-2 text-xs text-slate-400">Loading map...</p>
      </div>
    </div>
  ),
});

export default function FleetMapClient(props: FleetMapProps) {
  return (
    <MapErrorBoundary>
      <FleetMap {...props} />
    </MapErrorBoundary>
  );
}
