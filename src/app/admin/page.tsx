"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import {
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  UserCheck,
  ArrowUpRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface AdminStats {
  totalParticipants: number;
  verifiedReferrals: number;
  pendingVerifications: number;
  todayRegistrations: number;
  totalReferrals: number;
  topReferrer: string;
  dailyGrowth: { date: string; count: number }[];
  verificationRate: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple" />
      </div>
    );
  }

  const overviewCards = [
    { title: "Total Participants", value: stats.totalParticipants, icon: Users, color: "text-purple", href: "/admin/participants" },
    { title: "Verified Referrals", value: stats.verifiedReferrals, icon: CheckCircle, color: "text-green-600", href: "/admin/verification" },
    { title: "Pending Verification", value: stats.pendingVerifications, icon: Clock, color: "text-yellow-600", href: "/admin/verification" },
    { title: "Today's Registrations", value: stats.todayRegistrations, icon: TrendingUp, color: "text-gold", href: "/admin/participants" },
    { title: "Total Referrals", value: stats.totalReferrals, icon: ArrowUpRight, color: "text-purple-light", href: "/admin/leaderboard" },
    { title: "Top Referrer", value: stats.topReferrer || "N/A", icon: UserCheck, color: "text-chocolate", href: "/admin/leaderboard" },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <PageWrapper>
          <FadeIn>
            <h1 className="text-3xl font-bold text-chocolate mb-8">Admin Dashboard</h1>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {overviewCards.map((card, i) => (
              <FadeIn key={card.title} delay={i * 0.05}>
                <Link href={card.href}>
                  <Card className="hover:shadow-lg transition-all group cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-chocolate/70">{card.title}</p>
                          <p className={`text-2xl font-bold ${card.color} mt-1`}>
                            {typeof card.value === "number"
                              ? card.value.toLocaleString()
                              : card.value}
                          </p>
                        </div>
                        <card.icon className={`h-8 w-8 ${card.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </FadeIn>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FadeIn delay={0.3}>
              <Card>
                <CardHeader>
                  <CardTitle>Daily Registrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.dailyGrowth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F5E6D0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#5B2D90" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.4}>
              <Card>
                <CardHeader>
                  <CardTitle>Verification Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-[300px]">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-purple">
                        {stats.verificationRate}%
                      </div>
                      <p className="text-chocolate/70 mt-2">Referrals Verified</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </PageWrapper>
      </div>
    </div>
  );
}
