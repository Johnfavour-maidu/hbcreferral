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
    async function fetchReferrals() {
      try {
        const res = await fetch("/api/referrals");
        if (res.ok) {
          const data = await res.json();
          setReferrals(data.referrals);
        }
      } catch (error) {
        console.error("Failed to fetch referrals:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReferrals();
  }, []);

  const statusConfig = {
    PENDING: { label: "Pending", variant: "warning" as const, icon: Clock },
    VERIFIED: { label: "Verified", variant: "success" as const, icon: CheckCircle },
    REJECTED: { label: "Rejected", variant: "danger" as const, icon: XCircle },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple" />
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FadeIn>
          <h1 className="text-3xl font-bold text-chocolate flex items-center gap-3 mb-8">
            <History className="h-8 w-8 text-purple" />
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
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-cream-dark">
                        <th className="text-left py-3 px-4 font-medium text-chocolate/70">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-chocolate/70">Instagram</th>
                        <th className="text-left py-3 px-4 font-medium text-chocolate/70">Joined</th>
                        <th className="text-left py-3 px-4 font-medium text-chocolate/70">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referrals.map((ref) => {
                        const status = statusConfig[ref.status as keyof typeof statusConfig];
                        const StatusIcon = status.icon;
                        return (
                          <tr key={ref.id} className="border-b border-cream-dark/50 hover:bg-cream/50">
                            <td className="py-3 px-4 font-medium text-chocolate">{ref.fullName}</td>
                            <td className="py-3 px-4 text-chocolate/70">{ref.instagram}</td>
                            <td className="py-3 px-4 text-chocolate/50">
                              {new Date(ref.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={status.variant} className="gap-1">
                                <StatusIcon className="h-3 w-3" />
                                {status.label}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-chocolate/50 py-8">
                  No referrals yet. Share your link to get started!
                </p>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </PageWrapper>
  );
}
