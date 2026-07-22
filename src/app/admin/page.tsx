"use client";

import { useEffect, useState } from "react";
import {
  Users,
  CheckCircle,
  Clock,
  XCircle,
  School,
  MapPin,
  Eye,
  Share2,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Trophy,
  AlertCircle,
  Settings,
  FileText,
  Download,
  Gift,
  BarChart3,
  UserPlus,
  Activity,
  Calendar,
  Zap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useSession } from "next-auth/react";

interface Stats {
  totalParticipants: number;
  verifiedReferrals: number;
  pendingVerifications: number;
  rejectedReferrals: number;
  todayRegistrations: number;
  totalReferrals: number;
  topReferrer: string;
  activeSchools: number;
  statesCovered: number;
  dailyGrowth: { date: string; count: number }[];
  verificationRate: number;
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
    fullName: string;
    school: string;
    verifiedReferrals: number;
  }[];
  topStates: { name: string; count: number }[];
}

const PIE_COLORS = ["#C89A2B", "#F59E0B", "#DC2626"];

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  trend,
  color,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down";
  color: string;
  description?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-cream-dark hover:shadow-lg hover:shadow-brown/5 transition-all duration-300 hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        {change && (
          <span className={`flex items-center gap-1 text-[11px] font-semibold ${trend === "up" ? "text-success" : "text-error"}`}>
            {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {change}
          </span>
        )}
      </div>
      <p className="text-[11px] font-medium uppercase tracking-wider text-brown-light/60 mb-1">{label}</p>
      <p className="text-2xl font-extrabold text-brown-dark">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {description && <p className="text-[11px] text-brown-light/40 mt-1">{description}</p>}
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-cream-dark hover:border-gold/30 hover:shadow-md hover:shadow-gold/5 transition-all duration-200 group"
    >
      <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
        <Icon className="h-4 w-4 text-gold" />
      </div>
      <span className="text-[13px] font-medium text-brown-dark group-hover:text-gold transition-colors">{label}</span>
    </a>
  );
}

export default function AdminDashboard() {
  const { data: session } = useSession();
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

  const pieData = [
    { name: "Verified", value: stats.verifiedReferrals || 0 },
    { name: "Pending", value: stats.pendingVerifications || 0 },
    { name: "Rejected", value: stats.rejectedReferrals || 0 },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1C1410] via-[#2A1F17] to-[#1C1410] rounded-2xl p-6 lg:p-8 text-cream">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/3 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 bg-success/20 text-success text-[11px] font-semibold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              Campaign Active
            </span>
            <span className="text-cream/40 text-[12px]">10 Days Remaining</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold mb-1">
            Welcome back, {session?.user?.name?.split(" ")[0] || "Admin"}
          </h1>
          <p className="text-cream/50 text-sm">
            Referral Challenge Management Dashboard — {stats.totalParticipants} participants and counting
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-cream/60 text-[13px]">
              <Calendar className="h-4 w-4" />
              <span>Campaign ends Aug 15, 2026</span>
            </div>
            <div className="flex items-center gap-2 text-cream/60 text-[13px]">
              <Zap className="h-4 w-4 text-gold" />
              <span>{stats.verificationRate}% verification rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Participants"
          value={stats.totalParticipants}
          change="+12%"
          trend="up"
          color="bg-gold/10 text-gold"
          description="Total registered"
        />
        <StatCard
          icon={CheckCircle}
          label="Verified"
          value={stats.verifiedReferrals}
          change="+8%"
          trend="up"
          color="bg-success/10 text-success"
          description="Referrals approved"
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={stats.pendingVerifications}
          color="bg-warning/10 text-warning"
          description="Awaiting review"
        />
        <StatCard
          icon={XCircle}
          label="Rejected"
          value={stats.rejectedReferrals}
          color="bg-error/10 text-error"
          description="Declined referrals"
        />
        <StatCard
          icon={School}
          label="Schools"
          value={stats.activeSchools}
          change="+3"
          trend="up"
          color="bg-brown/10 text-brown"
          description="Active institutions"
        />
        <StatCard
          icon={MapPin}
          label="States"
          value={stats.statesCovered}
          color="bg-gold/10 text-gold"
          description="Geographic reach"
        />
        <StatCard
          icon={UserPlus}
          label="Today"
          value={stats.todayRegistrations}
          color="bg-success/10 text-success"
          description="New signups today"
        />
        <StatCard
          icon={BarChart3}
          label="Total Refs"
          value={stats.totalReferrals}
          color="bg-brown-light/10 text-brown-light"
          description="All referrals"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Daily Registrations */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-cream-dark">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-bold text-brown-dark">Daily Registrations</h3>
              <p className="text-[11px] text-brown-light/50 mt-0.5">Last 7 days</p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-success font-semibold">
              <TrendingUp className="h-3 w-3" /> +12% this week
            </div>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dailyGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#7B5B43" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#7B5B43" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #F0EBE3", fontSize: 12 }} />
                <Bar dataKey="count" fill="#C89A2B" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Referral Status Pie */}
        <div className="bg-white rounded-2xl p-5 border border-cream-dark">
          <h3 className="text-[15px] font-bold text-brown-dark mb-1">Referral Status</h3>
          <p className="text-[11px] text-brown-light/50 mb-4">Distribution overview</p>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #F0EBE3", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                <span className="text-[11px] text-brown-light">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions + Pending */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-5 border border-cream-dark">
          <h3 className="text-[15px] font-bold text-brown-dark mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2.5">
            <QuickAction icon={CheckCircle} label="Approve Referrals" href="/admin/verification" />
            <QuickAction icon={Download} label="Export Reports" href="/admin/exports" />
            <QuickAction icon={Trophy} label="View Leaderboard" href="/admin/leaderboard" />
            <QuickAction icon={Settings} label="Campaign Settings" href="/admin/campaign" />
            <QuickAction icon={Gift} label="Manage Rewards" href="/admin/rewards" />
            <QuickAction icon={FileText} label="View Analytics" href="/admin/analytics" />
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="bg-white rounded-2xl p-5 border border-cream-dark">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-bold text-brown-dark">Pending Verifications</h3>
              <p className="text-[11px] text-brown-light/50 mt-0.5">{stats.pendingVerifications} items awaiting review</p>
            </div>
            <a href="/admin/verification" className="text-[12px] text-gold font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </a>
          </div>
          {stats.pendingVerificationsList && stats.pendingVerificationsList.length > 0 ? (
            <div className="space-y-2.5">
              {stats.pendingVerificationsList.slice(0, 4).map((v) => (
                <div key={v.id} className="flex items-center justify-between p-3 rounded-xl bg-cream/50 border border-cream-dark">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-brown-dark truncate">{v.referredEmail}</p>
                    <p className="text-[11px] text-brown-light/60">
                      by {v.referrerName} · {v.referredInstagram}
                    </p>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1 bg-warning/10 text-warning text-[10px] font-semibold px-2 py-1 rounded-full">
                    <Clock className="h-3 w-3" /> Pending
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-brown-light/40 text-[13px]">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-30" />
              No pending verifications
            </div>
          )}
        </div>
      </div>

      {/* Top Referrers + Top States */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Referrers */}
        <div className="bg-white rounded-2xl p-5 border border-cream-dark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-brown-dark">Top Referrers</h3>
            <a href="/admin/leaderboard" className="text-[12px] text-gold font-semibold hover:underline flex items-center gap-1">
              Full Leaderboard <ArrowRight className="h-3 w-3" />
            </a>
          </div>
          <div className="space-y-2">
            {stats.topReferrers && stats.topReferrers.length > 0 ? (
              stats.topReferrers.slice(0, 5).map((r, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream/50 transition-colors">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                    i === 0 ? "bg-gold/15 text-gold" : i === 1 ? "bg-brown/10 text-brown" : i === 2 ? "bg-warning/10 text-warning" : "bg-cream text-brown-light"
                  }`}>
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-brown-dark truncate">{r.fullName}</p>
                    <p className="text-[11px] text-brown-light/50">{r.school}</p>
                  </div>
                  <span className="text-[13px] font-bold text-gold shrink-0">{r.verifiedReferrals}</span>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-brown-light/40 text-[13px]">No data yet</p>
            )}
          </div>
        </div>

        {/* Top States */}
        <div className="bg-white rounded-2xl p-5 border border-cream-dark">
          <h3 className="text-[15px] font-bold text-brown-dark mb-4">Top Performing States</h3>
          {stats.topStates && stats.topStates.length > 0 ? (
            <div className="space-y-3">
              {stats.topStates.slice(0, 5).map((s, i) => {
                const max = stats.topStates[0].count;
                const pct = max > 0 ? (s.count / max) * 100 : 0;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-medium text-brown-dark">{s.name}</span>
                      <span className="text-[12px] font-semibold text-brown-light">{s.count}</span>
                    </div>
                    <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-gold to-gold-dark rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center py-6 text-brown-light/40 text-[13px]">No data yet</p>
          )}
        </div>
      </div>

      {/* Recent Participants */}
      <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden">
        <div className="flex items-center justify-between p-5 pb-0">
          <div>
            <h3 className="text-[15px] font-bold text-brown-dark">Recent Participants</h3>
            <p className="text-[11px] text-brown-light/50 mt-0.5">Latest registrations</p>
          </div>
          <a href="/admin/participants" className="text-[12px] text-gold font-semibold hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-3 w-3" />
          </a>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-cream-dark">
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-brown-light/50">ID</th>
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-brown-light/50">Name</th>
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-brown-light/50">State</th>
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-brown-light/50">School</th>
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-brown-light/50">Referrals</th>
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-brown-light/50">Verified</th>
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-brown-light/50">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentParticipants && stats.recentParticipants.length > 0 ? (
                stats.recentParticipants.slice(0, 5).map((p) => (
                  <tr key={p.id} className="border-b border-cream-dark/50 last:border-0 hover:bg-cream/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-[11px] text-gold font-semibold">{p.participantId}</td>
                    <td className="px-5 py-3.5 text-[13px] font-semibold text-brown-dark">{p.fullName}</td>
                    <td className="px-5 py-3.5 text-[13px] text-brown-light">{p.state}</td>
                    <td className="px-5 py-3.5 text-[13px] text-brown-light">{p.school}</td>
                    <td className="px-5 py-3.5 text-[13px] font-semibold text-gold">{p.totalReferrals}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 bg-success/10 text-success text-[11px] font-semibold px-2 py-0.5 rounded-full">
                        {p.verifiedReferrals}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-brown-light/60">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-brown-light/40 text-[13px]">No participants yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
