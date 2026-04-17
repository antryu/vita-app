"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle2, Crown, Star, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PLAN_PRICES, type PlanType } from "@/lib/toss/payments";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" as const },
  }),
};

const planIcons: Record<PlanType, typeof Star> = { basic: Star, premium: Zap, platinum: Crown };
const currentPlan: PlanType = "premium";

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(currentPlan);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-accent" />
          구독 관리
        </h1>
        <p className="text-sm text-muted-foreground mt-1">현재 플랜: <span className="font-medium text-foreground">Premium</span></p>
      </motion.div>

      {/* Current Plan Info */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5 border-accent">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge className="gradient-vita text-white border-0">Premium</Badge>
              <Badge variant="outline" className="text-[10px]">활성</Badge>
            </div>
            <p className="text-sm font-medium">월 29,900원</p>
          </div>
          <p className="text-xs text-muted-foreground">다음 결제일: 2026.05.01 / 결제 수단: 신한카드 ****-1234</p>
        </Card>
      </motion.div>

      {/* Plan Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.entries(PLAN_PRICES) as [PlanType, typeof PLAN_PRICES.basic][]).map(([key, plan], i) => {
          const Icon = planIcons[key];
          const isCurrent = key === currentPlan;
          const isSelected = key === selectedPlan;

          return (
            <motion.div key={key} custom={i + 1} variants={fadeUp} initial="hidden" animate="visible">
              <Card
                className={`p-5 cursor-pointer transition-all h-full flex flex-col ${
                  isCurrent ? "border-accent shadow-md" : isSelected ? "border-accent/50" : "hover:border-accent/30"
                }`}
                onClick={() => setSelectedPlan(key)}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isCurrent ? "gradient-vita" : "bg-muted"}`}>
                    <Icon className={`w-4 h-4 ${isCurrent ? "text-white" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{plan.name}</h3>
                    {isCurrent && <Badge className="text-[8px] bg-accent/10 text-accent border-accent/20">현재</Badge>}
                  </div>
                </div>
                <p className="text-2xl font-bold mb-4">
                  {plan.price.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">원/월</span>
                </p>
                <div className="space-y-2 flex-1">
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex gap-2 items-start">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      <span className="text-xs">{feat}</span>
                    </div>
                  ))}
                </div>
                {!isCurrent && (
                  <Button
                    variant={key === "platinum" ? "default" : "outline"}
                    size="sm"
                    className={`w-full mt-4 text-xs ${key === "platinum" ? "gradient-vita text-white border-0" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`${plan.name} 플랜으로 변경 — 준비 중입니다`);
                    }}
                  >
                    {key === "basic" ? "다운그레이드" : "업그레이드"}
                  </Button>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Payment History */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <h2 className="text-sm font-semibold mb-4">결제 내역</h2>
          <div className="space-y-2">
            {[
              { date: "2026.04.01", amount: 29900, status: "완료" },
              { date: "2026.03.01", amount: 29900, status: "완료" },
              { date: "2026.02.01", amount: 19900, status: "완료" },
              { date: "2026.01.15", amount: 19900, status: "완료" },
            ].map((pay, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0 text-sm">
                <span className="text-muted-foreground">{pay.date}</span>
                <span className="font-medium">{pay.amount.toLocaleString()}원</span>
                <Badge variant="outline" className="text-[10px]">{pay.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
