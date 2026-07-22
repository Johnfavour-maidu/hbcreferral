"use client";

import { useState } from "react";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { Download, FileSpreadsheet, File, Loader2 } from "lucide-react";
import { toast } from "sonner";

const EXPORTS = [
  { type: "participants", label: "Participants", description: "All registered participants with their details" },
  { type: "leaderboard", label: "Leaderboard", description: "Current rankings and referral counts" },
  { type: "referrals", label: "Referrals", description: "All referral records with statuses" },
  { type: "verification", label: "Verification Log", description: "Admin verification actions log" },
];

export default function AdminExportsPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleExport = async (type: string, format: string) => {
    setLoading(`${type}-${format}`);
    try {
      const res = await fetch(`/api/admin/export?type=${type}&format=${format}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${type}.${format}`;
        a.click();
        toast.success(`${type} exported as ${format.toUpperCase()}!`);
      }
    } catch { toast.error("Export failed"); }
    finally { setLoading(null); }
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        {EXPORTS.map((exp, i) => (
          <FadeIn key={exp.type} delay={i * 0.08}>
            <div style={{
              background: "white", borderRadius: 20, border: "1.5px solid #E7D8C6",
              padding: "24px", transition: "all 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(74,46,31,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#2D2118", marginBottom: 6 }}>{exp.label}</h3>
              <p style={{ fontSize: 13, color: "#7B5B43", marginBottom: 20 }}>{exp.description}</p>
              <div style={{ display: "flex", gap: 8 }}>
                {["csv", "json"].map((format) => {
                  const isLoading = loading === `${exp.type}-${format}`;
                  return (
                    <button
                      key={format}
                      onClick={() => handleExport(exp.type, format)}
                      disabled={isLoading}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                        background: "white", color: "#4A2E1F",
                        border: "1.5px solid #E7D8C6", cursor: isLoading ? "wait" : "pointer",
                        transition: "all 0.2s", opacity: isLoading ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C89A2B"; e.currentTarget.style.background = "#FFF8EF"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E7D8C6"; e.currentTarget.style.background = "white"; }}
                    >
                      {isLoading ? (
                        <Loader2 style={{ width: 14, height: 14, animation: "spin 0.8s linear infinite" }} />
                      ) : format === "csv" ? (
                        <FileSpreadsheet style={{ width: 14, height: 14 }} />
                      ) : (
                        <File style={{ width: 14, height: 14 }} />
                      )}
                      {format.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </PageWrapper>
  );
}
