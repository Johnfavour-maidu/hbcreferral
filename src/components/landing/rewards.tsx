"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";

const tiers = [
  {
    icon: Trophy,
    name: "GOLD TIER",
    subtitle: "Highest Referrals",
    reward: "₦20,000",
    gradient: "from-[#FDF6E3] to-[#FFF8EF]",
    border: "border-gold/25",
    iconBg: "bg-gold/10",
    iconColor: "text-gold",
    nameColor: "text-gold",
    rewardColor: "text-gold-dark",
    shadow: "shadow-gold/8",
    highlight: true,
  },
  {
    icon: Medal,
    name: "SILVER TIER",
    subtitle: "2nd Highest Referrals",
    reward: "₦15,000",
    gradient: "from-[#F8F9FA] to-[#FFFFFF]",
    border: "border-gray-200",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-400",
    nameColor: "text-gray-500",
    rewardColor: "text-brown-dark",
    shadow: "shadow-gray-200/30",
    highlight: false,
  },
  {
    icon: Award,
    name: "BRONZE TIER",
    subtitle: "3rd Highest Referrals",
    reward: "₦10,000",
    gradient: "from-[#FFF8EF] to-[#FFFFFF]",
    border: "border-amber-200",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    nameColor: "text-amber-600",
    rewardColor: "text-brown-dark",
    shadow: "shadow-amber-100/30",
    highlight: false,
  },
];

export function RewardsPreview() {
  return (
    <section id="rewards" className="bg-white pt-16 pb-16 lg:pt-20 lg:pb-20">
      <div style={{ maxWidth: 1000, margin: "0 auto", paddingLeft: 32, paddingRight: 32 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
          style={{ marginBottom: 40 }}
        >
          <span className="inline-block text-gold text-sm font-semibold uppercase tracking-widest mb-3">
            Prizes
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brown-dark mb-4">
            Earn Amazing Rewards
          </h2>
          <p
            className="text-brown-light text-lg leading-[1.8] mx-auto text-center"
            style={{ maxWidth: 580 }}
          >
            The more referrals you make, the bigger the reward. Start today!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-gradient-to-b ${tier.gradient} border-2 ${tier.border} rounded-[20px] p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${tier.shadow} ${
                tier.highlight ? "ring-1 ring-gold/15" : ""
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-6 -right-6 w-28 h-28 bg-gold/8 rounded-full blur-2xl pointer-events-none" />
              )}
              <div className={`w-14 h-14 rounded-2xl ${tier.iconBg} flex items-center justify-center mx-auto mb-6`}>
                <tier.icon className={`h-7 w-7 ${tier.iconColor}`} />
              </div>
              <div className={`text-xs font-bold ${tier.nameColor} uppercase tracking-widest mb-2`}>
                {tier.name}
              </div>
              <div className="text-sm text-brown-light mb-5">{tier.subtitle}</div>
              <div className={`text-[32px] font-extrabold ${tier.rewardColor} leading-tight`}>
                {tier.reward}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
