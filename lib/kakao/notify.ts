export interface KakaoAlertPayload {
  recipientPhone: string;
  templateCode: string;
  variables: Record<string, string>;
}

export interface DailyReportData {
  memberName: string;
  vitaScore: number;
  sleepDuration: string;
  heartRate: number;
  stressLevel: string;
  coaching: string;
}

export interface AnomalyAlertData {
  memberName: string;
  metric: string;
  value: string;
  time: string;
  location: string;
}

export function buildDailyReport(data: DailyReportData): string {
  const statusEmoji = data.vitaScore >= 80 ? "양호" : data.vitaScore >= 60 ? "보통" : "주의";
  return [
    `[일일 건강 리포트]`,
    `${data.memberName}`,
    `VITA Score: ${data.vitaScore}점 (${statusEmoji})`,
    `수면: ${data.sleepDuration}`,
    `심박: 평균 ${data.heartRate}bpm`,
    `스트레스: ${data.stressLevel}`,
    ``,
    `AI 코칭: ${data.coaching}`,
  ].join("\n");
}

export function buildAnomalyAlert(data: AnomalyAlertData): string {
  return [
    `[긴급 알림 — 이상 감지]`,
    `${data.memberName} 이상 감지`,
    ``,
    `${data.metric} ${data.value}`,
    `발생 시각: ${data.time}`,
    `위치: ${data.location}`,
    ``,
    `5분 내 응답이 없으면 자동으로 119에 연락됩니다.`,
  ].join("\n");
}

export async function sendKakaoAlert(payload: KakaoAlertPayload): Promise<boolean> {
  // TODO: Replace with actual KakaoTalk Channel API call
  // const response = await fetch("https://kapi.kakao.com/v2/api/talk/memo/send", {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${process.env.KAKAO_REST_API_KEY}`,
  //     "Content-Type": "application/x-www-form-urlencoded",
  //   },
  //   body: new URLSearchParams({ ... }),
  // });
  console.log(`[KakaoTalk] Sending to ${payload.recipientPhone}: ${payload.templateCode}`);
  return true;
}

export type EscalationLevel = 1 | 2 | 3;

export interface EscalationAction {
  level: EscalationLevel;
  channel: string;
  description: string;
  delayMinutes: number;
}

export const ESCALATION_CHAIN: EscalationAction[] = [
  { level: 1, channel: "kakao", description: "KakaoTalk 긴급 알림 — 보호자/관리자에게 즉시 전송", delayMinutes: 0 },
  { level: 2, channel: "ai_call", description: "보호자 AI 콜 — 미응답 시 자동 음성 발신", delayMinutes: 5 },
  { level: 3, channel: "emergency_119", description: "119 자동 호출 — 위치 + 바이탈 전송", delayMinutes: 15 },
];

export function getEscalationAction(minutesSinceAlert: number): EscalationAction {
  for (let i = ESCALATION_CHAIN.length - 1; i >= 0; i--) {
    if (minutesSinceAlert >= ESCALATION_CHAIN[i].delayMinutes) {
      return ESCALATION_CHAIN[i];
    }
  }
  return ESCALATION_CHAIN[0];
}
