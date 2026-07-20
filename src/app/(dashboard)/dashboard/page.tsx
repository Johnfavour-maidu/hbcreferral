"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { Users, CheckCircle, Clock, Trophy, Copy, Share2, ExternalLink, TrendingUp, ArrowUpRight, QrCode } from "lucide-react";
import { toast } from "sonner";

interface DashboardData {
  profile: {
    fullName: string;
    referralCode: string;
    referralLink: string;
    totalReferrals: number;
    verifiedReferrals: number;
    pendingReferrals: number;
  };
  leaderboardPosition: number;
  totalParticipants: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>;
  }

  const { profile } = data;
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const shareLinks = [
    { name: "WhatsApp", url: `https://wa.me/?text=${encodeURIComponent(`Join Hearts by Charming Referral Challenge! Use my link: ${profile.referralLink}`)}` },
    { name: "Telegram", url: `https://t.me/share/url?url=${encodeURIComponent(profile.referralLink)}&text=${encodeURIComponent("Join Hearts by Charming Referral Challenge!")}` },
    { name: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profile.referralLink)}` },
  ];

  return (
    <PageWrapper>
      <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20 py-8 lg:py-12">
        <FadeIn>
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-brown-dark">
              Hello {profile.fullName.split(" ")[0]} 👋
            </h1>
            <p className="text-brown-light mt-1">Welcome to your referral dashboard</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { title: "Total Referrals", value: profile.totalReferrals, icon: Users, color: "text-gold", bg: "bg-gold/10" },
            { title: "Verified", value: profile.verifiedReferrals, icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
            { title: "Pending", value: profile.pendingReferrals, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
            { title: "Leaderboard", value: `#${data.leaderboardPosition}`, icon: Trophy, color: "text-gold", bg: "bg-gold/10" },
          ].map((stat, i) => (
            <FadeIn key={stat.title} delay={i * 0.05}>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-brown-light/30" />
                  </div>
                  <p className="text-sm text-brown-light mb-1">{stat.title}</p>
                  <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FadeIn delay={0.2} className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Share2 className="h-5 w-5 text-gold" />
                  Your Referral Link
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-cream rounded-xl border border-cream-dark">
                  <code className="flex-1 text-sm text-brown break-all font-mono">{profile.referralLink}</code>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(profile.referralLink)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="default" className="font-mono">Code: {profile.referralCode}</Badge>
                </div>

                <div>
                  <p className="text-sm text-brown-light mb-3">Share via:</p>
                  <div className="flex flex-wrap gap-2">
                    {shareLinks.map((link) => (
                      <Button key={link.name} size="sm" variant="outline" className="gap-2" onClick={() => window.open(link.url, "_blank")}>
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
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-gold" />
                  Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  { label: "Bronze (₦5,000)", current: profile.verifiedReferrals, target: 10 },
                  { label: "Silver (₦7,000)", current: profile.verifiedReferrals, target: 20 },
                  { label: "Gold (₦10,000)", current: profile.verifiedReferrals, target: 30 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-brown-light">{item.label}</span>
                      <span className="font-bold text-brown">{item.current}/{item.target}</span>
                    </div>
                    <Progress value={(item.current / item.target) * 100} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </PageWrapper>
  );
}
