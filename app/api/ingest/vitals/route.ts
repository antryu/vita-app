import { NextRequest, NextResponse } from "next/server";

interface VitalPayload {
  ring_id: string;
  measured_at: string;
  heart_rate?: number;
  hrv?: number;
  spo2?: number;
  skin_temp?: number;
  respiration_rate?: number;
  stress_score?: number;
  steps?: number;
  sleep_stage?: string;
  battery?: number;
  location?: { lat: number; lng: number };
}

function validatePayload(body: unknown): { valid: boolean; error?: string; data?: VitalPayload } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be a JSON object" };
  }

  const payload = body as Record<string, unknown>;

  if (!payload.ring_id || typeof payload.ring_id !== "string") {
    return { valid: false, error: "ring_id is required and must be a string" };
  }

  if (!payload.measured_at || typeof payload.measured_at !== "string") {
    return { valid: false, error: "measured_at is required and must be an ISO 8601 string" };
  }

  const measuredAt = new Date(payload.measured_at as string);
  if (isNaN(measuredAt.getTime())) {
    return { valid: false, error: "measured_at must be a valid date" };
  }

  if (payload.heart_rate !== undefined) {
    const hr = Number(payload.heart_rate);
    if (isNaN(hr) || hr < 20 || hr > 250) {
      return { valid: false, error: "heart_rate must be between 20 and 250" };
    }
  }

  if (payload.spo2 !== undefined) {
    const spo2 = Number(payload.spo2);
    if (isNaN(spo2) || spo2 < 50 || spo2 > 100) {
      return { valid: false, error: "spo2 must be between 50 and 100" };
    }
  }

  return {
    valid: true,
    data: {
      ring_id: payload.ring_id as string,
      measured_at: measuredAt.toISOString(),
      heart_rate: payload.heart_rate as number | undefined,
      hrv: payload.hrv as number | undefined,
      spo2: payload.spo2 as number | undefined,
      skin_temp: payload.skin_temp as number | undefined,
      respiration_rate: payload.respiration_rate as number | undefined,
      stress_score: payload.stress_score as number | undefined,
      steps: payload.steps as number | undefined,
      sleep_stage: payload.sleep_stage as string | undefined,
      battery: payload.battery as number | undefined,
      location: payload.location as { lat: number; lng: number } | undefined,
    },
  };
}

function detectAnomalies(data: VitalPayload) {
  const alerts: Array<{ type: string; severity: string; value: number; threshold: { min: number; max: number } }> = [];

  if (data.heart_rate !== undefined) {
    if (data.heart_rate < 40 || data.heart_rate > 150) {
      alerts.push({
        type: "heart_rate",
        severity: "critical",
        value: data.heart_rate,
        threshold: { min: 40, max: 150 },
      });
    }
  }

  if (data.spo2 !== undefined && data.spo2 < 90) {
    alerts.push({
      type: "spo2",
      severity: "critical",
      value: data.spo2,
      threshold: { min: 90, max: 100 },
    });
  }

  if (data.skin_temp !== undefined) {
    if (data.skin_temp < 34 || data.skin_temp > 39) {
      alerts.push({
        type: "skin_temp",
        severity: data.skin_temp > 39 ? "critical" : "warning",
        value: data.skin_temp,
        threshold: { min: 34, max: 39 },
      });
    }
  }

  return alerts;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validatePayload(body);

    if (!validation.valid) {
      return NextResponse.json(
        { status: "error", error: validation.error },
        { status: 400 }
      );
    }

    const data = validation.data!;

    // TODO: Deduplication check against DB (ring_id + measured_at)
    // TODO: Store in Supabase vitals table
    // For now, process and return

    const alerts = detectAnomalies(data);

    return NextResponse.json({
      status: "ok",
      ring_id: data.ring_id,
      measured_at: data.measured_at,
      alerts,
    });
  } catch {
    return NextResponse.json(
      { status: "error", error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}
