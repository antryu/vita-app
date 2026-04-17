import type { RiskLevel } from "@/lib/supabase/types";

export interface Vital {
  heart_rate: number | null;
  hrv: number | null;
  spo2: number | null;
  skin_temp: number | null;
  stress_score: number | null;
  steps: number | null;
  sleep_stage: string | null;
  measured_at: string;
}

export interface VitaScoreResult {
  health_score: number;
  sleep_score: number;
  stress_score: number;
  recovery_score: number;
  risk_level: RiskLevel;
}

export interface Baseline {
  heart_rate_mean: number;
  heart_rate_std: number;
  hrv_mean: number;
  hrv_std: number;
  spo2_mean: number;
  spo2_std: number;
  skin_temp_mean: number;
  skin_temp_std: number;
  avg_sleep_hours: number;
  avg_steps: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function scoreSleep(vitals: Vital[], baseline: Baseline): number {
  const sleepVitals = vitals.filter((v) => v.sleep_stage !== null);
  const sleepHours = (sleepVitals.length * 10) / 60;
  const deepSleep = sleepVitals.filter((v) => v.sleep_stage === "deep").length;
  const deepRatio = sleepVitals.length > 0 ? deepSleep / sleepVitals.length : 0;

  const durationScore = clamp((sleepHours / Math.max(baseline.avg_sleep_hours, 6)) * 100, 0, 100);
  const qualityScore = clamp(deepRatio * 300, 0, 100);

  return Math.round(durationScore * 0.6 + qualityScore * 0.4);
}

function scoreStress(vitals: Vital[]): number {
  const stressValues = vitals
    .map((v) => v.stress_score)
    .filter((s): s is number => s !== null);

  if (stressValues.length === 0) return 50;

  const avgStress = stressValues.reduce((a, b) => a + b, 0) / stressValues.length;
  return clamp(Math.round(100 - avgStress), 0, 100);
}

function scoreCardiac(vitals: Vital[], baseline: Baseline): number {
  const hrValues = vitals.map((v) => v.heart_rate).filter((h): h is number => h !== null);
  const hrvValues = vitals.map((v) => v.hrv).filter((h): h is number => h !== null);

  if (hrValues.length === 0) return 50;

  const avgHR = hrValues.reduce((a, b) => a + b, 0) / hrValues.length;
  const avgHRV = hrvValues.length > 0 ? hrvValues.reduce((a, b) => a + b, 0) / hrvValues.length : 30;

  const hrStability = clamp(100 - Math.abs(avgHR - baseline.heart_rate_mean) * 3, 0, 100);
  const hrvHealth = clamp((avgHRV / Math.max(baseline.hrv_mean, 20)) * 80, 0, 100);

  return Math.round(hrStability * 0.5 + hrvHealth * 0.5);
}

function scoreActivity(vitals: Vital[], baseline: Baseline): number {
  const totalSteps = vitals.reduce((sum, v) => sum + (v.steps || 0), 0);
  const target = Math.max(baseline.avg_steps, 3000);
  return clamp(Math.round((totalSteps / target) * 100), 0, 100);
}

function classifyRisk(score: number): RiskLevel {
  if (score >= 80) return "normal";
  if (score >= 60) return "caution";
  if (score >= 40) return "warning";
  return "critical";
}

export function calculateVitaScore(vitals: Vital[], baseline?: Baseline): VitaScoreResult {
  const defaultBaseline: Baseline = {
    heart_rate_mean: 70,
    heart_rate_std: 8,
    hrv_mean: 35,
    hrv_std: 10,
    spo2_mean: 97,
    spo2_std: 1.5,
    skin_temp_mean: 36.2,
    skin_temp_std: 0.4,
    avg_sleep_hours: 7,
    avg_steps: 5000,
  };

  const base = baseline || defaultBaseline;

  const sleep = scoreSleep(vitals, base);
  const stress = scoreStress(vitals);
  const cardiac = scoreCardiac(vitals, base);
  const activity = scoreActivity(vitals, base);

  const health_score = clamp(
    Math.round(sleep * 0.25 + stress * 0.25 + cardiac * 0.30 + activity * 0.20),
    0,
    100
  );

  return {
    health_score,
    sleep_score: sleep,
    stress_score: stress,
    recovery_score: cardiac,
    risk_level: classifyRisk(health_score),
  };
}

export function calculateBaseline(historicalVitals: Vital[]): Baseline {
  const hrs = historicalVitals.map((v) => v.heart_rate).filter((h): h is number => h !== null);
  const hrvs = historicalVitals.map((v) => v.hrv).filter((h): h is number => h !== null);
  const spo2s = historicalVitals.map((v) => v.spo2).filter((s): s is number => s !== null);
  const temps = historicalVitals.map((v) => v.skin_temp).filter((t): t is number => t !== null);
  const sleepCount = historicalVitals.filter((v) => v.sleep_stage !== null).length;
  const totalSteps = historicalVitals.reduce((s, v) => s + (v.steps || 0), 0);
  const days = Math.max(1, new Set(historicalVitals.map((v) => v.measured_at.split("T")[0])).size);

  function mean(arr: number[]) { return arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }
  function std(arr: number[]) {
    if (arr.length < 2) return 0;
    const m = mean(arr);
    return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
  }

  return {
    heart_rate_mean: Math.round(mean(hrs)),
    heart_rate_std: Math.round(std(hrs) * 10) / 10,
    hrv_mean: Math.round(mean(hrvs) * 10) / 10,
    hrv_std: Math.round(std(hrvs) * 10) / 10,
    spo2_mean: Math.round(mean(spo2s) * 10) / 10,
    spo2_std: Math.round(std(spo2s) * 10) / 10,
    skin_temp_mean: Math.round(mean(temps) * 10) / 10,
    skin_temp_std: Math.round(std(temps) * 10) / 10,
    avg_sleep_hours: Math.round((sleepCount * 10) / 60 / days * 10) / 10,
    avg_steps: Math.round(totalSteps / days),
  };
}
