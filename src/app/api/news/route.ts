import { NextResponse } from "next/server";
import { getNewsArticles } from "@/lib/seed";

export async function GET() {
  const news = await getNewsArticles();
  return NextResponse.json({ news });
}
