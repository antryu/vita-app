import { NextRequest, NextResponse } from "next/server";
import { generateCoaching } from "@/lib/ai/coaching";
import type { VitaScoreResult } from "@/lib/ai/vita-score";
import type { Anomaly } from "@/lib/ai/anomaly";

export async function POST(request: NextRequest) {
  try {
    const { scores, anomalies, profile } = (await request.json()) as {
      scores: VitaScoreResult;
      anomalies?: Anomaly[];
      profile?: { name: string; age: number; gender: string };
    };

    if (!scores || typeof scores.health_score !== "number") {
      return NextResponse.json(
        { error: "scores object with health_score is required" },
        { status: 400 }
      );
    }

    const message = generateCoaching(scores, anomalies || [], profile);

    return NextResponse.json({ status: "ok", message });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
