import type { Baseline, Vital } from "./vita-score";

export interface Anomaly {
  type: string;
  level: "critical" | "warning" | "caution";
  value: number;
  threshold: { min?: number; max?: number };
  deviation?: number;
  measured_at: string;
  message: string;
}

const ABSOLUTE_THRESHOLDS: Record<string, { min: number; max: number; label: string }> = {
  heart_rate: { min: 40, max: 150, label: "심박수" },
  spo2: { min: 90, max: 100, label: "산소포화도" },
  skin_temp: { min: 34, max: 39, label: "체온" },
};

export function detectAnomalies(vital: Vital, baseline: Baseline): Anomaly[] {
  const anomalies: Anomaly[] = [];

  // Level 1: Absolute threshold violations (critical)
  if (vital.heart_rate !== null) {
    const t = ABSOLUTE_THRESHOLDS.heart_rate;
    if (vital.heart_rate < t.min || vital.heart_rate > t.max) {
      anomalies.push({
        type: "heart_rate",
        level: "critical",
        value: vital.heart_rate,
        threshold: { min: t.min, max: t.max },
        measured_at: vital.measured_at,
        message: vital.heart_rate > t.max
          ? `심박수 ${vital.heart_rate}bpm — 정상 범위(${t.max}bpm) 초과`
          : `심박수 ${vital.heart_rate}bpm — 정상 범위(${t.min}bpm) 미만`,
      });
    }
  }

  if (vital.spo2 !== null) {
    const t = ABSOLUTE_THRESHOLDS.spo2;
    if (vital.spo2 < t.min) {
      anomalies.push({
        type: "spo2",
        level: "critical",
        value: vital.spo2,
        threshold: { min: t.min, max: t.max },
        measured_at: vital.measured_at,
        message: `산소포화도 ${vital.spo2}% — 위험 수준(${t.min}% 미만)`,
      });
    }
  }

  if (vital.skin_temp !== null) {
    const t = ABSOLUTE_THRESHOLDS.skin_temp;
    if (vital.skin_temp < t.min || vital.skin_temp > t.max) {
      anomalies.push({
        type: "skin_temp",
        level: vital.skin_temp > t.max ? "critical" : "warning",
        value: vital.skin_temp,
        threshold: { min: t.min, max: t.max },
        measured_at: vital.measured_at,
        message: vital.skin_temp > t.max
          ? `체온 ${vital.skin_temp}°C — 발열 감지`
          : `체온 ${vital.skin_temp}°C — 저체온 감지`,
      });
    }
  }

  // Level 2: Personal baseline ±2σ deviation (warning)
  if (vital.heart_rate !== null && baseline.heart_rate_std > 0) {
    const dev = (vital.heart_rate - baseline.heart_rate_mean) / baseline.heart_rate_std;
    if (Math.abs(dev) > 2) {
      anomalies.push({
        type: "heart_rate_baseline",
        level: "warning",
        value: vital.heart_rate,
        threshold: {
          min: Math.round(baseline.heart_rate_mean - 2 * baseline.heart_rate_std),
          max: Math.round(baseline.heart_rate_mean + 2 * baseline.heart_rate_std),
        },
        deviation: Math.round(dev * 10) / 10,
        measured_at: vital.measured_at,
        message: `심박수 ${vital.heart_rate}bpm — 개인 평균(${baseline.heart_rate_mean}bpm) 대비 ${Math.abs(Math.round(dev * 10) / 10)}σ 이탈`,
      });
    }
  }

  if (vital.hrv !== null && baseline.hrv_std > 0) {
    const dev = (vital.hrv - baseline.hrv_mean) / baseline.hrv_std;
    if (dev < -2) {
      anomalies.push({
        type: "hrv_baseline",
        level: "warning",
        value: vital.hrv,
        threshold: { min: Math.round(baseline.hrv_mean - 2 * baseline.hrv_std) },
        deviation: Math.round(dev * 10) / 10,
        measured_at: vital.measured_at,
        message: `HRV ${vital.hrv}ms — 개인 평균(${baseline.hrv_mean}ms) 대비 급감`,
      });
    }
  }

  if (vital.spo2 !== null && baseline.spo2_std > 0) {
    const dev = (vital.spo2 - baseline.spo2_mean) / baseline.spo2_std;
    if (dev < -2) {
      anomalies.push({
        type: "spo2_baseline",
        level: "warning",
        value: vital.spo2,
        threshold: { min: Math.round((baseline.spo2_mean - 2 * baseline.spo2_std) * 10) / 10 },
        deviation: Math.round(dev * 10) / 10,
        measured_at: vital.measured_at,
        message: `산소포화도 ${vital.spo2}% — 개인 평균(${baseline.spo2_mean}%) 대비 저하`,
      });
    }
  }

  return anomalies;
}

export function detectTrendAnomaly(
  dailyScores: Array<{ date: string; score: number }>,
  windowDays: number = 7
): Anomaly | null {
  if (dailyScores.length < windowDays) return null;

  const recent = dailyScores.slice(-windowDays);
  let declining = 0;
  for (let i = 1; i < recent.length; i++) {
    if (recent[i].score < recent[i - 1].score) declining++;
  }

  if (declining >= windowDays - 1) {
    const drop = recent[0].score - recent[recent.length - 1].score;
    return {
      type: "trend_decline",
      level: "caution",
      value: recent[recent.length - 1].score,
      threshold: {},
      measured_at: recent[recent.length - 1].date,
      message: `VITA Score ${windowDays}일 연속 하락 추세 (${drop}점 감소)`,
    };
  }

  return null;
}
