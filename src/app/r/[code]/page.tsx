"use client";

import { useEffect, useState, use } from "react";
import { ExternalLink, Copy, Check, Instagram, Send, MessageCircle, Facebook, Music } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { siteConfig } from "@/config/site";

const INSTAGRAM_URL = siteConfig.social.instagramUrl.split("?")[0];
const CHALLENGE_POST_URL = siteConfig.social.challengePostUrl;
const CHALLENGE_POST_COMMENT_URL = siteConfig.social.challengePostUrl;
const FACEBOOK_URL = siteConfig.social.facebookUrl;
const TIKTOK_URL = siteConfig.social.tiktokUrl;

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
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);

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
        setUsernameSubmitted(true);
        toast.success("Username submitted!");
      } else {
        toast.error(data.error || "Failed to submit");
      }
    } catch {
      toast.error("Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDone = () => {
    setSubmitted(true);
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
      <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #FFF8EF, #F5EFE4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #E7D8C6", padding: "48px 32px", maxWidth: 440, width: "100%", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ width: 72, height: 72, background: "rgba(200,154,43,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", border: "2px solid rgba(200,154,43,0.2)" }}>
            <Check style={{ width: 36, height: 36, color: "#C89A2B" }} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#2D2118", marginBottom: 12, lineHeight: 1.3 }}>
            Thank You!
          </h1>
          <p style={{ color: "#7B5B43", fontSize: 15, marginBottom: 8, lineHeight: 1.7 }}>
            Your referral has been submitted successfully.
          </p>
          <p style={{ color: "#7B5B43", fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
            Your referrer will receive a pending referral while our team verifies your submission.
          </p>
          <p style={{ color: "#C89A2B", fontSize: 14, fontWeight: 600, marginBottom: 32, lineHeight: 1.6 }}>
            Thank you for supporting Hearts by Charming.
          </p>
          <div style={{ background: "#FCF8F3", borderRadius: 14, padding: "16px 20px", border: "1px solid #E7D8C6" }}>
            <p style={{ fontSize: 13, color: "#7B5B43", lineHeight: 1.6, margin: 0 }}>
              Verification usually takes a short time. If your submitted Instagram username matches your activity on Instagram, the referral will be approved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #FFF8EF, #F5EFE4)" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E7D8C6", padding: "0 20px" }}>
        <div style={{ maxWidth: 520, margin: "0 auto", display: "flex", alignItems: "center", gap: 10, height: 56 }}>
          <Image src="/logo.png" alt="Hearts by Charming" width={120} height={120} style={{ objectFit: "contain", height: "100%", width: "auto" }} />
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

        {/* Required Title */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: "#2D2118", lineHeight: 1.3 }}>
            Complete the steps below
          </h1>
          <p style={{ fontSize: 13, color: "#999", marginTop: 4 }}>
            Complete the first 4 steps to make your referral count and the other two are optional
          </p>
        </div>

        {/* All Steps */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E7D8C6", padding: "28px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", marginBottom: 28 }}>
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

            <div style={{ height: 1, background: "#F0E6D6" }} />

            {/* Step 4 */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(200,154,43,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, fontWeight: 700, color: "#C89A2B" }}>
                4
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#2D2118", marginBottom: 4 }}>Submit your Instagram username</h3>
                <p style={{ fontSize: 13, color: "#999", marginBottom: 14 }}>Enter your Instagram username correctly below</p>
                {usernameSubmitted ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(59,165,92,0.08)", borderRadius: 12, padding: "12px 16px", border: "1px solid rgba(59,165,92,0.2)" }}>
                    <Check style={{ width: 18, height: 18, color: "#3BA55C" }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#3BA55C" }}>Username submitted: @{instagram}</span>
                  </div>
                ) : (
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
                )}
              </div>
            </div>

            <div style={{ height: 1, background: "#F0E6D6" }} />

            {/* Optional Step 5 */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(200,154,43,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#C89A2B" }}>5</span>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#2D2118", marginBottom: 4 }}>Follow on Facebook</h3>
                <p style={{ fontSize: 13, color: "#999", marginBottom: 14 }}>Stay connected with our Facebook community.</p>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1877F2", color: "#fff", padding: "10px 18px", borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "opacity 0.2s" }}
                >
                  <Facebook style={{ width: 16, height: 16 }} />
                  Follow on Facebook
                  <ExternalLink style={{ width: 14, height: 14 }} />
                </a>
              </div>
            </div>

            <div style={{ height: 1, background: "#F0E6D6" }} />

            {/* Optional Step 6 */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(200,154,43,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#C89A2B" }}>6</span>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#2D2118", marginBottom: 4 }}>Follow on TikTok</h3>
                <p style={{ fontSize: 13, color: "#999", marginBottom: 14 }}>Watch inspiring videos and updates on TikTok.</p>
                <a
                  href={TIKTOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#000000", color: "#fff", padding: "10px 18px", borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "opacity 0.2s" }}
                >
                  <Music style={{ width: 16, height: 16 }} />
                  Follow on TikTok
                  <ExternalLink style={{ width: 14, height: 14 }} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Done Button */}
        <div style={{ marginBottom: 40 }}>
          <button
            onClick={handleDone}
            disabled={!usernameSubmitted}
            style={{
              width: "100%", padding: "16px 24px", borderRadius: 14, fontSize: 16, fontWeight: 700,
              background: usernameSubmitted ? "#C89A2B" : "#D9D0C3",
              color: usernameSubmitted ? "#fff" : "#999",
              border: "none", cursor: usernameSubmitted ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              boxShadow: usernameSubmitted ? "0 4px 16px rgba(200,154,43,0.3)" : "none",
            }}
          >
            Done
          </button>
          {!usernameSubmitted && (
            <p style={{ textAlign: "center", fontSize: 12, color: "#999", marginTop: 10 }}>
              Please submit your Instagram username before completing.
            </p>
          )}
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", fontSize: 12, color: "rgba(123,91,67,0.4)" }}>
          &copy; 2026 Hearts by Charming. All rights reserved.
        </p>
      </div>
    </div>
  );
}
