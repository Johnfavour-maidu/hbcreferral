"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, FileSpreadsheet, Users, Trophy, UserCheck, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const EXPORTS = [
  {
    type: "participants",
    label: "Participants",
    description: "All registered participants with their details",
    icon: Users,
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
  },
  {
    type: "leaderboard",
    label: "Leaderboard",
    description: "Current rankings and referral counts",
    icon: Trophy,
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
  },
  {
    type: "referrals",
    label: "Referrals",
    description: "All referral records with usernames and statuses",
    icon: UserCheck,
    iconBg: "#EDE9FE",
    iconColor: "#7C3AED",
  },
];

export default function AdminExportsPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleExport = async (type: string) => {
    setLoading(type);
    try {
      const res = await fetch(`/api/admin/export?type=${type}&format=csv`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${type}.csv`;
        a.click();
        toast.success(`${type} exported as CSV!`);
      }
    } catch {
      toast.error("Export failed");
    } finally {
      setLoading(null);
    }
  };

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
          width: 64, height: 64, borderRadius: 20, background: "#FEF3C7",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", border: "2px solid #FDE68A",
        }}>
          <Download style={{ width: 32, height: 32, color: "#D97706" }} />
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#2D2118", margin: "0 0 8px" }}>
          Export Data
        </h1>
        <p style={{ fontSize: 15, color: "#7B5B43", margin: 0 }}>
          Download your data as CSV files for external analysis.
        </p>
      </div>

      <div style={{
        background: "white", borderRadius: 20, border: "1.5px solid #E7D8C6",
        overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #F0EBE3" }}>
                {["Export", "Description", "Action"].map((h) => (
                  <th key={h} style={{
                    padding: "14px 20px", fontSize: 11, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.05em",
                    color: "#A08060", textAlign: h === "Action" ? "center" : "left",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EXPORTS.map((exp) => {
                const Icon = exp.icon;
                const isLoading = loading === exp.type;
                return (
                  <tr
                    key={exp.type}
                    style={{ borderBottom: "1px solid #F0EBE3", transition: "background 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#FFF8EF"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10, background: exp.iconBg,
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                          <Icon style={{ width: 18, height: 18, color: exp.iconColor }} />
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#2D2118" }}>
                          {exp.label}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ fontSize: 13, color: "#7B5B43" }}>
                        {exp.description}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "center" }}>
                      <button
                        onClick={() => handleExport(exp.type)}
                        disabled={isLoading}
                        style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                          padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                          background: isLoading ? "#D4B76A" : "#C89A2B", color: "white", border: "none",
                          cursor: isLoading ? "wait" : "pointer",
                          transition: "all 0.2s", opacity: isLoading ? 0.7 : 1,
                        }}
                        onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.background = "#B8891F"; } }}
                        onMouseLeave={(e) => { if (!isLoading) { e.currentTarget.style.background = "#C89A2B"; } }}
                      >
                        {isLoading ? (
                          <Loader2 style={{ width: 14, height: 14, animation: "spin 0.8s linear infinite" }} />
                        ) : (
                          <FileSpreadsheet style={{ width: 14, height: 14 }} />
                        )}
                        {isLoading ? "Exporting..." : "Download CSV"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
