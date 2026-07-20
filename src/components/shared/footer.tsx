import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-brown text-cream">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="lg:col-span-1">
            <Image
              src="/logo.png"
              alt="Hearts by Charming"
              width={140}
              height={45}
              className="mb-4 brightness-0 invert opacity-90"
            />
            <p className="text-cream/60 text-sm leading-relaxed max-w-xs">
              Empowering youth through community, connection, and meaningful impact. Join our referral challenge and help us grow.
            </p>
          </div>

          <div>
            <h3 className="text-gold font-bold text-sm uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/register", label: "Register" },
                { href: "/login", label: "Login" },
                { href: "/leaderboard", label: "Leaderboard" },
                { href: "/rewards", label: "Rewards" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-cream/60 hover:text-cream text-sm transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gold font-bold text-sm uppercase tracking-wider mb-5">Contact</h3>
            <ul className="space-y-3">
              <li className="text-cream/60 text-sm">info@heartsbycharming.org</li>
              <li className="text-cream/60 text-sm">Lagos, Nigeria</li>
            </ul>
          </div>

          <div>
            <h3 className="text-gold font-bold text-sm uppercase tracking-wider mb-5">Connect</h3>
            <ul className="space-y-3">
              {[
                { href: "https://instagram.com/heartsbycharming", label: "Instagram" },
                { href: "https://twitter.com/heartsbycharming", label: "Twitter" },
                { href: "https://facebook.com/heartsbycharming", label: "Facebook" },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-cream/60 hover:text-cream text-sm transition-colors duration-200">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream/40 text-xs">
            &copy; {new Date().getFullYear()} Hearts by Charming. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-cream/40 hover:text-cream/60 text-xs transition-colors">Privacy</Link>
            <Link href="/terms" className="text-cream/40 hover:text-cream/60 text-xs transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
