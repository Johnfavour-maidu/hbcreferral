"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trophy } from "lucide-react";

export function AnnouncementBar() {
  const [stats, setStats] = useState({ participants: 0, verified: 0 });

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((d) => {
        setStats({
          participants: d.leaderboard?.length || 500,
          verified: d.leaderboard?.reduce((a: number, e: any) => a + (e.verifiedReferrals || 0), 0) || 1800,
        });
      })
      .catch(() => setStats({ participants: 500, verified: 1800 }));
  }, []);

  return (
    <div className="bg-brown text-cream/80 text-[13px]">
      <div
        className="h-10 flex items-center justify-center gap-2 sm:gap-6 overflow-hidden"
        style={{ maxWidth: 1280, margin: "0 auto", paddingLeft: 32, paddingRight: 32 }}
      >
        <span className="hidden sm:inline whitespace-nowrap">📅 Campaign: 1st–31st August 2026</span>
        <span className="sm:hidden whitespace-nowrap">📅 Aug 1–31, 2026</span>
        <span className="text-gold/60">|</span>
        <span className="whitespace-nowrap">👥 {stats.participants.toLocaleString()}+ Participants</span>
        <span className="text-gold/60">|</span>
        <span className="whitespace-nowrap">🔥 {stats.verified.toLocaleString()}+ Verified</span>
        <Link
          href="/leaderboard"
          className="hidden md:inline-flex items-center gap-1.5 text-gold hover:text-gold-light font-medium transition-colors whitespace-nowrap ml-2"
        >
          <Trophy className="h-3.5 w-3.5" />
          View Leaderboard
        </Link>
      </div>
    </div>
  );
}
