"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import {
  Users,
  CheckCircle,
  Clock,
  Trophy,
  Copy,
  Share2,
  ExternalLink,
  Hash,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";

interface DashboardData {
  profile: {
    fullName: string;
    participantId: string;
    referralCode: string;
    referralLink: string;
    totalReferrals: number;
    verifiedReferrals: number;
    pendingReferrals: number;
  };
  leaderboardPosition: number;
  totalParticipants: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold border-t-transparent" />
          <p className="text-sm text-brown-light/60">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const { profile } = data;
  const firstName = profile.fullName.split(" ")[0];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodeURIComponent(`Join Hearts by Charming Referral Challenge! Use my link: ${profile.referralLink}`)}`,
      color: "bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-[#25D366]/20",
    },
    {
      name: "Facebook",
      icon: ExternalLink,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profile.referralLink)}`,
      color: "bg-[#1877F2] hover:bg-[#1565C0] text-white shadow-[#1877F2]/20",
    },
    {
      name: "Telegram",
      icon: ExternalLink,
      url: `https://t.me/share/url?url=${encodeURIComponent(profile.referralLink)}&text=${encodeURIComponent("Join Hearts by Charming Referral Challenge!")}`,
      color: "bg-[#0088CC] hover:bg-[#0077B3] text-white shadow-[#0088CC]/20",
    },
  ];

  const stats = [
    {
      title: "Total Referrals",
      value: profile.totalReferrals,
      icon: Users,
      color: "text-gold",
      bg: "bg-gold/10",
      border: "border-gold/15",
      ring: "ring-gold/20",
    },
    {
      title: "Verified",
      value: profile.verifiedReferrals,
      icon: CheckCircle,
      color: "text-success",
      bg: "bg-success/10",
      border: "border-success/15",
      ring: "ring-success/20",
    },
    {
      title: "Pending",
      value: profile.pendingReferrals,
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/15",
      ring: "ring-warning/20",
    },
    {
      title: "Leaderboard",
      value: `#${data.leaderboardPosition}`,
      icon: Trophy,
      color: "text-purple-600",
      bg: "bg-purple-500/10",
      border: "border-purple-500/15",
      ring: "ring-purple-500/20",
    },
  ];

  return (
    <PageWrapper>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">

        {/* ─── Header ─── */}
        <FadeIn>
          <div className="mb-8 lg:mb-10">
            <h1 className="text-[28px] sm:text-[32px] lg:text-[36px] font-extrabold text-brown-dark leading-tight tracking-tight">
              Hello, {firstName} <span className="inline-block animate-[wave_2s_ease-in-out_infinite]">👋</span>
            </h1>
            <p className="text-brown-light/70 text-[14px] sm:text-[15px] mt-1.5">
              Welcome to your Hearts by Charming Referral Dashboard
            </p>
            <div className="mt-3">
              <Badge
                variant="default"
                className="font-mono text-[11px] tracking-wider px-3 py-1.5 rounded-full bg-gold/10 border-gold/25 text-gold-dark gap-1.5"
              >
                <Hash className="h-3 w-3" />
                {profile.participantId}
              </Badge>
            </div>
          </div>
        </FadeIn>

        {/* ─── Stat Cards ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 lg:mb-10">
          {stats.map((stat, i) => (
            <FadeIn key={stat.title} delay={i * 0.06}>
              <Card className="group relative overflow-hidden border-cream-dark/60 bg-white rounded-[20px] shadow-[0_1px_3px_rgba(74,46,31,0.04),0_4px_12px_rgba(74,46,31,0.03)] hover:shadow-[0_4px_16px_rgba(74,46,31,0.08),0_12px_32px_rgba(74,46,31,0.06)] hover:-translate-y-0.5 transition-all duration-300">
                <CardContent className="p-5 sm:p-6">
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${stat.bg} border ${stat.border} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}>
                    <stat.icon className={`h-5 w-5 sm:h-[22px] sm:w-[22px] ${stat.color}`} strokeWidth={2} />
                  </div>
                  <p className="text-[12px] sm:text-[13px] text-brown-light/60 font-medium uppercase tracking-wide mb-1">
                    {stat.title}
                  </p>
                  <p className={`text-[26px] sm:text-[30px] font-extrabold ${stat.color} leading-none`}>
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        {/* ─── Divider ─── */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8 lg:mb-10" />

        {/* ─── Referral Link Card ─── */}
        <FadeIn delay={0.25}>
          <Card className="relative overflow-hidden border-cream-dark/60 bg-white rounded-[20px] shadow-[0_1px_3px_rgba(74,46,31,0.04),0_4px_12px_rgba(74,46,31,0.03)]">
            {/* Subtle gold accent line at top */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold/40 via-gold to-gold/40" />

            <CardContent className="p-6 sm:p-8">
              {/* Title */}
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <Share2 className="h-[18px] w-[18px] text-gold" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-brown-dark leading-none">
                    Your Referral Link
                  </h2>
                  <p className="text-[12px] text-brown-light/50 mt-0.5">
                    Share this link to invite participants
                  </p>
                </div>
              </div>

              {/* Link Input */}
              <div className="flex items-center gap-2 p-3 sm:p-3.5 bg-cream/70 rounded-2xl border border-cream-dark/80 mb-2">
                <code className="flex-1 text-[13px] sm:text-[14px] text-brown-dark/80 break-all font-mono leading-relaxed select-all">
                  {profile.referralLink}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(profile.referralLink)}
                  className={`shrink-0 h-10 w-10 rounded-xl transition-all duration-200 ${
                    copied
                      ? "bg-success/10 text-success hover:bg-success/20"
                      : "bg-gold/10 text-gold hover:bg-gold/20"
                  }`}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              {/* Referral Code */}
              <div className="flex items-center gap-2 mb-6">
                <Badge
                  variant="default"
                  className="font-mono text-[11px] tracking-wider px-2.5 py-1 rounded-lg bg-cream-dark/60 border-cream-dark text-brown-light/70"
                >
                  Code: {profile.referralCode}
                </Badge>
              </div>

              {/* Share Section */}
              <div>
                <p className="text-[12px] text-brown-light/50 font-medium uppercase tracking-wide mb-3">
                  Share via
                </p>
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                  {shareLinks.map((link) => (
                    <Button
                      key={link.name}
                      size="sm"
                      onClick={() => window.open(link.url, "_blank", "noopener,noreferrer")}
                      className={`h-11 sm:h-12 rounded-2xl text-[13px] sm:text-[14px] font-semibold gap-2 shadow-lg ${link.color} hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 transition-all duration-200`}
                    >
                      <link.icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{link.name}</span>
                      <span className="sm:hidden text-[11px]">{link.name.slice(0, 6)}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* ─── Future Sections Placeholder ─── */}
        <div className="mt-10 lg:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-4 opacity-40 pointer-events-none">
          <div className="h-[120px] rounded-[20px] border-2 border-dashed border-border/50 bg-white/30 flex items-center justify-center">
            <p className="text-[13px] text-brown-light/40 font-medium">Recent Referrals</p>
          </div>
          <div className="h-[120px] rounded-[20px] border-2 border-dashed border-border/50 bg-white/30 flex items-center justify-center">
            <p className="text-[13px] text-brown-light/40 font-medium">Notifications</p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
