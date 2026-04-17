"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Wind,
  Moon,
  Zap,
  Coins,
  TrendingUp,
  TrendingDown,
  Brain,
  Bell,
  CreditCard,
  ChevronRight,
  MapPin,
  Clock,
  Battery,
  Footprints,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" as const },
  }),
};

// Mock data
const vitaScore = 87;
const prevScore = 84;
const scoreDelta = vitaScore - prevScore;

const vitals = [
  { icon: Heart, label: "심박수", value: "68", unit: "bpm", color: "text-red-500", bg: "bg-red-500/10" },
  { icon: Wind, label: "산소포화도", value: "97.3", unit: "%", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: Moon, label: "수면", value: "6h 42m", unit: "", color: "text-indigo-500", bg: "bg-indigo-500/10", sub: "깊은 잠 28%" },
  { icon: Zap, label: "스트레스", value: "낮음", unit: "", color: "text-amber-500", bg: "bg-amber-500/10", sub: "32점" },
];

const subScores = [
  { label: "수면", score: 82, color: "bg-indigo-500" },
  { label: "스트레스 회복", score: 71, color: "bg-amber-500" },
  { label: "심박 안정성", score: 93, color: "bg-red-500" },
  { label: "활동량", score: 65, color: "bg-emerald-500" },
];

const recentCash = [
  { reason: "숙면 달성", amount: 500, time: "오늘 06:00" },
  { reason: "아침 준비도 상승", amount: 300, time: "오늘 07:00" },
  { reason: "HRV 목표 유지", amount: 300, time: "어제" },
  { reason: "구독료 차감", amount: -19900, time: "04/01" },
];

const weeklyScores = [78, 81, 84, 82, 85, 84, 87];
const weekDays = ["월", "화", "수", "목", "금", "토", "일"];

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">내 건강</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              서울 강서구
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />3분 전
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Battery className="w-3 h-3" />
              72%
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
          </button>
        </div>
      </motion.div>

      {/* VITA Score */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 gradient-vita opacity-5 rounded-full -translate-y-8 translate-x-8" />
          <div className="flex items-center gap-6">
            {/* Circular score */}
            <div className="relative w-28 h-28 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-muted/50" strokeWidth="7" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="url(#vitaGrad)" strokeWidth="7" strokeLinecap="round"
                  strokeDasharray={`${vitaScore * 2.64} ${264 - vitaScore * 2.64}`}
                />
                <defs>
                  <linearGradient id="vitaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0d9488" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{vitaScore}</span>
                <span className="text-[10px] text-muted-foreground">VITA Score</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-xs">
                  양호
                </Badge>
                <span className="flex items-center gap-0.5 text-xs text-emerald-600">
                  {scoreDelta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  전일 대비 {scoreDelta > 0 ? "+" : ""}{scoreDelta}점
                </span>
              </div>

              <div className="space-y-2">
                {subScores.map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="font-medium">{s.score}</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.score}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className={`h-full rounded-full ${s.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-2 gap-3">
        {vitals.map((v, i) => (
          <motion.div key={v.label} custom={i + 1} variants={fadeUp} initial="hidden" animate="visible">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-lg ${v.bg} flex items-center justify-center`}>
                  <v.icon className={`w-3.5 h-3.5 ${v.color}`} />
                </div>
                <span className="text-xs text-muted-foreground">{v.label}</span>
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
      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <h3 className="text-sm font-semibold mb-4">주간 VITA Score</h3>
          <div className="flex items-end gap-1.5 h-20">
            {weeklyScores.map((score, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-muted-foreground">{score}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(score / 100) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className={`w-full rounded-t ${
                    i === weeklyScores.length - 1 ? "gradient-vita" : "bg-muted-foreground/20"
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
      <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5 bg-accent/5 border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg gradient-vita flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold">AI 코칭</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            전반적인 건강 상태가 양호합니다. 이번 주 수면의 질이 꾸준히 개선되고 있으며,
            스트레스 회복력도 좋은 편입니다. 오늘은 30분 산책을 추천드립니다.
          </p>
        </Card>
      </motion.div>

      {/* Vital Cash + Subscription Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Vital Cash */}
        <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-vita-gold" />
                <span className="text-sm font-semibold">바이탈 캐시</span>
              </div>
              <button className="text-xs text-accent hover:underline flex items-center gap-0.5">
                전체 보기 <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-2xl font-bold mb-3">
              12,400<span className="text-sm font-normal text-muted-foreground ml-1">P</span>
            </p>
            <div className="space-y-2">
              {recentCash.map((tx, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{tx.reason}</span>
                  <div className="flex items-center gap-2">
                    <span className={tx.amount > 0 ? "text-accent font-medium" : "text-destructive font-medium"}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString()}P
                    </span>
                    <span className="text-[10px] text-muted-foreground w-12 text-right">{tx.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Subscription */}
        <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold">구독</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="gradient-vita text-white border-0">Premium</Badge>
              <Badge variant="outline" className="text-[10px]">활성</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              월 29,900원 / 다음 결제: 2026.05.01
            </p>
            <div className="space-y-1.5">
              {["24시간 AI 관제", "월 1회 차HC 원격 상담", "보호자 실시간 모니터링", "분기별 건강검진 할인"].map((feat) => (
                <div key={feat} className="flex items-center gap-1.5 text-[11px]">
                  <div className="w-1 h-1 rounded-full bg-accent" />
                  <span className="text-muted-foreground">{feat}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Activity */}
      <motion.div custom={9} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Footprints className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold">오늘 활동</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold">4,328</p>
              <p className="text-[10px] text-muted-foreground">걸음</p>
              <Progress value={43} className="h-1 mt-1" />
            </div>
            <div>
              <p className="text-lg font-bold">186</p>
              <p className="text-[10px] text-muted-foreground">kcal</p>
              <Progress value={37} className="h-1 mt-1" />
            </div>
            <div>
              <p className="text-lg font-bold">2.8</p>
              <p className="text-[10px] text-muted-foreground">km</p>
              <Progress value={56} className="h-1 mt-1" />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
