"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Menu, X, Bell, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function CampaignStrip() {
  const [stats, setStats] = useState({ participants: 0, verified: 0 });

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((d) => {
        setStats({
          participants: d.leaderboard?.length || 500,
          verified: d.leaderboard?.reduce((a: number, e: any) => a + (e.verifiedReferrals || 0), 0) || 1800,
        });
      })
      .catch(() => setStats({ participants: 500, verified: 1800 }));
  }, []);

  return (
    <div className="bg-brown text-cream/90 text-xs sm:text-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-20 flex items-center justify-center gap-4 sm:gap-8 h-10 overflow-hidden">
        <span className="hidden sm:inline">📅</span>
        <span className="whitespace-nowrap">Campaign: 1st–31st August 2026</span>
        <span className="text-gold">|</span>
        <span className="whitespace-nowrap">👥 {stats.participants.toLocaleString()}+ Participants</span>
        <span className="text-gold">|</span>
        <span className="whitespace-nowrap">🔥 {stats.verified.toLocaleString()}+ Verified</span>
        <Link
          href="/leaderboard"
          className="hidden md:inline-flex items-center gap-1 text-gold hover:text-gold-light font-medium transition-colors whitespace-nowrap"
        >
          🏆 View Leaderboard
        </Link>
      </div>
    </div>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const isLanding = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = isLanding
    ? [
        { href: "/#features", label: "Features" },
        { href: "/leaderboard", label: "Leaderboard" },
        { href: "/#rewards", label: "Prizes" },
        { href: "/#faq", label: "FAQ" },
      ]
    : isDashboard
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/leaderboard", label: "Leaderboard" },
        { href: "/rewards", label: "Rewards" },
      ]
    : [];

  return (
    <>
      <CampaignStrip />
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass shadow-sm"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20">
          <div className="flex items-center justify-between h-16">
            <Logo size="sm" />

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? "text-gold bg-gold/5"
                      : "text-brown-light hover:text-brown hover:bg-cream-dark"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {isDashboard ? (
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/notifications">
                    <Bell className="h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">
                      Register Now
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-brown hover:bg-cream-dark rounded-lg transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-cream-dark overflow-hidden"
            >
              <div className="px-5 py-4 space-y-1 bg-white">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-3 text-sm font-medium text-brown-light hover:text-brown hover:bg-cream-dark rounded-xl transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 border-t border-cream-dark space-y-2">
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      Log In
                    </Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      Register Now
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
