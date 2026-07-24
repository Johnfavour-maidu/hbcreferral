"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CampaignCountdown } from "./countdown";

const ease = [0.25, 0.46, 0.45, 0.94];

export function HeroSection() {
  return (
    <section className="relative bg-bg overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none">
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-gold rounded-full blur-[120px]" />
        <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-brown rounded-full blur-[120px]" />
      </div>

      <div style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", paddingLeft: 32, paddingRight: 32 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-gold/10 rounded-full px-4 py-2 mb-7">
              <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-brown text-sm font-medium">Referral Challenge 2026 – Edition 1</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="text-[36px] sm:text-[44px] lg:text-[64px] font-extrabold text-brown-dark leading-[1.1] tracking-tight mb-5"
            >
              Join the Hearts by Charming{" "}
              <span className="text-gradient-gold">Referral Challenge</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease }}
              className="text-brown-light text-lg lg:text-xl leading-[1.75] text-center"
              style={{ marginBottom: 32 }}
            >
              Share the love, grow our community, and earn amazing rewards.
              Every referral makes a real impact in youth development.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              <Button size="default" className="group min-w-[180px] h-12 rounded-xl px-7 text-[15px] font-semibold" asChild>
                <Link href="/register">
                  Register Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="default" variant="outline" className="min-w-[180px] h-12 rounded-xl px-7 text-[15px] font-semibold" asChild>
                <Link href="/login">Login</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Countdown */}
          <div style={{ marginTop: 56 }}>
            <CampaignCountdown />
          </div>
        </div>
      </div>
    </section>
  );
}
