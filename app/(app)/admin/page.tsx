"use client";

import { motion } from "framer-motion";
import { BarChart3, Users, CreditCard, AlertTriangle, TrendingUp, Activity } from "lucide-react";
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

export default function AdminConsolePage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-accent" />
          Admin Console
        </h1>
        <p className="text-sm text-muted-foreground mt-1">VITA Platform Operations</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "총 가입자", value: "523", delta: "+12 이번 주", color: "text-accent" },
          { icon: CreditCard, label: "MRR", value: "12,847,100원", delta: "+8.3%", color: "text-emerald-600" },
          { icon: TrendingUp, label: "유료 구독", value: "489", delta: "93.5% 전환율", color: "text-accent" },
          { icon: AlertTriangle, label: "활성 알림", value: "5", delta: "2 critical", color: "text-red-600" },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} custom={i} variants={fadeUp} initial="hidden" animate="visible">
            <Card className="p-4">
              <kpi.icon className={`w-5 h-5 ${kpi.color} mb-2`} />
              <p className="text-xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <p className="text-[10px] text-accent mt-1">{kpi.delta}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <h2 className="text-sm font-semibold mb-4">구독 현황</h2>
          <div className="space-y-3">
            {[
              { tier: "Basic", count: 312, price: 19900 },
              { tier: "Premium", count: 156, price: 29900 },
              { tier: "Platinum", count: 21, price: 49900 },
            ].map((plan) => (
              <div key={plan.tier} className="flex items-center gap-3">
                <span className="text-sm font-medium w-20">{plan.tier}</span>
                <div className="flex-1"><Progress value={(plan.count / 489) * 100} className="h-2" /></div>
                <span className="text-xs text-muted-foreground w-16 text-right">{plan.count}명</span>
                <span className="text-xs font-medium w-28 text-right">{(plan.count * plan.price).toLocaleString()}원/월</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <h2 className="text-sm font-semibold mb-4">기관 계약</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="text-left py-2 font-medium">기관</th>
                  <th className="text-left py-2 font-medium">유형</th>
                  <th className="text-right py-2 font-medium">인원</th>
                  <th className="text-right py-2 font-medium">월 관제료</th>
                  <th className="text-left py-2 font-medium">상태</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "화성시 통합돌봄센터", type: "지자체", count: 55, fee: 2000, status: "SLA 계약" },
                  { name: "보람상조 VIP", type: "파트너", count: 200, fee: 0, status: "파일럿" },
                  { name: "한국건설 안전관리", type: "기업", count: 268, fee: 800, status: "월 정액" },
                ].map((org) => (
                  <tr key={org.name} className="border-b last:border-0">
                    <td className="py-2.5 font-medium">{org.name}</td>
                    <td className="py-2.5"><Badge variant="secondary" className="text-[10px]">{org.type}</Badge></td>
                    <td className="py-2.5 text-right">{org.count}명</td>
                    <td className="py-2.5 text-right">{org.fee > 0 ? `${org.fee}만원` : "무상"}</td>
                    <td className="py-2.5"><Badge variant="outline" className="text-[10px]">{org.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            시스템 상태
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "API 응답", value: "142ms" },
              { label: "DB 연결", value: "정상" },
              { label: "알림 발송", value: "정상" },
              { label: "AI 엔진", value: "정상" },
            ].map((sys) => (
              <div key={sys.label} className="p-3 rounded-lg bg-muted/50 text-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-medium">{sys.label}</p>
                <p className="text-[10px] text-muted-foreground">{sys.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
