import Link from "next/link";
import { Instagram, Twitter, Facebook, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/shared/logo";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/register", label: "Register" },
  { href: "/login", label: "Login" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/rewards", label: "Rewards" },
];

const socialLinks = [
  { href: "https://instagram.com/heartsbycharming", label: "Instagram", icon: Instagram },
  { href: "https://twitter.com/heartsbycharming", label: "Twitter", icon: Twitter },
  { href: "https://facebook.com/heartsbycharming", label: "Facebook", icon: Facebook },
];

export function Footer() {
  return (
    <footer className="bg-brown text-cream" id="contact">
      <div style={{ maxWidth: 1280, margin: "0 auto", paddingLeft: 32, paddingRight: 32, paddingTop: 80, paddingBottom: 80 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="mb-5 brightness-0 invert opacity-80">
              <Logo size="sm" />
            </div>
            <p className="text-cream/50 text-sm leading-relaxed mb-6" style={{ maxWidth: 320 }}>
              Empowering youth through community, connection, and meaningful impact. Join our
              referral challenge and help us grow.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-cream/40 text-sm">
                <Mail className="h-4 w-4" />
                info@heartsbycharming.org
              </div>
              <div className="flex items-center gap-2 text-cream/40 text-sm">
                <MapPin className="h-4 w-4" />
                Lagos, Nigeria
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <h3 className="text-gold font-bold text-xs uppercase tracking-widest mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/50 hover:text-cream text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-gold font-bold text-xs uppercase tracking-widest mb-5">
              Connect
            </h3>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-cream/50 hover:text-cream text-sm transition-colors duration-200"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream/30 text-xs">
            &copy; {new Date().getFullYear()} Hearts by Charming. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-cream/30 hover:text-cream/50 text-xs transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-cream/30 hover:text-cream/50 text-xs transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
