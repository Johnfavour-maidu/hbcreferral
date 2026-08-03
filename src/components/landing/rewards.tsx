"use client";

import { motion } from "framer-motion";

const tiers = [
  {
    name: "GOLD",
    subtitle: "Highest Referrals",
    amount: "₦20,000",
    label: "GRAND PRIZE",
    cardClass: "reward-card-gold",
    badgeClass: "tier-badge-gold",
    prizeClass: "prize-gold",
  },
  {
    name: "SILVER",
    subtitle: "2nd Highest Referrals",
    amount: "₦15,000",
    label: "RUNNER UP",
    cardClass: "reward-card-silver",
    badgeClass: "tier-badge-silver",
    prizeClass: "prize-silver",
  },
  {
    name: "BRONZE",
    subtitle: "3rd Highest Referrals",
    amount: "₦10,000",
    label: "TOP FINALIST",
    cardClass: "reward-card-bronze",
    badgeClass: "tier-badge-bronze",
    prizeClass: "prize-bronze",
  },
];

export function RewardsPreview() {
  return (
    <section id="rewards" className="bg-white" style={{ paddingBottom: 80 }}>
      <div className="pt-14 md:pt-4">
        <div style={{ maxWidth: 1000, margin: "0 auto", paddingLeft: 32, paddingRight: 32 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
            style={{ marginBottom: 28 }}
          >
            <span className="inline-block text-gold text-sm font-semibold uppercase tracking-widest mb-3">
              Prizes
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brown-dark mb-4">
              Earn Amazing Rewards
            </h2>
            <p className="text-brown-light text-lg leading-[1.75] text-center">
              The more referrals you make, the bigger the reward. Start today!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-stretch">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  delay: i * 0.15,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.04,
                  boxShadow: "0 24px 48px rgba(200,154,43,0.18), 0 8px 16px rgba(0,0,0,0.06)",
                  transition: { duration: 0.25, type: "spring", stiffness: 300, damping: 20 },
                }}
                whileTap={{ scale: 0.98 }}
                className={`reward-card ${tier.cardClass}`}
                style={{ cursor: "default" }}
              >
                <div className={`tier-badge ${tier.badgeClass} mb-4`}>
                  ★ {tier.name} TIER ★
                </div>

                <p className="text-[13px] font-semibold mb-2 tracking-wide text-center text-[#1F1F1F]">
                  {tier.subtitle}
                </p>

                <div
                  className={`font-[900] leading-none mb-3 text-center ${tier.prizeClass}`}
                  style={{ fontSize: "clamp(42px, 5vw, 54px)" }}
                >
                  {tier.amount}
                </div>

                <div className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-center text-[#1F1F1F]">
                  {tier.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
