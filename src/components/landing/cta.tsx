"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="section-padding bg-bg">
      <div style={{ maxWidth: 1280, margin: "0 auto", paddingLeft: 32, paddingRight: 32 }}>
        <div className="relative brown-gradient rounded-3xl overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-gold rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-light rounded-full blur-[100px]" />
          </div>

          <div className="relative pt-20 pb-24 px-8 md:px-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-cream mb-6 leading-tight">
                Ready to Get Started Today?
              </h2>
              <p
                className="text-cream/65 text-lg leading-[1.75] text-center mx-auto"
                style={{ maxWidth: 580, marginBottom: 40 }}
              >
                Join hundreds of young changemakers already participating in the referral
                challenge. Your journey to impact starts here.
              </p>
              <Button
                size="default"
                className="group min-w-[220px] h-12 rounded-xl px-8 text-[15px] font-semibold bg-gold hover:bg-gold-dark"
                asChild
              >
                <Link href="/register">
                  Start Referring Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
