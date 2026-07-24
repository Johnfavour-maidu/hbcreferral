"use client";

import { motion } from "framer-motion";
import Link from "next/link";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13.2a8.16 8.16 0 005.58 2.18v-3.45a4.85 4.85 0 01-3.58-1.59V6.69h3.58z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const socials = [
  {
    name: "Instagram",
    icon: InstagramIcon,
    href: "https://www.instagram.com/heartsbycharming_?igsh=MWRtbjlzeGZtNGI5MA%3D%3D&utm_source=qr",
    bg: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
    hoverShadow: "hover:shadow-[0_8px_24px_rgba(225,48,108,0.3)]",
  },
  {
    name: "Facebook",
    icon: FacebookIcon,
    href: "https://www.facebook.com/share/195h1uZfnZ/?mibextid=wwXIfr",
    bg: "bg-[#1877F2]",
    hoverShadow: "hover:shadow-[0_8px_24px_rgba(24,119,242,0.3)]",
  },
  {
    name: "TikTok",
    icon: TikTokIcon,
    href: "https://www.tiktok.com/@hbc_teens?_r=1&_t=ZS-98DgJMe73Nl",
    bg: "bg-[#010101]",
    hoverShadow: "hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]",
  },
];

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
                className="text-cream/65 text-lg leading-[1.75] text-center"
                style={{ marginBottom: 32 }}
              >
                Stay connected with Hearts by Charming for inspiring content and community highlights. Follow us and never miss an update.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {socials.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group inline-flex items-center justify-center gap-2.5 ${social.bg} text-white rounded-2xl px-6 h-[50px] text-[15px] font-semibold transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] ${social.hoverShadow}`}
                  >
                    <social.icon className="h-5 w-5" />
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
