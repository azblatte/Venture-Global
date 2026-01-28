import { NextResponse } from "next/server";
import { getVesselPositions, getVessels } from "@/lib/seed";

export async function GET() {
  const [vessels, positions] = await Promise.all([getVessels(), getVesselPositions()]);
  return NextResponse.json({ vessels, positions });
}
