"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  Shield,
  Smartphone,
  Moon,
  Sun,
  Globe,
  Link2,
  LogOut,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" as const },
  }),
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-accent" : "bg-muted-foreground/30"}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5.5" : "translate-x-0.5"}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({ daily: true, anomaly: true, weekly: true, marketing: false });
  const [dataSharing, setDataSharing] = useState({ insurance: false, research: false });

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-accent" />
          설정
        </h1>
      </motion.div>

      {/* Profile */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            프로필
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full gradient-vita flex items-center justify-center text-white font-bold text-lg">
              JH
            </div>
            <div>
              <p className="font-semibold">이정호</p>
              <p className="text-xs text-muted-foreground">jungho@example.com</p>
              <Badge variant="secondary" className="text-[10px] mt-1">Premium</Badge>
            </div>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">이름</Label>
              <Input defaultValue="이정호" className="h-9" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">전화번호</Label>
              <Input defaultValue="010-1234-5678" className="h-9" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Device */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-muted-foreground" />
            디바이스
          </h2>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm font-medium">VitalRing</p>
              <p className="text-xs text-muted-foreground">VR-2026-48291 / 배터리 72%</p>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-[10px]">연결됨</Badge>
          </div>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-muted-foreground" />
            알림 설정
          </h2>
          <div className="space-y-3">
            {[
              { key: "daily" as const, label: "일일 건강 리포트", desc: "매일 06:00 KakaoTalk 발송" },
              { key: "anomaly" as const, label: "이상 징후 알림", desc: "실시간 긴급 알림" },
              { key: "weekly" as const, label: "주간 요약 리포트", desc: "매주 월요일 09:00" },
              { key: "marketing" as const, label: "마케팅/이벤트", desc: "프로모션 및 챌린지 안내" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                </div>
                <Toggle
                  checked={notifications[item.key]}
                  onChange={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                />
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Data & Privacy */}
      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            개인정보 및 데이터
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">보험사 데이터 공유</p>
                <p className="text-[10px] text-muted-foreground">VITA Score + 수면/활동 트렌드만 공유 (원시 데이터 제외)</p>
              </div>
              <Toggle
                checked={dataSharing.insurance}
                onChange={() => setDataSharing((prev) => ({ ...prev, insurance: !prev.insurance }))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">연구 데이터 제공</p>
                <p className="text-[10px] text-muted-foreground">비식별화된 데이터를 의학 연구에 제공</p>
              </div>
              <Toggle
                checked={dataSharing.research}
                onChange={() => setDataSharing((prev) => ({ ...prev, research: !prev.research }))}
              />
            </div>
            <Separator />
            <button className="flex items-center justify-between w-full py-1">
              <span className="text-sm text-muted-foreground">데이터 다운로드</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="flex items-center justify-between w-full py-1">
              <span className="text-sm text-destructive">계정 삭제</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </Card>
      </motion.div>

      {/* Connected Services */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-muted-foreground" />
            연동 서비스
          </h2>
          <div className="space-y-2">
            {[
              { name: "KakaoTalk", status: "연결됨", connected: true },
              { name: "CHA Healthcare", status: "미연결", connected: false },
              { name: "DB손해보험", status: "미연결", connected: false },
            ].map((svc) => (
              <div key={svc.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <span className="text-sm">{svc.name}</span>
                {svc.connected ? (
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-[10px]">
                    <CheckCircle2 className="w-3 h-3 mr-1" />{svc.status}
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm" className="text-[10px] h-6">
                    연결하기
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
