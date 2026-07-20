"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "500+", label: "Participants" },
  { value: "2,500+", label: "Referrals" },
  { value: "1,800+", label: "Verified" },
  { value: "37", label: "States" },
];

export function StatsSection() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-purple mb-2">{stat.value}</div>
              <div className="text-chocolate/60 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
