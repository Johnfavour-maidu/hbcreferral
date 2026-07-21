"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I participate?",
    answer:
      "Simply register on the platform, get your unique referral code, and share it with friends. When they sign up using your link, you earn referrals.",
  },
  {
    question: "How are referrals verified?",
    answer:
      "Each referred person must follow Hearts by Charming on Instagram and confirm their username. Our team then verifies every referral to ensure authenticity.",
  },
  {
    question: "What prizes can I win?",
    answer:
      "Gold tier: ₦20,000 (Highest referrals), Silver tier: ₦15,000 (2nd highest referrals), Bronze tier: ₦10,000 (3rd highest referrals).",
  },
  {
    question: "Can I refer myself or use multiple accounts?",
    answer:
      "No. Self-referral, duplicate emails, phones, and Instagram accounts are automatically detected and blocked.",
  },
  {
    question: "When will I receive my reward?",
    answer:
      "Rewards are distributed within 2 weeks after the campaign ends. We'll contact you via email and Instagram.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-bg" style={{ paddingTop: 80, paddingBottom: 48 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", paddingLeft: 32, paddingRight: 32 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
          style={{ marginBottom: 48 }}
        >
          <span className="inline-block text-gold text-sm font-semibold uppercase tracking-widest mb-3">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brown-dark mb-4">
            Learn About the Challenge
          </h2>
          <p className="text-brown-light text-lg leading-[1.7] text-center">
            Everything you need to know before joining the Hearts by Charming Referral Challenge.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === i
                  ? "border-gold/30 shadow-lg shadow-gold/5"
                  : "border-border"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between text-left hover:bg-cream/30 transition-colors"
                style={{ padding: "18px 28px" }}
              >
                <span className="font-semibold text-brown-dark pr-4 text-[15px]">
                  {faq.question}
                </span>
                <div className="shrink-0">
                  <ChevronDown
                    className="h-5 w-5 text-brown-light transition-transform duration-300"
                    style={{
                      transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="overflow-hidden"
                  >
                    <p className="text-brown-light text-sm leading-relaxed" style={{ padding: "0 28px 20px" }}>
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
