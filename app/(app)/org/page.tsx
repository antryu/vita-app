"use client";

import { motion } from "framer-motion";
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Heart,
  Moon,
  Zap,
  Bell,
  Building2,
  FileText,
  TrendingUp,
  Search,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" as const },
  }),
};

const members = [
  { id: "m1", name: "김영수", age: 78, score: 42, status: "critical", hr: 142, spo2: 91, lastSeen: "15분 전" },
  { id: "m2", name: "박순자", age: 82, score: 38, status: "critical", hr: 58, spo2: 88, lastSeen: "8분 전" },
  { id: "m3", name: "이정호", age: 71, score: 61, status: "warning", hr: 78, spo2: 96, lastSeen: "2분 전" },
  { id: "m4", name: "최미경", age: 75, score: 55, status: "warning", hr: 82, spo2: 95, lastSeen: "5분 전" },
  { id: "m5", name: "정대식", age: 69, score: 68, status: "warning", hr: 71, spo2: 97, lastSeen: "1분 전" },
  { id: "m6", name: "한옥순", age: 80, score: 87, status: "normal", hr: 66, spo2: 98, lastSeen: "3분 전" },
  { id: "m7", name: "오병호", age: 74, score: 91, status: "normal", hr: 64, spo2: 98, lastSeen: "1분 전" },
  { id: "m8", name: "윤정숙", age: 77, score: 84, status: "normal", hr: 70, spo2: 97, lastSeen: "4분 전" },
  { id: "m9", name: "장기철", age: 83, score: 79, status: "normal", hr: 68, spo2: 97, lastSeen: "6분 전" },
  { id: "m10", name: "송미란", age: 72, score: 88, status: "normal", hr: 65, spo2: 98, lastSeen: "2분 전" },
];

const alerts = [
  { severity: "critical", name: "김영수", age: 78, msg: "심박수 142bpm — 평소 대비 2배 이상", time: "15분 전", action: "보호자 알림 발송 완료" },
  { severity: "critical", name: "박순자", age: 82, msg: "SpO2 88% — 산소포화도 위험 수준", time: "8분 전", action: "119 연동 진행 중" },
  { severity: "warning", name: "이정호", age: 71, msg: "수면 점수 3일 연속 저하", time: "오늘 06:00", action: "AI 코칭 발송" },
  { severity: "warning", name: "최미경", age: 75, msg: "스트레스 지수 상승 추세 (5일간)", time: "오늘 07:00", action: "주간 리포트 포함" },
];

function statusBadge(status: string) {
  if (status === "critical") return <Badge className="bg-red-500/10 text-red-600 border-red-200 text-[10px]">위험</Badge>;
  if (status === "warning") return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 text-[10px]">주의</Badge>;
  return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-[10px]">정상</Badge>;
}

export default function OrgDashboard() {
  const normal = members.filter((m) => m.status === "normal").length;
  const warning = members.filter((m) => m.status === "warning").length;
  const critical = members.filter((m) => m.status === "critical").length;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6 text-accent" />
            화성시 통합돌봄센터
          </h1>
          <p className="text-sm text-muted-foreground mt-1">2026.04.17 — {members.length}명 관리 중</p>
        </div>
        <div className="flex gap-2">
          <Link href="/org/alerts">
            <Badge variant="destructive" className="flex items-center gap-1 cursor-pointer">
              <Bell className="w-3 h-3" />
              {alerts.length}건
            </Badge>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "전체 대상자", value: members.length, color: "" },
          { icon: CheckCircle2, label: "정상", value: normal, color: "text-emerald-600" },
          { icon: AlertTriangle, label: "주의", value: warning, color: "text-amber-600" },
          { icon: AlertTriangle, label: "위험", value: critical, color: "text-red-600" },
        ].map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={fadeUp} initial="hidden" animate="visible">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <stat.icon className={`w-5 h-5 ${stat.color || "text-muted-foreground"}`} />
                <div>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Alerts */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h2 className="text-sm font-semibold">실시간 알림</h2>
            <Badge variant="destructive" className="text-[10px] ml-auto">{alerts.length}건</Badge>
          </div>
          <div className="space-y-3">
            {alerts.map((a, i) => (
              <div key={i} className={`p-3 rounded-lg border ${
                a.severity === "critical" ? "bg-red-500/[0.06] border-red-500/10" : "bg-amber-500/[0.06] border-amber-500/10"
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${a.severity === "critical" ? "bg-red-500 animate-pulse" : "bg-amber-500"}`} />
                  <span className="text-sm font-medium">{a.name} ({a.age}세)</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">{a.time}</span>
                </div>
                <p className="text-xs text-muted-foreground ml-4">{a.msg}</p>
                <div className="flex items-center gap-1 ml-4 mt-1.5">
                  <CheckCircle2 className="w-3 h-3 text-accent" />
                  <span className="text-[10px] text-accent font-medium">{a.action}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Weekly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Moon, label: "수면 현황", value: "6.2h", sub: "평균 수면시간 (전주 -0.3h)", color: "bg-indigo-400" },
          { icon: Zap, label: "스트레스", value: "42점", sub: "평균 스트레스 (전주 +5점)", color: "bg-amber-400" },
          { icon: Heart, label: "VITA Score", value: "74점", sub: "전체 평균 (전주 -2점)", color: "" },
        ].map((stat, i) => (
          <motion.div key={stat.label} custom={i + 5} variants={fadeUp} initial="hidden" animate="visible">
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <stat.icon className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold">{stat.label}</h3>
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
              {stat.color && (
                <div className="space-y-1.5 mt-3">
                  {members.slice(0, 4).map((m, j) => (
                    <div key={m.name} className="flex items-center gap-2">
                      <span className="text-[10px] w-12 truncate">{m.name}</span>
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${stat.color}`} style={{ width: `${40 + j * 12}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!stat.color && (
                <div className="flex items-end gap-1 h-14 mt-3">
                  {[68, 72, 75, 78, 76, 74, 74].map((v, j) => (
                    <div key={j} className="flex-1 gradient-vita rounded-t" style={{ height: `${(v / 100) * 100}%`, minHeight: 3 }} />
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Member List */}
      <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">대상자 현황</h2>
            </div>
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="이름 검색" className="pl-8 h-8 text-xs" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="text-left py-2 font-medium">이름</th>
                  <th className="text-left py-2 font-medium">나이</th>
                  <th className="text-left py-2 font-medium">VITA Score</th>
                  <th className="text-left py-2 font-medium">심박</th>
                  <th className="text-left py-2 font-medium">SpO2</th>
                  <th className="text-left py-2 font-medium">상태</th>
                  <th className="text-right py-2 font-medium">측정</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-2.5 font-medium">{m.name}</td>
                    <td className="py-2.5 text-muted-foreground">{m.age}세</td>
                    <td className="py-2.5">
                      <span className={`font-bold ${m.score < 50 ? "text-red-600" : m.score < 70 ? "text-amber-600" : "text-emerald-600"}`}>
                        {m.score}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className={m.hr > 100 || m.hr < 50 ? "text-red-600 font-medium" : ""}>{m.hr}bpm</span>
                    </td>
                    <td className="py-2.5">
                      <span className={m.spo2 < 92 ? "text-red-600 font-medium" : ""}>{m.spo2}%</span>
                    </td>
                    <td className="py-2.5">{statusBadge(m.status)}</td>
                    <td className="py-2.5 text-right text-xs text-muted-foreground">{m.lastSeen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
