"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative bg-bg overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none">
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-gold rounded-full blur-[120px]" />
        <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-brown rounded-full blur-[120px]" />
      </div>

      <div style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", paddingLeft: 32, paddingRight: 32 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-gold/10 rounded-full px-4 py-2 mb-7">
              <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-brown text-sm font-medium">Referral Challenge 2026 – Edition 1</span>
            </div>

            <h1 className="text-[36px] sm:text-[44px] lg:text-[64px] font-extrabold text-brown-dark leading-[1.1] tracking-tight mb-5">
              Join the Hearts by Charming{" "}
              <span className="text-gradient-gold">Referral Challenge</span>
            </h1>

            <p
              className="text-brown-light text-lg lg:text-xl leading-[1.7] text-center mx-auto block max-w-[650px]"
              style={{ marginBottom: 32 }}
            >
              Share the love, grow our community, and earn amazing rewards.
              Every referral makes a real impact in youth development.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Button size="default" className="group min-w-[180px] h-12 rounded-xl px-7 text-[15px] font-semibold" asChild>
                <Link href="/register">
                  Register Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="default" variant="outline" className="min-w-[180px] h-12 rounded-xl px-7 text-[15px] font-semibold" asChild>
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
