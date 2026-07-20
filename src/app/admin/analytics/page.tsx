"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#5B2D90", "#C89A2B", "#4A2E1F", "#7B4DB0", "#D4AD4F"];

interface AnalyticsData {
  dailySignups: { date: string; count: number }[];
  topReferrers: { name: string; count: number }[];
  topSchools: { name: string; count: number }[];
  topStates: { name: string; count: number }[];
  referralConversion: number;
  totalSignups: number;
  totalVerified: number;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/admin/analytics");
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <PageWrapper>
          <FadeIn>
            <h1 className="text-3xl font-bold text-chocolate mb-8">Analytics</h1>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <FadeIn delay={0.1}>
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-chocolate/70">Total Signups</p>
                  <p className="text-3xl font-bold text-purple mt-1">{data.totalSignups}</p>
                </CardContent>
              </Card>
            </FadeIn>
            <FadeIn delay={0.15}>
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-chocolate/70">Total Verified</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{data.totalVerified}</p>
                </CardContent>
              </Card>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-chocolate/70">Conversion Rate</p>
                  <p className="text-3xl font-bold text-gold mt-1">{data.referralConversion}%</p>
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <FadeIn delay={0.25}>
              <Card>
                <CardHeader>
                  <CardTitle>Daily Signups</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.dailySignups}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F5E6D0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#5B2D90" strokeWidth={2} dot={{ fill: "#5B2D90" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.3}>
              <Card>
                <CardHeader>
                  <CardTitle>Top States</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={data.topStates} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {data.topStates.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FadeIn delay={0.35}>
              <Card>
                <CardHeader>
                  <CardTitle>Top Referrers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.topReferrers.map((r, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-sm font-bold text-chocolate/50 w-6">#{i + 1}</span>
                        <span className="flex-1 text-sm text-chocolate">{r.name}</span>
                        <span className="font-bold text-purple">{r.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.4}>
              <Card>
                <CardHeader>
                  <CardTitle>Top Schools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.topSchools.map((s, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-sm font-bold text-chocolate/50 w-6">#{i + 1}</span>
                        <span className="flex-1 text-sm text-chocolate">{s.name}</span>
                        <span className="font-bold text-purple">{s.count}</span>
                      </div>
                    ))}
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
