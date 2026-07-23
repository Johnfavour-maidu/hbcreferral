"use client";

import { useEffect, useState, use } from "react";
import { ExternalLink, Copy, Check, Instagram, Send, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const INSTAGRAM_URL = "https://www.instagram.com/heartsbycharming_";
const CHALLENGE_POST_URL = "https://www.instagram.com/p/DbGbfYDs74v/";
const CHALLENGE_POST_COMMENT_URL = "https://www.instagram.com/p/DbGbfYDs74v/";

export default function ReferralPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const [referrerName, setReferrerName] = useState("");
  const [referrerInstagram, setReferrerInstagram] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [instagram, setInstagram] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/referrals/lookup?code=${code}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.referrer) {
          setReferrerName(data.referrer.fullName);
          setReferrerInstagram(data.referrer.instagram);
        } else {
          setError("Invalid referral link");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load referral info");
        setLoading(false);
      });
  }, [code]);

  const commentText = `Referred by ${referrerInstagram || referrerName}`;

  const copyComment = () => {
    navigator.clipboard.writeText(commentText);
    setCopied(true);
    toast.success("Comment copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!instagram.trim()) {
      toast.error("Please enter your Instagram username");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/referrals/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, instagram: instagram.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        toast.success("Referral submitted! Waiting for admin verification.");
      } else {
        toast.error(data.error || "Failed to submit");
      }
    } catch {
      toast.error("Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #FFF8EF, #F5EFE4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid rgba(200,154,43,0.2)", borderTopColor: "#C89A2B", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #FFF8EF, #F5EFE4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#2D2118", fontSize: 18, fontWeight: 600 }}>{error}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #FFF8EF, #F5EFE4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E7D8C6", padding: 48, maxWidth: 420, width: "100%", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ width: 64, height: 64, background: "rgba(59,165,92,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Check style={{ width: 32, height: 32, color: "#3BA55C" }} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#2D2118", marginBottom: 8 }}>Submission Received!</h2>
          <p style={{ color: "#7B5B43", fontSize: 14, marginBottom: 8, lineHeight: 1.6 }}>
            Your referral has been submitted and is pending admin verification.
          </p>
          <p style={{ color: "#C89A2B", fontSize: 15, fontWeight: 700, marginBottom: 32, lineHeight: 1.6 }}>
            {referrerInstagram || referrerName} is grateful for your support! 🤍
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #FFF8EF, #F5EFE4)" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E7D8C6", padding: "12px 20px" }}>
        <div style={{ maxWidth: 520, margin: "0 auto", display: "flex", alignItems: "center", gap: 10 }}>
          <Image src="/logo.png" alt="Hearts by Charming" width={40} height={40} style={{ objectFit: "contain" }} />
          <span style={{ fontSize: 18, fontWeight: 700, color: "#2D2118" }}>Hearts by Charming</span>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "32px 20px 48px" }}>
        {/* Referrer Card */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E7D8C6", padding: "32px 28px", marginBottom: 28, textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <p style={{ fontSize: 13, color: "#7B5B43", marginBottom: 8 }}>You were invited by</p>
          <p style={{ fontSize: 26, fontWeight: 800, color: "#2D2118", marginBottom: 4 }}>{referrerName}</p>
          {referrerInstagram && (
            <p style={{ fontSize: 14, color: "#C89A2B", fontWeight: 600 }}>{referrerInstagram}</p>
          )}
          <p style={{ fontSize: 13, color: "#999", marginTop: 14, lineHeight: 1.6 }}>
            Complete the steps below to support {referrerName} in the Hearts by Charming Referral Challenge.
          </p>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#2D2118", lineHeight: 1.3 }}>
            Complete these 4 steps to make your referral count
          </h1>
        </div>

        {/* Steps */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E7D8C6", padding: "28px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", marginBottom: 40 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Step 1 */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(200,154,43,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, fontWeight: 700, color: "#C89A2B" }}>
                1
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#2D2118", marginBottom: 4 }}>Follow @heartsbycharming</h3>
                <p style={{ fontSize: 13, color: "#999", marginBottom: 14 }}>Follow our Instagram page</p>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(to right, #833AB4, #FD1D1D, #F77737)", color: "#fff", padding: "10px 18px", borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "opacity 0.2s" }}
                >
                  <Instagram style={{ width: 16, height: 16 }} />
                  Follow on Instagram
                  <ExternalLink style={{ width: 14, height: 14 }} />
                </a>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "#F0E6D6" }} />

            {/* Step 2 */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(200,154,43,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, fontWeight: 700, color: "#C89A2B" }}>
                2
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#2D2118", marginBottom: 4 }}>Like the challenge post</h3>
                <p style={{ fontSize: 13, color: "#999", marginBottom: 14 }}>Find and like our latest challenge post</p>
                <a
                  href={CHALLENGE_POST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#C89A2B", color: "#fff", padding: "10px 18px", borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "background 0.2s" }}
                >
                  Open Challenge Post
                  <ExternalLink style={{ width: 14, height: 14 }} />
                </a>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "#F0E6D6" }} />

            {/* Step 3 */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(200,154,43,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, fontWeight: 700, color: "#C89A2B" }}>
                3
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#2D2118", marginBottom: 4 }}>Comment on the post</h3>
                <p style={{ fontSize: 13, color: "#999", marginBottom: 12 }}>
                  Comment the following on the challenge post:
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#FCF8F3", borderRadius: 12, padding: "12px 14px", border: "1px solid #E7D8C6", marginBottom: 12 }}>
                  <span style={{ fontSize: 14, color: "#2D2118", fontWeight: 500, flex: 1, wordBreak: "break-all" }}>{commentText}</span>
                  <button
                    onClick={copyComment}
                    style={{ flexShrink: 0, padding: 8, borderRadius: 8, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
                    title="Copy comment"
                  >
                    {copied ? (
                      <Check style={{ width: 16, height: 16, color: "#3BA55C" }} />
                    ) : (
                      <Copy style={{ width: 16, height: 16, color: "#7B5B43" }} />
                    )}
                  </button>
                </div>
                <a
                  href={CHALLENGE_POST_COMMENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#C89A2B", color: "#fff", padding: "10px 18px", borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "background 0.2s" }}
                >
                  <MessageCircle style={{ width: 16, height: 16 }} />
                  Go to Comment Section
                  <ExternalLink style={{ width: 14, height: 14 }} />
                </a>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "#F0E6D6" }} />

            {/* Step 4 */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(200,154,43,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, fontWeight: 700, color: "#C89A2B" }}>
                4
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#2D2118", marginBottom: 4 }}>Submit your Instagram username</h3>
                <p style={{ fontSize: 13, color: "#999", marginBottom: 14 }}>Enter your Instagram username correctly below</p>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="Type your username"
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #E7D8C6", background: "#FCF8F3", fontSize: 14, color: "#2D2118", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !instagram.trim()}
                    style={{ flexShrink: 0, background: "#C89A2B", color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, opacity: submitting || !instagram.trim() ? 0.5 : 1, transition: "opacity 0.2s" }}
                  >
                    <Send style={{ width: 16, height: 16 }} />
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", fontSize: 12, color: "rgba(123,91,67,0.4)", marginTop: 40 }}>
          &copy; 2026 Hearts by Charming. All rights reserved.
        </p>
      </div>
    </div>
  );
}
