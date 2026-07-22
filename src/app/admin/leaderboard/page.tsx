"use client";

import { useEffect, useState } from "react";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { Trophy, Medal, Crown } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  fullName: string;
  totalReferrals: number;
  verifiedReferrals: number;
  state: string;
}

function getRankStyle(rank: number) {
  if (rank === 1) return { icon: Crown, bg: "#FEF3C7", color: "#D97706", border: "#FDE68A", badge: "Gold" };
  if (rank === 2) return { icon: Medal, bg: "#F0EBE3", color: "#7B5B43", border: "#E7D8C6", badge: "Silver" };
  if (rank === 3) return { icon: Medal, bg: "#FEE2E2", color: "#DC2626", border: "#FECACA", badge: "Bronze" };
  return { icon: null, bg: "#F9FAFB", color: "#6B7280", border: "#E5E7EB", badge: "—" };
}

export default function AdminLeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/leaderboard")
      .then((r) => r.json())
      .then((d) => setEntries(d.leaderboard || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #F0EBE3", borderTopColor: "#C89A2B", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  return (
    <PageWrapper>
      <FadeIn>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Trophy style={{ width: 20, height: 20, color: "#D97706" }} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#2D2118" }}>Leaderboard Management</h1>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div style={{
          background: "white", borderRadius: 20, border: "1.5px solid #E7D8C6",
          overflow: "hidden",
        }}>
          <div style={{ padding: "20px 24px", borderBottom: "1.5px solid #F0EBE3" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#2D2118" }}>All Rankings</h2>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #F0EBE3" }}>
                  {["Rank", "Name", "State", "Total", "Verified", "Tier"].map((h) => (
                    <th key={h} style={{
                      padding: "12px 16px", fontSize: 11, fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.05em",
                      color: "#A08060", textAlign: h === "Total" || h === "Verified" || h === "Tier" ? "center" : "left",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => {
                  const rankStyle = getRankStyle(e.rank);
                  return (
                    <tr key={e.rank} style={{ borderBottom: "1px solid #F0EBE3", transition: "background 0.15s" }}
                      onMouseEnter={(ev) => { ev.currentTarget.style.background = "#FFF8EF"; }}
                      onMouseLeave={(ev) => { ev.currentTarget.style.background = "transparent"; }}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: 10,
                            background: rankStyle.bg, color: rankStyle.color,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 13, fontWeight: 800,
                            border: `1.5px solid ${rankStyle.border}`,
                          }}>
                            #{e.rank}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#2D2118" }}>{e.fullName}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#7B5B43" }}>{e.state}</td>
                      <td style={{ padding: "14px 16px", textAlign: "center", fontSize: 14, fontWeight: 700, color: "#C89A2B" }}>{e.totalReferrals}</td>
                      <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <span style={{
                          display: "inline-block", padding: "3px 10px", borderRadius: 20,
                          fontSize: 12, fontWeight: 700,
                          background: "#DCFCE7", color: "#16A34A",
                        }}>
                          {e.verifiedReferrals}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <span style={{
                          display: "inline-block", padding: "3px 12px", borderRadius: 20,
                          fontSize: 11, fontWeight: 700,
                          background: rankStyle.bg, color: rankStyle.color,
                          border: `1px solid ${rankStyle.border}`,
                        }}>
                          {rankStyle.badge}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: "48px 16px", textAlign: "center", color: "#A08060", fontSize: 14 }}>
                      No leaderboard data yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </PageWrapper>
  );
}
