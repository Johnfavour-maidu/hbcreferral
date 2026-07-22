"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Trophy,
  ArrowRight,
  Download,
  Settings,
  Hash,
} from "lucide-react";

interface Stats {
  totalParticipants: number;
  verifiedReferrals: number;
  pendingVerifications: number;
  rejectedReferrals: number;
  todayRegistrations: number;
  totalReferrals: number;
  activeSchools: number;
  statesCovered: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #F0EBE3", borderTopColor: "#C89A2B", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0", color: "#7B5B43" }}>
        Failed to load dashboard data.
      </div>
    );
  }

  const firstName = session?.user?.name?.split(" ")[0] || "Admin";

  const statCards = [
    {
      icon: Users,
      label: "Total Participants",
      value: stats.totalParticipants,
      sub: `${stats.todayRegistrations} new today`,
      iconBg: "#FEF3C7",
      iconColor: "#D97706",
    },
    {
      icon: CheckCircle,
      label: "Verified Referrals",
      value: stats.verifiedReferrals,
      sub: "Confirmed referrals",
      iconBg: "#DCFCE7",
      iconColor: "#16A34A",
    },
    {
      icon: Clock,
      label: "Pending",
      value: stats.pendingVerifications,
      sub: "Awaiting review",
      iconBg: "#FEF3C7",
      iconColor: "#D97706",
    },
    {
      icon: XCircle,
      label: "Rejected",
      value: stats.rejectedReferrals,
      sub: "Declined referrals",
      iconBg: "#FEE2E2",
      iconColor: "#DC2626",
    },
  ];

  const quickActions = [
    { icon: CheckCircle, label: "Approve Referrals", href: "/admin/verification", color: "#16A34A", bg: "#DCFCE7" },
    { icon: Trophy, label: "View Leaderboard", href: "/admin/leaderboard", color: "#D97706", bg: "#FEF3C7" },
    { icon: Download, label: "Export Data", href: "/admin/exports", color: "#7B5B43", bg: "#F0EBE3" },
    { icon: Settings, label: "Campaign Settings", href: "/admin/campaign", color: "#C89A2B", bg: "#FEF3C7" },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      {/* ─── Header ─── */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 34, fontWeight: 800, color: "#2D2118", lineHeight: 1.2, margin: 0 }}>
          Hello, {firstName} 👋
        </h1>
        <p style={{ color: "#7B5B43", fontSize: 14, marginTop: 6, marginBottom: 0 }}>
          Welcome to your Admin Dashboard
        </p>
      </div>

      {/* ─── Stat Cards ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        <style>{`
          @media (max-width: 1024px) { .admin-stats { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 640px) { .admin-stats { grid-template-columns: 1fr !important; } }
        `}</style>
        <div className="admin-stats" style={{ display: "contents" }}>
          {statCards.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "2px solid #C89A2B",
                padding: "14px 14px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: stat.iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <stat.icon style={{ width: 20, height: 20, color: stat.iconColor }} strokeWidth={2} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 11, color: "#7B5B43", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em", margin: 0 }}>
                    {stat.label}
                  </p>
                  <p style={{ fontSize: 26, fontWeight: 800, color: stat.iconColor, lineHeight: 1, marginTop: 2, marginBottom: 0 }}>
                    {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                  </p>
                  <p style={{ fontSize: 11, color: "#999", marginTop: 4, marginBottom: 0 }}>
                    {stat.sub}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Quick Actions ─── */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#2D2118", margin: "0 0 16px" }}>Quick Actions</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          <style>{`
            @media (max-width: 768px) { .admin-actions { grid-template-columns: 1fr !important; } }
          `}</style>
          <div className="admin-actions" style={{ display: "contents" }}>
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: "white",
                  borderRadius: 16,
                  border: "1.5px solid #E7D8C6",
                  padding: "16px 20px",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C89A2B"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(200,154,43,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E7D8C6"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: action.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <action.icon style={{ width: 20, height: 20, color: action.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#2D2118", margin: 0 }}>{action.label}</p>
                </div>
                <ArrowRight style={{ width: 16, height: 16, color: "#A08060" }} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Summary Info ─── */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
      }}>
        <style>{`
          @media (max-width: 768px) { .admin-summary { grid-template-columns: 1fr !important; } }
        `}</style>
        <div className="admin-summary" style={{ display: "contents" }}>
          <div style={{ background: "white", borderRadius: 16, border: "1.5px solid #E7D8C6", padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users style={{ width: 16, height: 16, color: "#D97706" }} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#2D2118", margin: 0 }}>Active Schools</p>
            </div>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#2D2118", margin: 0 }}>{stats.activeSchools}</p>
          </div>

          <div style={{ background: "white", borderRadius: 16, border: "1.5px solid #E7D8C6", padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Hash style={{ width: 16, height: 16, color: "#16A34A" }} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#2D2118", margin: 0 }}>States Covered</p>
            </div>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#2D2118", margin: 0 }}>{stats.statesCovered}</p>
          </div>

          <div style={{ background: "white", borderRadius: 16, border: "1.5px solid #E7D8C6", padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F0EBE3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Trophy style={{ width: 16, height: 16, color: "#7B5B43" }} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#2D2118", margin: 0 }}>Total Referrals</p>
            </div>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#2D2118", margin: 0 }}>{stats.totalReferrals}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
