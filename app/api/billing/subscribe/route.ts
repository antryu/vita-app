import { NextRequest, NextResponse } from "next/server";
import { PLAN_PRICES, type PlanType } from "@/lib/toss/payments";

export async function POST(request: NextRequest) {
  try {
    const { plan, member_id } = (await request.json()) as { plan: PlanType; member_id: string };

    if (!plan || !PLAN_PRICES[plan]) {
      return NextResponse.json({ error: "Invalid plan. Must be basic, premium, or platinum" }, { status: 400 });
    }
    if (!member_id) {
      return NextResponse.json({ error: "member_id is required" }, { status: 400 });
    }

    const planInfo = PLAN_PRICES[plan];

    // TODO: Create subscription in Supabase
    // TODO: Register billing key via Toss Payments
    const subscription = {
      id: `sub_${Date.now()}`,
      member_id,
      plan,
      price_monthly: planInfo.price,
      status: "active",
      started_at: new Date().toISOString(),
      next_billing_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    return NextResponse.json({ status: "ok", subscription });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
