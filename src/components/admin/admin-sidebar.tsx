"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import {
  LayoutDashboard,
  Users,
  GitPullRequest,
  CheckCircle,
  Trophy,
  Gift,
  School,
  MapPin,
  BarChart3,
  Bell,
  Megaphone,
  Image,
  FileText,
  UserCog,
  Settings,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { useState } from "react";

const mainNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Participants", href: "/admin/participants", icon: Users },
  { label: "Referrals", href: "/admin/verification", icon: GitPullRequest },
  { label: "Verification", href: "/admin/verification", icon: CheckCircle },
  { label: "Leaderboard", href: "/admin/leaderboard", icon: Trophy },
  { label: "Rewards", href: "/admin/rewards", icon: Gift },
];

const secondaryNav = [
  { label: "Schools", href: "/admin/analytics", icon: School },
  { label: "States", href: "/admin/analytics", icon: MapPin },
  { label: "Reports", href: "/admin/exports", icon: BarChart3 },
  { label: "Notifications", href: "/admin", icon: Bell },
  { label: "Campaign", href: "/admin/campaign", icon: Megaphone },
];

const bottomNav = [
  { label: "Media Library", href: "/admin", icon: Image },
  { label: "Audit Logs", href: "/admin", icon: FileText },
  { label: "Admin Users", href: "/admin", icon: UserCog },
  { label: "Settings", href: "/admin/campaign", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`hidden lg:flex flex-col h-screen sticky top-0 bg-brown-dark transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/10 shrink-0">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <Logo size="icon" className="[&_img]:brightness-0 [&_img]:invert" />
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-cream/60 hover:text-cream hover:bg-white/10 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        <div className="mb-2">
          {!collapsed && (
            <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-cream/30">
              Main
            </p>
          )}
          {mainNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                isActive(item.href)
                  ? "bg-gold text-white shadow-lg shadow-gold/20"
                  : "text-cream/60 hover:text-cream hover:bg-white/8"
              } ${collapsed ? "justify-center px-0" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>

        <div className="border-t border-white/8 my-2 pt-2">
          {!collapsed && (
            <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-cream/30">
              Management
            </p>
          )}
          {secondaryNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                isActive(item.href) && pathname === item.href
                  ? "bg-gold text-white shadow-lg shadow-gold/20"
                  : "text-cream/60 hover:text-cream hover:bg-white/8"
              } ${collapsed ? "justify-center px-0" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>

        <div className="border-t border-white/8 my-2 pt-2">
          {bottomNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                isActive(item.href) && pathname === item.href
                  ? "bg-gold text-white shadow-lg shadow-gold/20"
                  : "text-cream/60 hover:text-cream hover:bg-white/8"
              } ${collapsed ? "justify-center px-0" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-2 shrink-0">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-cream/50 hover:text-cream hover:bg-white/8 transition-all"
          title={collapsed ? "Back to Dashboard" : undefined}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Back to Dashboard</span>}
        </Link>
      </div>
    </aside>
  );
}
