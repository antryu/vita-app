import { NextRequest, NextResponse } from "next/server";

interface EarnRequest {
  member_id: string;
  reason: string;
  amount: number;
}

const EARNING_RULES: Record<string, number> = {
  sleep_goal: 500,
  readiness_up: 300,
  hrv_maintained: 300,
  family_engagement: 200,
  fandom_challenge: 1000,
  medication_adherence: 100,
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as EarnRequest;

    if (!body.member_id || !body.reason || !body.amount) {
      return NextResponse.json({ error: "member_id, reason, and amount are required" }, { status: 400 });
    }

    // TODO: Get current balance from Supabase
    const mockCurrentBalance = 12400;
    const newBalance = body.amount > 0
      ? mockCurrentBalance + body.amount
      : Math.max(0, mockCurrentBalance + body.amount);

    const transaction = {
      id: `vc_${Date.now()}`,
      member_id: body.member_id,
      transaction_type: body.amount > 0 ? "earn" : "burn",
      amount: Math.abs(body.amount),
      reason: body.reason,
      balance_after: newBalance,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ status: "ok", transaction, balance: newBalance });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    earning_rules: EARNING_RULES,
  });
}
