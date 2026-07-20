"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="section-padding bg-brown relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-20 w-72 h-72 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-gold-light rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-5 sm:px-10 lg:px-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-cream mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-cream/70 text-lg mb-10 max-w-2xl mx-auto">
            Join hundreds of young changemakers already participating in the referral challenge.
            Your journey to impact starts here.
          </p>
          <Button size="xl" className="group" asChild>
            <Link href="/register">
              Start Referring Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
