"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  Users,
  Coins,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Building2,
  Sun,
  Moon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const menuItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "대시보드" },
  { href: "/guardian", icon: Users, label: "보호자" },
  { href: "/org", icon: Building2, label: "기관 관제" },
  { href: "/vital-cash", icon: Coins, label: "바이탈 캐시" },
  { href: "/subscription", icon: CreditCard, label: "구독 관리" },
  { href: "/settings", icon: Settings, label: "설정" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("vita-theme");
    const prefersDark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("vita-theme", next ? "dark" : "light");
  }

  return (
    <TooltipProvider delay={0}>
      <aside
        className={`gradient-navy text-white flex flex-col shrink-0 transition-all duration-300 ${
          collapsed ? "w-16" : "w-56"
        } hidden md:flex`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-2 h-16 px-4 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          {!collapsed && (
            <span className="text-sm font-bold tracking-tight">VITA Platform</span>
          )}
        </div>

        {/* User Info */}
        {!collapsed && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center text-xs font-bold">
                JH
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">이정호</p>
                <Badge className="bg-accent/20 text-accent border-0 text-[9px] px-1.5 py-0">
                  Premium
                </Badge>
              </div>
            </div>
          </div>
        )}

        <div className="h-px bg-white/10 mx-3" />

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 mt-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const linkContent = (
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  collapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-white/15 text-white font-medium"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                <item.icon className="w-4.5 h-4.5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger className="w-full">{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.href}>{linkContent}</div>;
          })}
        </nav>

        {/* Bottom */}
        <div className="p-2 space-y-1">
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors w-full ${
              collapsed ? "justify-center" : ""
            }`}
          >
            {dark ? <Sun className="w-3.5 h-3.5 shrink-0" /> : <Moon className="w-3.5 h-3.5 shrink-0" />}
            {!collapsed && <span>{dark ? "라이트 모드" : "다크 모드"}</span>}
          </button>

          <a
            href="https://vita-platform.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <Shield className="w-3.5 h-3.5 shrink-0" />
            {!collapsed && <span>마케팅 사이트</span>}
          </a>

          <button
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors w-full ${
              collapsed ? "justify-center" : ""
            }`}
            onClick={() => {
              // TODO: supabase.auth.signOut()
              window.location.href = "/auth/login";
            }}
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            {!collapsed && <span>로그아웃</span>}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/30 hover:text-white/60 transition-colors w-full ${
              collapsed ? "justify-center" : ""
            }`}
          >
            {collapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <>
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>접기</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
