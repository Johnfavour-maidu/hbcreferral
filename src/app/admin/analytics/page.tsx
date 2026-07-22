"use client";

import { useEffect, useState } from "react";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { BarChart3, TrendingUp, Users, CheckCircle } from "lucide-react";
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

function StatBox({ icon: Icon, label, value, color, bg }: {
  icon: React.ElementType; label: string; value: string | number; color: string; bg: string;
}) {
  return (
    <div style={{
      background: "white", borderRadius: 16, border: "1.5px solid #E7D8C6",
      padding: "20px 24px", display: "flex", alignItems: "center", gap: 14,
    }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon style={{ width: 20, height: 20, color }} />
      </div>
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#A08060", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 24, fontWeight: 800, color: "#2D2118" }}>{value}</p>
      </div>
    </div>
  );
}

function ListCard({ title, items, labelKey, valueKey }: {
  title: string; items: Record<string, string | number>[]; labelKey: string; valueKey: string;
}) {
  return (
    <div style={{ background: "white", borderRadius: 20, border: "1.5px solid #E7D8C6", overflow: "hidden" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1.5px solid #F0EBE3" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#2D2118" }}>{title}</h3>
      </div>
      <div style={{ padding: "16px 24px" }}>
        {items.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", borderRadius: 10, transition: "background 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#FFF8EF"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, color: "#A08060", width: 24 }}>#{i + 1}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#2D2118" }}>{String(item[labelKey])}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#C89A2B" }}>{String(item[valueKey])}</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", padding: "24px 0", color: "#A08060", fontSize: 13 }}>No data yet</p>
        )}
      </div>
    </div>
  );
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
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #F0EBE3", borderTopColor: "#C89A2B", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  return (
    <PageWrapper>
      <FadeIn>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#2D2118", marginBottom: 28 }}>Analytics</h1>
      </FadeIn>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatBox icon={Users} label="Total Signups" value={data.totalSignups} color="#C89A2B" bg="#FEF3C7" />
        <StatBox icon={CheckCircle} label="Total Verified" value={data.totalVerified} color="#16A34A" bg="#DCFCE7" />
        <StatBox icon={TrendingUp} label="Conversion Rate" value={`${data.referralConversion}%`} color="#C89A2B" bg="#FEF3C7" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 20, marginBottom: 28 }}>
        <FadeIn delay={0.1}>
          <div style={{ background: "white", borderRadius: 20, border: "1.5px solid #E7D8C6", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1.5px solid #F0EBE3" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#2D2118" }}>Daily Signups</h3>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.dailySignups}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#7B5B43" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#7B5B43" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E7D8C6", fontSize: 12 }} />
                  <Line type="monotone" dataKey="count" stroke="#C89A2B" strokeWidth={2.5} dot={{ fill: "#C89A2B", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div style={{ background: "white", borderRadius: 20, border: "1.5px solid #E7D8C6", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1.5px solid #F0EBE3" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#2D2118" }}>Top States</h3>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={data.topStates} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {data.topStates.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E7D8C6", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </FadeIn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 20 }}>
        <FadeIn delay={0.2}>
          <ListCard title="Top Referrers" items={data.topReferrers} labelKey="name" valueKey="count" />
        </FadeIn>
        <FadeIn delay={0.25}>
          <ListCard title="Top Schools" items={data.topSchools} labelKey="name" valueKey="count" />
        </FadeIn>
      </div>
    </PageWrapper>
  );
}
