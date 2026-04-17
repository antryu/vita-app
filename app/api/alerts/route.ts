import { NextRequest, NextResponse } from "next/server";
import { getEscalationAction, ESCALATION_CHAIN } from "@/lib/kakao/notify";
import type { AlertSeverity } from "@/lib/supabase/types";

interface CreateAlertRequest {
  member_id: string;
  alert_type: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

const SEVERITY_CHANNELS: Record<AlertSeverity, string[]> = {
  info: ["app"],
  warning: ["app", "kakao"],
  critical: ["app", "kakao", "dashboard", "ai_call"],
  emergency: ["app", "kakao", "dashboard", "ai_call", "emergency_119"],
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateAlertRequest;

    if (!body.member_id || !body.severity || !body.title) {
      return NextResponse.json({ error: "member_id, severity, and title are required" }, { status: 400 });
    }

    const channels = SEVERITY_CHANNELS[body.severity] || ["app"];

    // TODO: Store alert in Supabase
    // TODO: Send KakaoTalk notification
    // TODO: Start escalation timer for critical/emergency

    const alert = {
      id: `alert-${Date.now()}`,
      ...body,
      status: "sent",
      sent_via: channels,
      sent_at: new Date().toISOString(),
      escalation: body.severity === "critical" || body.severity === "emergency"
        ? ESCALATION_CHAIN.map((e) => ({ ...e, triggered: e.delayMinutes === 0 }))
        : null,
    };

    return NextResponse.json({ status: "ok", alert });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  // TODO: Query from Supabase with RLS
  // Mock response
  const mockAlerts = [
    { id: "a1", member_id: "m1", severity: "critical", title: "심박수 142bpm", status: "sent", created_at: new Date().toISOString() },
    { id: "a2", member_id: "m2", severity: "critical", title: "SpO2 88%", status: "sent", created_at: new Date().toISOString() },
    { id: "a3", member_id: "m3", severity: "warning", title: "수면 점수 저하", status: "acknowledged", created_at: new Date().toISOString() },
  ];

  const filtered = status ? mockAlerts.filter((a) => a.status === status) : mockAlerts;

  return NextResponse.json({ status: "ok", alerts: filtered, total: filtered.length });
}
