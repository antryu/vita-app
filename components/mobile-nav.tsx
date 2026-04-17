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
  { href: "/dashboard", icon: LayoutDashboard, label: "홈" },
  { href: "/guardian", icon: Users, label: "보호자" },
  { href: "/org", icon: Building2, label: "관제" },
  { href: "/vital-cash", icon: Coins, label: "캐시" },
  { href: "/settings", icon: Settings, label: "설정" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t bg-card/95 backdrop-blur-lg safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                isActive
                  ? "text-accent"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[9px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
