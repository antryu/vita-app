import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { member_id, consent, data_scope } = (await request.json()) as {
      member_id: string;
      consent: boolean;
      data_scope: string[];
    };

    if (!member_id || consent === undefined) {
      return NextResponse.json({ error: "member_id and consent are required" }, { status: 400 });
    }

    if (!consent) {
      return NextResponse.json({ status: "ok", message: "Data sharing declined" });
    }

    // TODO: Generate anonymized health summary for insurer
    // Only share: vita_score, sleep_quality_trend, activity_level — NO raw biometrics
    const sharedData = {
      member_ref: `anon_${member_id.slice(-6)}`,
      period: "30d",
      vita_score_avg: 78,
      vita_score_trend: "improving",
      sleep_quality: "good",
      activity_level: "moderate",
      shared_at: new Date().toISOString(),
      scope: data_scope || ["vita_score", "sleep_quality", "activity_level"],
    };

    return NextResponse.json({ status: "ok", shared_data: sharedData });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
