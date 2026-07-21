"use client";

import { motion } from "framer-motion";
import { Instagram, Facebook } from "lucide-react";
import Link from "next/link";

const socials = [
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/heartsbycharming_?igsh=MWRtbjlzeGZtNGI5MA%3D%3D&utm_source=qr",
    color: "hover:bg-[#E1306C]/15 hover:border-[#E1306C]/30 hover:text-[#E1306C] hover:shadow-[0_0_20px_rgba(225,48,108,0.15)]",
  },
  {
    name: "Facebook",
    icon: Facebook,
    href: "https://www.facebook.com/share/195h1uZfnZ/?mibextid=wwXIfr",
    color: "hover:bg-[#1877F2]/15 hover:border-[#1877F2]/30 hover:text-[#1877F2] hover:shadow-[0_0_20px_rgba(24,119,242,0.15)]",
  },
  {
    name: "TikTok",
    icon: TikTokIcon,
    href: "https://www.tiktok.com/@hbc_teens?_r=1&_t=ZS-98DgJMe73Nl",
    color: "hover:bg-[#000000]/10 hover:border-[#000000]/20 hover:text-[#000000] hover:shadow-[0_0_20px_rgba(0,0,0,0.1)]",
  },
];

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13.2a8.16 8.16 0 005.58 2.18v-3.45a4.85 4.85 0 01-3.58-1.59V6.69h3.58z" />
    </svg>
  );
}

export function SocialSection() {
  return (
    <section className="bg-bg" style={{ paddingTop: 16, paddingBottom: 16 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", paddingLeft: 32, paddingRight: 32 }}>
        <div className="relative brown-gradient rounded-3xl overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-gold rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-gold-light rounded-full blur-[100px]" />
          </div>

          <div className="relative px-8 md:px-16 text-center" style={{ paddingTop: 56, paddingBottom: 56 }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-cream leading-tight" style={{ marginBottom: 20 }}>
                Follow Us on Social Media
              </h2>
              <p
                className="text-cream/65 text-lg leading-[1.75] text-center mx-auto"
                style={{ maxWidth: 640, marginBottom: 32 }}
              >
                Stay connected with Hearts by Charming for challenge updates, winners,
                announcements, inspiring content, and community highlights. Follow us and
                never miss an update.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {socials.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group inline-flex items-center gap-3 bg-white/10 border border-white/15 text-cream rounded-xl px-7 h-12 text-[15px] font-semibold transition-all duration-300 hover:-translate-y-0.5 ${social.color}`}
                  >
                    <social.icon className="h-5 w-5 transition-colors" />
                    {social.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
