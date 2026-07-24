"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, UserCog } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/shared/logo";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/profile");
  const isLeaderboard = pathname.startsWith("/leaderboard");
  const hideButtons = isDashboard || isLeaderboard;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`sticky top-0 z-50 h-20 transition-all duration-300 bg-white border-b border-cream-dark ${
        scrolled
          ? "shadow-[0_2px_8px_rgba(74,46,31,0.06)]"
          : "shadow-none"
      }`}
    >
      <div
        className="h-full flex items-center justify-between"
        style={{ maxWidth: 1280, margin: "0 auto", paddingLeft: 32, paddingRight: 32 }}
      >
        <Logo size="sm" />
        <div className="hidden md:flex items-center gap-3">
          {hideButtons ? (
            <>
              <Link
                href="/profile"
                className="inline-flex items-center justify-center gap-2 h-11 min-w-[140px] px-5 rounded-xl border-2 border-cream-dark bg-white text-brown-dark font-semibold text-[14px] hover:border-gold hover:text-gold transition-colors"
              >
                <UserCog className="h-4 w-4" />
                Update Profile
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="inline-flex items-center justify-center gap-3 h-11 min-w-[140px] px-6 rounded-xl bg-gold text-white font-semibold text-[14px] shadow-[0_4px_12px_rgba(200,154,43,0.25)] hover:bg-gold-dark transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Button variant="outline" size="default" className="min-w-[170px] h-12 rounded-xl px-6 text-[15px]" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="default" className="min-w-[170px] h-12 rounded-xl px-6 text-[15px]" asChild>
                <Link href="/register">Register Now</Link>
              </Button>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-brown hover:bg-cream-dark rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:hidden border-t border-border overflow-hidden"
          >
            <div className="py-4 bg-white" style={{ paddingLeft: 32, paddingRight: 32 }}>
              {hideButtons ? (
                <div className="flex flex-col gap-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="text-[15px] font-medium text-brown hover:text-gold transition-colors py-2.5 text-right"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/leaderboard"
                    onClick={() => setMobileOpen(false)}
                    className="text-[15px] font-medium text-brown hover:text-gold transition-colors py-2.5 text-right"
                  >
                    Leaderboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="text-[15px] font-medium text-brown hover:text-gold transition-colors py-2.5 text-right"
                  >
                    Update Profile
                  </Link>
                  <div className="border-t border-border my-1" />
                  <button
                    className="text-[15px] font-medium text-brown hover:text-gold transition-colors py-2.5 text-right"
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-end">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="text-[15px] font-medium text-brown hover:text-gold transition-colors py-2">
                    Login
                  </Link>
                  <div className="w-full border-t border-border my-2" />
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="text-[15px] font-medium text-gold hover:text-gold-dark transition-colors py-2">
                    Register Now
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
