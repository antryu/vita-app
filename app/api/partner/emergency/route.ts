import { NextRequest, NextResponse } from "next/server";

interface EmergencyDispatchRequest {
  member_id: string;
  location: { lat: number; lng: number };
  vitals_snapshot: {
    heart_rate?: number;
    spo2?: number;
    skin_temp?: number;
  };
  alert_type: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as EmergencyDispatchRequest;

    if (!body.member_id || !body.location) {
      return NextResponse.json({ error: "member_id and location are required" }, { status: 400 });
    }

    // TODO: Integrate with 119 emergency dispatch API (Korea-specific)
    // TODO: Send SMS fallback if API unavailable
    const dispatch = {
      id: `sos_${Date.now()}`,
      member_id: body.member_id,
      status: "dispatched",
      location: body.location,
      vitals: body.vitals_snapshot,
      alert_type: body.alert_type,
      dispatched_at: new Date().toISOString(),
      estimated_arrival: "8-12분",
      channels: ["119_api", "sms_guardian", "kakao_guardian"],
    };

    return NextResponse.json({ status: "ok", dispatch });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
