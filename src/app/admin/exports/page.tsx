"use client";

import { useState } from "react";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { Download, FileSpreadsheet, Users, Trophy, UserCheck, Loader2 } from "lucide-react";
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
    <PageWrapper>
      <FadeIn>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Download style={{ width: 20, height: 20, color: "#D97706" }} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#2D2118" }}>Export Data</h1>
        </div>
      </FadeIn>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 20,
      }}>
        {EXPORTS.map((exp, i) => {
          const Icon = exp.icon;
          const isLoading = loading === exp.type;
          return (
            <FadeIn key={exp.type} delay={i * 0.08}>
              <div style={{
                background: "white", borderRadius: 20, border: "1.5px solid #E7D8C6",
                padding: 24, transition: "all 0.2s", display: "flex", flexDirection: "column", gap: 16,
              }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(74,46,31,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, background: exp.iconBg,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Icon style={{ width: 22, height: 22, color: exp.iconColor }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#2D2118", margin: 0 }}>{exp.label}</h3>
                    <p style={{ fontSize: 13, color: "#7B5B43", margin: "4px 0 0", lineHeight: 1.4 }}>{exp.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleExport(exp.type)}
                  disabled={isLoading}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "10px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600,
                    background: "#C89A2B", color: "white", border: "none",
                    cursor: isLoading ? "wait" : "pointer",
                    transition: "all 0.2s", opacity: isLoading ? 0.7 : 1,
                    width: "100%",
                  }}
                  onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.background = "#B8891F"; } }}
                  onMouseLeave={(e) => { if (!isLoading) { e.currentTarget.style.background = "#C89A2B"; } }}
                >
                  {isLoading ? (
                    <Loader2 style={{ width: 16, height: 16, animation: "spin 0.8s linear infinite" }} />
                  ) : (
                    <FileSpreadsheet style={{ width: 16, height: 16 }} />
                  )}
                  {isLoading ? "Exporting..." : "Download CSV"}
                </button>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </PageWrapper>
  );
}
