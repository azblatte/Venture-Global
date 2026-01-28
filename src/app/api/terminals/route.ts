import { NextResponse } from "next/server";
import { getTerminals } from "@/lib/seed";

export async function GET() {
  const terminals = await getTerminals();
  return NextResponse.json({ terminals });
}
