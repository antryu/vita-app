/**
 * VITA Platform — Mock Data Seed Generator
 * Generates realistic Korean senior health data for development
 */

const MEMBERS = [
  { name: "김영수", age: 78, gender: "M" },
  { name: "박순자", age: 82, gender: "F" },
  { name: "이정호", age: 71, gender: "M" },
  { name: "최미경", age: 75, gender: "F" },
  { name: "정대식", age: 69, gender: "M" },
  { name: "한옥순", age: 80, gender: "F" },
  { name: "오병호", age: 74, gender: "M" },
  { name: "윤정숙", age: 77, gender: "F" },
  { name: "장기철", age: 83, gender: "M" },
  { name: "송미란", age: 72, gender: "F" },
];

const ORGS = [
  { name: "화성시 통합돌봄센터", type: "municipality", max: 200 },
  { name: "은빛요양원", type: "nursing_home", max: 50 },
  { name: "한국건설 안전관리팀", type: "enterprise", max: 300 },
];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number, decimals = 1) {
  return +(Math.random() * (max - min) + min).toFixed(decimals);
}

function generateVitals(memberId: string, days: number) {
  const vitals = [];
  const now = new Date();

  for (let d = 0; d < days; d++) {
    const measurementsPerDay = rand(6, 12);
    for (let m = 0; m < measurementsPerDay; m++) {
      const date = new Date(now);
      date.setDate(date.getDate() - d);
      date.setHours(rand(0, 23), rand(0, 59), 0, 0);

      const isNight = date.getHours() >= 22 || date.getHours() <= 6;
      const baseHR = isNight ? rand(52, 68) : rand(62, 88);

      vitals.push({
        member_id: memberId,
        measured_at: date.toISOString(),
        heart_rate: baseHR + rand(-5, 5),
        hrv: randFloat(15, 60),
        spo2: randFloat(94, 99),
        skin_temp: randFloat(35.5, 37.2),
        respiration_rate: rand(12, 20),
        stress_score: rand(10, 85),
        steps: isNight ? 0 : rand(0, 500),
        sleep_stage: isNight
          ? ["light", "deep", "rem", "light"][rand(0, 3)]
          : null,
        battery: rand(20, 100),
      });
    }
  }
  return vitals;
}

function calculateVitaScore(vitals: ReturnType<typeof generateVitals>) {
  const avgHR = vitals.reduce((s, v) => s + (v.heart_rate || 0), 0) / vitals.length;
  const avgHRV = vitals.reduce((s, v) => s + (v.hrv || 0), 0) / vitals.length;
  const avgStress = vitals.reduce((s, v) => s + (v.stress_score || 0), 0) / vitals.length;
  const sleepVitals = vitals.filter((v) => v.sleep_stage !== null);
  const sleepHours = (sleepVitals.length * 10) / 60;

  const sleepScore = Math.min(100, Math.round((sleepHours / 7) * 100));
  const stressScore = Math.round(100 - avgStress);
  const cardiacScore = avgHR < 80 && avgHRV > 25 ? rand(75, 95) : rand(40, 70);
  const activitySteps = vitals.reduce((s, v) => s + (v.steps || 0), 0);
  const activityScore = Math.min(100, Math.round((activitySteps / 5000) * 100));

  const total = Math.round(
    sleepScore * 0.25 + stressScore * 0.25 + cardiacScore * 0.3 + activityScore * 0.2
  );

  let riskLevel: string;
  if (total >= 80) riskLevel = "normal";
  else if (total >= 60) riskLevel = "caution";
  else if (total >= 40) riskLevel = "warning";
  else riskLevel = "critical";

  return {
    health_score: total,
    sleep_score: sleepScore,
    stress_score: stressScore,
    recovery_score: cardiacScore,
    risk_level: riskLevel,
  };
}

function generateAlerts() {
  return [
    {
      member_index: 0,
      alert_type: "anomaly",
      severity: "critical",
      title: "심박수 급상승",
      message: "심박수 142bpm — 평소 대비 2배 이상 상승 감지",
      status: "sent",
      sent_via: ["kakao", "dashboard"],
    },
    {
      member_index: 1,
      alert_type: "anomaly",
      severity: "critical",
      title: "SpO2 저하",
      message: "산소포화도 88% — 위험 수준 감지. 119 연동 진행 중",
      status: "sent",
      sent_via: ["kakao", "dashboard", "call_119"],
    },
    {
      member_index: 2,
      alert_type: "trend",
      severity: "warning",
      title: "수면 점수 연속 저하",
      message: "수면 점수 3일 연속 저하 (82→65→48). AI 코칭 발송",
      status: "acknowledged",
      sent_via: ["kakao"],
    },
    {
      member_index: 3,
      alert_type: "trend",
      severity: "warning",
      title: "스트레스 상승 추세",
      message: "스트레스 지수 5일간 지속 상승 추세 감지",
      status: "pending",
      sent_via: [],
    },
    {
      member_index: 4,
      alert_type: "anomaly",
      severity: "warning",
      title: "체온 상승",
      message: "피부 온도 38.2°C — 발열 가능성. 모니터링 지속",
      status: "sent",
      sent_via: ["kakao"],
    },
  ];
}

// Export all generated data
export function generateSeedData() {
  const memberIds = MEMBERS.map((_, i) => `mock-member-${String(i + 1).padStart(3, "0")}`);

  const members = MEMBERS.map((m, i) => ({
    id: memberIds[i],
    name: m.name,
    age: m.age,
    gender: m.gender,
    ring_id: `VR-2026-${String(rand(10000, 99999))}`,
    tier: i < 3 ? "platinum" : i < 6 ? "premium" : "basic",
    organization_id: i < 5 ? "org-001" : i < 7 ? "org-002" : null,
    birth_date: `${2026 - m.age}-${String(rand(1, 12)).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
  }));

  const allVitals = memberIds.flatMap((id) => generateVitals(id, 30));

  const analyses = memberIds.map((id) => {
    const memberVitals = allVitals.filter((v) => v.member_id === id).slice(0, 20);
    const scores = calculateVitaScore(memberVitals);
    return {
      member_id: id,
      analysis_date: new Date().toISOString().split("T")[0],
      ...scores,
      anomalies: [],
      ai_recommendation: getCoachingMessage(scores.health_score),
    };
  });

  const alerts = generateAlerts().map((a) => ({
    member_id: memberIds[a.member_index],
    ...a,
    member_index: undefined,
  }));

  const orgs = ORGS.map((o, i) => ({
    id: `org-${String(i + 1).padStart(3, "0")}`,
    ...o,
  }));

  return { members, vitals: allVitals, analyses, alerts, orgs };
}

function getCoachingMessage(score: number): string {
  if (score >= 80) return "전반적인 건강 상태가 양호합니다. 오늘도 규칙적인 생활을 유지하세요.";
  if (score >= 60) return "어제 수면 중 깊은 잠 비율이 평소보다 낮았습니다. 취침 전 가벼운 스트레칭을 권합니다.";
  if (score >= 40) return "최근 스트레스 지수가 상승 추세입니다. 충분한 휴식과 수분 섭취를 권장합니다.";
  return "건강 지표가 평소 대비 저하되었습니다. 가까운 의료기관 방문을 권장합니다.";
}

// Run if called directly
if (typeof require !== "undefined" && require.main === module) {
  const data = generateSeedData();
  console.log(JSON.stringify(data, null, 2));
}
