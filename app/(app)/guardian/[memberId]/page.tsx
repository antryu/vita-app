"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Wind,
  Moon,
  Zap,
  MapPin,
  Clock,
  Battery,
  Brain,
  Bell,
  Phone,
  AlertTriangle,
  CheckCircle2,
  Footprints,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" as const },
  }),
};

const MOCK_MEMBERS: Record<string, {
  name: string; relation: string; age: number; avatar: string;
  vitaScore: number; status: string; hr: number; spo2: number;
  sleep: string; deepSleep: string; stress: string; stressScore: number;
  location: string; lastSeen: string; battery: number; steps: number;
  coaching: string; weeklyScores: number[];
  alerts: Array<{ severity: string; title: string; time: string; action: string }>;
}> = {
  "member-001": {
    name: "이정호", relation: "아버지", age: 72, avatar: "JH",
    vitaScore: 87, status: "normal", hr: 68, spo2: 97.3,
    sleep: "6h 42m", deepSleep: "28%", stress: "낮음", stressScore: 32,
    location: "서울 강서구 마곡동", lastSeen: "3분 전", battery: 72, steps: 4328,
    coaching: "전반적인 건강 상태가 양호합니다. 이번 주 수면의 질이 꾸준히 개선되고 있으며, 스트레스 회복력도 좋은 편입니다. 오늘은 30분 산책을 추천드립니다.",
    weeklyScores: [78, 81, 84, 82, 85, 84, 87],
    alerts: [],
  },
  "member-002": {
    name: "박순자", relation: "어머니", age: 70, avatar: "SJ",
    vitaScore: 62, status: "caution", hr: 78, spo2: 95.8,
    sleep: "5h 10m", deepSleep: "18%", stress: "보통", stressScore: 55,
    location: "서울 강서구 마곡동", lastSeen: "8분 전", battery: 58, steps: 2100,
    coaching: "수면의 질이 조금 낮습니다. 깊은 잠 비율이 18%로 평소보다 부족합니다. 취침 전 가벼운 스트레칭을 해보세요.",
    weeklyScores: [71, 68, 65, 63, 66, 64, 62],
    alerts: [
      { severity: "warning", title: "수면 점수 3일 연속 저하", time: "오늘 06:00", action: "AI 코칭 발송" },
    ],
  },
  "member-003": {
    name: "이범수", relation: "삼촌", age: 78, avatar: "BS",
    vitaScore: 38, status: "critical", hr: 142, spo2: 91,
    sleep: "3h 20m", deepSleep: "8%", stress: "높음", stressScore: 82,
    location: "인천 남동구", lastSeen: "15분 전", battery: 45, steps: 680,
    coaching: "건강 지표가 평소 대비 많이 저하되었습니다. 심박수가 정상 범위를 벗어났으며, 산소포화도도 주의가 필요합니다. 가까운 의료기관 방문을 권장합니다.",
    weeklyScores: [55, 52, 48, 45, 42, 40, 38],
    alerts: [
      { severity: "critical", title: "심박수 142bpm 감지", time: "15분 전", action: "보호자 알림 발송 완료" },
      { severity: "critical", title: "SpO2 91% 감지", time: "12분 전", action: "119 연동 대기 중" },
    ],
  },
};

const weekDays = ["월", "화", "수", "목", "금", "토", "일"];

export default function GuardianMemberDetail() {
  const params = useParams();
  const memberId = params.memberId as string;
  const member = MOCK_MEMBERS[memberId];

  if (!member) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center py-20">
        <p className="text-muted-foreground">멤버를 찾을 수 없습니다.</p>
        <Link href="/guardian" className="text-accent hover:underline text-sm mt-2 block">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const isCritical = member.status === "critical";

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      {/* Back + Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
        <Link href="/guardian" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          가족 목록
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Phone className="w-3 h-3 mr-1" />
            전화하기
          </Button>
          {isCritical && (
            <Button variant="destructive" size="sm" className="text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              119 호출
            </Button>
          )}
        </div>
      </motion.div>

      {/* Profile + Score */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
        <Card className={`p-6 ${isCritical ? "border-red-200 dark:border-red-900" : ""}`}>
          <div className="flex items-center gap-5">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg ${
                isCritical ? "gradient-navy text-white ring-2 ring-red-500/30" : "bg-muted"
              }`}>
                {member.avatar}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{member.name}</h1>
              <p className="text-sm text-muted-foreground">{member.relation} / {member.age}세</p>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{member.location}</span>
                <Clock className="w-3 h-3 text-muted-foreground ml-2" />
                <span className="text-xs text-muted-foreground">{member.lastSeen}</span>
                <Battery className="w-3 h-3 text-muted-foreground ml-2" />
                <span className="text-xs text-muted-foreground">{member.battery}%</span>
              </div>
            </div>

            {/* Score Circle */}
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-muted/50" strokeWidth="6" />
                <circle cx="50" cy="50" r="42" fill="none"
                  stroke={member.vitaScore >= 80 ? "#10b981" : member.vitaScore >= 60 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${member.vitaScore * 2.64} ${264 - member.vitaScore * 2.64}`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold">{member.vitaScore}</span>
                <span className="text-[8px] text-muted-foreground">VITA</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Alerts */}
      {member.alerts.length > 0 && (
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold">활성 알림</span>
              <Badge variant="destructive" className="text-[10px] ml-auto">{member.alerts.length}</Badge>
            </div>
            <div className="space-y-2">
              {member.alerts.map((alert, i) => (
                <div key={i} className={`p-3 rounded-lg border ${
                  alert.severity === "critical"
                    ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900"
                    : "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900"
                }`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-medium">{alert.title}</span>
                    <span className="text-[10px] text-muted-foreground">{alert.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-accent" />
                    <span className="text-[10px] text-accent">{alert.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Vitals Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Heart, label: "심박수", value: `${member.hr}`, unit: "bpm", color: "text-red-500", bg: "bg-red-500/10", alert: member.hr > 100 || member.hr < 50 },
          { icon: Wind, label: "산소포화도", value: `${member.spo2}`, unit: "%", color: "text-blue-500", bg: "bg-blue-500/10", alert: member.spo2 < 93 },
          { icon: Moon, label: "수면", value: member.sleep, unit: "", color: "text-indigo-500", bg: "bg-indigo-500/10", sub: `깊은 잠 ${member.deepSleep}` },
          { icon: Zap, label: "스트레스", value: member.stress, unit: "", color: "text-amber-500", bg: "bg-amber-500/10", sub: `${member.stressScore}점` },
        ].map((v, i) => (
          <motion.div key={v.label} custom={i + 2} variants={fadeUp} initial="hidden" animate="visible">
            <Card className={`p-4 ${v.alert ? "border-red-200 dark:border-red-900" : ""}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-lg ${v.bg} flex items-center justify-center`}>
                  <v.icon className={`w-3.5 h-3.5 ${v.color}`} />
                </div>
                <span className="text-xs text-muted-foreground">{v.label}</span>
                {v.alert && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-auto" />}
              </div>
              <p className="text-xl font-bold">
                {v.value}
                {v.unit && <span className="text-xs font-normal text-muted-foreground ml-0.5">{v.unit}</span>}
              </p>
              {v.sub && <p className="text-[10px] text-muted-foreground mt-0.5">{v.sub}</p>}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Weekly Trend */}
      <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-semibold">주간 VITA Score</h3>
          </div>
          <div className="flex items-end gap-1.5 h-20">
            {member.weeklyScores.map((score, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-muted-foreground">{score}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(score / 100) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className={`w-full rounded-t ${
                    i === member.weeklyScores.length - 1
                      ? score >= 70 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500"
                      : "bg-muted-foreground/20"
                  }`}
                  style={{ minHeight: 4 }}
                />
                <span className="text-[9px] text-muted-foreground">{weekDays[i]}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* AI Coaching */}
      <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5 bg-accent/5 border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg gradient-vita flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold">AI 코칭</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{member.coaching}</p>
        </Card>
      </motion.div>

      {/* Activity */}
      <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Footprints className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold">오늘 활동</span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-2xl font-bold">{member.steps.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">걸음</p>
            </div>
            <div className="flex-1">
              <Progress value={(member.steps / 8000) * 100} className="h-2" />
              <p className="text-[10px] text-muted-foreground mt-1">목표 8,000보 중 {Math.round((member.steps / 8000) * 100)}%</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
