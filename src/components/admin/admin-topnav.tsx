"use client";

import { Bell, Search, LogOut, ChevronDown, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";

interface AdminTopNavProps {
  onMenuToggle?: () => void;
}

export function AdminTopNav({ onMenuToggle }: AdminTopNavProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-cream-dark px-4 lg:px-6 flex items-center justify-between shrink-0 sticky top-0 z-40">
      {/* Left: Menu toggle + Search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl hover:bg-cream transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5 text-brown-dark" />
        </button>
        <div className="hidden sm:flex items-center gap-2 bg-cream/60 rounded-xl px-4 py-2.5 w-full max-w-md border border-transparent focus-within:border-gold/30 focus-within:bg-white transition-all">
          <Search className="h-4 w-4 text-brown-light/40 shrink-0" />
          <input
            type="text"
            placeholder="Search participants, referrals, schools..."
            className="bg-transparent text-sm text-brown-dark placeholder:text-brown-light/40 outline-none w-full"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 ml-4">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative p-2.5 rounded-xl hover:bg-cream transition-colors"
          >
            <Bell className="h-5 w-5 text-brown-light" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-white" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-cream-dark z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-cream-dark bg-cream/30">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-bold text-brown-dark">Notifications</p>
                  <button className="text-[11px] text-gold font-semibold hover:underline">Mark all read</button>
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-cream/30 border-b border-cream-dark/50 cursor-pointer">
                  <p className="text-[12px] font-medium text-brown-dark">New registration: Mary Johnson</p>
                  <p className="text-[11px] text-brown-light/50 mt-0.5">2 minutes ago</p>
                </div>
                <div className="px-4 py-3 hover:bg-cream/30 border-b border-cream-dark/50 cursor-pointer">
                  <p className="text-[12px] font-medium text-brown-dark">Referral approved for HBC000003</p>
                  <p className="text-[11px] text-brown-light/50 mt-0.5">15 minutes ago</p>
                </div>
                <div className="px-4 py-3 hover:bg-cream/30 cursor-pointer">
                  <p className="text-[12px] font-medium text-brown-dark">3 pending verifications</p>
                  <p className="text-[11px] text-brown-light/50 mt-0.5">1 hour ago</p>
                </div>
              </div>
              <div className="px-4 py-2.5 border-t border-cream-dark bg-cream/20">
                <button className="text-[12px] text-gold font-semibold hover:underline w-full text-center">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-cream-dark mx-1" />

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-cream transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
              A
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[13px] font-semibold text-brown-dark leading-tight">Admin</p>
              <p className="text-[11px] text-brown-light/50 leading-tight">Administrator</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-brown-light/40" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-cream-dark py-1.5 z-50">
              <div className="px-4 py-3 border-b border-cream-dark">
                <p className="text-[13px] font-bold text-brown-dark">Admin User</p>
                <p className="text-[11px] text-brown-light/50">admin@heartsbycharming.org</p>
              </div>
              <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-brown-light hover:bg-cream/50 transition-colors">
                <Bell className="h-4 w-4" />
                Notification Settings
              </button>
              <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-brown-light hover:bg-cream/50 transition-colors">
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
              <div className="border-t border-cream-dark mt-1 pt-1">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-error hover:bg-error/5 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
