"use client";

import { useEffect, useState } from "react";
import {
  Users,
  CheckCircle,
  Clock,
  XCircle,
  School,
  MapPin,
  TrendingUp,
  ArrowRight,
  Trophy,
  BarChart3,
  UserPlus,
  Calendar,
  AlertTriangle,
  Eye,
  Activity,
  FileText,
  Settings,
  Gift,
  Search,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CampaignData {
  name: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  daysRemaining: number;
  registrationEnabled: boolean;
  leaderboardVisible: boolean;
}

interface Stats {
  totalParticipants: number;
  verifiedReferrals: number;
  pendingVerifications: number;
  rejectedReferrals: number;
  todayRegistrations: number;
  totalReferrals: number;
  topReferrer: string;
  topReferrerCount: number;
  activeSchools: number;
  statesCovered: number;
  dailyRegistrations: { date: string; count: number }[];
  dailyReferrals: { date: string; verified: number; pending: number }[];
  recentParticipants: {
    id: string;
    participantId: string;
    fullName: string;
    state: string;
    school: string;
    totalReferrals: number;
    verifiedReferrals: number;
    createdAt: string;
  }[];
  pendingVerificationsList: {
    id: string;
    referredEmail: string;
    referredInstagram: string;
    referrerName: string;
    createdAt: string;
    status: string;
  }[];
  topReferrers: {
    participantId: string;
    fullName: string;
    school: string;
    verifiedReferrals: number;
  }[];
  campaign: CampaignData | null;
  recentActivity: {
    type: string;
    message: string;
    timestamp: string;
  }[];
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  color,
  trend,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  description: string;
  color: string;
  trend?: string;
}) {
  return (
    <div className="bg-white rounded-xl p-5 border border-cream-dark hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-success">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-brown-dark">{typeof value === "number" ? value.toLocaleString() : value}</p>
      <p className="text-[12px] text-brown-light/60 mt-0.5">{label}</p>
      {description && <p className="text-[11px] text-brown-light/40 mt-1">{description}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20 text-brown-light">Failed to load dashboard data.</div>
    );
  }

  const activityIcons: Record<string, React.ElementType> = {
    registration: UserPlus,
    verified: CheckCircle,
    rejected: XCircle,
    default: Activity,
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-brown-dark">Dashboard Overview</h1>
        <p className="text-[13px] text-brown-light/60 mt-0.5">Referral Challenge 2026 – Edition 1</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Participants"
          value={stats.totalParticipants}
          description={`${stats.todayRegistrations} new today`}
          color="bg-gold/10 text-gold"
          trend="+12%"
        />
        <StatCard
          icon={CheckCircle}
          label="Verified Referrals"
          value={stats.verifiedReferrals}
          description={`${stats.totalReferrals > 0 ? Math.round((stats.verifiedReferrals / stats.totalReferrals) * 100) : 0}% verification rate`}
          color="bg-success/10 text-success"
        />
        <StatCard
          icon={Clock}
          label="Pending Verification"
          value={stats.pendingVerifications}
          description="Awaiting review"
          color="bg-warning/10 text-warning"
        />
        <StatCard
          icon={XCircle}
          label="Rejected Referrals"
          value={stats.rejectedReferrals}
          description="Declined"
          color="bg-error/10 text-error"
        />
        <StatCard
          icon={School}
          label="Schools"
          value={stats.activeSchools}
          description="Active institutions"
          color="bg-brown/10 text-brown"
        />
        <StatCard
          icon={MapPin}
          label="States"
          value={stats.statesCovered}
          description="Geographic reach"
          color="bg-gold/10 text-gold"
        />
        <StatCard
          icon={Calendar}
          label="Days Remaining"
          value={stats.campaign?.daysRemaining ?? "—"}
          description={stats.campaign?.status === "ACTIVE" ? "Campaign active" : "Campaign inactive"}
          color="bg-success/10 text-success"
        />
        <StatCard
          icon={Trophy}
          label="Current Leader"
          value={stats.topReferrer || "—"}
          description={stats.topReferrerCount > 0 ? `${stats.topReferrerCount} verified referrals` : "No referrals yet"}
          color="bg-gold/10 text-gold"
        />
      </div>

      {/* Pending Actions */}
      <div className="bg-white rounded-xl border border-cream-dark p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <h2 className="text-[15px] font-bold text-brown-dark">Pending Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <a
            href="/admin/verification"
            className="flex items-center justify-between p-4 rounded-lg bg-cream/40 border border-cream-dark hover:border-gold/30 transition-colors group"
          >
            <div>
              <p className="text-[14px] font-semibold text-brown-dark">{stats.pendingVerifications} referrals awaiting verification</p>
              <p className="text-[12px] text-brown-light/50 mt-0.5">Review and approve or reject</p>
            </div>
            <span className="text-gold text-[12px] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
              Verify <ArrowRight className="h-3 w-3" />
            </span>
          </a>
          <a
            href="/admin/participants"
            className="flex items-center justify-between p-4 rounded-lg bg-cream/40 border border-cream-dark hover:border-gold/30 transition-colors group"
          >
            <div>
              <p className="text-[14px] font-semibold text-brown-dark">{stats.todayRegistrations} new participants today</p>
              <p className="text-[12px] text-brown-light/50 mt-0.5">Review new registrations</p>
            </div>
            <span className="text-gold text-[12px] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
              Review <ArrowRight className="h-3 w-3" />
            </span>
          </a>
          <a
            href="/admin/exports"
            className="flex items-center justify-between p-4 rounded-lg bg-cream/40 border border-cream-dark hover:border-gold/30 transition-colors group"
          >
            <div>
              <p className="text-[14px] font-semibold text-brown-dark">Generate campaign reports</p>
              <p className="text-[12px] text-brown-light/50 mt-0.5">Export participant and referral data</p>
            </div>
            <span className="text-gold text-[12px] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
              Export <ArrowRight className="h-3 w-3" />
            </span>
          </a>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Registrations */}
        <div className="bg-white rounded-xl p-5 border border-cream-dark">
          <h3 className="text-[14px] font-bold text-brown-dark mb-1">Daily Registrations</h3>
          <p className="text-[11px] text-brown-light/50 mb-4">Last 7 days</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dailyRegistrations || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#7B5B43" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#7B5B43" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #F0EBE3", fontSize: 12 }} />
                <Bar dataKey="count" fill="#C89A2B" radius={[4, 4, 0, 0]} maxBarSize={36} name="Registrations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verified vs Pending */}
        <div className="bg-white rounded-xl p-5 border border-cream-dark">
          <h3 className="text-[14px] font-bold text-brown-dark mb-1">Referrals Overview</h3>
          <p className="text-[11px] text-brown-light/50 mb-4">Verified vs Pending (7 days)</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dailyReferrals || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#7B5B43" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#7B5B43" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #F0EBE3", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="verified" fill="#3BA55C" radius={[4, 4, 0, 0]} maxBarSize={36} name="Verified" />
                <Bar dataKey="pending" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={36} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity + Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-cream-dark">
          <div className="flex items-center justify-between p-5 pb-0">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-brown-light/60" />
              <h3 className="text-[14px] font-bold text-brown-dark">Recent Activity</h3>
            </div>
          </div>
          <div className="p-5 pt-3">
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {stats.recentActivity.map((a, i) => {
                  const Icon = activityIcons[a.type] || activityIcons.default;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="h-4 w-4 text-brown-light/60" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] text-brown-dark">{a.message}</p>
                        <p className="text-[11px] text-brown-light/40 mt-0.5">
                          {new Date(a.timestamp).toLocaleDateString("en-NG", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center py-6 text-brown-light/40 text-[13px]">No recent activity</p>
            )}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-xl border border-cream-dark">
          <div className="flex items-center justify-between p-5 pb-0">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-gold" />
              <h3 className="text-[14px] font-bold text-brown-dark">Top Performers</h3>
            </div>
            <a href="/admin/leaderboard" className="text-[12px] text-gold font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </a>
          </div>
          <div className="p-5 pt-3">
            {stats.topReferrers && stats.topReferrers.length > 0 ? (
              <div className="space-y-2">
                {stats.topReferrers.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-cream/40 transition-colors">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                      i === 0 ? "bg-gold/15 text-gold" : i === 1 ? "bg-brown/10 text-brown" : i === 2 ? "bg-warning/10 text-warning" : "bg-cream text-brown-light"
                    }`}>
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-brown-dark truncate">{r.fullName}</p>
                      <p className="text-[11px] text-brown-light/50">{r.participantId}</p>
                    </div>
                    <span className="text-[13px] font-bold text-gold shrink-0">{r.verifiedReferrals}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-brown-light/40 text-[13px]">No data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Campaign Status + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Campaign Status */}
        <div className="bg-white rounded-xl border border-cream-dark p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-4 w-4 text-brown-light/60" />
            <h3 className="text-[14px] font-bold text-brown-dark">Campaign Status</h3>
          </div>
          {stats.campaign ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-cream-dark/50">
                <span className="text-[12px] text-brown-light/60">Campaign</span>
                <span className="text-[13px] font-semibold text-brown-dark">{stats.campaign.name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-cream-dark/50">
                <span className="text-[12px] text-brown-light/60">Status</span>
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  stats.campaign.status === "ACTIVE" ? "bg-success/10 text-success" : "bg-cream text-brown-light"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${stats.campaign.status === "ACTIVE" ? "bg-success" : "bg-brown-light/40"}`} />
                  {stats.campaign.status}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-cream-dark/50">
                <span className="text-[12px] text-brown-light/60">Start Date</span>
                <span className="text-[13px] text-brown-dark">
                  {stats.campaign.startDate ? new Date(stats.campaign.startDate).toLocaleDateString("en-NG") : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-cream-dark/50">
                <span className="text-[12px] text-brown-light/60">End Date</span>
                <span className="text-[13px] text-brown-dark">
                  {stats.campaign.endDate ? new Date(stats.campaign.endDate).toLocaleDateString("en-NG") : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-cream-dark/50">
                <span className="text-[12px] text-brown-light/60">Days Remaining</span>
                <span className="text-[13px] font-semibold text-brown-dark">{stats.campaign.daysRemaining}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-cream-dark/50">
                <span className="text-[12px] text-brown-light/60">Registration</span>
                <span className={`text-[12px] font-semibold ${stats.campaign.registrationEnabled ? "text-success" : "text-error"}`}>
                  {stats.campaign.registrationEnabled ? "Open" : "Closed"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[12px] text-brown-light/60">Leaderboard</span>
                <span className={`text-[12px] font-semibold ${stats.campaign.leaderboardVisible ? "text-success" : "text-error"}`}>
                  {stats.campaign.leaderboardVisible ? "Visible" : "Hidden"}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-center py-6 text-brown-light/40 text-[13px]">No campaign data</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-cream-dark p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-brown-light/60" />
            <h3 className="text-[14px] font-bold text-brown-dark">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { icon: Users, label: "View Participants", href: "/admin/participants" },
              { icon: CheckCircle, label: "Verify Referrals", href: "/admin/verification" },
              { icon: Trophy, label: "Open Leaderboard", href: "/admin/leaderboard" },
              { icon: FileText, label: "Generate Reports", href: "/admin/exports" },
              { icon: Gift, label: "Manage Rewards", href: "/admin/rewards" },
              { icon: Settings, label: "Campaign Settings", href: "/admin/campaign" },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center gap-2.5 p-3 rounded-lg border border-cream-dark hover:border-gold/30 hover:bg-cream/30 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors shrink-0">
                  <action.icon className="h-4 w-4 text-gold" />
                </div>
                <span className="text-[12px] font-medium text-brown-dark group-hover:text-gold transition-colors">{action.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
