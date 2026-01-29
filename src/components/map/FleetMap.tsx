"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import type { VesselPosition } from "@/types/vessel";
import type { Terminal } from "@/types/terminal";

export interface FleetMapProps {
  positions: VesselPosition[];
  terminals: Terminal[];
  height?: string;
}

function isValidCoordinate(lat: unknown, lon: unknown): boolean {
  return (
    typeof lat === "number" &&
    typeof lon === "number" &&
    !isNaN(lat) &&
    !isNaN(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
}

export default function FleetMap({ positions, terminals, height = "360px" }: FleetMapProps) {
  const validPositions = positions.filter((p) => isValidCoordinate(p.latitude, p.longitude));
  const validTerminals = terminals.filter((t) => isValidCoordinate(t.latitude, t.longitude));

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200/70" style={{ height }}>
      <MapContainer
        center={[28, -40]}
        zoom={2}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validPositions.map((position) => (
          <CircleMarker
            key={`${position.vesselId}-${position.recordedAt}`}
            center={[position.latitude, position.longitude]}
            radius={6}
            pathOptions={{ color: "#0f172a", fillColor: "#0ea5e9", fillOpacity: 0.8 }}
          >
            <Popup>
              <strong>{position.vesselName}</strong>
              <br />
              {position.destination ?? "Destination unknown"}
              <br />
              {position.speedKnots ?? 0} kn
            </Popup>
          </CircleMarker>
        ))}
        {validTerminals.map((terminal) => (
          <CircleMarker
            key={terminal.id}
            center={[terminal.latitude, terminal.longitude]}
            radius={7}
            pathOptions={{ color: "#1e293b", fillColor: "#f97316", fillOpacity: 0.9 }}
          >
            <Popup>
              <strong>{terminal.name}</strong>
              <br />
              {terminal.location}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
