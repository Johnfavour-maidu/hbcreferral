"use client";

import { useEffect, useState } from "react";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { CheckCircle, Check, X, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface VerificationItem {
  id: string;
  referrerName: string;
  referredName: string;
  referredInstagram: string;
  status: string;
  createdAt: string;
}

export default function AdminVerificationPage() {
  const [items, setItems] = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");

  useEffect(() => {
    fetch("/api/admin/verify")
      .then((r) => r.json())
      .then((d) => setItems(d.verifications || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      const res = await fetch("/api/admin/verify", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        toast.success(action === "approve" ? "Referral approved!" : "Referral rejected");
      }
    } catch { toast.error("Failed to process"); }
  };

  const filtered = items.filter((i) => filter === "ALL" || i.status === filter);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #F0EBE3", borderTopColor: "#C89A2B", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  const filters = ["PENDING", "VERIFIED", "REJECTED", "ALL"] as const;

  return (
    <PageWrapper>
      <FadeIn>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#2D2118", marginBottom: 28 }}>Verification Queue</h1>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                cursor: "pointer",
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
      </FadeIn>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((item, i) => (
          <FadeIn key={item.id} delay={i * 0.03}>
            <div style={{
              background: "white", borderRadius: 16, border: "1.5px solid #E7D8C6",
              padding: "20px 24px", display: "flex", alignItems: "center", gap: 16,
              transition: "all 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(74,46,31,0.06)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#2D2118" }}>{item.referredName}</span>
                  <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "#F0EBE3", color: "#7B5B43" }}>
                    @{item.referredInstagram}
                  </span>
                  <span style={{
                    padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: item.status === "PENDING" ? "#FEF3C7" : item.status === "VERIFIED" ? "#DCFCE7" : "#FEE2E2",
                    color: item.status === "PENDING" ? "#D97706" : item.status === "VERIFIED" ? "#16A34A" : "#DC2626",
                  }}>
                    {item.status}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#7B5B43" }}>
                  Referred by: <strong style={{ color: "#2D2118" }}>{item.referrerName}</strong> · {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              {item.status === "PENDING" && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => handleAction(item.id, "approve")}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                      background: "#16A34A", color: "white", border: "none",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#15803D"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#16A34A"; }}
                  >
                    <Check style={{ width: 14, height: 14 }} /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(item.id, "reject")}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                      background: "#FEE2E2", color: "#DC2626", border: "1.5px solid #FECACA",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#FECACA"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#FEE2E2"; }}
                  >
                    <X style={{ width: 14, height: 14 }} /> Reject
                  </button>
                </div>
              )}
            </div>
          </FadeIn>
        ))}
        {filtered.length === 0 && (
          <div style={{
            background: "white", borderRadius: 20, border: "1.5px solid #E7D8C6",
            padding: "48px 24px", textAlign: "center",
          }}>
            <CheckCircle style={{ width: 48, height: 48, color: "#E7D8C6", margin: "0 auto 12px" }} />
            <p style={{ fontSize: 14, color: "#A08060" }}>No items to verify</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
