import { NextRequest, NextResponse } from "next/server";

interface ReferralRequest {
  member_id: string;
  reason: string;
  vita_score: number;
  recent_anomalies: Array<{ type: string; severity: string }>;
  urgency: "within_24h" | "within_1week" | "routine";
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ReferralRequest;

    if (!body.member_id || !body.reason) {
      return NextResponse.json({ error: "member_id and reason are required" }, { status: 400 });
    }

    // TODO: Send referral to CHA Healthcare API
    // TODO: Create partner_referral record in Supabase
    const referral = {
      id: `ref_${Date.now()}`,
      member_id: body.member_id,
      partner_type: "cha_hc",
      partner_name: "CHA Healthcare",
      referral_reason: body.reason,
      urgency: body.urgency || "routine",
      status: "initiated",
      created_at: new Date().toISOString(),
      estimated_response: body.urgency === "within_24h" ? "24시간 이내" : body.urgency === "within_1week" ? "1주일 이내" : "예약 가능 시",
    };

    return NextResponse.json({ status: "ok", referral });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
