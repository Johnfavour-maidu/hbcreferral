"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { Gift, Trophy, Medal, Award } from "lucide-react";

const tiers = [
  {
    name: "Gold",
    icon: Trophy,
    referrals: 30,
    amount: 10000,
    color: "from-gold/20 to-gold/5",
    borderColor: "border-gold/30",
    iconColor: "text-gold",
    badge: "gold" as const,
  },
  {
    name: "Silver",
    icon: Medal,
    referrals: 20,
    amount: 7000,
    color: "from-gray-200 to-gray-100",
    borderColor: "border-gray-300",
    iconColor: "text-gray-500",
    badge: "chocolate" as const,
  },
  {
    name: "Bronze",
    icon: Award,
    referrals: 10,
    amount: 5000,
    color: "from-amber-100 to-amber-50",
    borderColor: "border-amber-300",
    iconColor: "text-amber-600",
    badge: "warning" as const,
  },
];

export default function RewardsPage() {
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-chocolate flex items-center justify-center gap-3">
              <Gift className="h-8 w-8 text-gold" />
              Rewards
            </h1>
            <p className="text-chocolate/70 mt-2">Earn amazing prizes for your referrals</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {tiers.map((tier, i) => (
            <FadeIn key={tier.name} delay={i * 0.1}>
              <Card className={`bg-gradient-to-b ${tier.color} ${tier.borderColor} hover:shadow-xl transition-all duration-300`}>
                <CardHeader className="text-center pb-2">
                  <div className={`w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-3 shadow-sm`}>
                    <tier.icon className={`h-8 w-8 ${tier.iconColor}`} />
                  </div>
                  <Badge variant={tier.badge} className="w-fit mx-auto">{tier.name} Tier</Badge>
                  <CardTitle className="text-4xl font-bold text-chocolate mt-3">
                    ₦{tier.amount.toLocaleString()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-chocolate/70 text-sm mb-4">
                    Get <strong>{tier.referrals}</strong> verified referrals
                  </p>
                  <div className="text-xs text-chocolate/50">
                    {tier.name === "Gold" && "Top reward for our most dedicated referrers"}
                    {tier.name === "Silver" && "Great achievement for active participants"}
                    {tier.name === "Bronze" && "Your first milestone to celebrate"}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { step: "1", title: "Share Your Link", description: "Send your unique referral link to friends" },
                  { step: "2", title: "Friends Register", description: "They sign up and follow us on Instagram" },
                  { step: "3", title: "Earn Rewards", description: "Get verified and claim your prize" },
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="w-10 h-10 rounded-full bg-purple text-white flex items-center justify-center mx-auto mb-3 font-bold">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-chocolate mb-1">{item.title}</h3>
                    <p className="text-sm text-chocolate/70">{item.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </PageWrapper>
  );
}
