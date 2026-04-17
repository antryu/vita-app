"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Wind,
  Moon,
  Zap,
  Coins,
  Brain,
  Bell,
  Footprints,
  TrendingUp,
  MapPin,
  Battery,
  ChevronRight,
  Flame,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const vitaScore = 87;
const weeklyScores = [78, 81, 84, 82, 85, 84, 87];
const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4 gradient-mesh min-h-screen">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Good morning</p>
          <h1 className="text-xl font-bold">정호님</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <MapPin className="w-3 h-3" />강서구
            <span className="text-white/20">|</span>
            <Battery className="w-3 h-3" />72%
          </div>
          <button className="relative p-2 rounded-xl glass">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-vita-coral" />
          </button>
        </div>
      </motion.div>

      {/* VITA Score — Hero */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
        <div className="relative rounded-2xl overflow-hidden p-6 glow-teal" style={{ background: "linear-gradient(135deg, rgba(20,184,166,0.12), rgba(59,130,246,0.08))", border: "1px solid rgba(20,184,166,0.15)" }}>
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-vita-teal/5 -translate-y-10 translate-x-10 blur-2xl" />
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <motion.circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="url(#scoreGrad)" strokeWidth="6" strokeLinecap="round"
                  initial={{ strokeDasharray: "0 264" }}
                  animate={{ strokeDasharray: `${vitaScore * 2.64} ${264 - vitaScore * 2.64}` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-3xl font-black tabular-nums"
                >{vitaScore}</motion.span>
                <span className="text-[8px] text-muted-foreground tracking-widest uppercase">Score</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20 text-[10px]">Excellent</Badge>
                <span className="text-xs text-emerald-400 flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />+3</span>
              </div>
              <div className="flex items-end gap-1 h-10">
                {weeklyScores.map((s, i) => (
                  <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${(s / 100) * 100}%` }} transition={{ duration: 0.6, delay: 0.8 + i * 0.05 }}
                    className={`flex-1 rounded-sm ${i === 6 ? "bg-gradient-to-t from-[#14b8a6] to-[#3b82f6]" : "bg-white/[0.06]"}`} style={{ minHeight: 2 }} />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                {weekDays.map((d, i) => (<span key={i} className={`text-[8px] flex-1 text-center ${i === 6 ? "text-[#14b8a6]" : "text-white/20"}`}>{d}</span>))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bento Vitals */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Heart, label: "Heart Rate", value: "68", unit: "bpm", glow: "glow-red", accent: "#f43f5e", bg: "rgba(244,63,94,0.08)", border: "rgba(244,63,94,0.12)" },
          { icon: Wind, label: "SpO2", value: "97.3", unit: "%", glow: "glow-blue", accent: "#3b82f6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.12)" },
          { icon: Moon, label: "Sleep", value: "6h42m", unit: "", sub: "Deep 28%", glow: "glow-purple", accent: "#8b5cf6", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.12)" },
          { icon: Zap, label: "Stress", value: "Low", unit: "", sub: "32pts", glow: "glow-gold", accent: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.12)" },
        ].map((v, i) => (
          <motion.div key={v.label} custom={i + 1} variants={fadeUp} initial="hidden" animate="visible">
            <div className={`rounded-2xl p-4 ${v.glow}`} style={{ background: v.bg, border: `1px solid ${v.border}` }}>
              <div className="flex items-center gap-1.5 mb-3">
                <v.icon className="w-3.5 h-3.5" style={{ color: v.accent }} />
                <span className="text-[10px] text-muted-foreground">{v.label}</span>
              </div>
              <p className="text-2xl font-black tabular-nums">
                {v.value}{v.unit && <span className="text-xs font-normal text-muted-foreground ml-0.5">{v.unit}</span>}
              </p>
              {v.sub && <p className="text-[10px] text-muted-foreground mt-0.5">{v.sub}</p>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Coach */}
      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
        <div className="rounded-2xl p-5 glow-teal" style={{ background: "rgba(20,184,166,0.06)", border: "1px solid rgba(20,184,166,0.1)" }}>
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-7 h-7 rounded-lg gradient-vita flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-semibold" style={{ color: "#14b8a6" }}>AI Coach</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            수면의 질이 이번 주 꾸준히 개선되고 있습니다. 스트레스 회복력도 좋은 상태입니다. 오늘은 30분 산책을 추천드립니다.
          </p>
        </div>
      </motion.div>

      {/* Vital Cash + Activity */}
      <div className="grid grid-cols-5 gap-3">
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="col-span-3">
          <div className="rounded-2xl p-4 glow-gold" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.1)" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span className="text-[10px] text-muted-foreground">Vital Cash</span>
              </div>
              <ChevronRight className="w-3 h-3 text-white/20" />
            </div>
            <p className="text-2xl font-black tabular-nums">12,400<span className="text-xs font-normal text-muted-foreground ml-0.5">P</span></p>
            <div className="flex gap-2 mt-2">
              <span className="text-[10px] text-emerald-400">+500 sleep</span>
              <span className="text-[10px] text-emerald-400">+300 HRV</span>
            </div>
          </div>
        </motion.div>
        <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible" className="col-span-2">
          <div className="rounded-2xl p-4 h-full flex flex-col justify-between" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.1)" }}>
            <Footprints className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-xl font-black tabular-nums">4,328</p>
              <p className="text-[10px] text-muted-foreground">steps / 54%</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Score Breakdown */}
      <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible">
        <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
          <p className="text-[10px] text-muted-foreground mb-3 tracking-widest uppercase">Score Breakdown</p>
          <div className="space-y-2.5">
            {[
              { label: "Sleep Quality", score: 82, color: "#8b5cf6" },
              { label: "Stress Recovery", score: 71, color: "#f59e0b" },
              { label: "Cardiac Stability", score: 93, color: "#f43f5e" },
              { label: "Activity Level", score: 65, color: "#10b981" },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-bold tabular-nums" style={{ color: s.color }}>{s.score}</span>
                </div>
                <div className="w-full h-1 rounded-full bg-white/[0.04] overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${s.score}%` }} transition={{ duration: 1, delay: 0.5 }}
                    className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${s.color}40, ${s.color})` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Streak */}
      <motion.div custom={9} variants={fadeUp} initial="hidden" animate="visible">
        <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(244,63,94,0.1)" }}>
            <Flame className="w-5 h-5 text-[#f43f5e]" />
          </div>
          <div>
            <p className="text-sm font-bold">7-Day Streak</p>
            <p className="text-[10px] text-muted-foreground">숙면 목표를 7일 연속 달성</p>
          </div>
          <Badge className="ml-auto text-[10px]" style={{ background: "rgba(244,63,94,0.15)", color: "#f43f5e", border: "1px solid rgba(244,63,94,0.2)" }}>+1,000P</Badge>
        </div>
      </motion.div>
    </div>
  );
}
