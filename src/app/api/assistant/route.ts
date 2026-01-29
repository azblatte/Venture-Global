import { NextResponse } from "next/server";
import { answerQuestion } from "@/lib/assistant";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message : "";
    const response = answerQuestion(message);
    return NextResponse.json({ success: true, ...response });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
