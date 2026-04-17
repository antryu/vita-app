import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, data } = body as { eventType: string; data: Record<string, unknown> };

    switch (eventType) {
      case "BILLING_KEY_ISSUED":
        // TODO: Update subscription billing key in DB
        console.log("[Toss Webhook] Billing key issued:", data);
        break;
      case "PAYMENT_DONE":
        // TODO: Record payment, update next_billing_at
        console.log("[Toss Webhook] Payment done:", data);
        break;
      case "PAYMENT_FAILED":
        // TODO: Retry logic, send dunning notification
        console.log("[Toss Webhook] Payment failed:", data);
        break;
      case "PAYMENT_CANCELED":
        // TODO: Process refund
        console.log("[Toss Webhook] Payment canceled:", data);
        break;
      default:
        console.log("[Toss Webhook] Unknown event:", eventType);
    }

    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }
}
