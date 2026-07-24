"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const END_DATE = new Date("2026-08-31T23:59:59");

function getTimeLeft() {
  const now = new Date();
  const diff = END_DATE.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="bg-white rounded-2xl flex items-center justify-center font-extrabold text-brown-dark"
        style={{
          width: 72,
          height: 72,
          fontSize: 28,
          boxShadow: "0 4px 20px rgba(200,154,43,0.12), 0 1px 3px rgba(0,0,0,0.06)",
          border: "1px solid #E7D8C6",
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <span
        className="text-brown-light font-medium uppercase tracking-widest"
        style={{ fontSize: 11, marginTop: 8 }}
      >
        {label}
      </span>
    </div>
  );
}

export function CampaignCountdown() {
  const [time, setTime] = useState(getTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        {["Days", "Hours", "Minutes", "Seconds"].map((label) => (
          <div key={label} className="flex flex-col items-center">
            <div
              className="bg-white rounded-2xl flex items-center justify-center font-extrabold text-brown-dark"
              style={{
                width: 72,
                height: 72,
                fontSize: 28,
                boxShadow: "0 4px 20px rgba(200,154,43,0.12), 0 1px 3px rgba(0,0,0,0.06)",
                border: "1px solid #E7D8C6",
              }}
            >
              --
            </div>
            <span
              className="text-brown-light font-medium uppercase tracking-widest"
              style={{ fontSize: 11, marginTop: 8 }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center"
    >
      <p
        className="text-brown-light font-semibold uppercase tracking-widest mb-4"
        style={{ fontSize: 12 }}
      >
        Challenge Ends In
      </p>
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        <CountdownUnit value={time.days} label="Days" />
        <span className="text-gold font-bold text-2xl mt-[-20px]">:</span>
        <CountdownUnit value={time.hours} label="Hours" />
        <span className="text-gold font-bold text-2xl mt-[-20px]">:</span>
        <CountdownUnit value={time.minutes} label="Minutes" />
        <span className="text-gold font-bold text-2xl mt-[-20px]">:</span>
        <CountdownUnit value={time.seconds} label="Seconds" />
      </div>
    </motion.div>
  );
}
