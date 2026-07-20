"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Trophy, Gift } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative bg-cream section-padding overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-brown rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="inline-flex items-center gap-2 bg-gold/10 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-brown text-sm font-medium">Referral Challenge 2026</span>
            </div>

            <h1 className="text-[34px] sm:text-[42px] lg:text-[64px] font-extrabold text-brown-dark leading-[1.1] tracking-tight mb-6">
              Join the Hearts by Charming{" "}
              <span className="text-gradient-gold">Referral Challenge</span>
            </h1>

            <p className="text-brown-light text-lg lg:text-xl leading-relaxed mb-8 max-w-lg">
              Share the love, grow our community, and earn amazing rewards.
              Every referral makes a real impact in youth development.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
              <Button size="xl" className="group" asChild>
                <Link href="/register">
                  Register Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link href="/leaderboard">View Leaderboard</Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-md">
              {[
                { icon: Gift, value: "₦10K+", label: "Top Prize" },
                { icon: Users, value: "500+", label: "Participants" },
                { icon: Trophy, value: "100%", label: "Free" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-brown-dark">{stat.value}</div>
                    <div className="text-xs text-brown-light">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-gold/10 via-cream to-brown/5 rounded-3xl p-8 lg:p-12 border border-cream-dark">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gold/20 rounded-2xl blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-brown/10 rounded-2xl blur-2xl" />

              <div className="relative space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-dark">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                      <span className="text-gold text-sm font-bold">🔗</span>
                    </div>
                    <span className="text-sm font-medium text-brown">Your Referral Link</span>
                  </div>
                  <div className="bg-cream-dark rounded-xl p-3 flex items-center gap-2">
                    <code className="text-sm text-brown-light flex-1 font-mono">heartsbycharming.org/r/HBC-X8P2M</code>
                    <div className="w-8 h-8 rounded-lg bg-gold text-white flex items-center justify-center text-xs font-bold">📋</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-dark text-center">
                    <div className="text-3xl font-bold text-gold mb-1">24</div>
                    <div className="text-xs text-brown-light">Total Referrals</div>
                  </div>
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-dark text-center">
                    <div className="text-3xl font-bold text-success mb-1">18</div>
                    <div className="text-xs text-brown-light">Verified</div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-dark">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-brown">Progress to Gold</span>
                    <span className="text-sm text-gold font-bold">18/30</span>
                  </div>
                  <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
                    <div className="h-full bg-gold rounded-full" style={{ width: "60%" }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
