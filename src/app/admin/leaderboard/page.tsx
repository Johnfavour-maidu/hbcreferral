"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Trophy } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  fullName: string;
  totalReferrals: number;
  verifiedReferrals: number;
  state: string;
}

export default function AdminLeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch("/api/admin/leaderboard");
        if (res.ok) {
          const data = await res.json();
          setEntries(data.leaderboard);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  if (loading) {
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
            <h1 className="text-3xl font-bold text-chocolate flex items-center gap-3 mb-8">
              <Trophy className="h-8 w-8 text-gold" />
              Leaderboard Management
            </h1>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle>All Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-cream-dark">
                        <th className="text-left py-3 px-3 font-medium text-chocolate/70">Rank</th>
                        <th className="text-left py-3 px-3 font-medium text-chocolate/70">Name</th>
                        <th className="text-left py-3 px-3 font-medium text-chocolate/70">State</th>
                        <th className="text-center py-3 px-3 font-medium text-chocolate/70">Total</th>
                        <th className="text-center py-3 px-3 font-medium text-chocolate/70">Verified</th>
                        <th className="text-center py-3 px-3 font-medium text-chocolate/70">Tier</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((e) => (
                        <tr key={e.rank} className="border-b border-cream-dark/50 hover:bg-cream/50">
                          <td className="py-3 px-3 font-bold text-chocolate">#{e.rank}</td>
                          <td className="py-3 px-3 font-medium text-chocolate">{e.fullName}</td>
                          <td className="py-3 px-3 text-chocolate/70">{e.state}</td>
                          <td className="py-3 px-3 text-center text-purple font-bold">{e.totalReferrals}</td>
                          <td className="py-3 px-3 text-center text-green-600 font-bold">{e.verifiedReferrals}</td>
                          <td className="py-3 px-3 text-center">
                            <Badge variant={e.verifiedReferrals >= 30 ? "gold" : e.verifiedReferrals >= 20 ? "chocolate" : e.verifiedReferrals >= 10 ? "warning" : "default"}>
                              {e.verifiedReferrals >= 30 ? "Gold" : e.verifiedReferrals >= 20 ? "Silver" : e.verifiedReferrals >= 10 ? "Bronze" : "—"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </PageWrapper>
      </div>
    </div>
  );
}
