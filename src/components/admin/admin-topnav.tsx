"use client";

import { Bell, Search, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";

export function AdminTopNav() {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-cream-dark px-4 lg:px-6 flex items-center justify-between shrink-0 sticky top-0 z-40">
      {/* Search */}
      <div className="flex items-center gap-2 bg-cream rounded-xl px-4 py-2.5 w-full max-w-md">
        <Search className="h-4 w-4 text-brown-light/50 shrink-0" />
        <input
          type="text"
          placeholder="Search participants, referrals, schools..."
          className="bg-transparent text-sm text-brown-dark placeholder:text-brown-light/40 outline-none w-full"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 ml-4">
        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl hover:bg-cream transition-colors">
          <Bell className="h-5 w-5 text-brown-light" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold rounded-full" />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-cream transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center text-gold text-xs font-bold">
              A
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[13px] font-semibold text-brown-dark leading-tight">
                Admin
              </p>
              <p className="text-[11px] text-brown-light/60 leading-tight">
                Administrator
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-brown-light/50" />
          </button>

          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-cream-dark py-1.5 z-50">
                <div className="px-4 py-2 border-b border-cream-dark">
                  <p className="text-[13px] font-semibold text-brown-dark">
                    Admin
                  </p>
                  <p className="text-[11px] text-brown-light/60">
                    admin@heartsbycharming.org
                  </p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-brown-light hover:bg-cream transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
