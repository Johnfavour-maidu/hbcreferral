"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, CheckCircle, Trophy, BarChart3, Download, Settings, Gift, ArrowLeft } from "lucide-react";
import Image from "next/image";

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
    <aside className="w-64 bg-brown text-cream min-h-screen p-6 flex flex-col hidden lg:flex">
      <div className="mb-8">
        <Image src="/assets/logo/logo-horizontal-sm.png" alt="Hearts by Charming" width={40} height={40} className="brightness-0 invert opacity-90" style={{ width: 40, height: "auto", objectFit: "contain" }} />
        <p className="text-cream/40 text-xs mt-2 font-medium uppercase tracking-wider">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive ? "bg-gold text-white shadow-lg shadow-gold/20" : "text-cream/60 hover:text-cream hover:bg-cream/10"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-cream/10">
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-cream/60 hover:text-cream hover:bg-cream/10 transition-all">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </aside>
  );
}
