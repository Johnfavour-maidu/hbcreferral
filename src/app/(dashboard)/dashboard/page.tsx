"use client";

import { useEffect, useState } from "react";
import {
  Users,
  CheckCircle,
  Clock,
  Trophy,
  Copy,
  Share2,
  Hash,
  MessageCircle,
  ExternalLink,
  ArrowRight,
  Bell,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

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

interface Referral {
  id: string;
  fullName: string;
  instagram: string;
  status: string;
  createdAt: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
  border,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-cream-dark hover:shadow-lg hover:shadow-brown/5 transition-all duration-300 hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg} border ${border}`}
        >
          <Icon className={`h-5 w-5 ${color}`} strokeWidth={2} />
        </div>
      </div>
      <p className="text-[11px] font-medium uppercase tracking-wider text-brown-light/60 mb-1">
        {label}
      </p>
      <p className="text-2xl font-extrabold text-brown-dark">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard").then((r) => r.json()),
      fetch("/api/referrals").then((r) => r.json()),
      fetch("/api/notifications").then((r) => r.json()),
    ])
      .then(([dashData, refData, notifData]) => {
        setData(dashData);
        setReferrals(refData.referrals || []);
        setNotifications(notifData.notifications || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-brown-light">
        Failed to load dashboard data.
      </div>
    );
  }

  const { profile } = data;
  const firstName = profile.fullName.split(" ")[0];
  const unreadCount = notifications.filter((n) => !n.read).length;

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
      label: "Total Referrals",
      value: profile.totalReferrals,
      icon: Users,
      color: "text-gold",
      bg: "bg-gold/10",
      border: "border-gold/15",
    },
    {
      label: "Verified",
      value: profile.verifiedReferrals,
      icon: CheckCircle,
      color: "text-success",
      bg: "bg-success/10",
      border: "border-success/15",
    },
    {
      label: "Pending",
      value: profile.pendingReferrals,
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/15",
    },
    {
      label: "Leaderboard",
      value: `#${data.leaderboardPosition}`,
      icon: Trophy,
      color: "text-[#8B5CF6]",
      bg: "bg-[#8B5CF6]/10",
      border: "border-[#8B5CF6]/15",
    },
  ];

  const statusColor = (s: string) => {
    if (s === "VERIFIED") return "bg-success/10 text-success";
    if (s === "PENDING") return "bg-warning/10 text-warning";
    return "bg-error/10 text-error";
  };

  const notifIcon = (t: string) => {
    if (t === "REFERRAL_VERIFIED") return <CheckCircle className="h-4 w-4 text-success" />;
    if (t === "REFERRAL_PENDING") return <Clock className="h-4 w-4 text-warning" />;
    return <Bell className="h-4 w-4 text-brown-light" />;
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-brown-dark">
          Hello, {firstName} 👋
        </h1>
        <p className="text-brown-light text-sm mt-1">
          Welcome to your Hearts by Charming Referral Dashboard
        </p>
        <div className="mt-3">
          <span className="inline-flex items-center gap-1.5 bg-gold/10 text-gold-dark text-[11px] font-semibold px-3 py-1.5 rounded-full border border-gold/20">
            <Hash className="h-3 w-3" />
            {profile.participantId}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            color={stat.color}
            bg={stat.bg}
            border={stat.border}
          />
        ))}
      </div>

      {/* Referral Link */}
      <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden">
        <div className="h-[2px] bg-gradient-to-r from-gold/40 via-gold to-gold/40" />
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
              <Share2 className="h-[18px] w-[18px] text-gold" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-brown-dark">Your Referral Link</h2>
              <p className="text-[12px] text-brown-light/50">Share this link to invite participants</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-cream/70 rounded-xl border border-cream-dark/80 mb-3">
            <code className="flex-1 text-[13px] text-brown-dark/80 break-all font-mono leading-relaxed select-all">
              {profile.referralLink}
            </code>
            <button
              onClick={() => copyToClipboard(profile.referralLink)}
              className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                copied
                  ? "bg-success/10 text-success"
                  : "bg-gold/10 text-gold hover:bg-gold/20"
              }`}
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>

          <span className="inline-flex items-center text-[11px] text-brown-light/50 font-mono bg-cream-dark/40 px-2 py-1 rounded-md">
            Code: {profile.referralCode}
          </span>

          <div className="mt-5">
            <p className="text-[11px] text-brown-light/50 font-medium uppercase tracking-wide mb-3">
              Share via
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 h-11 rounded-xl text-[13px] font-semibold shadow-lg ${link.color} hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 transition-all duration-200`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Referrals + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Referrals */}
        <div className="bg-white rounded-2xl p-5 border border-cream-dark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-brown-dark">Recent Referrals</h3>
            {referrals.length > 3 && (
              <Link
                href="/referral-history"
                className="text-[12px] text-gold font-semibold hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
          {referrals.length > 0 ? (
            <div className="space-y-2.5">
              {referrals.slice(0, 4).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-cream/50 border border-cream-dark"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-brown-dark truncate">
                      {r.fullName}
                    </p>
                    <p className="text-[11px] text-brown-light/60">{r.instagram}</p>
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full ${statusColor(
                      r.status
                    )}`}
                  >
                    {r.status === "VERIFIED" && <CheckCircle className="h-3 w-3" />}
                    {r.status === "PENDING" && <Clock className="h-3 w-3" />}
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-brown-light/40 text-[13px]">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-30" />
              No referrals yet. Share your link to get started!
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl p-5 border border-cream-dark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-brown-dark">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-[11px] font-semibold bg-gold/10 text-gold px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          {notifications.length > 0 ? (
            <div className="space-y-2.5">
              {notifications.slice(0, 4).map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                    n.read
                      ? "bg-cream/30 border-cream-dark/50"
                      : "bg-gold/5 border-gold/15"
                  }`}
                >
                  <div className="shrink-0 mt-0.5">{notifIcon(n.type)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-brown-dark">{n.title}</p>
                    <p className="text-[11px] text-brown-light/60 line-clamp-2">{n.message}</p>
                  </div>
                  {!n.read && (
                    <div className="shrink-0 w-2 h-2 rounded-full bg-gold mt-1.5" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-brown-light/40 text-[13px]">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
              No notifications yet
            </div>
          )}
        </div>
      </div>

      {/* Progress toward next tier */}
      <div className="bg-white rounded-2xl p-5 border border-cream-dark">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
            <TrendingUp className="h-[18px] w-[18px] text-gold" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-brown-dark">Your Progress</h3>
            <p className="text-[12px] text-brown-light/50">Track your referral journey</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { tier: "Bronze", target: 10, color: "bg-amber-600" },
            { tier: "Silver", target: 20, color: "bg-gray-400" },
            { tier: "Gold", target: 30, color: "bg-gold" },
          ].map((t) => {
            const pct = Math.min((profile.verifiedReferrals / t.target) * 100, 100);
            const reached = profile.verifiedReferrals >= t.target;
            return (
              <div key={t.tier}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-medium text-brown-dark">{t.tier}</span>
                  <span className="text-[12px] font-semibold text-brown-light">
                    {profile.verifiedReferrals}/{t.target} verified
                  </span>
                </div>
                <div className="h-2.5 bg-cream-dark rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      reached ? t.color : "bg-gold/60"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
