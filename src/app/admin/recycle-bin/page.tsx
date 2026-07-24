"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Trash2, Inbox } from "lucide-react";
import { toast } from "sonner";

interface DeletedParticipant {
  id: string;
  participantId: string;
  fullName: string;
  email: string;
  instagram: string;
  totalReferrals: number;
  verifiedReferrals: number;
  participantStatus: string;
  createdAt: string;
}

export default function RecycleBinPage() {
  const [participants, setParticipants] = useState<DeletedParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/participants")
      .then((r) => r.json())
      .then((d) => {
        const deleted = (d.participants || []).filter(
          (p: DeletedParticipant) => p.participantStatus === "SUSPENDED" || p.participantStatus === "DELETED"
        );
        setParticipants(deleted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRestore = async (p: DeletedParticipant) => {
    setActionLoading(p.id);
    try {
      const res = await fetch("/api/admin/participants", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, action: "restore" }),
      });
      if (res.ok) {
        setParticipants((prev) => prev.filter((x) => x.id !== p.id));
        toast.success(`${p.fullName} restored`);
      } else {
        toast.error("Failed to restore");
      }
    } catch {
      toast.error("Failed to restore");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePermanentDelete = async (p: DeletedParticipant) => {
    if (!confirm(`Permanently delete ${p.fullName}? This cannot be undone.`)) return;
    setActionLoading(p.id);
    try {
      const res = await fetch("/api/admin/participants", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, action: "permanentDelete" }),
      });
      if (res.ok) {
        setParticipants((prev) => prev.filter((x) => x.id !== p.id));
        toast.success(`${p.fullName} permanently deleted`);
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    } finally {
      setActionLoading(null);
    }
  };

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
          href="/admin"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 14, fontWeight: 600, color: "#7B5B43", textDecoration: "none",
            padding: "8px 16px", borderRadius: 10, border: "1px solid #E7D8C6",
            background: "#fff", transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C89A2B"; e.currentTarget.style.color = "#C89A2B"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E7D8C6"; e.currentTarget.style.color = "#7B5B43"; }}
        >
          <ArrowLeft style={{ width: 16, height: 16 }} />
          Back to Admin Dashboard
        </Link>
      </div>

      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20, background: "#FEE2E2",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", border: "2px solid #FECACA",
        }}>
          <Inbox style={{ width: 32, height: 32, color: "#DC2626" }} />
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#2D2118", margin: "0 0 8px" }}>
          Recycle Bin
        </h1>
        <p style={{ fontSize: 15, color: "#7B5B43", margin: 0 }}>
          Suspended and deleted participants. Restore them or permanently remove.
        </p>
      </div>

      <div style={{
        background: "white", borderRadius: 20, border: "1.5px solid #E7D8C6",
        overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        {participants.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #F0EBE3" }}>
                  {["Name", "Email", "Instagram", "Refs", "Verified", "Status", "Actions"].map((h) => (
                    <th key={h} style={{
                      padding: "14px 16px", fontSize: 11, fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.05em",
                      color: "#A08060", textAlign: h === "Refs" || h === "Verified" || h === "Status" || h === "Actions" ? "center" : "left",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #F0EBE3", transition: "background 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#FFF8EF"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#2D2118" }}>{p.fullName}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#7B5B43" }}>{p.email}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#7B5B43" }}>{p.instagram.replace(/^@+/, "")}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: "#C89A2B", textAlign: "center" }}>{p.totalReferrals}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: "#16A34A", textAlign: "center" }}>{p.verifiedReferrals}</td>
                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
                      <span style={{
                        display: "inline-block", padding: "3px 10px", borderRadius: 20,
                        fontSize: 11, fontWeight: 600,
                        background: p.participantStatus === "SUSPENDED" ? "#FEF3C7" : "#FEE2E2",
                        color: p.participantStatus === "SUSPENDED" ? "#D97706" : "#DC2626",
                      }}>
                        {p.participantStatus}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <button
                          disabled={actionLoading === p.id}
                          onClick={() => handleRestore(p)}
                          title="Restore"
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 4,
                            padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                            background: "#DCFCE7", color: "#16A34A", border: "1px solid #BBF7D0",
                            cursor: "pointer", transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#BBF7D0"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "#DCFCE7"; }}
                        >
                          <RotateCcw style={{ width: 12, height: 12 }} /> Restore
                        </button>
                        <button
                          disabled={actionLoading === p.id}
                          onClick={() => handlePermanentDelete(p)}
                          title="Permanent Delete"
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 4,
                            padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                            background: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA",
                            cursor: "pointer", transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#FECACA"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "#FEE2E2"; }}
                        >
                          <Trash2 style={{ width: 12, height: 12 }} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: "64px 32px", textAlign: "center" }}>
            <div style={{
              width: 80, height: 80, borderRadius: 24, background: "#F0EBE3",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <Inbox style={{ width: 40, height: 40, color: "#A08060" }} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#2D2118", margin: "0 0 8px" }}>
              Recycle Bin is Empty
            </h3>
            <p style={{ fontSize: 14, color: "#7B5B43", maxWidth: 400, margin: "0 auto" }}>
              No suspended or deleted participants. When you suspend or delete participants, they will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
