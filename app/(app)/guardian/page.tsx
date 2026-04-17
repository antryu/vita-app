"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Heart,
  Moon,
  Zap,
  Wind,
  MapPin,
  Clock,
  ChevronRight,
  Bell,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

const familyMembers = [
  {
    id: "member-001",
    name: "안종현",
    relation: "아버지",
    age: 72,
    avatar: "JH",
    vitaScore: 87,
    status: "normal" as const,
    hr: 68,
    spo2: 97.3,
    sleep: "6h 42m",
    stress: "낮음",
    location: "서울 강서구 마곡동",
    lastSeen: "3분 전",
    coaching: "전반적인 건강 상태가 양호합니다. 오늘도 규칙적인 생활을 유지하세요.",
    alerts: 0,
  },
  {
    id: "member-002",
    name: "박순자",
    relation: "어머니",
    age: 70,
    avatar: "SJ",
    vitaScore: 62,
    status: "caution" as const,
    hr: 78,
    spo2: 95.8,
    sleep: "5h 10m",
    stress: "보통",
    location: "서울 강서구 마곡동",
    lastSeen: "8분 전",
    coaching: "수면의 질이 조금 낮습니다. 취침 전 가벼운 스트레칭을 해보세요.",
    alerts: 1,
  },
  {
    id: "member-003",
    name: "이범수",
    relation: "삼촌",
    age: 78,
    avatar: "BS",
    vitaScore: 38,
    status: "critical" as const,
    hr: 142,
    spo2: 91,
    sleep: "3h 20m",
    stress: "높음",
    location: "인천 남동구",
    lastSeen: "15분 전",
    coaching: "건강 지표가 평소 대비 많이 저하되었습니다. 가까운 의료기관 방문을 권장합니다.",
    alerts: 2,
  },
];

function statusConfig(status: "normal" | "caution" | "critical") {
  if (status === "normal") return { label: "양호", bg: "bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-200", ring: "ring-emerald-500/20" };
  if (status === "caution") return { label: "주의", bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-200", ring: "ring-amber-500/20" };
  return { label: "위험", bg: "bg-red-500/10", text: "text-red-600", border: "border-red-200", ring: "ring-red-500/20" };
}

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
}

export default function GuardianPage() {
  const criticalCount = familyMembers.filter((m) => m.status === "critical").length;
  const totalAlerts = familyMembers.reduce((s, m) => s + m.alerts, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-accent" />
            가족 건강
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {familyMembers.length}명 모니터링 중
          </p>
        </div>
        <div className="flex gap-2">
          {totalAlerts > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {totalAlerts}건 알림
            </Badge>
          )}
          <button className="p-2 rounded-lg border hover:bg-muted transition-colors">
            <Plus className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </motion.div>

      {/* Alert Banner */}
      {criticalCount > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="p-4 bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                {criticalCount}명의 가족에게 긴급 주의가 필요합니다
              </p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Family Member Cards */}
      <div className="space-y-4">
        {familyMembers.map((member, i) => {
          const sc = statusConfig(member.status);
          return (
            <motion.div
              key={member.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <Link href={`/guardian/${member.id}`}>
                <Card className={`p-5 hover:shadow-md transition-all cursor-pointer group ${
                  member.status === "critical" ? "border-red-200 dark:border-red-900" : ""
                }`}>
                  <div className="flex items-start gap-4">
                    {/* Avatar + Score */}
                    <div className="text-center shrink-0">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold ring-2 ${sc.ring} ${
                        member.status === "critical" ? "gradient-navy text-white" : "bg-muted text-foreground"
                      }`}>
                        {member.avatar}
                      </div>
                      <p className={`text-lg font-bold mt-1 ${scoreColor(member.vitaScore)}`}>
                        {member.vitaScore}
                      </p>
                      <p className="text-[9px] text-muted-foreground">VITA</p>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{member.name}</h3>
                        <span className="text-xs text-muted-foreground">
                          {member.relation} / {member.age}세
                        </span>
                        <Badge className={`${sc.bg} ${sc.text} ${sc.border} text-[10px] ml-auto`}>
                          {sc.label}
                        </Badge>
                        {member.alerts > 0 && (
                          <Badge variant="destructive" className="text-[10px]">
                            {member.alerts}
                          </Badge>
                        )}
                      </div>

                      {/* Vitals Row */}
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-400" />
                          <span className="text-xs">{member.hr}bpm</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Wind className="w-3 h-3 text-blue-400" />
                          <span className="text-xs">{member.spo2}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Moon className="w-3 h-3 text-indigo-400" />
                          <span className="text-xs">{member.sleep}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span className="text-xs">{member.stress}</span>
                        </div>
                      </div>

                      {/* Location + Time */}
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5" />{member.location}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />{member.lastSeen}
                        </span>
                      </div>

                      {/* AI Coaching Preview */}
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                        {member.coaching}
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0 mt-2" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
