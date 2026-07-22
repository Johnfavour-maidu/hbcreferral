"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Trophy, Crown, Medal, Search, ChevronLeft, ChevronRight, Users, CheckCircle, Clock } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  fullName: string;
  instagram: string;
  participantId: string;
  totalReferrals: number;
  verifiedReferrals: number;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  totalParticipants: number;
  lastUpdated: string;
}

const PAGE_SIZE = 20;

function formatDate(iso: string) {
  const d = new Date(iso);
  const day = d.getDate();
  const month = d.toLocaleString("en-NG", { month: "long" });
  const year = d.getFullYear();
  const time = d.toLocaleString("en-NG", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${day} ${month} ${year} • ${time}`;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function PodiumCard({ entry, color, iconBg, borderColor, glowColor, medal, order }: {
  entry: LeaderboardEntry;
  color: string;
  iconBg: string;
  borderColor: string;
  glowColor: string;
  medal: string;
  order: number;
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 20,
        border: `2px solid ${borderColor}`,
        padding: "28px 24px",
        textAlign: "center",
        position: "relative",
        boxShadow: `0 4px 24px ${glowColor}`,
        transition: "all 0.3s",
        order,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 8px 32px ${glowColor}`; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 4px 24px ${glowColor}`; }}
    >
      <div style={{
        position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)",
        width: 48, height: 48, borderRadius: 24, background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        border: `2px solid ${borderColor}`, fontSize: 22,
      }}>
        {medal}
      </div>

      <div style={{ marginTop: 24, marginBottom: 16 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 32, background: iconBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto", border: `2px solid ${borderColor}`,
          fontSize: 24, fontWeight: 800, color,
        }}>
          {getInitials(entry.fullName)}
        </div>
      </div>

      <p style={{ fontSize: 17, fontWeight: 700, color: "#2D2118", margin: 0, marginBottom: 4 }}>
        {entry.fullName}
      </p>
      <p style={{ fontSize: 13, color: "#7B5B43", margin: 0, marginBottom: 12 }}>
        @{entry.instagram}
      </p>

      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: iconBg, color, padding: "6px 14px",
        borderRadius: 20, fontSize: 14, fontWeight: 700, marginBottom: 12,
      }}>
        <CheckCircle style={{ width: 14, height: 14 }} />
        {entry.verifiedReferrals} Verified
      </div>

      <p style={{ fontSize: 12, color: "#A08060", margin: 0 }}>
        Prize: <span style={{ fontWeight: 700, color }}>
          {entry.rank === 1 ? "₦20,000" : entry.rank === 2 ? "₦15,000" : "₦10,000"}
        </span>
      </p>
    </div>
  );
}

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const entries = data?.leaderboard || [];
  const totalParticipants = data?.totalParticipants || 0;
  const lastUpdated = data?.lastUpdated || "";
  const totalVerified = entries.reduce((sum, e) => sum + e.verifiedReferrals, 0);

  const filtered = useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter(
      (e) =>
        e.fullName.toLowerCase().includes(q) ||
        e.instagram.toLowerCase().includes(q) ||
        e.participantId.toLowerCase().includes(q)
    );
  }, [entries, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search]);

  const currentUserId = (session?.user as any)?.id || "";
  const podium = entries.slice(0, 3);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #F0EBE3", borderTopColor: "#C89A2B", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  const hasPodium = podium.length >= 3;

  const gold = hasPodium ? podium.find((e) => e.rank === 1) : null;
  const silver = hasPodium ? podium.find((e) => e.rank === 2) : null;
  const bronze = hasPodium ? podium.find((e) => e.rank === 3) : null;

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", paddingLeft: 32, paddingRight: 32, paddingTop: 48, paddingBottom: 64 }}>
      {/* ─── Header ─── */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20, background: "#FEF3C7",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", border: "2px solid #FDE68A",
        }}>
          <Trophy style={{ width: 32, height: 32, color: "#D97706" }} />
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#2D2118", margin: "0 0 8px" }}>
          Leaderboard
        </h1>
        <p style={{ fontSize: 16, color: "#7B5B43", margin: "0 0 28px" }}>
          See where participants rank based on verified referrals.
        </p>

        <div style={{
          display: "inline-flex", flexWrap: "wrap", justifyContent: "center", gap: 24,
          background: "white", borderRadius: 16, padding: "16px 32px",
          border: "1.5px solid #E7D8C6",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Users style={{ width: 16, height: 16, color: "#C89A2B" }} />
            <span style={{ fontSize: 13, color: "#7B5B43" }}>Total Participants: </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#2D2118" }}>{totalParticipants.toLocaleString()}</span>
          </div>
          <div style={{ width: 1, height: 20, background: "#E7D8C6", alignSelf: "center" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle style={{ width: 16, height: 16, color: "#16A34A" }} />
            <span style={{ fontSize: 13, color: "#7B5B43" }}>Verified Referrals: </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#2D2118" }}>{totalVerified.toLocaleString()}</span>
          </div>
          <div style={{ width: 1, height: 20, background: "#E7D8C6", alignSelf: "center" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Clock style={{ width: 16, height: 16, color: "#7B5B43" }} />
            <span style={{ fontSize: 13, color: "#7B5B43" }}>Last Updated: </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#2D2118" }}>{formatDate(lastUpdated)}</span>
          </div>
        </div>
      </div>

      {/* ─── Top 3 Podium ─── */}
      {hasPodium && gold && silver && bronze && (
        <div style={{ marginBottom: 48 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            alignItems: "start",
          }}>
            <style>{`
              @media (max-width: 900px) {
                .podium-grid { grid-template-columns: 1fr !important; }
              }
            `}</style>
            <div className="podium-grid" style={{ display: "contents" }}>
              <PodiumCard
                entry={silver}
                color="#7B5B43"
                iconBg="#F0EBE3"
                borderColor="#D6C8B8"
                glowColor="rgba(123,91,67,0.08)"
                medal="🥈"
                order={1}
              />
              <PodiumCard
                entry={gold}
                color="#D97706"
                iconBg="#FEF3C7"
                borderColor="#FDE68A"
                glowColor="rgba(217,119,6,0.12)"
                medal="🥇"
                order={2}
              />
              <PodiumCard
                entry={bronze}
                color="#DC2626"
                iconBg="#FEE2E2"
                borderColor="#FECACA"
                glowColor="rgba(220,38,38,0.08)"
                medal="🥉"
                order={3}
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── Search ─── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          position: "relative", maxWidth: 480,
        }}>
          <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "#A08060", pointerEvents: "none" }} />
          <input
            placeholder="Search by name, username, or participant ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "12px 16px 12px 44px",
              borderRadius: 14, border: "1.5px solid #E7D8C6",
              fontSize: 14, color: "#2D2118", background: "white",
              outline: "none", boxSizing: "border-box",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          />
        </div>
      </div>

      {/* ─── Table ─── */}
      <div style={{
        background: "white", borderRadius: 20, border: "1.5px solid #E7D8C6",
        overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        {filtered.length > 0 ? (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #F0EBE3" }}>
                    {["Rank", "Full Name", "Username", "Participant ID", "Verified Referrals"].map((h) => (
                      <th key={h} style={{
                        padding: "14px 20px", fontSize: 11, fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.05em",
                        color: "#A08060", textAlign: h === "Rank" || h === "Verified Referrals" ? "center" : "left",
                        position: "sticky", top: 0, background: "white", zIndex: 1,
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((entry) => {
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
                        onMouseLeave={(e) => { if (!isCurrentUser) e.currentTarget.style.background = "transparent"; }}
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
                              {getInitials(entry.fullName)}
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
                          @{entry.instagram}
                        </td>
                        <td style={{ padding: "14px 20px", fontSize: 12, fontFamily: "monospace", color: "#A08060" }}>
                          {entry.participantId}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 20px", borderTop: "1.5px solid #F0EBE3",
              }}>
                <span style={{ fontSize: 13, color: "#7B5B43" }}>
                  Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{
                      width: 36, height: 36, borderRadius: 10,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "1.5px solid #E7D8C6", background: "white",
                      cursor: page === 1 ? "not-allowed" : "pointer",
                      opacity: page === 1 ? 0.4 : 1, transition: "all 0.2s",
                    }}
                  >
                    <ChevronLeft style={{ width: 16, height: 16, color: "#4A2E1F" }} />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        style={{
                          width: 36, height: 36, borderRadius: 10,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          border: page === pageNum ? "1.5px solid #C89A2B" : "1.5px solid #E7D8C6",
                          background: page === pageNum ? "#C89A2B" : "white",
                          color: page === pageNum ? "white" : "#4A2E1F",
                          fontSize: 13, fontWeight: 600, cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={{
                      width: 36, height: 36, borderRadius: 10,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "1.5px solid #E7D8C6", background: "white",
                      cursor: page === totalPages ? "not-allowed" : "pointer",
                      opacity: page === totalPages ? 0.4 : 1, transition: "all 0.2s",
                    }}
                  >
                    <ChevronRight style={{ width: 16, height: 16, color: "#4A2E1F" }} />
                  </button>
                </div>
              </div>
            )}
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
