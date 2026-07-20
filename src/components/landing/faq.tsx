"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How do I participate?",
    answer: "Simply register on the platform, get your unique referral code, and share it with friends. When they sign up using your link, you earn referrals.",
  },
  {
    question: "How are referrals verified?",
    answer: "Each referred person must follow Hearts by Charming on Instagram and confirm their username. Our team then verifies every referral to ensure authenticity.",
  },
  {
    question: "What prizes can I win?",
    answer: "Gold tier: ₦10,000 (30+ verified referrals), Silver tier: ₦7,000 (20+ verified referrals), Bronze tier: ₦5,000 (10+ verified referrals).",
  },
  {
    question: "Can I refer myself or use multiple accounts?",
    answer: "No. Self-referral, duplicate emails, phones, and Instagram accounts are automatically detected and blocked.",
  },
  {
    question: "When will I receive my reward?",
    answer: "Rewards are distributed within 2 weeks after the campaign ends. We'll contact you via email and Instagram.",
  },
  {
    question: "Is my data safe?",
    answer: "Absolutely. We use industry-standard encryption and never share your personal data with third parties.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="section-padding bg-white">
      <div className="max-w-3xl mx-auto px-5 sm:px-10 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-gold text-sm font-semibold uppercase tracking-widest mb-3">FAQ</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brown-dark mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-brown-light text-lg">
            Got questions? We&apos;ve got answers.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === i ? "border-gold/30 shadow-md shadow-gold/5" : "border-cream-dark"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-cream/50 transition-colors"
              >
                <span className="font-semibold text-brown-dark pr-4">{faq.question}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  openIndex === i ? "bg-gold text-white" : "bg-cream-dark text-brown-light"
                }`}>
                  {openIndex === i ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
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
                    <p className="px-5 pb-5 text-brown-light text-sm leading-relaxed">
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
