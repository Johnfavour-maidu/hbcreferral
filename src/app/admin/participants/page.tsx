"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { Search, Download, Eye, Ban, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

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

export default function AdminParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/participants")
      .then((r) => r.json())
      .then((d) => setParticipants(d.participants || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const normalize = (s: string) => s.replace(/^@+/, "").toLowerCase();

  const filtered = participants.filter((p) => {
    const q = normalize(search);
    const match =
      normalize(p.participantId).includes(q) ||
      normalize(p.fullName).includes(q) ||
      normalize(p.email).includes(q) ||
      normalize(p.instagram).includes(q);
    if (filter === "active") return match && p.participantStatus === "ACTIVE";
    if (filter === "suspended") return match && p.participantStatus === "SUSPENDED";
    if (filter === "deleted") return match && p.participantStatus === "DELETED";
    return match;
  });

  const handleSuspend = async (p: Participant) => {
    if (!confirm(`Suspend ${p.fullName}? They will lose access.`)) return;
    setActionLoading(p.id);
    try {
      const res = await fetch("/api/admin/participants", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, action: "suspend" }),
      });
      if (res.ok) {
        setParticipants((prev) =>
          prev.map((x) => (x.id === p.id ? { ...x, isActive: false, participantStatus: "SUSPENDED" } : x))
        );
        toast.success(`${p.fullName} suspended`);
      } else {
        toast.error("Failed to suspend participant");
      }
    } catch {
      toast.error("Failed to suspend participant");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRestore = async (p: Participant) => {
    setActionLoading(p.id);
    try {
      const res = await fetch("/api/admin/participants", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, action: "restore" }),
      });
      if (res.ok) {
        setParticipants((prev) =>
          prev.map((x) => (x.id === p.id ? { ...x, isActive: true, participantStatus: "ACTIVE" } : x))
        );
        toast.success(`${p.fullName} restored`);
      } else {
        toast.error("Failed to restore participant");
      }
    } catch {
      toast.error("Failed to restore participant");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (p: Participant) => {
    if (!confirm(`Delete ${p.fullName}? They will be moved to recycle bin.`)) return;
    setActionLoading(p.id);
    try {
      const res = await fetch("/api/admin/participants", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, action: "softDelete" }),
      });
      if (res.ok) {
        setParticipants((prev) =>
          prev.map((x) => (x.id === p.id ? { ...x, isActive: false, participantStatus: "DELETED" } : x))
        );
        toast.success(`${p.fullName} moved to recycle bin`);
      } else {
        toast.error("Failed to delete participant");
      }
    } catch {
      toast.error("Failed to delete participant");
    } finally {
      setActionLoading(null);
    }
  };

  const statusBadge = (status: string) => {
    if (status === "ACTIVE") return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "#DCFCE7", color: "#16A34A" }}>Active</span>;
    if (status === "SUSPENDED") return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "#FEF3C7", color: "#D97706" }}>Suspended</span>;
    return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "#FEE2E2", color: "#DC2626" }}>Deleted</span>;
  };

  const exportCSV = () => {
    const headers = ["Participant ID", "Name", "Email", "Phone", "Instagram", "State", "Refs", "Verified", "Status"];
    const rows = filtered.map((p) => [p.participantId, p.fullName, p.email, p.phone, p.instagram, p.state, p.totalReferrals, p.verifiedReferrals, p.participantStatus]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "participants.csv";
    a.click();
    toast.success("CSV exported!");
  };

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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#2D2118" }}>Participants</h1>
          <button
            onClick={exportCSV}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
              background: "white", color: "#4A2E1F",
              border: "1.5px solid #E7D8C6", cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C89A2B"; e.currentTarget.style.background = "#FFF8EF"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E7D8C6"; e.currentTarget.style.background = "white"; }}
          >
            <Download style={{ width: 14, height: 14 }} /> Export CSV
          </button>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div style={{
          background: "white", borderRadius: 20, border: "1.5px solid #E7D8C6",
          padding: 24, marginBottom: 24,
        }}>
          <div style={{ display: "flex", flexDirection: "row", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
              <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#A08060", pointerEvents: "none" }} />
              <input
                placeholder="Search by name, email, Instagram, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px 10px 40px",
                  borderRadius: 10, border: "1.5px solid #E7D8C6",
                  fontSize: 13, color: "#2D2118", background: "#FFF8EF",
                  outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["all", "active", "suspended", "deleted"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                    textTransform: "capitalize", cursor: "pointer",
                    background: filter === f ? "#C89A2B" : "white",
                    color: filter === f ? "white" : "#4A2E1F",
                    border: filter === f ? "1.5px solid #C89A2B" : "1.5px solid #E7D8C6",
                    transition: "all 0.2s",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: "auto", margin: "0 -24px", padding: "0 24px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #F0EBE3" }}>
                  {["ID", "Name", "Email", "Instagram", "State", "Refs", "Verified", "Status", "Actions"].map((h) => (
                    <th key={h} style={{
                      padding: "12px 8px", fontSize: 11, fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.05em",
                      color: "#A08060", textAlign: h === "Refs" || h === "Verified" || h === "Status" || h === "Actions" ? "center" : "left",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #F0EBE3", transition: "background 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#FFF8EF"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <td style={{ padding: "12px 8px", fontSize: 12, fontFamily: "monospace", fontWeight: 600, color: "#C89A2B" }}>{p.participantId}</td>
                    <td style={{ padding: "12px 8px", fontSize: 13, fontWeight: 600, color: "#2D2118" }}>{p.fullName}</td>
                    <td style={{ padding: "12px 8px", fontSize: 13, color: "#7B5B43" }}>{p.email}</td>
                    <td style={{ padding: "12px 8px", fontSize: 13, color: "#7B5B43" }}>{p.instagram.replace(/^@+/, "")}</td>
                    <td style={{ padding: "12px 8px", fontSize: 13, color: "#7B5B43" }}>{p.state}</td>
                    <td style={{ padding: "12px 8px", fontSize: 13, fontWeight: 700, color: "#C89A2B", textAlign: "center" }}>{p.totalReferrals}</td>
                    <td style={{ padding: "12px 8px", fontSize: 13, fontWeight: 700, color: "#16A34A", textAlign: "center" }}>{p.verifiedReferrals}</td>
                    <td style={{ padding: "12px 8px", textAlign: "center" }}>{statusBadge(p.participantStatus)}</td>
                    <td style={{ padding: "12px 8px", textAlign: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                        {p.participantStatus === "ACTIVE" && (
                          <>
                            <button
                              disabled={actionLoading === p.id}
                              onClick={() => handleSuspend(p)}
                              title="Suspend"
                              style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#D97706", transition: "all 0.2s" }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "#FEF3C7"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                            >
                              <Ban style={{ width: 14, height: 14 }} />
                            </button>
                            <button
                              disabled={actionLoading === p.id}
                              onClick={() => handleDelete(p)}
                              title="Delete"
                              style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#DC2626", transition: "all 0.2s" }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "#FEE2E2"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                            >
                              <Trash2 style={{ width: 14, height: 14 }} />
                            </button>
                          </>
                        )}
                        {(p.participantStatus === "SUSPENDED" || p.participantStatus === "DELETED") && (
                          <button
                            disabled={actionLoading === p.id}
                            onClick={() => handleRestore(p)}
                            title="Restore"
                            style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#16A34A", transition: "all 0.2s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "#DCFCE7"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                          >
                            <RotateCcw style={{ width: 14, height: 14 }} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ padding: "40px 8px", textAlign: "center", color: "#A08060", fontSize: 13 }}>
                      No participants found
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
