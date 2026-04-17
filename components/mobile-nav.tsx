"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Coins,
  Settings,
} from "lucide-react";

const items = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/guardian", icon: Users, label: "Family" },
  { href: "/org", icon: Building2, label: "Org" },
  { href: "/vital-cash", icon: Coins, label: "Cash" },
  { href: "/settings", icon: Settings, label: "More" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-area-bottom" style={{ background: "rgba(10,14,26,0.9)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center justify-around h-14">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 relative"
            >
              {isActive && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#14b8a6]" />
              )}
              <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-[#14b8a6]" : "text-white/30"}`} />
              <span className={`text-[9px] font-medium transition-colors ${isActive ? "text-[#14b8a6]" : "text-white/30"}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
