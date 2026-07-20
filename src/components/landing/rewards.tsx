"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Medal, Award } from "lucide-react";
import Link from "next/link";

export function RewardsPreview() {
  const tiers = [
    { icon: Trophy, name: "Gold", amount: "₦10,000", referrals: "30+", gradient: "from-gold/10 to-gold/5", border: "border-gold/20", iconColor: "text-gold" },
    { icon: Medal, name: "Silver", amount: "₦7,000", referrals: "20+", gradient: "from-gray-100 to-gray-50", border: "border-gray-200", iconColor: "text-gray-400" },
    { icon: Award, name: "Bronze", amount: "₦5,000", referrals: "10+", gradient: "from-amber-50 to-orange-50", border: "border-amber-200", iconColor: "text-amber-600" },
  ];

  return (
    <section id="rewards" className="section-padding bg-cream">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-gold text-sm font-semibold uppercase tracking-widest mb-3">Prizes</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brown-dark mb-4">
            Earn Amazing Rewards
          </h2>
          <p className="text-brown-light text-lg max-w-2xl mx-auto">
            The more referrals you make, the bigger the reward. Start today!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-gradient-to-b ${tier.gradient} border-2 ${tier.border} rounded-3xl p-8 text-center card-hover overflow-hidden`}
            >
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-gold/5 rounded-full blur-2xl" />
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-5">
                <tier.icon className={`h-8 w-8 ${tier.iconColor}`} />
              </div>
              <div className="text-sm font-semibold text-brown-light uppercase tracking-wider mb-2">{tier.name} Tier</div>
              <div className="text-4xl font-extrabold text-brown-dark mb-3">{tier.amount}</div>
              <div className="text-sm text-brown-light">
                Get <strong className="text-brown">{tier.referrals}</strong> verified referrals
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="group" asChild>
            <Link href="/rewards">
              View All Rewards
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
