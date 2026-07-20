"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Gift } from "lucide-react";

interface Reward {
  id: string;
  name: string;
  tier: string;
  value: number;
  claimed: boolean;
  createdAt: string;
}

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/rewards")
      .then((r) => r.json())
      .then((d) => setRewards(d.rewards || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>;

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminSidebar />
      <div className="flex-1 p-6 lg:p-8">
        <PageWrapper>
          <FadeIn>
            <h1 className="text-3xl font-extrabold text-brown-dark flex items-center gap-3 mb-8">
              <Gift className="h-8 w-8 text-gold" /> Rewards Management
            </h1>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Card>
              <CardHeader><CardTitle>All Rewards</CardTitle></CardHeader>
              <CardContent>
                {rewards.length > 0 ? (
                  <div className="overflow-x-auto -mx-6 px-6">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-cream-dark">
                          <th className="text-left py-3 px-3 font-semibold text-brown-light">Name</th>
                          <th className="text-left py-3 px-3 font-semibold text-brown-light">Tier</th>
                          <th className="text-center py-3 px-3 font-semibold text-brown-light">Value</th>
                          <th className="text-center py-3 px-3 font-semibold text-brown-light">Status</th>
                          <th className="text-left py-3 px-3 font-semibold text-brown-light">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rewards.map((r) => (
                          <tr key={r.id} className="border-b border-cream-dark/50 hover:bg-cream/50 transition-colors">
                            <td className="py-3 px-3 font-medium text-brown-dark">{r.name}</td>
                            <td className="py-3 px-3">
                              <Badge variant={r.tier === "GOLD" ? "gold" : r.tier === "SILVER" ? "brown" : "warning"}>{r.tier}</Badge>
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-gold">₦{r.value.toLocaleString()}</td>
                            <td className="py-3 px-3 text-center">
                              <Badge variant={r.claimed ? "success" : "warning"}>{r.claimed ? "Claimed" : "Unclaimed"}</Badge>
                            </td>
                            <td className="py-3 px-3 text-brown-light">{new Date(r.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-brown-light/50 py-8">No rewards distributed yet</p>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </PageWrapper>
      </div>
    </div>
  );
}
