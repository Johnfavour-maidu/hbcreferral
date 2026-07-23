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
  Ban,
  Eye,
  Trash2,
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
  createdAt: string;
}

interface VerificationItem {
  id: string;
  referrerName: string;
  referredName: string;
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

  const handleDeleteParticipant = async (id: string) => {
    if (!confirm("Are you sure you want to delete this participant? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/participants?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setParticipants((prev) => prev.filter((p) => p.id !== id));
        setStats((prev) => prev ? { ...prev, totalParticipants: prev.totalParticipants - 1 } : prev);
        toast.success("Participant deleted successfully");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete participant");
      }
    } catch {
      toast.error("Failed to delete participant");
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
    { icon: Download, label: "Export Data", href: "/admin/exports", color: "#7B5B43", bg: "#F0EBE3" },
  ];

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "participants", label: `Participants (${participants.length})` },
    { key: "verification", label: `Verification (${pendingVerifications.length})` },
  ] as const;

  return (
    <div style={{ minHeight: "100vh", background: "#FFF8EF" }}>
      <div style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 32, paddingBottom: 48 }}>
      {/* ─── Header ─── */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 34, fontWeight: 800, color: "#2D2118", lineHeight: 1.2, margin: 0 }}>
          Hello, {firstName} 👋
        </h1>
        <p style={{ color: "#7B5B43", fontSize: 14, marginTop: 6, marginBottom: 0 }}>
          Welcome to your Admin Dashboard
        </p>
      </div>

      {/* ─── Tabs ─── */}
      <div style={{ display: "flex", gap: 4, marginBottom: 32, background: "white", borderRadius: 14, padding: 4, border: "1.5px solid #E7D8C6", width: "fit-content" }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
            <style>{`
              @media (max-width: 1024px) { .admin-stats { grid-template-columns: repeat(2, 1fr) !important; } }
              @media (max-width: 640px) { .admin-stats { grid-template-columns: 1fr !important; } }
            `}</style>
            <div className="admin-stats" style={{ display: "contents" }}>
              {statCards.map((stat) => (
                <div key={stat.label} style={{
                  background: "#fff", borderRadius: 16, border: "2px solid #C89A2B",
                  padding: "14px 14px", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: stat.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <stat.icon style={{ width: 20, height: 20, color: stat.iconColor }} strokeWidth={2} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 11, color: "#7B5B43", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em", margin: 0 }}>{stat.label}</p>
                      <p style={{ fontSize: 26, fontWeight: 800, color: stat.iconColor, lineHeight: 1, marginTop: 2, marginBottom: 0 }}>{stat.value.toLocaleString()}</p>
                      <p style={{ fontSize: 11, color: "#999", marginTop: 4, marginBottom: 0 }}>{stat.sub}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#2D2118", margin: "0 0 16px" }}>Quick Actions</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              <style>{`@media (max-width: 768px) { .admin-actions { grid-template-columns: 1fr !important; } }`}</style>
              <div className="admin-actions" style={{ display: "contents" }}>
                {quickActions.map((action) => (
                  <Link key={action.label} href={action.href} style={{
                    display: "flex", alignItems: "center", gap: 14, background: "white",
                    borderRadius: 16, border: "1.5px solid #E7D8C6", padding: "16px 20px",
                    textDecoration: "none", transition: "all 0.2s",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C89A2B"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(200,154,43,0.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E7D8C6"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: action.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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

          {/* Pending Verifications */}
          {pendingVerifications.length > 0 && (
            <div style={{ background: "white", borderRadius: 20, border: "1.5px solid #E7D8C6", overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1.5px solid #F0EBE3", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Clock style={{ width: 16, height: 16, color: "#D97706" }} />
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#2D2118", margin: 0 }}>Pending Verifications</h3>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#D97706", background: "#FEF3C7", padding: "4px 10px", borderRadius: 20 }}>{pendingVerifications.length}</span>
              </div>
              <div style={{ padding: "12px 24px" }}>
                {pendingVerifications.slice(0, 5).map((v) => (
                  <div key={v.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #F0EBE3" }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#2D2118", margin: 0 }}>{v.referredName}</p>
                      <p style={{ fontSize: 12, color: "#7B5B43", margin: "2px 0 0" }}>by {v.referrerName} · @{v.referredInstagram}</p>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => handleVerify(v.id, "approve")} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#DCFCE7", color: "#16A34A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Check style={{ width: 14, height: 14 }} />
                      </button>
                      <button onClick={() => handleVerify(v.id, "reject")} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#FEE2E2", color: "#DC2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <X style={{ width: 14, height: 14 }} />
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
          <div style={{ padding: "16px 24px", borderBottom: "1.5px solid #F0EBE3" }}>
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
                      padding: "12px 14px", fontSize: 11, fontWeight: 700,
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
                    <td style={{ padding: "12px 14px", fontSize: 12, fontFamily: "monospace", fontWeight: 600, color: "#C89A2B" }}>{p.participantId}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600, color: "#2D2118" }}>{p.fullName}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: "#7B5B43" }}>{p.email}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: "#7B5B43" }}>{p.phone}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: "#7B5B43" }}>@{p.instagram}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: "#7B5B43" }}>{p.state}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 700, color: "#C89A2B", textAlign: "center" }}>{p.totalReferrals}</td>
                    <td style={{ padding: "12px 14px", textAlign: "center" }}>
                      <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: "#DCFCE7", color: "#16A34A" }}>{p.verifiedReferrals}</span>
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "center" }}>
                      <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: p.isActive ? "#DCFCE7" : "#FEE2E2", color: p.isActive ? "#16A34A" : "#DC2626" }}>
                        {p.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "center" }}>
                      <button
                        onClick={() => handleDeleteParticipant(p.id)}
                        style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#FEE2E2", color: "#DC2626", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                        title="Delete participant"
                      >
                        <Trash2 style={{ width: 14, height: 14 }} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredParticipants.length === 0 && (
                  <tr><td colSpan={11} style={{ padding: "40px 14px", textAlign: "center", color: "#A08060", fontSize: 13 }}>No participants found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Verification Tab ─── */}
      {activeTab === "verification" && (
        <div style={{ background: "white", borderRadius: 20, border: "1.5px solid #E7D8C6", overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1.5px solid #F0EBE3" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#2D2118", margin: 0 }}>All Verifications</h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #F0EBE3" }}>
                  {["Referred Name", "Instagram", "Referred By", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} style={{
                      padding: "12px 14px", fontSize: 11, fontWeight: 700,
                      textTransform: "uppercase" as const, letterSpacing: "0.05em",
                      color: "#A08060", textAlign: ["Actions"].includes(h) ? "center" : "left",
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
                    <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600, color: "#2D2118" }}>{v.referredName}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: "#7B5B43" }}>@{v.referredInstagram}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: "#7B5B43" }}>{v.referrerName}</td>
                    <td style={{ padding: "12px 14px", textAlign: "center" }}>
                      <span style={{
                        display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                        background: v.status === "PENDING" ? "#FEF3C7" : v.status === "VERIFIED" ? "#DCFCE7" : "#FEE2E2",
                        color: v.status === "PENDING" ? "#D97706" : v.status === "VERIFIED" ? "#16A34A" : "#DC2626",
                      }}>{v.status}</span>
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "#A08060" }}>{new Date(v.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: "12px 14px", textAlign: "center" }}>
                      {v.status === "PENDING" && (
                        <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                          <button onClick={() => handleVerify(v.id, "approve")} style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "#DCFCE7", color: "#16A34A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Check style={{ width: 13, height: 13 }} />
                          </button>
                          <button onClick={() => handleVerify(v.id, "reject")} style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "#FEE2E2", color: "#DC2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <X style={{ width: 13, height: 13 }} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {verifications.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: "40px 14px", textAlign: "center", color: "#A08060", fontSize: 13 }}>No verifications yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
