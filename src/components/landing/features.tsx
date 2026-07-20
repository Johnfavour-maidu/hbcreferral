"use client";

import { motion } from "framer-motion";
import { Link2, Trophy, Gift, Heart, Users, Shield } from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Unique Referral Links",
    description: "Get your personal referral code and link. Share it with friends and track every signup.",
  },
  {
    icon: Trophy,
    title: "Live Leaderboard",
    description: "See where you rank in real-time. Compete with others and climb to the top.",
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
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-chocolate mb-4">
            Why Join the Challenge?
          </h2>
          <p className="text-chocolate/70 text-lg max-w-2xl mx-auto">
            Everything you need to refer, track, and earn rewards — all in one beautiful platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-2xl border border-cream-dark bg-cream hover:border-purple/30 hover:shadow-lg hover:shadow-purple/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-purple/10 flex items-center justify-center mb-5 group-hover:bg-purple group-hover:text-white transition-all duration-300">
                <feature.icon className="h-6 w-6 text-purple group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-chocolate mb-2">{feature.title}</h3>
              <p className="text-chocolate/70 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
