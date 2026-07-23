"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import {
  LayoutDashboard,
  Users,
  CheckCircle,
  Trophy,
  ChevronLeft,
  LogOut,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Participants", href: "/admin/participants", icon: Users },
  { label: "Verification", href: "/admin/verification", icon: CheckCircle },
  { label: "Leaderboard", href: "/admin/leaderboard", icon: Trophy },
  { label: "Analytics", href: "/admin/analytics", icon: LayoutDashboard },
  { label: "Campaign", href: "/admin/campaign", icon: LayoutDashboard },
  { label: "Exports", href: "/admin/exports", icon: LayoutDashboard },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const NavItems = () => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          onClick={onMobileClose}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 mb-0.5 ${
            isActive(item.href)
              ? "bg-gold text-white shadow-lg shadow-gold/25"
              : "text-cream/55 hover:text-cream hover:bg-white/[0.07]"
          } ${collapsed ? "justify-center px-0" : ""}`}
          title={collapsed ? item.label : undefined}
        >
          <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />
          {!collapsed && <span>{item.label}</span>}
        </Link>
      ))}
    </>
  );

  const sidebarContent = (
    <aside
      className={`hidden lg:flex flex-col h-screen sticky top-0 bg-[#1C1410] transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/[0.06] shrink-0">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2.5">
            <Logo size="icon" className="[&_img]:brightness-0 [&_img]:invert h-7 w-7" />
            <div>
              <p className="text-[13px] font-bold text-cream leading-none">Admin Panel</p>
              <p className="text-[10px] text-cream/35 mt-0.5">Referral Campaign</p>
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-cream/40 hover:text-cream hover:bg-white/10 transition-colors"
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
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <NavItems />
      </nav>

      {/* Footer */}
      <div className="border-t border-white/[0.06] p-2 shrink-0">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-cream/40 hover:text-cream hover:bg-white/[0.07] transition-all ${
            collapsed ? "justify-center px-0" : ""
          }`}
          title={collapsed ? "Back to Dashboard" : undefined}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Back to Dashboard</span>}
        </Link>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop */}
      {sidebarContent}

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="absolute left-0 top-0 h-full w-[280px] bg-[#1C1410] flex flex-col">
            <div className="flex items-center justify-between px-4 h-16 border-b border-white/[0.06] shrink-0">
              <Link href="/admin" className="flex items-center gap-2.5" onClick={onMobileClose}>
                <Logo size="icon" className="[&_img]:brightness-0 [&_img]:invert h-7 w-7" />
                <div>
                  <p className="text-[13px] font-bold text-cream leading-none">Admin Panel</p>
                  <p className="text-[10px] text-cream/35 mt-0.5">Referral Campaign</p>
                </div>
              </Link>
              <button onClick={onMobileClose} className="p-1.5 rounded-lg text-cream/40 hover:text-cream hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-3 px-2">
              <NavItems />
            </nav>
            <div className="border-t border-white/[0.06] p-2 shrink-0">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-cream/40 hover:text-cream hover:bg-white/[0.07]"
              >
                <LogOut className="h-[18px] w-[18px] shrink-0" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
