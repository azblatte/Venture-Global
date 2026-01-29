export type TerminalStage = "OPERATIONAL" | "COMMISSIONING" | "CONSTRUCTION" | "DEVELOPMENT" | "PLANNED";

export interface Terminal {
  id: string;
  name: string;
  slug: string;
  location: string;
  latitude: number;
  longitude: number;
  capacityMtpa: number;
  numberOfTrains: number;
  stage: TerminalStage;
  operationalSince?: string;
  owner?: string;
  liquefactionFee?: number; // $/MMBtu charged to SPA customers
  operatingCost?: number; // $/MMBtu internal cost
  fid?: string; // Final Investment Decision date
  expectedCod?: string; // Expected Commercial Operations Date
  geofencePolygon?: [number, number][];
}
