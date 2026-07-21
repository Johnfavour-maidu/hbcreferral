"use client";

import { motion } from "framer-motion";
import { Users, CheckCircle, MapPin, Award, School } from "lucide-react";

const stats = [
  { icon: Users, value: "500+", label: "Participants", color: "text-gold" },
  { icon: Award, value: "2,500+", label: "Referrals", color: "text-brown" },
  { icon: CheckCircle, value: "1,800+", label: "Verified", color: "text-success" },
  { icon: MapPin, value: "37", label: "States", color: "text-gold" },
  { icon: School, value: "120+", label: "Schools", color: "text-brown" },
];

export function StatsSection() {
  return (
    <section className="section-padding bg-white">
      <div style={{ maxWidth: 1280, margin: "0 auto", paddingLeft: 32, paddingRight: 32 }}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="glass-card rounded-2xl p-6 text-center card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="text-2xl lg:text-3xl font-extrabold text-brown-dark mb-1">{stat.value}</div>
              <div className="text-brown-light text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
