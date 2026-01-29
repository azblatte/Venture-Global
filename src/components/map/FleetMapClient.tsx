"use client";

import dynamic from "next/dynamic";
import type { FleetMapProps } from "./FleetMap";

const FleetMap = dynamic(() => import("./FleetMap"), { ssr: false });

export default function FleetMapClient(props: FleetMapProps) {
  return <FleetMap {...props} />;
}
