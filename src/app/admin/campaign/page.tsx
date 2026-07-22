"use client";

import { useEffect, useState } from "react";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { Save, Loader2, Settings, Check } from "lucide-react";
import { toast } from "sonner";

interface CampaignData {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  registrationEnabled: boolean;
  leaderboardVisible: boolean;
  goldReward: number;
  silverReward: number;
  bronzeReward: number;
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 44, height: 24, borderRadius: 12, position: "relative",
          background: checked ? "#C89A2B" : "#E7D8C6",
          cursor: "pointer", transition: "background 0.2s",
        }}
      >
        <div style={{
          width: 20, height: 20, borderRadius: 10, background: "white",
          position: "absolute", top: 2, left: checked ? 22 : 2,
          transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }} />
      </div>
      <span style={{ fontSize: 14, fontWeight: 500, color: "#2D2118" }}>{label}</span>
    </label>
  );
}

export default function AdminCampaignPage() {
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/campaign")
      .then((r) => r.json())
      .then((d) => setCampaign(d.campaign))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!campaign) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/campaign", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaign),
      });
      if (res.ok) toast.success("Campaign updated!");
    } catch { toast.error("Failed to update campaign"); }
    finally { setSaving(false); }
  };

  if (loading || !campaign) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #F0EBE3", borderTopColor: "#C89A2B", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: "1.5px solid #E7D8C6", fontSize: 14, color: "#2D2118",
    background: "white", outline: "none", boxSizing: "border-box",
  };

  return (
    <PageWrapper>
      <FadeIn>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Settings style={{ width: 20, height: 20, color: "#D97706" }} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#2D2118" }}>Campaign Settings</h1>
        </div>
      </FadeIn>

      <div style={{ maxWidth: 640, display: "flex", flexDirection: "column", gap: 20 }}>
        <FadeIn delay={0.1}>
          <div style={{ background: "white", borderRadius: 20, border: "1.5px solid #E7D8C6", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1.5px solid #F0EBE3" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#2D2118" }}>General</h2>
            </div>
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#2D2118", marginBottom: 6 }}>Campaign Name</label>
                <input value={campaign.name} onChange={(e) => setCampaign({ ...campaign, name: e.target.value })} style={inputStyle} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#2D2118", marginBottom: 8 }}>Status</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["DRAFT", "ACTIVE", "PAUSED", "CLOSED"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setCampaign({ ...campaign, status: s })}
                      style={{
                        padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                        cursor: "pointer",
                        background: campaign.status === s ? "#C89A2B" : "white",
                        color: campaign.status === s ? "white" : "#4A2E1F",
                        border: campaign.status === s ? "1.5px solid #C89A2B" : "1.5px solid #E7D8C6",
                        transition: "all 0.2s",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#2D2118", marginBottom: 6 }}>Start Date</label>
                  <input type="date" value={campaign.startDate?.split("T")[0] || ""} onChange={(e) => setCampaign({ ...campaign, startDate: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#2D2118", marginBottom: 6 }}>End Date</label>
                  <input type="date" value={campaign.endDate?.split("T")[0] || ""} onChange={(e) => setCampaign({ ...campaign, endDate: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 24 }}>
                <Toggle checked={campaign.registrationEnabled} onChange={(v) => setCampaign({ ...campaign, registrationEnabled: v })} label="Registration Enabled" />
                <Toggle checked={campaign.leaderboardVisible} onChange={(v) => setCampaign({ ...campaign, leaderboardVisible: v })} label="Leaderboard Visible" />
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div style={{ background: "white", borderRadius: 20, border: "1.5px solid #E7D8C6", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1.5px solid #F0EBE3" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#2D2118" }}>Reward Values (₦)</h2>
            </div>
            <div style={{ padding: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#D97706", marginBottom: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 5, background: "#D97706" }} />
                    Gold
                  </label>
                  <input type="number" value={campaign.goldReward} onChange={(e) => setCampaign({ ...campaign, goldReward: parseInt(e.target.value) || 0 })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#7B5B43", marginBottom: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 5, background: "#7B5B43" }} />
                    Silver
                  </label>
                  <input type="number" value={campaign.silverReward} onChange={(e) => setCampaign({ ...campaign, silverReward: parseInt(e.target.value) || 0 })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#DC2626", marginBottom: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 5, background: "#DC2626" }} />
                    Bronze
                  </label>
                  <input type="number" value={campaign.bronzeReward} onChange={(e) => setCampaign({ ...campaign, bronzeReward: parseInt(e.target.value) || 0 })} style={inputStyle} />
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "12px 28px", borderRadius: 12, fontSize: 15, fontWeight: 700,
              background: "#C89A2B", color: "white", border: "none",
              cursor: saving ? "wait" : "pointer",
              boxShadow: "0 2px 10px rgba(200,154,43,0.3)",
              transition: "all 0.2s", opacity: saving ? 0.7 : 1,
            }}
            onMouseEnter={(e) => { if (!saving) { e.currentTarget.style.background = "#B88A1B"; e.currentTarget.style.transform = "translateY(-1px)"; }}}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#C89A2B"; e.currentTarget.style.transform = "none"; }}
          >
            {saving ? <Loader2 style={{ width: 18, height: 18, animation: "spin 0.8s linear infinite" }} /> : <Save style={{ width: 18, height: 18 }} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </FadeIn>
      </div>
    </PageWrapper>
  );
}
