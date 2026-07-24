"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  User,
  Save,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Hash,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  state: string;
  instagram: string;
  referralCode: string;
  referralLink: string;
  participantId: string;
  createdAt: string;
  totalReferrals: number;
  verifiedReferrals: number;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => setProfile(d.profile))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!profile) return;

    if (profile.fullName.trim().length < 3) {
      toast.error("Full name must be at least 3 characters");
      return;
    }
    if (profile.phone.trim().length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    if (!profile.email.trim() || !profile.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!profile.state.trim()) {
      toast.error("State is required");
      return;
    }
    if (!profile.instagram.trim()) {
      toast.error("Instagram username is required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: profile.fullName.trim(),
          phone: profile.phone.trim(),
          email: profile.email.trim(),
          state: profile.state.trim(),
          instagram: profile.instagram.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #F0EBE3", borderTopColor: "#C89A2B", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0", color: "#7B5B43" }}>
        Failed to load profile data.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", paddingLeft: 32, paddingRight: 32, paddingTop: 40, paddingBottom: 64 }}>
      {/* Back Link */}
      <div style={{ marginBottom: 32 }}>
        <Link
          href="/dashboard"
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
          Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#2D2118", margin: 0 }}>
          Update Profile
        </h1>
        <p style={{ color: "#7B5B43", fontSize: 14, marginTop: 8, marginBottom: 0 }}>
          Manage your account information and preferences.
        </p>
      </div>

      {/* Read-only Info Card */}
      <div style={{
        background: "white", borderRadius: 20, border: "1.5px solid #E7D8C6",
        overflow: "hidden", marginBottom: 24,
      }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #F0EBE3" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#2D2118", margin: 0 }}>Account Information</h3>
          <p style={{ fontSize: 12, color: "#999", marginTop: 4, marginBottom: 0 }}>These fields cannot be edited</p>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {/* Participant ID */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#7B5B43", textTransform: "uppercase" as const, letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Participant ID</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#F9F6F1", borderRadius: 10, border: "1px solid #E7D8C6" }}>
                <Hash style={{ width: 14, height: 14, color: "#A08060" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#C89A2B", fontFamily: "monospace" }}>{profile.participantId}</span>
              </div>
            </div>
            {/* Registration Date */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#7B5B43", textTransform: "uppercase" as const, letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Registration Date</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#F9F6F1", borderRadius: 10, border: "1px solid #E7D8C6" }}>
                <Calendar style={{ width: 14, height: 14, color: "#A08060" }} />
                <span style={{ fontSize: 13, color: "#7B5B43" }}>{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editable Fields Card */}
      <div style={{
        background: "white", borderRadius: 20, border: "1.5px solid #E7D8C6",
        overflow: "hidden", marginBottom: 24,
      }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #F0EBE3" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#2D2118", margin: 0 }}>Personal Information</h3>
          <p style={{ fontSize: 12, color: "#999", marginTop: 4, marginBottom: 0 }}>Update your personal details below</p>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {/* Full Name */}
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#7B5B43", textTransform: "uppercase" as const, letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Full Name *</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", background: "#FFF8EF", borderRadius: 10, border: "1.5px solid #E7D8C6", transition: "border-color 0.2s" }}>
                <User style={{ width: 16, height: 16, color: "#A08060", flexShrink: 0 }} />
                <input
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  style={{ width: "100%", padding: "12px 0", border: "none", background: "transparent", fontSize: 14, color: "#2D2118", outline: "none" }}
                />
              </div>
            </div>
            {/* Phone */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#7B5B43", textTransform: "uppercase" as const, letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Phone Number *</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", background: "#FFF8EF", borderRadius: 10, border: "1.5px solid #E7D8C6", transition: "border-color 0.2s" }}>
                <Phone style={{ width: 16, height: 16, color: "#A08060", flexShrink: 0 }} />
                <input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  style={{ width: "100%", padding: "12px 0", border: "none", background: "transparent", fontSize: 14, color: "#2D2118", outline: "none" }}
                />
              </div>
            </div>
            {/* Email */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#7B5B43", textTransform: "uppercase" as const, letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Email Address *</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", background: "#FFF8EF", borderRadius: 10, border: "1.5px solid #E7D8C6", transition: "border-color 0.2s" }}>
                <Mail style={{ width: 16, height: 16, color: "#A08060", flexShrink: 0 }} />
                <input
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  style={{ width: "100%", padding: "12px 0", border: "none", background: "transparent", fontSize: 14, color: "#2D2118", outline: "none" }}
                />
              </div>
            </div>
            {/* Instagram */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#7B5B43", textTransform: "uppercase" as const, letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Instagram Username *</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", background: "#FFF8EF", borderRadius: 10, border: "1.5px solid #E7D8C6", transition: "border-color 0.2s" }}>
                <Instagram style={{ width: 16, height: 16, color: "#A08060", flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: "#A08060", flexShrink: 0 }}>@</span>
                <input
                  value={profile.instagram}
                  onChange={(e) => setProfile({ ...profile, instagram: e.target.value.replace(/^@/, "").replace(/\s/g, "") })}
                  style={{ width: "100%", padding: "12px 0", border: "none", background: "transparent", fontSize: 14, color: "#2D2118", outline: "none" }}
                />
              </div>
            </div>
            {/* State */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#7B5B43", textTransform: "uppercase" as const, letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>State *</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", background: "#FFF8EF", borderRadius: 10, border: "1.5px solid #E7D8C6", transition: "border-color 0.2s" }}>
                <MapPin style={{ width: 16, height: 16, color: "#A08060", flexShrink: 0 }} />
                <input
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  style={{ width: "100%", padding: "12px 0", border: "none", background: "transparent", fontSize: 14, color: "#2D2118", outline: "none" }}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
                height: 48, padding: "0 32px", borderRadius: 12,
                background: saving ? "#D4B76A" : "#C89A2B",
                color: "white", fontSize: 15, fontWeight: 600,
                border: "none", cursor: saving ? "not-allowed" : "pointer",
                boxShadow: "0 4px 12px rgba(200,154,43,0.25)",
                transition: "all 0.2s",
              }}
            >
              {saving ? <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> : <Save style={{ width: 18, height: 18 }} />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
