"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

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
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-chocolate mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-chocolate/70 text-lg">
            Got questions? We&apos;ve got answers.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border border-cream-dark rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-cream/50 transition-colors"
              >
                <span className="font-medium text-chocolate">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-chocolate/50 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-chocolate/70 text-sm leading-relaxed">
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
