"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CheckCircle,
  Trophy,
  BarChart3,
  Download,
  Settings,
  Gift,
  ArrowLeft,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/participants", label: "Participants", icon: Users },
  { href: "/admin/verification", label: "Verification", icon: CheckCircle },
  { href: "/admin/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/exports", label: "Exports", icon: Download },
  { href: "/admin/campaign", label: "Campaign", icon: Settings },
  { href: "/admin/rewards", label: "Rewards", icon: Gift },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-chocolate text-cream min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <Logo size="sm" />
        <p className="text-cream/50 text-xs mt-2">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                isActive
                  ? "bg-purple text-white"
                  : "text-cream/70 hover:text-cream hover:bg-cream/10"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-cream/20">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-cream/70 hover:text-cream hover:bg-cream/10 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </aside>
  );
}
