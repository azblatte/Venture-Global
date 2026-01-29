"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import type { VesselPosition } from "@/types/vessel";
import type { Terminal } from "@/types/terminal";

export interface FleetMapProps {
  positions: VesselPosition[];
  terminals: Terminal[];
  height?: string;
}

export default function FleetMap({ positions, terminals, height = "360px" }: FleetMapProps) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200/70" style={{ height }}>
      <MapContainer center={[28, -40]} zoom={2} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {positions.map((position) => (
          <CircleMarker
            key={`${position.vesselId}-${position.recordedAt}`}
            center={[position.latitude, position.longitude]}
            radius={6}
            pathOptions={{ color: "#0f172a", fillColor: "#0ea5e9", fillOpacity: 0.8 }}
          >
            <Popup>
              <div className="text-xs">
                <p className="font-semibold">{position.vesselName}</p>
                <p className="text-slate-600">{position.destination ?? "Destination unknown"}</p>
                <p className="text-slate-500">{position.speedKnots ?? 0} kn</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
        {terminals.map((terminal) => (
          <CircleMarker
            key={terminal.id}
            center={[terminal.latitude, terminal.longitude]}
            radius={7}
            pathOptions={{ color: "#1e293b", fillColor: "#f97316", fillOpacity: 0.9 }}
          >
            <Popup>
              <div className="text-xs">
                <p className="font-semibold">{terminal.name}</p>
                <p className="text-slate-600">{terminal.location}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
