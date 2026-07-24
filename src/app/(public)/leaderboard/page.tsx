"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Trophy, ArrowLeft, Users } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  fullName: string;
  instagram: string;
  participantId: string;
  verifiedReferrals: number;
}

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((d) => setEntries(d.leaderboard || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const currentUserId = (session?.user as any)?.id || "";

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #F0EBE3", borderTopColor: "#C89A2B", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", paddingLeft: 32, paddingRight: 32, paddingTop: 48, paddingBottom: 64 }}>
      <div style={{ marginBottom: 32 }}>
        <Link
          href={session ? "/dashboard" : "/"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 600,
            color: "#7B5B43",
            textDecoration: "none",
            padding: "8px 16px",
            borderRadius: 10,
            border: "1px solid #E7D8C6",
            background: "#fff",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C89A2B"; e.currentTarget.style.color = "#C89A2B"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E7D8C6"; e.currentTarget.style.color = "#7B5B43"; }}
        >
          <ArrowLeft style={{ width: 16, height: 16 }} />
          {session ? "Back to Dashboard" : "Back to Home"}
        </Link>
      </div>

      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20, background: "#FEF3C7",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", border: "2px solid #FDE68A",
        }}>
          <Trophy style={{ width: 32, height: 32, color: "#D97706" }} />
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#2D2118", margin: "0 0 8px" }}>
          Leaderboard
        </h1>
        <p style={{ fontSize: 15, color: "#7B5B43", margin: 0 }}>
          See where participants rank based on verified referrals.
        </p>
      </div>

      <div style={{
        background: "white", borderRadius: 20, border: "1.5px solid #E7D8C6",
        overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        {entries.length > 0 ? (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col">
              {entries.map((entry) => {
                const isCurrentUser = entry.userId === currentUserId;
                const rankBg = entry.rank === 1 ? "#FEF3C7" : entry.rank === 2 ? "#F0EBE3" : entry.rank === 3 ? "#FEE2E2" : "transparent";
                const rankColor = entry.rank === 1 ? "#D97706" : entry.rank === 2 ? "#7B5B43" : entry.rank === 3 ? "#DC2626" : "#7B5B43";

                return (
                  <div
                    key={entry.userId}
                    style={{
                      padding: "14px 18px",
                      borderBottom: "1px solid #F0EBE3",
                      background: isCurrentUser ? "rgba(200,154,43,0.06)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: rankBg, color: rankColor,
                      fontSize: 13, fontWeight: 800,
                      border: entry.rank <= 3 ? `1.5px solid ${rankColor}20` : "none",
                    }}>
                      {entry.rank <= 3 ? (entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉") : `#${entry.rank}`}
                    </span>
                    <div style={{
                      width: 36, height: 36, borderRadius: 18, flexShrink: 0,
                      background: isCurrentUser ? "#FEF3C7" : "#F0EBE3",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700,
                      color: isCurrentUser ? "#D97706" : "#7B5B43",
                    }}>
                      {entry.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#2D2118", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {entry.fullName}
                        {isCurrentUser && (
                          <span style={{ fontSize: 11, color: "#C89A2B", marginLeft: 6, fontWeight: 600 }}>(You)</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: "#999" }}>{entry.instagram}</div>
                    </div>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0,
                      background: "#DCFCE7", color: "#16A34A",
                      padding: "4px 10px", borderRadius: 20,
                      fontSize: 12, fontWeight: 700,
                    }}>
                      {entry.verifiedReferrals}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block" style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #F0EBE3" }}>
                  <th style={{
                    padding: "14px 20px", fontSize: 11, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.05em",
                    color: "#A08060", textAlign: "center", width: 60,
                  }}>
                    Rank
                  </th>
                  <th style={{
                    padding: "14px 20px", fontSize: 11, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.05em",
                    color: "#A08060", textAlign: "left",
                  }}>
                    Name
                  </th>
                  <th style={{
                    padding: "14px 20px", fontSize: 11, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.05em",
                    color: "#A08060", textAlign: "left",
                  }}>
                    Username
                  </th>
                  <th style={{
                    padding: "14px 20px", fontSize: 11, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.05em",
                    color: "#A08060", textAlign: "center",
                  }}>
                    Verified Referrals
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const isCurrentUser = entry.userId === currentUserId;
                  const rankBg = entry.rank === 1 ? "#FEF3C7" : entry.rank === 2 ? "#F0EBE3" : entry.rank === 3 ? "#FEE2E2" : "transparent";
                  const rankColor = entry.rank === 1 ? "#D97706" : entry.rank === 2 ? "#7B5B43" : entry.rank === 3 ? "#DC2626" : "#7B5B43";

                  return (
                    <tr
                      key={entry.userId}
                      style={{
                        borderBottom: "1px solid #F0EBE3",
                        background: isCurrentUser ? "rgba(200,154,43,0.06)" : "transparent",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => { if (!isCurrentUser) e.currentTarget.style.background = "#FFF8EF"; }}
                      onMouseLeave={(e) => { if (!isCurrentUser) e.currentTarget.style.background = isCurrentUser ? "rgba(200,154,43,0.06)" : "transparent"; }}
                    >
                      <td style={{ padding: "14px 20px", textAlign: "center" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: 36, height: 36, borderRadius: 10,
                          background: rankBg, color: rankColor,
                          fontSize: 13, fontWeight: 800,
                          border: entry.rank <= 3 ? `1.5px solid ${rankColor}20` : "none",
                        }}>
                          {entry.rank <= 3 ? (entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉") : `#${entry.rank}`}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 18,
                            background: isCurrentUser ? "#FEF3C7" : "#F0EBE3",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 12, fontWeight: 700,
                            color: isCurrentUser ? "#D97706" : "#7B5B43",
                            flexShrink: 0,
                          }}>
                            {entry.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 600, color: "#2D2118" }}>
                            {entry.fullName}
                            {isCurrentUser && (
                              <span style={{ fontSize: 11, color: "#C89A2B", marginLeft: 6, fontWeight: 600 }}>(You)</span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#7B5B43" }}>
                        {entry.instagram}
                      </td>
                      <td style={{ padding: "14px 20px", textAlign: "center" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          background: "#DCFCE7", color: "#16A34A",
                          padding: "4px 12px", borderRadius: 20,
                          fontSize: 13, fontWeight: 700,
                        }}>
                          {entry.verifiedReferrals}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </>
        ) : (
          <div style={{ padding: "64px 32px", textAlign: "center" }}>
            <div style={{
              width: 80, height: 80, borderRadius: 24, background: "#FEF3C7",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px", border: "2px solid #FDE68A",
            }}>
              <Trophy style={{ width: 40, height: 40, color: "#D97706" }} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#2D2118", margin: "0 0 8px" }}>
              Leaderboard Coming Soon
            </h3>
            <p style={{ fontSize: 14, color: "#7B5B43", maxWidth: 400, margin: "0 auto" }}>
              No verified referrals yet. Be the first participant to earn a verified referral and claim the top spot!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
