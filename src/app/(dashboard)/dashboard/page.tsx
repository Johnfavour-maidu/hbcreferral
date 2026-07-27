"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Users,
  CheckCircle,
  Clock,
  Trophy,
  Copy,
  Share2,
  Hash,
  ArrowRight,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

interface DashboardData {
  profile: {
    fullName: string;
    participantId: string;
    referralCode: string;
    referralLink: string;
    totalReferrals: number;
    verifiedReferrals: number;
    pendingReferrals: number;
  };
  leaderboardPosition: number | null;
  totalParticipants: number;
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13.2a8.16 8.16 0 005.58 2.18v-3.45a4.85 4.85 0 01-3.58-1.59V6.69h3.58z" />
    </svg>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState<
    { id: string; fullName: string; instagram: string; status: string; createdAt: string }[]
  >([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [refPage, setRefPage] = useState(1);
  const REF_PER_PAGE = 10;

  useEffect(() => {
    if (session && (session.user.role === "ADMIN" || session.user.role === "MODERATOR")) {
      window.location.href = "/admin";
      return;
    }
  }, [session]);

  useEffect(() => {
    if (session && (session.user.role === "ADMIN" || session.user.role === "MODERATOR")) return;
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));

    fetch("/api/referrals")
      .then((r) => r.json())
      .then((d) => setReferrals(d.referrals || []))
      .catch(console.error);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-[3px] border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || (session && (session.user.role === "ADMIN" || session.user.role === "MODERATOR"))) {
    return null;
  }

  const { profile } = data;
  const firstName = profile.fullName.split(" ")[0];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const socials = [
    {
      name: "Instagram",
      icon: InstagramIcon,
      href: "https://www.instagram.com/heartsbycharming_?igsh=MWRtbjlzeGZtNGI5MA%3D%3D&utm_source=qr",
      bg: "bg-gradient-to-br from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]",
      hoverShadow: "hover:shadow-[0_8px_24px_rgba(225,48,108,0.3)]",
    },
    {
      name: "Facebook",
      icon: FacebookIcon,
      href: "https://www.facebook.com/share/195h1uZfnZ/?mibextid=wwXIfr",
      bg: "bg-[#1877F2]",
      hoverShadow: "hover:shadow-[0_8px_24px_rgba(24,119,242,0.3)]",
    },
    {
      name: "TikTok",
      icon: TikTokIcon,
      href: "https://www.tiktok.com/@hbc_teens?_r=1&_t=ZS-98DgJMe73Nl",
      bg: "bg-[#010101]",
      hoverShadow: "hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]",
    },
  ];

  return (
    <div
      style={{
        maxWidth: 1200,
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: 32,
        paddingRight: 32,
        paddingTop: 40,
        paddingBottom: 48,
      }}
    >
      {/* ─── Header ─── */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: "#2D2118",
            lineHeight: 1.2,
          }}
        >
          Hello, {firstName} 👋
        </h1>
        <p style={{ color: "#7B5B43", fontSize: 14, marginTop: 6 }}>
          Welcome to your Hearts by Charming Referral Dashboard
        </p>
        <div style={{ marginTop: 12 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(200,154,43,0.1)",
              color: "#B88A22",
              fontSize: 12,
              fontWeight: 600,
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px solid rgba(200,154,43,0.2)",
            }}
          >
            <Hash style={{ width: 12, height: 12 }} />
            {profile.participantId}
          </span>
        </div>
      </div>

      {/* ─── Stat Cards ─── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 40,
        }}
      >
        {[
          {
            label: "Total Referrals",
            value: profile.totalReferrals,
            sub: "Total invited participants",
            icon: Users,
            iconBg: "rgba(200,154,43,0.1)",
            iconColor: "#C89A2B",
          },
          {
            label: "Verified",
            value: profile.verifiedReferrals,
            sub: "Confirmed referrals",
            icon: CheckCircle,
            iconBg: "rgba(59,165,92,0.1)",
            iconColor: "#3BA55C",
          },
          {
            label: "Pending",
            value: profile.pendingReferrals,
            sub: "Awaiting verification",
            icon: Clock,
            iconBg: "rgba(245,158,11,0.1)",
            iconColor: "#F59E0B",
          },
          {
            label: "Leaderboard",
            value: data.leaderboardPosition != null ? `#${data.leaderboardPosition}` : "-",
            sub: "Your current rank",
            icon: Trophy,
            iconBg: "rgba(139,92,246,0.1)",
            iconColor: "#8B5CF6",
          },
        ].map((stat) => (
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
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: stat.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <stat.icon style={{ width: 20, height: 20, color: stat.iconColor }} strokeWidth={2} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 11, color: "#7B5B43", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
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

      {/* ─── Referral Link Card ─── */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #E7D8C6",
          overflow: "hidden",
          marginBottom: 40,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ height: 2, background: "linear-gradient(to right, rgba(200,154,43,0.4), #C89A2B, rgba(200,154,43,0.4))" }} />
        <div style={{ padding: "28px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(200,154,43,0.1)",
                border: "1px solid rgba(200,154,43,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Share2 style={{ width: 18, height: 18, color: "#C89A2B" }} />
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#2D2118", margin: 0 }}>Your Referral Link</h2>
              <p style={{ fontSize: 12, color: "#999", marginTop: 2, marginBottom: 0 }}>Share this link to invite participants</p>
            </div>
          </div>

          {/* Link Input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              background: "#FCF8F3",
              borderRadius: 12,
              border: "1px solid #E7D8C6",
              marginBottom: 12,
            }}
          >
            <code
              style={{
                flex: 1,
                fontSize: 13,
                color: "#4A2E1F",
                fontFamily: "monospace",
                wordBreak: "break-all",
                userSelect: "all",
              }}
            >
              {profile.referralLink.toLowerCase()}
            </code>
            <button
              onClick={() => copyToClipboard(profile.referralLink)}
              style={{
                flexShrink: 0,
                width: 40,
                height: 40,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: copied ? "rgba(59,165,92,0.1)" : "rgba(200,154,43,0.1)",
                color: copied ? "#3BA55C" : "#C89A2B",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Copy style={{ width: 16, height: 16 }} />
            </button>
          </div>

        </div>
      </div>

      {/* ─── Referral History Card ─── */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #E7D8C6",
          overflow: "hidden",
          marginBottom: 40,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ height: 2, background: "linear-gradient(to right, rgba(200,154,43,0.4), #C89A2B, rgba(200,154,43,0.4))" }} />
        <button
          onClick={() => setHistoryOpen(!historyOpen)}
          style={{
            width: "100%",
            padding: "28px 32px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(200,154,43,0.1)",
              border: "1px solid rgba(200,154,43,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Clock style={{ width: 18, height: 18, color: "#C89A2B" }} />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#2D2118", margin: 0 }}>Referral History</h2>
            <p style={{ fontSize: 12, color: "#999", marginTop: 2, marginBottom: 0 }}>Track every participant who joined using your referral link.</p>
          </div>
          <ChevronDown
            style={{
              width: 20,
              height: 20,
              color: "#999",
              transition: "transform 0.2s",
              transform: historyOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>

        {historyOpen && (
          <div style={{ padding: "0 32px 28px" }}>

          {/* Table or Empty */}
          {referrals.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <Users style={{ width: 48, height: 48, color: "#C8A960", marginBottom: 16 }} strokeWidth={1.2} />
              <p style={{ fontSize: 15, fontWeight: 600, color: "#2D2118", marginBottom: 4 }}>No referrals yet.</p>
              <p style={{ fontSize: 13, color: "#999" }}>Share your referral link to start inviting friends.</p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="referral-mobile-cards" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {referrals
                  .slice((refPage - 1) * REF_PER_PAGE, refPage * REF_PER_PAGE)
                  .map((ref) => (
                    <div key={ref.id} style={{ background: "#FCF8F3", borderRadius: 12, border: "1px solid #F0E6D6", padding: "14px 16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#2D2118" }}>{ref.instagram}</span>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 10px",
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 600,
                            background: ref.status === "PENDING" ? "rgba(245,158,11,0.1)" : ref.status === "VERIFIED" ? "rgba(59,165,92,0.1)" : "rgba(239,68,68,0.1)",
                            color: ref.status === "PENDING" ? "#D97706" : ref.status === "VERIFIED" ? "#16A34A" : "#DC2626",
                          }}
                        >
                          {ref.status === "PENDING" ? "Pending" : ref.status === "VERIFIED" ? "Approved" : "Rejected"}
                        </span>
                      </div>
                      <span style={{ fontSize: 12, color: "#999" }}>
                        {new Date(ref.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}{" • "}{new Date(ref.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #F0E6D6" }}>Instagram</th>
                      <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #F0E6D6" }}>Date & Time</th>
                      <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #F0E6D6" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals
                      .slice((refPage - 1) * REF_PER_PAGE, refPage * REF_PER_PAGE)
                      .map((ref) => (
                        <tr key={ref.id} style={{ borderBottom: "1px solid #F8F2EA" }}>
                          <td style={{ padding: "12px", color: "#2D2118", fontWeight: 500 }}>{ref.instagram}</td>
                          <td style={{ padding: "12px", color: "#7B5B43" }}>
                            {new Date(ref.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}{" • "}{new Date(ref.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                          </td>
                          <td style={{ padding: "12px" }}>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "4px 12px",
                                borderRadius: 999,
                                fontSize: 12,
                                fontWeight: 600,
                                background: ref.status === "PENDING" ? "rgba(245,158,11,0.1)" : ref.status === "VERIFIED" ? "rgba(59,165,92,0.1)" : "rgba(239,68,68,0.1)",
                                color: ref.status === "PENDING" ? "#D97706" : ref.status === "VERIFIED" ? "#16A34A" : "#DC2626",
                              }}
                            >
                              {ref.status === "PENDING" ? "Pending" : ref.status === "VERIFIED" ? "Approved" : "Rejected"}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {(() => {
                const totalPages = Math.ceil(referrals.length / REF_PER_PAGE);
                if (totalPages <= 1) return null;
                return (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 20 }}>
                    <button
                      onClick={() => setRefPage((p) => Math.max(1, p - 1))}
                      disabled={refPage === 1}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        border: "1px solid #E7D8C6",
                        background: refPage === 1 ? "#F7F3EC" : "#fff",
                        color: refPage === 1 ? "#ccc" : "#4A2E1F",
                        cursor: refPage === 1 ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ChevronLeft style={{ width: 16, height: 16 }} />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (refPage <= 3) {
                        pageNum = i + 1;
                      } else if (refPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = refPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setRefPage(pageNum)}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            border: refPage === pageNum ? "2px solid #C89A2B" : "1px solid #E7D8C6",
                            background: refPage === pageNum ? "rgba(200,154,43,0.1)" : "#fff",
                            color: refPage === pageNum ? "#C89A2B" : "#4A2E1F",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 13,
                            fontWeight: refPage === pageNum ? 700 : 500,
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setRefPage((p) => Math.min(totalPages, p + 1))}
                      disabled={refPage === totalPages}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        border: "1px solid #E7D8C6",
                        background: refPage === totalPages ? "#F7F3EC" : "#fff",
                        color: refPage === totalPages ? "#ccc" : "#4A2E1F",
                        cursor: refPage === totalPages ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ChevronRight style={{ width: 16, height: 16 }} />
                    </button>
                  </div>
                );
              })()}
            </>
          )}
          </div>
        )}
      </div>

      {/* ─── Leaderboard Card ─── */}
      <style>{`
        @media (max-width: 640px) {
          .leaderboard-card-flex { justify-content: center !important; }
          .leaderboard-card-btn { margin-left: auto !important; margin-right: auto !important; }
        }
        @media (min-width: 768px) {
          .referral-mobile-cards { display: none !important; }
        }
      `}</style>
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "2px solid #C89A2B",
          overflow: "hidden",
          marginBottom: 40,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="leaderboard-card-flex"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "24px 28px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "rgba(200,154,43,0.1)",
              border: "1px solid rgba(200,154,43,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Trophy style={{ width: 28, height: 28, color: "#C89A2B" }} strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#2D2118", margin: 0 }}>Leaderboard</h3>
            <p style={{ fontSize: 14, color: "#7B5B43", marginTop: 4, marginBottom: 0 }}>
              See where you rank among all participants and track your progress.
            </p>
          </div>
          <Link
            href="/leaderboard"
            className="leaderboard-card-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              height: 48,
              padding: "0 28px",
              borderRadius: 16,
              background: "#C89A2B",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(200,154,43,0.25)",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            <Trophy style={{ width: 16, height: 16 }} />
            View Leaderboard
            <ArrowRight style={{ width: 16, height: 16 }} />
          </Link>
        </div>
      </div>

      {/* ─── Follow Hearts by Charming ─── */}
      <div
        className="brown-gradient"
        style={{
          borderRadius: 24,
          overflow: "hidden",
          marginBottom: 40,
        }}
      >
        <div style={{ padding: "48px 32px", textAlign: "center" }}>
          <h2
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#FFF8EF",
              lineHeight: 1.2,
              marginBottom: 16,
            }}
          >
            Follow Hearts by Charming
          </h2>
          <p
            style={{
              color: "rgba(255,248,239,0.6)",
              fontSize: 16,
              lineHeight: 1.7,
              maxWidth: 580,
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: 32,
            }}
          >
            Stay connected with Hearts by Charming for inspiring content and community highlights.
            Follow us and never miss an update.
          </p>

          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${s.bg} ${s.hoverShadow}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  height: 52,
                  minWidth: 170,
                  width: "100%",
                  maxWidth: 170,
                  borderRadius: 16,
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 15,
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                  transition: "all 0.25s",
                }}
              >
                <s.icon className="w-5 h-5" />
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Responsive Overrides ─── */}
      <style>{`
        @media (max-width: 1024px) {
          div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          div[style*="grid-template-columns: repeat(4"],
          div[style*="grid-template-columns: repeat(2"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
