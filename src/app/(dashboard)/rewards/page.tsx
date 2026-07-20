"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { Gift, Trophy, Medal, Award, ArrowRight } from "lucide-react";

const tiers = [
  { name: "Gold", icon: Trophy, referrals: 30, amount: 10000, gradient: "from-gold/10 to-gold/5", border: "border-gold/20", iconColor: "text-gold", badge: "gold" as const },
  { name: "Silver", icon: Medal, referrals: 20, amount: 7000, gradient: "from-gray-100 to-gray-50", border: "border-gray-200", iconColor: "text-gray-400", badge: "brown" as const },
  { name: "Bronze", icon: Award, referrals: 10, amount: 5000, gradient: "from-amber-50 to-orange-50", border: "border-amber-200", iconColor: "text-amber-600", badge: "warning" as const },
];

export default function RewardsPage() {
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-5 sm:px-10 lg:px-20 py-8 lg:py-12">
        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-brown-dark flex items-center justify-center gap-3">
              <Gift className="h-8 w-8 text-gold" />
              Rewards
            </h1>
            <p className="text-brown-light mt-2">Earn amazing prizes for your referrals</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {tiers.map((tier, i) => (
            <FadeIn key={tier.name} delay={i * 0.1}>
              <Card className={`bg-gradient-to-b ${tier.gradient} ${tier.border} border-2 overflow-hidden`}>
                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-3">
                    <tier.icon className={`h-8 w-8 ${tier.iconColor}`} />
                  </div>
                  <Badge variant={tier.badge} className="w-fit mx-auto">{tier.name} Tier</Badge>
                  <CardTitle className="text-4xl font-extrabold text-brown-dark mt-3">₦{tier.amount.toLocaleString()}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-brown-light text-sm mb-4">Get <strong>{tier.referrals}</strong> verified referrals</p>
                  <p className="text-xs text-brown-light/60">
                    {tier.name === "Gold" && "Top reward for our most dedicated referrers"}
                    {tier.name === "Silver" && "Great achievement for active participants"}
                    {tier.name === "Bronze" && "Your first milestone to celebrate"}
                  </p>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { step: "1", title: "Share Your Link", description: "Send your unique referral link to friends" },
                  { step: "2", title: "Friends Register", description: "They sign up and follow us on Instagram" },
                  { step: "3", title: "Earn Rewards", description: "Get verified and claim your prize" },
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="w-10 h-10 rounded-xl bg-gold text-white flex items-center justify-center mx-auto mb-3 font-bold">{item.step}</div>
                    <h3 className="font-bold text-brown-dark mb-1">{item.title}</h3>
                    <p className="text-sm text-brown-light">{item.description}</p>
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
