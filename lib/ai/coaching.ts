import type { VitaScoreResult } from "./vita-score";
import type { Anomaly } from "./anomaly";

interface MemberProfile {
  name: string;
  age: number;
  gender: string;
}

const TEMPLATES: Record<string, string[]> = {
  excellent: [
    "전반적인 건강 상태가 매우 양호합니다. {name}님, 오늘도 규칙적인 생활을 유지하세요.",
    "수면과 회복이 잘 이루어지고 있습니다. 가벼운 산책으로 하루를 시작해 보세요.",
    "건강 점수가 높은 상태입니다. 이 컨디션을 유지하시면 좋겠습니다.",
  ],
  good: [
    "컨디션이 양호합니다. {metric_advice}",
    "전반적으로 안정적입니다. {metric_advice}",
    "{name}님, 오늘 건강 상태가 괜찮습니다. {metric_advice}",
  ],
  caution: [
    "{problem} 주의가 필요합니다. {advice}",
    "최근 {problem} 상태가 평소보다 좋지 않습니다. {advice}",
    "{name}님, {problem}에 신경 써 주세요. {advice}",
  ],
  warning: [
    "{problem} 건강 관리에 더 신경 써 주세요. {advice} 지속되면 전문의 상담을 권합니다.",
    "최근 {problem} 수치가 걱정됩니다. {advice}",
  ],
  critical: [
    "건강 지표가 평소 대비 많이 저하되었습니다. 가까운 의료기관 방문을 권장합니다.",
    "긴급 주의가 필요한 상태입니다. 보호자에게 알림이 전송되었습니다. 안정을 취해 주세요.",
  ],
};

const METRIC_ADVICE: Record<string, { problem: string; advice: string }> = {
  sleep_low: {
    problem: "수면의 질이",
    advice: "취침 전 카페인을 피하고, 가벼운 스트레칭을 해보세요.",
  },
  stress_high: {
    problem: "스트레스가",
    advice: "깊은 호흡 운동이나 명상을 5분간 시도해 보세요.",
  },
  cardiac_unstable: {
    problem: "심박 안정성이",
    advice: "과격한 운동을 피하고 충분한 수분 섭취를 해주세요.",
  },
  activity_low: {
    problem: "활동량이",
    advice: "30분 이상 가벼운 산책을 추천드립니다.",
  },
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getWeakestMetric(scores: VitaScoreResult): string | null {
  const metrics = [
    { key: "sleep_low", score: scores.sleep_score },
    { key: "stress_high", score: scores.stress_score },
    { key: "cardiac_unstable", score: scores.recovery_score },
    { key: "activity_low", score: scores.sleep_score },
  ];

  const weakest = metrics.reduce((min, m) => (m.score < min.score ? m : min));
  return weakest.score < 70 ? weakest.key : null;
}

export function generateCoaching(
  scores: VitaScoreResult,
  anomalies: Anomaly[],
  profile?: MemberProfile
): string {
  const name = profile?.name || "회원";
  const hasCriticalAnomaly = anomalies.some((a) => a.level === "critical");

  if (hasCriticalAnomaly || scores.risk_level === "critical") {
    return pickRandom(TEMPLATES.critical).replace("{name}", name);
  }

  if (scores.risk_level === "warning") {
    const weakMetric = getWeakestMetric(scores);
    const metricInfo = weakMetric ? METRIC_ADVICE[weakMetric] : { problem: "건강 상태가", advice: "충분한 휴식을 취해 주세요." };
    return pickRandom(TEMPLATES.warning)
      .replace("{name}", name)
      .replace("{problem}", metricInfo.problem)
      .replace("{advice}", metricInfo.advice);
  }

  if (scores.risk_level === "caution") {
    const weakMetric = getWeakestMetric(scores);
    const metricInfo = weakMetric ? METRIC_ADVICE[weakMetric] : { problem: "컨디션이", advice: "오늘은 무리하지 마세요." };
    return pickRandom(TEMPLATES.caution)
      .replace("{name}", name)
      .replace("{problem}", metricInfo.problem)
      .replace("{advice}", metricInfo.advice);
  }

  if (scores.health_score >= 85) {
    return pickRandom(TEMPLATES.excellent).replace("{name}", name);
  }

  const weakMetric = getWeakestMetric(scores);
  const metricAdvice = weakMetric
    ? `${METRIC_ADVICE[weakMetric].problem} 조금 낮습니다. ${METRIC_ADVICE[weakMetric].advice}`
    : "오늘은 30분 산책을 추천드립니다.";

  return pickRandom(TEMPLATES.good)
    .replace("{name}", name)
    .replace("{metric_advice}", metricAdvice);
}

export async function generateCoachingLLM(
  scores: VitaScoreResult,
  anomalies: Anomaly[],
  profile?: MemberProfile
): Promise<string> {
  // TODO: Replace with actual Claude Haiku API call
  // const response = await anthropic.messages.create({
  //   model: "claude-haiku-4-5-20251001",
  //   max_tokens: 150,
  //   messages: [{ role: "user", content: prompt }],
  // });
  return generateCoaching(scores, anomalies, profile);
}
