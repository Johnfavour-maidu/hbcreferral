"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import {
  Users,
  CheckCircle,
  Clock,
  Trophy,
  Copy,
  Share2,
  QrCode,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

interface DashboardData {
  profile: {
    fullName: string;
    referralCode: string;
    referralLink: string;
    totalReferrals: number;
    verifiedReferrals: number;
    pendingReferrals: number;
    state: string;
    school: string;
    instagram: string;
  };
  leaderboardPosition: number;
  totalParticipants: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple" />
      </div>
    );
  }

  const { profile } = data;
  const progressToNext = Math.min((profile.verifiedReferrals / 10) * 100, 100);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const shareLinks = [
    { name: "WhatsApp", url: `https://wa.me/?text=${encodeURIComponent(`Join Hearts by Charming Referral Challenge! Use my link: ${profile.referralLink}`)}`, color: "bg-green-500" },
    { name: "Telegram", url: `https://t.me/share/url?url=${encodeURIComponent(profile.referralLink)}&text=${encodeURIComponent("Join Hearts by Charming Referral Challenge!")}`, color: "bg-blue-500" },
    { name: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profile.referralLink)}`, color: "bg-blue-600" },
  ];

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FadeIn>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-chocolate">
              Hello {profile.fullName.split(" ")[0]} 👋
            </h1>
            <p className="text-chocolate/70 mt-1">Welcome to your referral dashboard</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { title: "Total Referrals", value: profile.totalReferrals, icon: Users, color: "text-purple" },
            { title: "Verified", value: profile.verifiedReferrals, icon: CheckCircle, color: "text-green-600" },
            { title: "Pending", value: profile.pendingReferrals, icon: Clock, color: "text-yellow-600" },
            { title: "Leaderboard Position", value: `#${data.leaderboardPosition}`, icon: Trophy, color: "text-gold" },
          ].map((stat, i) => (
            <FadeIn key={stat.title} delay={i * 0.1}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-chocolate/70">{stat.title}</p>
                      <p className={`text-3xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-cream flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FadeIn delay={0.2} className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-purple" />
                  Your Referral Link
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-cream rounded-lg">
                  <code className="flex-1 text-sm text-chocolate break-all font-mono">
                    {profile.referralLink}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(profile.referralLink)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="default" className="font-mono">
                    Code: {profile.referralCode}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-chocolate/70 mb-3">Share via:</p>
                  <div className="flex gap-2">
                    {shareLinks.map((link) => (
                      <Button
                        key={link.name}
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={() => window.open(link.url, "_blank")}
                      >
                        <ExternalLink className="h-3 w-3" />
                        {link.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-gold" />
                  Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-chocolate/70">To Bronze (₦5,000)</span>
                    <span className="font-medium text-chocolate">{profile.verifiedReferrals}/10</span>
                  </div>
                  <Progress value={(profile.verifiedReferrals / 10) * 100} />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-chocolate/70">To Silver (₦7,000)</span>
                    <span className="font-medium text-chocolate">{profile.verifiedReferrals}/20</span>
                  </div>
                  <Progress value={(profile.verifiedReferrals / 20) * 100} />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-chocolate/70">To Gold (₦10,000)</span>
                    <span className="font-medium text-chocolate">{profile.verifiedReferrals}/30</span>
                  </div>
                  <Progress value={(profile.verifiedReferrals / 30) * 100} />
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </PageWrapper>
  );
}
