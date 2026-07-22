"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
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
    fetch("/api/admin/leaderboard")
      .then((r) => r.json())
      .then((d) => setEntries(d.leaderboard || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>;

  return (
    <PageWrapper>
      <FadeIn>
        <h1 className="text-3xl font-extrabold text-brown-dark flex items-center gap-3 mb-8">
          <Trophy className="h-8 w-8 text-gold" /> Leaderboard Management
        </h1>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card>
          <CardHeader><CardTitle>All Rankings</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-cream-dark">
                    <th className="text-left py-3 px-3 font-semibold text-brown-light">Rank</th>
                    <th className="text-left py-3 px-3 font-semibold text-brown-light">Name</th>
                    <th className="text-left py-3 px-3 font-semibold text-brown-light">State</th>
                    <th className="text-center py-3 px-3 font-semibold text-brown-light">Total</th>
                    <th className="text-center py-3 px-3 font-semibold text-brown-light">Verified</th>
                    <th className="text-center py-3 px-3 font-semibold text-brown-light">Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e) => (
                    <tr key={e.rank} className="border-b border-cream-dark/50 hover:bg-cream/50 transition-colors">
                      <td className="py-3 px-3 font-bold text-brown-dark">#{e.rank}</td>
                      <td className="py-3 px-3 font-medium text-brown-dark">{e.fullName}</td>
                      <td className="py-3 px-3 text-brown-light">{e.state}</td>
                      <td className="py-3 px-3 text-center text-gold font-bold">{e.totalReferrals}</td>
                      <td className="py-3 px-3 text-center text-success font-bold">{e.verifiedReferrals}</td>
                      <td className="py-3 px-3 text-center">
                        <Badge variant={e.verifiedReferrals >= 30 ? "gold" : e.verifiedReferrals >= 20 ? "brown" : e.verifiedReferrals >= 10 ? "warning" : "cream"}>
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
  );
}
