import { NextRequest, NextResponse } from "next/server";
import { calculateVitaScore, type Vital } from "@/lib/ai/vita-score";

export async function POST(request: NextRequest) {
  try {
    const { vitals } = (await request.json()) as { vitals: Vital[] };

    if (!Array.isArray(vitals) || vitals.length === 0) {
      return NextResponse.json(
        { error: "vitals array is required and must not be empty" },
        { status: 400 }
      );
    }

    const result = calculateVitaScore(vitals);

    return NextResponse.json({ status: "ok", ...result });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
