export type VesselStatus =
  | "AT_SEA"
  | "IN_PORT"
  | "AT_TERMINAL_LOADING"
  | "AT_TERMINAL_WAITING"
  | "LAID_UP"
  | "DRY_DOCK"
  | "UNKNOWN";

export interface Vessel {
  id: string;
  name: string;
  imo?: string;
  vesselType: "LNG_CARRIER" | "FSRU";
  ownership: "OWNED" | "CHARTERED";
  capacityCbm: number;
  yearBuilt?: number;
  builder?: string;
  flag?: string;
  status: VesselStatus;
  isDelivered: boolean;
  expectedDelivery?: string;
}

export interface VesselPosition {
  vesselId: string;
  vesselName: string;
  imo?: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speedKnots?: number;
  course?: number;
  draught?: number;
  destination?: string;
  eta?: string;
  navStatus?: string;
  recordedAt: string;
}
