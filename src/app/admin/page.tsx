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
  Search,
  Check,
  X,
  Trash2,
  Inbox,
  RotateCcw,
  Ban,
} from "lucide-react";
import { toast } from "sonner";

interface Stats {
  totalParticipants: number;
  verifiedReferrals: number;
  pendingVerifications: number;
  rejectedReferrals: number;
  todayRegistrations: number;
  totalReferrals: number;
}

interface Participant {
  id: string;
  participantId: string;
  fullName: string;
  email: string;
  phone: string;
  instagram: string;
  state: string;
  referralCode: string;
  totalReferrals: number;
  verifiedReferrals: number;
  isActive: boolean;
  participantStatus: string;
  createdAt: string;
}

interface VerificationItem {
  id: string;
  referredInstagram: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [verifications, setVerifications] = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [participantSearch, setParticipantSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "participants" | "verification">("overview");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/participants").then((r) => r.json()),
      fetch("/api/admin/verify").then((r) => r.json()),
    ])
      .then(([statsData, participantsData, verificationsData]) => {
        setStats(statsData);
        setParticipants(participantsData.participants || []);
        setVerifications(verificationsData.verifications || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleVerify = async (id: string, action: "approve" | "reject") => {
    try {
      const res = await fetch("/api/admin/verify", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        setVerifications((prev) => prev.filter((v) => v.id !== id));
        if (action === "approve") {
          setStats((prev) => prev ? { ...prev, verifiedReferrals: prev.verifiedReferrals + 1, pendingVerifications: prev.pendingVerifications - 1 } : prev);
        } else {
          setStats((prev) => prev ? { ...prev, rejectedReferrals: prev.rejectedReferrals + 1, pendingVerifications: prev.pendingVerifications - 1 } : prev);
        }
        toast.success(action === "approve" ? "Referral approved!" : "Referral rejected");
      }
    } catch {
      toast.error("Failed to process");
    }
  };

  const handleReverse = async (id: string) => {
    const current = verifications.find((v) => v.id === id);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "reverse" }),
      });
      if (res.ok) {
        setVerifications((prev) => prev.map((v) => v.id === id ? { ...v, status: "PENDING" } : v));
        if (current?.status === "VERIFIED") {
          setStats((prev) => prev ? { ...prev, verifiedReferrals: prev.verifiedReferrals - 1, pendingVerifications: prev.pendingVerifications + 1 } : prev);
        } else if (current?.status === "REJECTED") {
          setStats((prev) => prev ? { ...prev, rejectedReferrals: prev.rejectedReferrals - 1, pendingVerifications: prev.pendingVerifications + 1 } : prev);
        }
        toast.success("Referral reversed to pending");
      }
    } catch {
      toast.error("Failed to reverse referral");
    }
  };

  const handleDeleteParticipant = async (id: string) => {
    if (!confirm("Move this participant to recycle bin?")) return;
    try {
      const res = await fetch("/api/admin/participants", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "softDelete" }),
      });
      if (res.ok) {
        setParticipants((prev) => prev.map((p) => p.id === id ? { ...p, isActive: false, participantStatus: "DELETED" } : p));
        toast.success("Participant moved to recycle bin");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete participant");
      }
    } catch {
      toast.error("Failed to delete participant");
    }
  };

  const handleSuspendParticipant = async (id: string) => {
    if (!confirm("Suspend this participant?")) return;
    try {
      const res = await fetch("/api/admin/participants", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "suspend" }),
      });
      if (res.ok) {
        setParticipants((prev) => prev.map((p) => p.id === id ? { ...p, isActive: false, participantStatus: "SUSPENDED" } : p));
        toast.success("Participant suspended");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to suspend participant");
      }
    } catch {
      toast.error("Failed to suspend participant");
    }
  };

  const filteredParticipants = participants.filter((p) => {
    if (!participantSearch.trim()) return true;
    const q = participantSearch.toLowerCase();
    return p.fullName.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.instagram.toLowerCase().includes(q) || p.participantId.toLowerCase().includes(q);
  });

  const pendingVerifications = verifications.filter((v) => v.status === "PENDING");

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
    { icon: Users, label: "Total Participants", value: stats.totalParticipants, sub: `${stats.todayRegistrations} new today`, iconBg: "#FEF3C7", iconColor: "#D97706" },
    { icon: CheckCircle, label: "Verified Referrals", value: stats.verifiedReferrals, sub: "Confirmed referrals", iconBg: "#DCFCE7", iconColor: "#16A34A" },
    { icon: Clock, label: "Pending", value: stats.pendingVerifications, sub: "Awaiting review", iconBg: "#FEF3C7", iconColor: "#D97706" },
    { icon: XCircle, label: "Rejected", value: stats.rejectedReferrals, sub: "Declined referrals", iconBg: "#FEE2E2", iconColor: "#DC2626" },
  ];

  const quickActions = [
    { icon: Trophy, label: "View Leaderboard", href: "/admin/leaderboard", color: "#D97706", bg: "#FEF3C7" },
    { icon: Inbox, label: "Recycle Bin", href: "/admin/recycle-bin", color: "#DC2626", bg: "#FEE2E2" },
    { icon: Download, label: "Export Data", href: "/admin/exports", color: "#7B5B43", bg: "#F0EBE3" },
  ];

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "participants", label: `Participants (${participants.length})` },
    { key: "verification", label: `Verification (${pendingVerifications.length})` },
  ] as const;

  return (
    <>
      <style>{`
        .admin-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .admin-actions-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        @media (max-width: 1024px) { .admin-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .admin-grid { grid-template-columns: 1fr; } }
        @media (max-width: 768px) { .admin-actions-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div style={{ maxWidth: 1280, margin: "0 auto", paddingLeft: 32, paddingRight: 32, paddingTop: 32, paddingBottom: 48 }}>
        {/* ─── Header ─── */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: "#2D2118", lineHeight: 1.2, margin: 0 }}>
            Hello, {firstName} 👋
          </h1>
          <p style={{ color: "#7B5B43", fontSize: 14, marginTop: 8, marginBottom: 0 }}>
            Welcome to your Admin Dashboard
          </p>
        </div>

        {/* ─── Tabs ─── */}
        <div style={{ display: "flex", gap: 4, marginBottom: 40, background: "white", borderRadius: 14, padding: 4, border: "1.5px solid #E7D8C6", width: "fit-content" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                cursor: "pointer", border: "none", transition: "all 0.2s",
                background: activeTab === tab.key ? "#C89A2B" : "transparent",
                color: activeTab === tab.key ? "white" : "#7B5B43",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Overview Tab ─── */}
        {activeTab === "overview" && (
          <>
            {/* Stat Cards */}
            <div className="admin-grid" style={{ marginBottom: 40 }}>
              {statCards.map((stat) => (
                <div key={stat.label} style={{
                  background: "#fff", borderRadius: 16, border: "2px solid #C89A2B",
                  padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: stat.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <stat.icon style={{ width: 22, height: 22, color: stat.iconColor }} strokeWidth={2} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 11, color: "#7B5B43", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em", margin: 0 }}>{stat.label}</p>
                      <p style={{ fontSize: 28, fontWeight: 800, color: stat.iconColor, lineHeight: 1, marginTop: 4, marginBottom: 0 }}>{stat.value.toLocaleString()}</p>
                      <p style={{ fontSize: 11, color: "#999", marginTop: 6, marginBottom: 0 }}>{stat.sub}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#2D2118", margin: "0 0 16px" }}>Quick Actions</h2>
              <div className="admin-actions-grid">
                {quickActions.map((action) => (
                  <Link key={action.label} href={action.href} style={{
                    display: "flex", alignItems: "center", gap: 14, background: "white",
                    borderRadius: 16, border: "1.5px solid #E7D8C6", padding: "20px 24px",
                    textDecoration: "none", transition: "all 0.2s",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C89A2B"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(200,154,43,0.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E7D8C6"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: action.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <action.icon style={{ width: 22, height: 22, color: action.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 15, fontWeight: 600, color: "#2D2118", margin: 0 }}>{action.label}</p>
                    </div>
                    <ArrowRight style={{ width: 18, height: 18, color: "#A08060" }} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Pending Verifications */}
            {pendingVerifications.length > 0 && (
              <div style={{ background: "white", borderRadius: 20, border: "1.5px solid #E7D8C6", overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: "1.5px solid #F0EBE3", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Clock style={{ width: 18, height: 18, color: "#D97706" }} />
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#2D2118", margin: 0 }}>Pending Verifications</h3>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#D97706", background: "#FEF3C7", padding: "4px 12px", borderRadius: 20 }}>{pendingVerifications.length}</span>
                </div>
                <div style={{ padding: "8px 24px" }}>
                  {pendingVerifications.slice(0, 5).map((v) => (
                    <div key={v.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid #F0EBE3" }}>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#2D2118", margin: 0 }}>@{v.referredInstagram?.replace("@", "") || "unknown"}</p>
                        <p style={{ fontSize: 12, color: "#A08060", margin: "4px 0 0" }}>{new Date(v.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => handleVerify(v.id, "approve")} style={{ width: 36, height: 36, borderRadius: 10, border: "none", background: "#DCFCE7", color: "#16A34A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Check style={{ width: 16, height: 16 }} />
                        </button>
                        <button onClick={() => handleVerify(v.id, "reject")} style={{ width: 36, height: 36, borderRadius: 10, border: "none", background: "#FEE2E2", color: "#DC2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <X style={{ width: 16, height: 16 }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ─── Participants Tab ─── */}
        {activeTab === "participants" && (
          <div style={{ background: "white", borderRadius: 20, border: "1.5px solid #E7D8C6", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1.5px solid #F0EBE3" }}>
              <div style={{ position: "relative", maxWidth: 400 }}>
                <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#A08060", pointerEvents: "none" }} />
                <input
                  placeholder="Search by name, email, Instagram, or ID..."
                  value={participantSearch}
                  onChange={(e) => setParticipantSearch(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px 10px 38px", borderRadius: 10,
                    border: "1.5px solid #E7D8C6", fontSize: 13, color: "#2D2118",
                    background: "#FFF8EF", outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #F0EBE3" }}>
                    {["ID", "Full Name", "Email", "Phone", "Instagram", "State", "Refs", "Verified", "Status", "Actions"].map((h) => (
                      <th key={h} style={{
                        padding: "14px 16px", fontSize: 11, fontWeight: 700,
                        textTransform: "uppercase" as const, letterSpacing: "0.05em",
                        color: "#A08060", textAlign: ["Refs", "Verified", "Status", "Actions"].includes(h) ? "center" : "left",
                        position: "sticky" as const, top: 0, background: "white",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipants.map((p) => (
                    <tr key={p.id} style={{ borderBottom: "1px solid #F0EBE3", transition: "background 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#FFF8EF"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <td style={{ padding: "14px 16px", fontSize: 12, fontFamily: "monospace", fontWeight: 600, color: "#C89A2B" }}>{p.participantId}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#2D2118" }}>{p.fullName}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#7B5B43" }}>{p.email}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#7B5B43" }}>{p.phone}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#7B5B43" }}>{p.instagram.replace(/^@+/, "")}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#7B5B43" }}>{p.state}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: "#C89A2B", textAlign: "center" }}>{p.totalReferrals}</td>
                      <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: "#DCFCE7", color: "#16A34A" }}>{p.verifiedReferrals}</span>
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: p.participantStatus === "ACTIVE" ? "#DCFCE7" : p.participantStatus === "SUSPENDED" ? "#FEF3C7" : "#FEE2E2", color: p.participantStatus === "ACTIVE" ? "#16A34A" : p.participantStatus === "SUSPENDED" ? "#D97706" : "#DC2626" }}>
                          {p.participantStatus}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          {p.participantStatus === "ACTIVE" && (
                            <button
                              onClick={() => handleSuspendParticipant(p.id)}
                              style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: "#FEF3C7", color: "#D97706", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                              title="Suspend participant"
                            >
                              <Ban style={{ width: 14, height: 14 }} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteParticipant(p.id)}
                            style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: "#FEE2E2", color: "#DC2626", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                            title="Delete participant"
                          >
                            <Trash2 style={{ width: 14, height: 14 }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredParticipants.length === 0 && (
                    <tr><td colSpan={11} style={{ padding: "48px 16px", textAlign: "center", color: "#A08060", fontSize: 13 }}>No participants found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── Verification Tab ─── */}
        {activeTab === "verification" && (
          <div style={{ background: "white", borderRadius: 20, border: "1.5px solid #E7D8C6", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1.5px solid #F0EBE3" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#2D2118", margin: 0 }}>All Verifications</h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #F0EBE3" }}>
                    {["Instagram", "Status", "Date", "Actions"].map((h) => (
                      <th key={h} style={{
                        padding: "14px 16px", fontSize: 11, fontWeight: 700,
                        textTransform: "uppercase" as const, letterSpacing: "0.05em",
                        color: "#A08060", textAlign: ["Actions", "Status"].includes(h) ? "center" : "left",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {verifications.map((v) => (
                    <tr key={v.id} style={{ borderBottom: "1px solid #F0EBE3", transition: "background 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#FFF8EF"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#7B5B43" }}>{v.referredInstagram.replace(/^@+/, "")}</td>
                      <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <span style={{
                          display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                          background: v.status === "PENDING" ? "#FEF3C7" : v.status === "VERIFIED" ? "#DCFCE7" : "#FEE2E2",
                          color: v.status === "PENDING" ? "#D97706" : v.status === "VERIFIED" ? "#16A34A" : "#DC2626",
                        }}>{v.status}</span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 12, color: "#A08060" }}>{new Date(v.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          {v.status === "PENDING" && (
                            <>
                              <button onClick={() => handleVerify(v.id, "approve")} style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: "#DCFCE7", color: "#16A34A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Check style={{ width: 14, height: 14 }} />
                              </button>
                              <button onClick={() => handleVerify(v.id, "reject")} style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: "#FEE2E2", color: "#DC2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <X style={{ width: 14, height: 14 }} />
                              </button>
                            </>
                          )}
                          {(v.status === "VERIFIED" || v.status === "REJECTED") && (
                            <button onClick={() => handleReverse(v.id)} title="Reverse to pending" style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: "#FEF3C7", color: "#D97706", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <RotateCcw style={{ width: 14, height: 14 }} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {verifications.length === 0 && (
                    <tr><td colSpan={4} style={{ padding: "48px 16px", textAlign: "center", color: "#A08060", fontSize: 13 }}>No verifications yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
