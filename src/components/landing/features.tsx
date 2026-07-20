"use client";

import { motion } from "framer-motion";
import { Link2, Trophy, Gift, Heart, Users, Shield } from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Unique Referral Links",
    description: "Get your personal referral code and link. Share it with friends and track every signup in real-time.",
  },
  {
    icon: Trophy,
    title: "Live Leaderboard",
    description: "See where you rank in real-time. Compete with others and climb to the top of the rankings.",
  },
  {
    icon: Gift,
    title: "Amazing Prizes",
    description: "Win cash prizes from Gold, Silver, and Bronze tiers. The more you refer, the more you earn.",
  },
  {
    icon: Heart,
    title: "Real Impact",
    description: "Every referral helps us expand our youth development programs across Nigeria.",
  },
  {
    icon: Users,
    title: "Community Growth",
    description: "Be part of a growing movement. Connect with like-minded youth making a difference.",
  },
  {
    icon: Shield,
    title: "Verified & Secure",
    description: "Fair verification process ensures authentic referrals. Your data is always protected.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="section-padding bg-white">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-gold text-sm font-semibold uppercase tracking-widest mb-3">Why Join</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brown-dark mb-4">
            Why Join the Challenge?
          </h2>
          <p className="text-brown-light text-lg max-w-2xl mx-auto">
            Everything you need to refer, track, and earn rewards — all in one beautiful platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group p-8 rounded-2xl border border-cream-dark bg-cream hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold group-hover:text-white transition-all duration-300">
                <feature.icon className="h-6 w-6 text-gold group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-brown-dark mb-2">{feature.title}</h3>
              <p className="text-brown-light text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
