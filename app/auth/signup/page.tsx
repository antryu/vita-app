"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Users,
  Building2,
  Heart,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserRole } from "@/lib/supabase/types";

const roles: Array<{
  value: UserRole;
  icon: typeof Heart;
  title: string;
  desc: string;
}> = [
  {
    value: "member",
    icon: Heart,
    title: "바이탈링 사용자",
    desc: "링을 착용하고 건강을 관리합니다",
  },
  {
    value: "guardian",
    icon: Users,
    title: "보호자 / 가족",
    desc: "가족의 건강 상태를 모니터링합니다",
  },
  {
    value: "org_admin",
    icon: Building2,
    title: "기관 관리자",
    desc: "지자체/요양원/기업 관제 대시보드",
  },
];

export default function SignupPage() {
  const [step, setStep] = useState<"role" | "info">("role");
  const [role, setRole] = useState<UserRole>("member");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // TODO: Supabase auth signup
      // const { error } = await supabase.auth.signUp({
      //   email, password,
      //   options: { data: { name, role } }
      // });
      await new Promise((r) => setTimeout(r, 1000));
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px]"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-vita flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold">
            <span className="text-gradient">VITA</span> Platform
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {step === "role" ? "사용 유형을 선택하세요" : "계정 정보를 입력하세요"}
          </p>
        </div>

        <Card className="p-6 shadow-lg dark:border-white/[0.06]">
          {step === "role" ? (
            <motion.div
              key="role"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-3"
            >
              {roles.map((r) => (
                <button
                  key={r.value}
                  onClick={() => {
                    setRole(r.value);
                    setStep("info");
                  }}
                  className={`w-full p-4 rounded-xl border text-left flex items-start gap-4 transition-all hover:border-accent hover:bg-accent/5 ${
                    role === r.value ? "border-accent bg-accent/5" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg gradient-vita flex items-center justify-center shrink-0">
                    <r.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.form
              key="info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSignup}
              className="space-y-4"
            >
              <button
                type="button"
                onClick={() => setStep("role")}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
              >
                ← 유형 다시 선택
              </button>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="홍길동"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="8자 이상"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                선택된 유형:{" "}
                <span className="font-medium text-foreground">
                  {roles.find((r) => r.value === role)?.title}
                </span>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full gradient-vita text-white border-0 h-10"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    회원가입
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </motion.form>
          )}
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          이미 계정이 있으신가요?{" "}
          <Link href="/auth/login" className="text-accent hover:underline font-medium">
            로그인
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
