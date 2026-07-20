"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { History, CheckCircle, Clock, XCircle } from "lucide-react";

interface ReferralEntry {
  id: string;
  fullName: string;
  instagram: string;
  status: string;
  createdAt: string;
}

export default function ReferralHistoryPage() {
  const [referrals, setReferrals] = useState<ReferralEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/referrals")
      .then((r) => r.json())
      .then((d) => setReferrals(d.referrals || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusConfig = {
    PENDING: { label: "Pending", variant: "warning" as const, icon: Clock },
    VERIFIED: { label: "Verified", variant: "success" as const, icon: CheckCircle },
    REJECTED: { label: "Rejected", variant: "danger" as const, icon: XCircle },
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>;
  }

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-5 sm:px-10 lg:px-20 py-8 lg:py-12">
        <FadeIn>
          <h1 className="text-3xl font-extrabold text-brown-dark flex items-center gap-3 mb-8">
            <History className="h-8 w-8 text-gold" />
            Referral History
          </h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle>Your Referrals ({referrals.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {referrals.length > 0 ? (
                <div className="overflow-x-auto -mx-6 px-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-cream-dark">
                        <th className="text-left py-3 px-4 font-semibold text-brown-light">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-brown-light">Instagram</th>
                        <th className="text-left py-3 px-4 font-semibold text-brown-light">Joined</th>
                        <th className="text-left py-3 px-4 font-semibold text-brown-light">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referrals.map((ref) => {
                        const status = statusConfig[ref.status as keyof typeof statusConfig];
                        const StatusIcon = status?.icon || Clock;
                        return (
                          <tr key={ref.id} className="border-b border-cream-dark/50 hover:bg-cream/50 transition-colors">
                            <td className="py-3 px-4 font-medium text-brown-dark">{ref.fullName}</td>
                            <td className="py-3 px-4 text-brown-light">{ref.instagram}</td>
                            <td className="py-3 px-4 text-brown-light/70">{new Date(ref.createdAt).toLocaleDateString()}</td>
                            <td className="py-3 px-4">
                              <Badge variant={status?.variant || "default"} className="gap-1">
                                <StatusIcon className="h-3 w-3" />
                                {status?.label || ref.status}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-brown-light/50 py-8">No referrals yet. Share your link to get started!</p>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </PageWrapper>
  );
}
