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
  geofencePolygon?: [number, number][];
}
