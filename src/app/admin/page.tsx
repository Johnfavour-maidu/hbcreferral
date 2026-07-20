"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Users, CheckCircle, Clock, TrendingUp, UserCheck, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>;
  }

  const overviewCards = [
    { title: "Total Participants", value: stats.totalParticipants.toLocaleString(), icon: Users, color: "text-gold", bg: "bg-gold/10", href: "/admin/participants" },
    { title: "Verified Referrals", value: stats.verifiedReferrals.toLocaleString(), icon: CheckCircle, color: "text-success", bg: "bg-success/10", href: "/admin/verification" },
    { title: "Pending Verification", value: stats.pendingVerifications.toLocaleString(), icon: Clock, color: "text-warning", bg: "bg-warning/10", href: "/admin/verification" },
    { title: "Today's Registrations", value: stats.todayRegistrations.toLocaleString(), icon: TrendingUp, color: "text-gold", bg: "bg-gold/10", href: "/admin/participants" },
    { title: "Total Referrals", value: stats.totalReferrals.toLocaleString(), icon: ArrowUpRight, color: "text-brown", bg: "bg-brown/10", href: "/admin/leaderboard" },
    { title: "Top Referrer", value: stats.topReferrer || "N/A", icon: UserCheck, color: "text-gold", bg: "bg-gold/10", href: "/admin/leaderboard" },
  ];

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminSidebar />
      <div className="flex-1 p-6 lg:p-8">
        <PageWrapper>
          <FadeIn>
            <h1 className="text-3xl font-extrabold text-brown-dark mb-8">Admin Dashboard</h1>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {overviewCards.map((card, i) => (
              <FadeIn key={card.title} delay={i * 0.05}>
                <Link href={card.href}>
                  <Card className="group cursor-pointer">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-brown-light">{card.title}</p>
                          <p className={`text-2xl font-extrabold ${card.color} mt-1`}>{card.value}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <card.icon className={`h-5 w-5 ${card.color}`} />
                        </div>
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
                <CardContent className="p-6">
                  <h3 className="font-bold text-brown-dark mb-4">Daily Registrations</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.dailyGrowth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F7F3EC" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#C89A2B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.4}>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-brown-dark mb-4">Verification Rate</h3>
                  <div className="flex items-center justify-center h-[300px]">
                    <div className="text-center">
                      <div className="text-6xl font-extrabold text-gold">{stats.verificationRate}%</div>
                      <p className="text-brown-light mt-2">Referrals Verified</p>
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
