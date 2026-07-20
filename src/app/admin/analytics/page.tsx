"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#C89A2B", "#4A2E1F", "#7B5B43", "#E5C66A", "#A07A1F"];

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
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>;
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminSidebar />
      <div className="flex-1 p-6 lg:p-8">
        <PageWrapper>
          <FadeIn>
            <h1 className="text-3xl font-extrabold text-brown-dark mb-8">Analytics</h1>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Signups", value: data.totalSignups, color: "text-gold" },
              { label: "Total Verified", value: data.totalVerified, color: "text-success" },
              { label: "Conversion Rate", value: `${data.referralConversion}%`, color: "text-gold" },
            ].map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.05}>
                <Card><CardContent className="p-5 text-center">
                  <p className="text-sm text-brown-light">{s.label}</p>
                  <p className={`text-3xl font-extrabold ${s.color} mt-1`}>{s.value}</p>
                </CardContent></Card>
              </FadeIn>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <FadeIn delay={0.2}>
              <Card>
                <CardHeader><CardTitle>Daily Signups</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.dailySignups}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F7F3EC" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#C89A2B" strokeWidth={2} dot={{ fill: "#C89A2B" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.3}>
              <Card>
                <CardHeader><CardTitle>Top States</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={data.topStates} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {data.topStates.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
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
                <CardHeader><CardTitle>Top Referrers</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.topReferrers.map((r, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-cream transition-colors">
                        <span className="text-sm font-bold text-brown-light/50 w-6">#{i + 1}</span>
                        <span className="flex-1 text-sm text-brown-dark">{r.name}</span>
                        <span className="font-bold text-gold">{r.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.4}>
              <Card>
                <CardHeader><CardTitle>Top Schools</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.topSchools.map((s, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-cream transition-colors">
                        <span className="text-sm font-bold text-brown-light/50 w-6">#{i + 1}</span>
                        <span className="flex-1 text-sm text-brown-dark">{s.name}</span>
                        <span className="font-bold text-gold">{s.count}</span>
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
