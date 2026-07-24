"use client";

import { motion } from "framer-motion";

export function HeroIllustration() {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-full max-w-[420px] mx-auto"
    >
      <svg viewBox="0 0 400 380" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        {/* Background circle */}
        <circle cx="200" cy="190" r="160" fill="#FFF8EF" opacity="0.6" />
        <circle cx="200" cy="190" r="130" fill="#FCF8F3" opacity="0.8" />

        {/* Connection lines */}
        <line x1="200" y1="120" x2="130" y2="200" stroke="#E7D8C6" strokeWidth="2" strokeDasharray="6 4" />
        <line x1="200" y1="120" x2="270" y2="200" stroke="#E7D8C6" strokeWidth="2" strokeDasharray="6 4" />
        <line x1="130" y1="200" x2="100" y2="270" stroke="#E7D8C6" strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1="270" y1="200" x2="300" y2="270" stroke="#E7D8C6" strokeWidth="1.5" strokeDasharray="4 3" />

        {/* Central phone */}
        <rect x="170" y="80" width="60" height="90" rx="12" fill="#4A2E1F" />
        <rect x="175" y="88" width="50" height="68" rx="4" fill="#FFF8EF" />
        <circle cx="200" cy="160" r="3" fill="#4A2E1F" />
        {/* Share icon on phone */}
        <path d="M193 115 L200 108 L207 115" stroke="#C89A2B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="200" cy="120" r="2" fill="#C89A2B" />
        <line x1="200" y1="122" x2="200" y2="138" stroke="#C89A2B" strokeWidth="2" />

        {/* Left person - holding phone */}
        <circle cx="110" cy="175" r="16" fill="#C89A2B" />
        <circle cx="110" cy="170" r="12" fill="#FFF8EF" />
        <rect x="100" y="195" width="20" height="28" rx="6" fill="#4A2E1F" />
        <rect x="96" y="205" width="12" height="16" rx="3" fill="#FFF8EF" />

        {/* Right person - holding phone */}
        <circle cx="290" cy="175" r="16" fill="#C89A2B" />
        <circle cx="290" cy="170" r="12" fill="#FFF8EF" />
        <rect x="280" y="195" width="20" height="28" rx="6" fill="#4A2E1F" />
        <rect x="286" y="205" width="12" height="16" rx="3" fill="#FFF8EF" />

        {/* Hearts floating */}
        <motion.g
          animate={{ y: [0, -4, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0 }}
        >
          <path d="M155 100 C155 95, 148 90, 143 95 C138 90, 131 95, 131 100 C131 108, 143 115, 143 115 C143 115, 155 108, 155 100Z" fill="#DC2626" opacity="0.8" />
        </motion.g>
        <motion.g
          animate={{ y: [0, -5, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <path d="M260 95 C260 91, 254 87, 250 91 C246 87, 240 91, 240 95 C240 102, 250 108, 250 108 C250 108, 260 102, 260 95Z" fill="#DC2626" opacity="0.7" />
        </motion.g>
        <motion.g
          animate={{ y: [0, -3, 0], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <path d="M200 65 C200 62, 196 59, 193 62 C190 59, 186 62, 186 65 C186 70, 193 74, 193 74 C193 74, 200 70, 200 65Z" fill="#DC2626" opacity="0.6" />
        </motion.g>

        {/* Trophy */}
        <motion.g
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        >
          <path d="M185 255 L215 255 L212 275 L188 275Z" fill="#C89A2B" />
          <rect x="195" y="275" width="10" height="8" fill="#B88A22" />
          <rect x="188" y="283" width="24" height="4" rx="2" fill="#C89A2B" />
          <path d="M190 255 Q180 245, 182 255" stroke="#C89A2B" strokeWidth="2" fill="none" />
          <path d="M210 255 Q220 245, 218 255" stroke="#C89A2B" strokeWidth="2" fill="none" />
          <text x="200" y="270" textAnchor="middle" fill="#FFF8EF" fontSize="10" fontWeight="bold">★</text>
        </motion.g>

        {/* Gift boxes */}
        <motion.g
          animate={{ y: [0, -2, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        >
          <rect x="80" y="250" width="24" height="22" rx="3" fill="#C89A2B" />
          <rect x="78" y="248" width="28" height="6" rx="2" fill="#B88A22" />
          <line x1="92" y1="248" x2="92" y2="272" stroke="#FFF8EF" strokeWidth="1.5" />
          <line x1="78" y1="260" x2="106" y2="260" stroke="#FFF8EF" strokeWidth="1.5" />
        </motion.g>

        <motion.g
          animate={{ y: [0, -3, 0], rotate: [0, -2, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        >
          <rect x="296" y="248" width="22" height="20" rx="3" fill="#C89A2B" />
          <rect x="294" y="246" width="26" height="5" rx="2" fill="#B88A22" />
          <line x1="307" y1="246" x2="307" y2="268" stroke="#FFF8EF" strokeWidth="1.5" />
          <line x1="294" y1="256" x2="320" y2="256" stroke="#FFF8EF" strokeWidth="1.5" />
        </motion.g>

        {/* Confetti dots */}
        <motion.circle
          cx="70" cy="120" r="3" fill="#C89A2B"
          animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0 }}
        />
        <motion.circle
          cx="330" cy="130" r="2.5" fill="#DC2626"
          animate={{ y: [0, -6, 0], opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.7 }}
        />
        <motion.circle
          cx="60" cy="200" r="2" fill="#4A2E1F"
          animate={{ y: [0, -5, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: 1.1 }}
        />
        <motion.circle
          cx="340" cy="210" r="3" fill="#C89A2B"
          animate={{ y: [0, -7, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: 0.4 }}
        />
        <motion.circle
          cx="150" cy="300" r="2" fill="#E5C66A"
          animate={{ y: [0, -4, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: 1.5 }}
        />
        <motion.circle
          cx="250" cy="310" r="2.5" fill="#DC2626"
          animate={{ y: [0, -5, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3.1, repeat: Infinity, delay: 0.9 }}
        />

        {/* Referral arrows / network */}
        <motion.g
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        >
          <path d="M145 275 L170 260" stroke="#C89A2B" strokeWidth="1.5" strokeLinecap="round" markerEnd="url(#arrow)" />
          <path d="M255 275 L230 260" stroke="#C89A2B" strokeWidth="1.5" strokeLinecap="round" markerEnd="url(#arrow)" />
        </motion.g>

        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="#C89A2B" />
          </marker>
        </defs>
      </svg>
    </motion.div>
  );
}
