"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle,
  Clock,
  Trophy,
  Copy,
  Share2,
  Hash,
  ArrowRight,
  Bell,
  TrendingUp,
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

/* ─── Share Icons ─── */

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function SnapchatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12.925-.214.093-.04.195-.06.3-.06.337 0 .659.135.889.373.18.195.27.449.24.718-.03.3-.18.585-.42.795-.15.135-.33.24-.525.315l-.03.015c.15.075.285.165.405.27.24.225.375.54.375.885 0 .375-.165.72-.465.96-.165.135-.36.225-.57.285-.21.06-.435.09-.66.09-.105 0-.21-.015-.315-.03-.195 1.035-.72 1.995-1.455 2.7-.375.36-.81.645-1.29.825-.465.18-.96.255-1.455.255h-.3c-.495 0-1.005-.075-1.47-.255-.465-.18-.9-.465-1.275-.825-.72-.705-1.245-1.665-1.455-2.7-.105.015-.21.03-.315.03-.225 0-.45-.03-.66-.09-.21-.06-.405-.15-.57-.285-.3-.24-.465-.585-.465-.96 0-.345.135-.66.375-.885.12-.105.255-.195.405-.27l-.03-.015c-.195-.06-.375-.165-.525-.315-.24-.21-.39-.495-.42-.795-.03-.27.06-.525.24-.715.225-.24.54-.375.87-.375.105 0 .21.015.3.06.27.09.615.21.93.215.195 0 .33-.045.4-.09-.01-.165-.02-.33-.03-.51l-.003-.06c-.105-1.628-.228-3.654.3-4.847C7.354 1.07 10.716.794 11.706.794h.5z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13.2a8.16 8.16 0 005.58 2.18v-3.45a4.85 4.85 0 01-3.58-1.59V6.69h3.58z" />
    </svg>
  );
}

/* ─── Main Dashboard ─── */

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-[3px] border-gold/20 border-t-gold rounded-full animate-spin" />
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
  const referralMessage = `Join Hearts by Charming Referral Challenge! Use my link: ${profile.referralLink}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: WhatsAppIcon,
      url: `https://wa.me/?text=${encodeURIComponent(referralMessage)}`,
      bg: "bg-[#25D366]",
      hoverBg: "hover:bg-[#20BD5A]",
      shadow: "hover:shadow-[0_8px_20px_rgba(37,211,102,0.3)]",
    },
    {
      name: "Facebook",
      icon: FacebookIcon,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profile.referralLink)}`,
      bg: "bg-[#1877F2]",
      hoverBg: "hover:bg-[#1565C0]",
      shadow: "hover:shadow-[0_8px_20px_rgba(24,119,242,0.3)]",
    },
    {
      name: "Telegram",
      icon: TelegramIcon,
      url: `https://t.me/share/url?url=${encodeURIComponent(profile.referralLink)}&text=${encodeURIComponent("Join Hearts by Charming Referral Challenge!")}`,
      bg: "bg-[#0088CC]",
      hoverBg: "hover:bg-[#0077B3]",
      shadow: "hover:shadow-[0_8px_20px_rgba(0,136,204,0.3)]",
    },
    {
      name: "Instagram",
      icon: InstagramIcon,
      url: `https://www.instagram.com/direct/new/?text=${encodeURIComponent(referralMessage)}`,
      bg: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
      hoverBg: "hover:opacity-90",
      shadow: "hover:shadow-[0_8px_20px_rgba(225,48,108,0.3)]",
    },
    {
      name: "TikTok",
      icon: TikTokIcon,
      url: "#",
      bg: "bg-[#010101]",
      hoverBg: "hover:bg-[#1a1a1a]",
      shadow: "hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)]",
    },
    {
      name: "Snapchat",
      icon: SnapchatIcon,
      url: `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(profile.referralLink)}`,
      bg: "bg-[#FFFC00]",
      hoverBg: "hover:bg-[#E6E300]",
      shadow: "hover:shadow-[0_8px_20px_rgba(255,252,0,0.3)]",
      textColor: "text-black",
    },
    {
      name: "X",
      icon: XIcon,
      url: `https://x.com/intent/post?text=${encodeURIComponent(referralMessage)}`,
      bg: "bg-[#000000]",
      hoverBg: "hover:bg-[#1a1a1a]",
      shadow: "hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)]",
    },
  ];

  const handleTikTok = (e: React.MouseEvent) => {
    e.preventDefault();
    copyToClipboard(profile.referralLink);
    toast.info("Link copied! Open TikTok and paste it in your bio or story.", {
      duration: 5000,
    });
  };

  const socials = [
    {
      name: "Instagram",
      icon: InstagramIcon,
      href: "https://www.instagram.com/heartsbycharming_?igsh=MWRtbjlzeGZtNGI5MA%3D%3D&utm_source=qr",
      bg: "bg-gradient-to-br from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]",
      hoverShadow: "hover:shadow-[0_8px_24px_rgba(225,48,108,0.3)]",
    },
    {
      name: "Facebook",
      icon: FacebookIcon,
      href: "https://www.facebook.com/share/195h1uZfnZ/?mibextid=wwXIfr",
      bg: "bg-[#1877F2]",
      hoverShadow: "hover:shadow-[0_8px_24px_rgba(24,119,242,0.3)]",
    },
    {
      name: "TikTok",
      icon: TikTokIcon,
      href: "https://www.tiktok.com/@hbc_teens?_r=1&_t=ZS-98DgJMe73Nl",
      bg: "bg-[#010101]",
      hoverShadow: "hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]",
    },
  ];

  const stats = [
    {
      label: "Total Referrals",
      value: profile.totalReferrals,
      description: "Total invited participants",
      icon: Users,
      color: "text-gold",
      bg: "bg-gold/10",
      border: "border-gold/15",
    },
    {
      label: "Verified",
      value: profile.verifiedReferrals,
      description: "Confirmed referrals",
      icon: CheckCircle,
      color: "text-success",
      bg: "bg-success/10",
      border: "border-success/15",
    },
    {
      label: "Pending",
      value: profile.pendingReferrals,
      description: "Awaiting verification",
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/15",
    },
    {
      label: "Leaderboard",
      value: `#${data.leaderboardPosition}`,
      description: "Your current rank",
      icon: Trophy,
      color: "text-[#8B5CF6]",
      bg: "bg-[#8B5CF6]/10",
      border: "border-[#8B5CF6]/15",
    },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

      {/* ─── Header ─── */}
      <div className="mb-8">
        <h1 className="text-[28px] sm:text-[32px] lg:text-[36px] font-extrabold text-brown-dark leading-tight tracking-tight">
          Hello, {firstName} 👋
        </h1>
        <p className="text-brown-light/60 text-[14px] sm:text-[15px] mt-1.5">
          Welcome to your Hearts by Charming Referral Dashboard
        </p>
        <div className="mt-3">
          <span className="inline-flex items-center gap-1.5 bg-gold/10 text-gold-dark text-[11px] font-semibold px-3 py-1.5 rounded-full border border-gold/20">
            <Hash className="h-3 w-3" />
            {profile.participantId}
          </span>
        </div>
      </div>

      {/* ─── Stat Cards (Horizontal) ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-[18px] border border-cream-dark/60 p-4 sm:p-5 hover:shadow-[0_4px_16px_rgba(74,46,31,0.08),0_12px_32px_rgba(74,46,31,0.06)] hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${stat.bg} border ${stat.border} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300`}
              >
                <stat.icon
                  className={`h-5 w-5 sm:h-[22px] sm:w-[22px] ${stat.color}`}
                  strokeWidth={2}
                />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-[12px] text-brown-light/60 font-medium uppercase tracking-wide truncate">
                  {stat.label}
                </p>
                <p
                  className={`text-[24px] sm:text-[28px] font-extrabold ${stat.color} leading-none mt-0.5`}
                >
                  {typeof stat.value === "number"
                    ? stat.value.toLocaleString()
                    : stat.value}
                </p>
                <p className="text-[10px] sm:text-[11px] text-brown-light/40 font-medium mt-0.5 truncate">
                  {stat.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Divider ─── */}
      <div className="h-px bg-gradient-to-r from-transparent via-cream-dark to-transparent mb-10" />

      {/* ─── Referral Link Card ─── */}
      <div className="bg-white rounded-[20px] border border-cream-dark/60 overflow-hidden mb-10 hover:shadow-[0_4px_16px_rgba(74,46,31,0.06)] transition-shadow duration-300">
        <div className="h-[2px] bg-gradient-to-r from-gold/40 via-gold to-gold/40" />
        <div className="p-6 sm:p-8">
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
          <div className="flex items-center gap-2 p-3 sm:p-3.5 bg-cream/70 rounded-2xl border border-cream-dark/80 mb-3">
            <code className="flex-1 text-[13px] sm:text-[14px] text-brown-dark/80 break-all font-mono leading-relaxed select-all">
              {profile.referralLink}
            </code>
            <button
              onClick={() => copyToClipboard(profile.referralLink)}
              className={`shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                copied
                  ? "bg-success/10 text-success hover:bg-success/20"
                  : "bg-gold/10 text-gold hover:bg-gold/20"
              }`}
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>

          {/* Referral Code */}
          <span className="inline-flex items-center text-[11px] text-brown-light/50 font-mono bg-cream-dark/40 px-2.5 py-1 rounded-lg">
            Code: {profile.referralCode}
          </span>

          {/* Share Section */}
          <div className="mt-6">
            <p className="text-[11px] text-brown-light/50 font-medium uppercase tracking-wide mb-3">
              Share via
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={link.name === "TikTok" ? handleTikTok : undefined}
                  className={`flex items-center justify-center gap-2 h-11 rounded-2xl text-[13px] font-semibold text-white ${link.bg} ${link.hoverBg} ${link.shadow} ${link.textColor || ""} hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Follow Hearts by Charming ─── */}
      <div className="mb-10">
        <div className="brown-gradient rounded-[24px] overflow-hidden">
          <div className="px-8 md:px-16 text-center" style={{ paddingTop: 40, paddingBottom: 36 }}>
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-cream leading-tight mb-4">
              Follow Hearts by Charming
            </h2>
            <div className="max-w-[580px] mx-auto mb-8">
              <p className="text-cream/65 text-[15px] md:text-[17px] leading-[1.8]">
                Stay connected with Hearts by Charming for inspiring content and community highlights.
                Follow us and never miss an update.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${s.bg} group flex items-center justify-center gap-3 h-[52px] min-w-[170px] w-full sm:w-[170px] rounded-2xl text-white font-semibold text-[15px] shadow-lg transition-all duration-250 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-2xl hover:brightness-110`}
                >
                  <s.icon className="h-5 w-5" />
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Leaderboard Card ─── */}
      <div className="bg-white rounded-[20px] border border-cream-dark/60 overflow-hidden hover:shadow-[0_4px_16px_rgba(74,46,31,0.06)] transition-shadow duration-300">
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
            <Trophy className="h-7 w-7 text-gold" strokeWidth={1.8} />
          </div>
          <div className="flex-1">
            <h3 className="text-[17px] font-bold text-brown-dark leading-none mb-1.5">
              Leaderboard
            </h3>
            <p className="text-[13px] sm:text-[14px] text-brown-light/60 leading-relaxed">
              See where you rank among all participants and track your progress.
            </p>
          </div>
          <Link
            href="/leaderboard"
            className="shrink-0 inline-flex items-center gap-2 h-11 sm:h-12 rounded-2xl px-6 sm:px-8 bg-gold hover:bg-gold-dark text-white font-semibold text-[14px] shadow-[0_4px_12px_rgba(200,154,43,0.25)] hover:shadow-[0_6px_20px_rgba(200,154,43,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <Trophy className="h-4 w-4" />
            View Leaderboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
