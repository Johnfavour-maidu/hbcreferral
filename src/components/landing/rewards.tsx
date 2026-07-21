"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Ribbon } from "lucide-react";

const tiers = [
  {
    name: "GOLD",
    subtitle: "Highest Referrals",
    amount: "₦20,000",
    label: "GRAND PRIZE",
    cardClass: "reward-card-gold",
    badgeClass: "tier-badge-gold",
    prizeClass: "prize-gold",
    labelColor: "text-[#9A7418]/70",
    subtitleColor: "text-[#8B6E1A]/50",
    watermark: Trophy,
  },
  {
    name: "SILVER",
    subtitle: "2nd Highest Referrals",
    amount: "₦15,000",
    label: "RUNNER UP",
    cardClass: "reward-card-silver",
    badgeClass: "tier-badge-silver",
    prizeClass: "prize-silver",
    labelColor: "text-[#495057]/55",
    subtitleColor: "text-[#6C757D]/50",
    watermark: Medal,
  },
  {
    name: "BRONZE",
    subtitle: "3rd Highest Referrals",
    amount: "₦10,000",
    label: "TOP FINALIST",
    cardClass: "reward-card-bronze",
    badgeClass: "tier-badge-bronze",
    prizeClass: "prize-bronze",
    labelColor: "text-[#8B5E34]/55",
    subtitleColor: "text-[#A07040]/50",
    watermark: Ribbon,
  },
];

export function RewardsPreview() {
  return (
    <section id="rewards" className="bg-white">
      <div style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", paddingLeft: 32, paddingRight: 32 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
            style={{ marginBottom: 48 }}
          >
            <span className="inline-block text-gold text-sm font-semibold uppercase tracking-widest mb-3">
              Prizes
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brown-dark mb-4">
              Earn Amazing Rewards
            </h2>
            <p
              className="text-brown-light text-lg leading-[1.75] text-center"
            >
              The more referrals you make, the bigger the reward. Start today!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-start">
            {tiers.map((tier, i) => {
              const WatermarkIcon = tier.watermark;
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className={`reward-card ${tier.cardClass}`}
                >
                  <WatermarkIcon
                    className="reward-watermark"
                    strokeWidth={1}
                    style={{ width: 110, height: 110 }}
                  />

                  <div className={`tier-badge ${tier.badgeClass} mb-3`}>
                    ★ {tier.name} TIER ★
                  </div>

                  <p className={`text-[13px] font-semibold mb-2 tracking-wide text-center ${tier.subtitleColor}`}>
                    {tier.subtitle}
                  </p>

                  <div
                    className={`font-[900] leading-none mb-2 text-center ${tier.prizeClass}`}
                    style={{ fontSize: "clamp(42px, 5vw, 54px)" }}
                  >
                    {tier.amount}
                  </div>

                  <div
                    className={`text-[10.5px] font-bold uppercase tracking-[0.2em] text-center ${tier.labelColor}`}
                  >
                    {tier.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
