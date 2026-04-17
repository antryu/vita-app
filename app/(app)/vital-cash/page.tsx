"use client";

import { motion } from "framer-motion";
import { Coins, TrendingUp, Gift, ShoppingBag, Shield, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" as const },
  }),
};

const transactions = [
  { reason: "숙면 달성", amount: 500, time: "오늘 06:00", type: "earn" },
  { reason: "아침 준비도 상승", amount: 300, time: "오늘 07:00", type: "earn" },
  { reason: "HRV 목표 유지", amount: 300, time: "어제", type: "earn" },
  { reason: "가족 안부 연결", amount: 200, time: "어제", type: "earn" },
  { reason: "구독료 차감", amount: -19900, time: "04/01", type: "burn" },
  { reason: "스트레스 관리", amount: 300, time: "04/15", type: "earn" },
  { reason: "팬덤 챌린지 달성", amount: 1000, time: "04/14", type: "earn" },
  { reason: "약 복용 인증", amount: 100, time: "04/14", type: "earn" },
];

const earningRules = [
  { action: "숙면 달성", points: "500P/일", icon: "sleep" },
  { action: "아침 준비도 상승", points: "300P/일", icon: "morning" },
  { action: "스트레스 관리", points: "300P/일", icon: "stress" },
  { action: "가족 안부 연결", points: "200P", icon: "family" },
  { action: "팬덤 챌린지", points: "1,000P/주", icon: "fandom" },
  { action: "약 복용 인증", points: "100P/회", icon: "med" },
];

export default function VitalCashPage() {
  const balance = 12400;
  const monthlyEarned = 4200;
  const monthlyBurned = 19900;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Coins className="w-6 h-6 text-vita-gold" />
          바이탈 캐시
        </h1>
        <p className="text-sm text-muted-foreground mt-1">건강하면 포인트가 쌓입니다</p>
      </motion.div>

      {/* Balance Card */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-6 gradient-navy text-white border-0">
          <p className="text-xs text-white/60 mb-1">보유 포인트</p>
          <p className="text-4xl font-bold mb-4">{balance.toLocaleString()}<span className="text-lg ml-1">P</span></p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <div className="flex items-center gap-1 mb-1">
                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-white/60">이번 달 적립</span>
              </div>
              <p className="text-lg font-bold text-emerald-400">+{monthlyEarned.toLocaleString()}P</p>
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              <div className="flex items-center gap-1 mb-1">
                <ArrowDownRight className="w-3 h-3 text-red-400" />
                <span className="text-[10px] text-white/60">이번 달 사용</span>
              </div>
              <p className="text-lg font-bold text-red-400">-{monthlyBurned.toLocaleString()}P</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Earning Rules */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            적립 방법 — &apos;자면서 돈을 번다&apos;
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {earningRules.map((rule) => (
              <div key={rule.action} className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-xs font-medium mb-1">{rule.action}</p>
                <p className="text-sm font-bold text-accent">{rule.points}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Redemption Options */}
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="p-4 bg-accent/5 border-accent/20">
            <Gift className="w-5 h-5 text-accent mb-2" />
            <h3 className="text-sm font-semibold">구독료 차감</h3>
            <p className="text-[10px] text-muted-foreground mt-1">포인트로 월 구독료 직접 결제</p>
          </Card>
          <Card className="p-4">
            <ShoppingBag className="w-5 h-5 text-vita-gold mb-2" />
            <h3 className="text-sm font-semibold">바이탈 몰</h3>
            <p className="text-[10px] text-muted-foreground mt-1">건강검진 할인권, 영양제, 여행 상품</p>
          </Card>
          <Card className="p-4">
            <Shield className="w-5 h-5 text-muted-foreground mb-2" />
            <h3 className="text-sm font-semibold">파트너 혜택</h3>
            <p className="text-[10px] text-muted-foreground mt-1">보람상조 할인, 보험료 캐시백</p>
          </Card>
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <h2 className="text-sm font-semibold mb-4">거래 내역</h2>
          <div className="space-y-3">
            {transactions.map((tx, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b last:border-0">
                <div>
                  <p className="text-sm">{tx.reason}</p>
                  <p className="text-[10px] text-muted-foreground">{tx.time}</p>
                </div>
                <span className={`text-sm font-bold ${tx.amount > 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString()}P
                </span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
