import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Revalidate all pricing-related pages
    revalidatePath("/pricing");
    revalidatePath("/lng-dashboard");
    revalidatePath("/dashboard");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      revalidated: ["/pricing", "/lng-dashboard", "/dashboard", "/"],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
