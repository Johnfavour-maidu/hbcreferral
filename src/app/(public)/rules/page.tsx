"use client";

import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function RulesPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", paddingLeft: 32, paddingRight: 32, paddingTop: 48, paddingBottom: 64 }}>
      <div style={{ marginBottom: 32 }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 600,
            color: "#7B5B43",
            textDecoration: "none",
            padding: "8px 16px",
            borderRadius: 10,
            border: "1px solid #E7D8C6",
            background: "#fff",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C89A2B"; e.currentTarget.style.color = "#C89A2B"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E7D8C6"; e.currentTarget.style.color = "#7B5B43"; }}
        >
          <ArrowLeft style={{ width: 16, height: 16 }} />
          Back to Home
        </Link>
      </div>

      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20, background: "#FEF3C7",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", border: "2px solid #FDE68A",
        }}>
          <Shield style={{ width: 32, height: 32, color: "#D97706" }} />
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#2D2118", margin: "0 0 8px" }}>
          Rules &amp; Guidelines
        </h1>
        <p style={{ fontSize: 15, color: "#7B5B43", margin: 0 }}>
          Hearts by Charming Referral Challenge 2026
        </p>
      </div>

      <div style={{
        background: "white", borderRadius: 20, border: "1.5px solid #E7D8C6",
        overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        <div style={{ padding: "32px 36px" }}>
          <div style={{ fontSize: 15, color: "#4A2E1F", lineHeight: 1.8 }}>
            <p style={{ marginBottom: 20 }}>
              Welcome to the <strong>Hearts by Charming Referral Challenge 2026</strong>. These rules are designed to ensure that the competition is fair, transparent, and enjoyable for everyone. By participating, you agree to abide by the following terms and conditions.
            </p>

            <Section number="1" title="Eligibility">
              <ul style={{ margin: "8px 0 0 20px", padding: 0 }}>
                <li>The Referral Challenge is open to individuals who successfully register through the official Hearts by Charming Referral Challenge platform.</li>
                <li>Each participant may register <strong>only once</strong>.</li>
                <li>Participants must provide accurate and complete information during registration.</li>
                <li>Hearts by Charming reserves the right to verify participant information at any stage of the competition.</li>
              </ul>
            </Section>

            <Section number="2" title="How to Participate">
              <p>To participate:</p>
              <ol style={{ margin: "8px 0 0 20px", padding: 0 }}>
                <li>Register on the official Hearts by Charming Referral Challenge website.</li>
                <li>Receive your unique referral link.</li>
                <li>Share your referral link with friends and family.</li>
                <li>Encourage them to complete all required participation steps.</li>
              </ol>
            </Section>

            <Section number="3" title="Requirements for Every Referred Friend">
              <p>For a referral to qualify, the referred participant must:</p>
              <ol style={{ margin: "8px 0 0 20px", padding: 0 }}>
                <li>Follow the official <strong>Hearts by Charming Instagram page</strong>.</li>
                <li>Like <strong>at least two (2)</strong> posts on the Hearts by Charming Instagram page.</li>
                <li>
                  Comment on the official Referral Challenge post using:
                  <div style={{
                    margin: "12px 0",
                    padding: "12px 16px",
                    background: "#FCF8F3",
                    borderRadius: 10,
                    borderLeft: "3px solid #C89A2B",
                    fontStyle: "italic",
                    color: "#4A2E1F",
                  }}>
                    Referred by @YourUsername
                  </div>
                  where <strong>@YourUsername</strong> is the Instagram username of the participant who referred them.
                </li>
              </ol>
              <p>Failure to complete all of these requirements may result in the referral not being approved.</p>
            </Section>

            <Section number="4" title="Referral Verification">
              <ul style={{ margin: "8px 0 0 20px", padding: 0 }}>
                <li>Every successful registration through a participant&apos;s referral link will initially be marked as <strong>Pending</strong>.</li>
                <li>Hearts by Charming will review and verify referrals before they are counted as <strong>Approved</strong>.</li>
                <li>Only <strong>Approved (Verified)</strong> referrals contribute to leaderboard rankings and prize eligibility.</li>
                <li>Hearts by Charming reserves the right to request additional information where necessary during verification.</li>
              </ul>
            </Section>

            <Section number="5" title="Leaderboard">
              <ul style={{ margin: "8px 0 0 20px", padding: 0 }}>
                <li>The leaderboard is ranked based on the number of <strong>Verified Referrals</strong> only.</li>
                <li>Pending referrals do not affect leaderboard positions until they are approved.</li>
                <li>In the event of a tie, the participant who achieved the referral count first will be ranked higher.</li>
                <li>Leaderboard updates are made periodically throughout the competition.</li>
              </ul>
            </Section>

            <Section number="6" title="Prizes">
              <p>Prizes will be awarded to the participants with the highest number of verified referrals at the close of the competition.</p>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12,
                margin: "16px 0",
              }}>
                <PrizeCard medal="🥇" label="1st Place" amount="₦20,000" color="#D97706" bg="#FEF3C7" border="#FDE68A" />
                <PrizeCard medal="🥈" label="2nd Place" amount="₦15,000" color="#7B5B43" bg="#F0EBE3" border="#E7D8C6" />
                <PrizeCard medal="🥉" label="3rd Place" amount="₦10,000" color="#DC2626" bg="#FEE2E2" border="#FECACA" />
              </div>
              <p>Hearts by Charming reserves the right to verify all winning referrals before prizes are awarded.</p>
            </Section>

            <Section number="7" title="Prohibited Activities">
              <p>The following activities are strictly prohibited:</p>
              <ul style={{ margin: "8px 0 0 20px", padding: 0 }}>
                <li>Creating multiple participant accounts.</li>
                <li>Referring yourself using another account.</li>
                <li>Using fake, duplicate, inactive, or automated accounts.</li>
                <li>Providing false registration information.</li>
                <li>Attempting to manipulate referral counts.</li>
                <li>Harassing, misleading, or spamming potential participants.</li>
                <li>Any activity deemed fraudulent or dishonest by Hearts by Charming.</li>
              </ul>
              <p>Any participant found engaging in prohibited activities may be disqualified immediately.</p>
            </Section>

            <Section number="8" title="Disqualification">
              <p>Hearts by Charming reserves the right to:</p>
              <ul style={{ margin: "8px 0 0 20px", padding: 0 }}>
                <li>Reject any referral that does not meet the campaign requirements.</li>
                <li>Suspend or remove participant accounts.</li>
                <li>Disqualify participants found violating these rules.</li>
                <li>Remove fraudulent referrals from leaderboard calculations.</li>
              </ul>
              <p>All decisions made by Hearts by Charming regarding verification and disqualification are final.</p>
            </Section>

            <Section number="9" title="Campaign Period">
              <p>Only referrals completed within the official campaign period will be considered.</p>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                margin: "16px 0",
              }}>
                <div style={{
                  padding: "16px",
                  background: "#DCFCE7",
                  borderRadius: 12,
                  border: "1px solid #BBF7D0",
                  textAlign: "center",
                }}>
                  <p style={{ fontSize: 12, color: "#16A34A", fontWeight: 600, margin: "0 0 4px" }}>Campaign Starts</p>
                  <p style={{ fontSize: 15, color: "#2D2118", fontWeight: 700, margin: 0 }}>1st August 2026</p>
                </div>
                <div style={{
                  padding: "16px",
                  background: "#FEE2E2",
                  borderRadius: 12,
                  border: "1px solid #FECACA",
                  textAlign: "center",
                }}>
                  <p style={{ fontSize: 12, color: "#DC2626", fontWeight: 600, margin: "0 0 4px" }}>Campaign Ends</p>
                  <p style={{ fontSize: 15, color: "#2D2118", fontWeight: 700, margin: 0 }}>31st August 2026</p>
                </div>
              </div>
              <p>Referrals submitted after the closing date will not be counted.</p>
            </Section>

            <Section number="10" title="Privacy">
              <p>By participating, you agree that Hearts by Charming may use the information you provide solely for administering the Referral Challenge, verifying referrals, communicating with participants, and announcing winners. Personal information will not be shared with third parties except where required by law or for the operation of the competition.</p>
            </Section>

            <Section number="11" title="Changes to the Rules">
              <p>Hearts by Charming reserves the right to update, modify, suspend, or terminate the Referral Challenge or these rules where necessary to ensure fairness, security, or proper administration. Participants will be notified of significant changes through the official platform or Hearts by Charming&apos;s communication channels.</p>
            </Section>

            <Section number="12" title="Acceptance of the Rules">
              <p>By registering for the Hearts by Charming Referral Challenge, you confirm that you have read, understood, and agreed to these Rules &amp; Guidelines. Failure to comply with these rules may result in the removal of referrals, suspension from the competition, or disqualification.</p>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{
        fontSize: 18, fontWeight: 700, color: "#2D2118",
        margin: "0 0 12px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 28, height: 28, borderRadius: 8,
          background: "rgba(200,154,43,0.1)", color: "#C89A2B",
          fontSize: 13, fontWeight: 800, flexShrink: 0,
        }}>
          {number}
        </span>
        {title}
      </h2>
      <div style={{ paddingLeft: 38 }}>
        {children}
      </div>
    </div>
  );
}

function PrizeCard({ medal, label, amount, color, bg, border }: {
  medal: string; label: string; amount: string; color: string; bg: string; border: string;
}) {
  return (
    <div style={{
      padding: "16px",
      background: bg,
      borderRadius: 12,
      border: `1px solid ${border}`,
      textAlign: "center",
    }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{medal}</div>
      <p style={{ fontSize: 13, color: "#7B5B43", margin: "0 0 4px" }}>{label}</p>
      <p style={{ fontSize: 18, fontWeight: 800, color, margin: 0 }}>{amount}</p>
    </div>
  );
}
