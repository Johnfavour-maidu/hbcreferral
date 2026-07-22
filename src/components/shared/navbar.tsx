"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/shared/logo";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

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
        <div className="hidden md:flex items-center gap-4">
          {isDashboard ? null : (
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
            <div className="py-4 space-y-2 bg-white" style={{ paddingLeft: 32, paddingRight: 32 }}>
              <Button variant="outline" className="w-full h-12 rounded-xl text-[15px]" asChild>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
              </Button>
              <Button className="w-full h-12 rounded-xl text-[15px]" asChild>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  Register Now
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
