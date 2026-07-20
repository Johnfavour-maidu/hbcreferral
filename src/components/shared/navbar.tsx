"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Menu, X, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const isLanding = pathname === "/";

  return (
    <nav className="sticky top-0 z-50 glass border-b border-cream-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          <div className="hidden md:flex items-center gap-6">
            {isLanding && (
              <>
                <Link href="/#features" className="text-sm text-chocolate/70 hover:text-purple transition-colors">
                  Features
                </Link>
                <Link href="/#faq" className="text-sm text-chocolate/70 hover:text-purple transition-colors">
                  FAQ
                </Link>
              </>
            )}
            {isDashboard && (
              <>
                <Link href="/dashboard" className={`text-sm transition-colors ${pathname === "/dashboard" ? "text-purple font-semibold" : "text-chocolate/70 hover:text-purple"}`}>
                  Dashboard
                </Link>
                <Link href="/leaderboard" className={`text-sm transition-colors ${pathname === "/leaderboard" ? "text-purple font-semibold" : "text-chocolate/70 hover:text-purple"}`}>
                  Leaderboard
                </Link>
                <Link href="/rewards" className={`text-sm transition-colors ${pathname === "/rewards" ? "text-purple font-semibold" : "text-chocolate/70 hover:text-purple"}`}>
                  Rewards
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isDashboard ? (
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/notifications">
                    <Bell className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Register Now</Link>
                </Button>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-chocolate"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-cream-dark glass overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {isLanding && (
                <>
                  <Link href="/#features" className="block text-sm text-chocolate/70 hover:text-purple py-2" onClick={() => setMobileOpen(false)}>
                    Features
                  </Link>
                  <Link href="/#faq" className="block text-sm text-chocolate/70 hover:text-purple py-2" onClick={() => setMobileOpen(false)}>
                    FAQ
                  </Link>
                </>
              )}
              {isDashboard && (
                <>
                  <Link href="/dashboard" className="block text-sm text-chocolate/70 hover:text-purple py-2" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/leaderboard" className="block text-sm text-chocolate/70 hover:text-purple py-2" onClick={() => setMobileOpen(false)}>
                    Leaderboard
                  </Link>
                  <Link href="/rewards" className="block text-sm text-chocolate/70 hover:text-purple py-2" onClick={() => setMobileOpen(false)}>
                    Rewards
                  </Link>
                  <Link href="/notifications" className="block text-sm text-chocolate/70 hover:text-purple py-2" onClick={() => setMobileOpen(false)}>
                    Notifications
                  </Link>
                </>
              )}
              {!isDashboard && (
                <div className="flex flex-col gap-2 pt-2">
                  <Button variant="ghost" asChild className="w-full">
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/register">Register Now</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
