"use client";

import { motion } from "framer-motion";
import { UserPlus, Share2, Users, Trophy } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Register",
    description: "Create your Hearts by Charming referral account.",
    number: "01",
  },
  {
    icon: Share2,
    title: "Share Your Link",
    description: "Copy and share your unique referral link.",
    number: "02",
  },
  {
    icon: Users,
    title: "Invite Friends",
    description: "Friends complete the required steps and are verified.",
    number: "03",
  },
  {
    icon: Trophy,
    title: "Earn Rewards",
    description: "Verified referrals increase your ranking and qualify you for prizes.",
    number: "04",
  },
];

export function HowItWorks() {
  return (
    <>
      <style>{`@media (min-width: 768px) { .how-it-works-section { padding-bottom: 24px !important; } }`}</style>
      <section className="bg-white how-it-works-section" style={{ paddingTop: 80, paddingBottom: 48 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", paddingLeft: 32, paddingRight: 32 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
          style={{ marginBottom: 0 }}
        >
          <span className="inline-block text-gold text-sm font-semibold uppercase tracking-widest mb-3">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brown-dark mb-4">
            Start Referring in Four Simple Steps
          </h2>
          <p className="hidden md:block text-brown-light text-lg leading-[1.75] text-center" style={{ maxWidth: 520, margin: "0 auto" }}>
            From sign-up to rewards, the process is quick and straightforward.
          </p>
        </motion.div>

        {/* Desktop horizontal timeline */}
        <div className="hidden md:block relative">
          {/* Connector line */}
          <div
            className="absolute"
            style={{
              top: 44,
              left: "12%",
              right: "12%",
              height: 2,
              background: "linear-gradient(90deg, #E7D8C6, #C89A2B, #E7D8C6)",
              borderRadius: 1,
            }}
          />

          <div className="grid grid-cols-4 gap-6 relative">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex flex-col items-center text-center relative"
              >
                <div
                  className="relative z-10 bg-white flex items-center justify-center mb-6"
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: "50%",
                    border: "2px solid #E7D8C6",
                    boxShadow: "0 4px 20px rgba(200,154,43,0.1)",
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-full bg-gold/10"
                    style={{ width: 52, height: 52 }}
                  >
                    <step.icon className="h-6 w-6 text-gold" />
                  </div>
                </div>

                <span className="text-gold text-xs font-bold uppercase tracking-widest mb-2">
                  Step {step.number}
                </span>
                <h3 className="text-lg font-bold text-brown-dark mb-2">
                  {step.title}
                </h3>
                <p className="text-brown-light text-sm leading-relaxed" style={{ maxWidth: 200 }}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile vertical stepper */}
        <div className="md:hidden relative" style={{ paddingTop: 16 }}>
          <div className="relative" style={{ display: "flex", flexDirection: "column", gap: 56 }}>
            {steps.map((step, i) => (
                <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex gap-5 items-start relative"
              >
                {/* Step number circle with centered line */}
                <div className="relative flex flex-col items-center">
                  <div
                    className="relative z-10 shrink-0 bg-white flex items-center justify-center"
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      border: "2px solid #E7D8C6",
                      boxShadow: "0 2px 12px rgba(200,154,43,0.1)",
                    }}
                  >
                    <step.icon className="h-5 w-5 text-gold" />
                  </div>
                  {/* Connector line between circles - only between items */}
                  {i < steps.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        top: 52,
                        height: 56,
                        width: 2,
                        background: "linear-gradient(180deg, #C89A2B, #E7D8C6)",
                        borderRadius: 1,
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div style={{ paddingTop: 8, paddingBottom: 8 }}>
                  <span className="text-gold text-xs font-bold uppercase tracking-widest">
                    Step {step.number}
                  </span>
                  <h3 className="text-lg font-bold text-brown-dark" style={{ marginTop: 6, marginBottom: 8 }}>
                    {step.title}
                  </h3>
                  <p className="text-brown-light text-sm" style={{ lineHeight: 1.7 }}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
