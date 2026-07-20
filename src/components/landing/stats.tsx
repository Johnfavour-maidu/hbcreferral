"use client";

import { motion } from "framer-motion";
import { Users, CheckCircle, MapPin, Award } from "lucide-react";

const stats = [
  { icon: Users, value: "500+", label: "Participants", color: "text-gold" },
  { icon: Award, value: "2,500+", label: "Referrals", color: "text-brown" },
  { icon: CheckCircle, value: "1,800+", label: "Verified", color: "text-success" },
  { icon: MapPin, value: "37", label: "States", color: "text-gold" },
];

export function StatsSection() {
  return (
    <section className="section-padding bg-cream">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl p-6 text-center border border-cream-dark card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-brown-dark mb-1">{stat.value}</div>
              <div className="text-brown-light text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
