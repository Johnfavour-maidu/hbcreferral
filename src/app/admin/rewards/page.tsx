"use client";

import { useEffect, useState } from "react";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { Gift } from "lucide-react";

interface Reward {
  id: string;
  name: string;
  tier: string;
  value: number;
  claimed: boolean;
  createdAt: string;
}

const TIER_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  GOLD: { bg: "#FEF3C7", color: "#D97706", border: "#FDE68A" },
  SILVER: { bg: "#F0EBE3", color: "#7B5B43", border: "#E7D8C6" },
  BRONZE: { bg: "#FEE2E2", color: "#DC2626", border: "#FECACA" },
};

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/rewards")
      .then((r) => r.json())
      .then((d) => setRewards(d.rewards || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Gift style={{ width: 20, height: 20, color: "#D97706" }} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#2D2118" }}>Rewards Management</h1>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div style={{
          background: "white", borderRadius: 20, border: "1.5px solid #E7D8C6",
          overflow: "hidden",
        }}>
          <div style={{ padding: "20px 24px", borderBottom: "1.5px solid #F0EBE3" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#2D2118" }}>All Rewards</h2>
          </div>

          {rewards.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #F0EBE3" }}>
                    {["Name", "Tier", "Value", "Status", "Date"].map((h) => (
                      <th key={h} style={{
                        padding: "12px 16px", fontSize: 11, fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.05em",
                        color: "#A08060", textAlign: h === "Value" || h === "Status" ? "center" : "left",
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rewards.map((r) => {
                    const tierStyle = TIER_STYLES[r.tier] || TIER_STYLES.BRONZE;
                    return (
                      <tr key={r.id} style={{ borderBottom: "1px solid #F0EBE3", transition: "background 0.15s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#FFF8EF"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#2D2118" }}>{r.name}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{
                            display: "inline-block", padding: "3px 12px", borderRadius: 20,
                            fontSize: 11, fontWeight: 700,
                            background: tierStyle.bg, color: tierStyle.color,
                            border: `1px solid ${tierStyle.border}`,
                          }}>
                            {r.tier}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px", textAlign: "center", fontSize: 14, fontWeight: 700, color: "#C89A2B" }}>
                          ₦{r.value.toLocaleString()}
                        </td>
                        <td style={{ padding: "14px 16px", textAlign: "center" }}>
                          <span style={{
                            display: "inline-block", padding: "3px 10px", borderRadius: 20,
                            fontSize: 11, fontWeight: 600,
                            background: r.claimed ? "#DCFCE7" : "#FEF3C7",
                            color: r.claimed ? "#16A34A" : "#D97706",
                          }}>
                            {r.claimed ? "Claimed" : "Unclaimed"}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "#7B5B43" }}>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <Gift style={{ width: 40, height: 40, color: "#E7D8C6", margin: "0 auto 12px" }} />
              <p style={{ fontSize: 14, color: "#A08060" }}>No rewards distributed yet</p>
            </div>
          )}
        </div>
      </FadeIn>
    </PageWrapper>
  );
}
