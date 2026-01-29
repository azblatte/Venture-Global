export interface SpaDeal {
  id: string;
  buyer: string;
  country: string;
  region: "EUROPE" | "ASIA" | "AMERICAS" | "GLOBAL";
  volumeMtpa: number;
  termYears: number;
  startYear: number;
  project: string;
  signedDate?: string;
  notes?: string;
}
