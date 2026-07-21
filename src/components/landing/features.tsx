"use client";

import { motion } from "framer-motion";
import { Link2, Trophy, Gift, Heart, Users, Shield, ArrowRight } from "lucide-react";

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
    <section id="features" className="section-padding bg-bg">
      <div style={{ maxWidth: 1280, margin: "0 auto", paddingLeft: 32, paddingRight: 32 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-gold text-sm font-semibold uppercase tracking-widest mb-3">
            Why Join
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brown-dark mb-5">
            Why Join the Challenge?
          </h2>
          <p
            className="text-brown-light text-lg leading-relaxed mx-auto"
            style={{ maxWidth: 560 }}
          >
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
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="group bg-white rounded-2xl p-8 border border-border hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300 flex flex-col card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold transition-colors duration-300">
                <feature.icon className="h-6 w-6 text-gold group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-brown-dark mb-3">{feature.title}</h3>
              <p className="text-brown-light text-sm leading-relaxed flex-1 mb-5">
                {feature.description}
              </p>
              <div className="flex items-center gap-2 text-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Learn more <ArrowRight className="h-4 w-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
