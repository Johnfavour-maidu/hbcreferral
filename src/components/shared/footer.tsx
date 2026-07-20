import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="bg-chocolate text-cream py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <span className="text-xl font-bold text-cream">
                Hearts <span className="text-gold">by</span> Charming
              </span>
            </div>
            <p className="text-cream/70 text-sm leading-relaxed max-w-md">
              Empowering youth through community, connection, and meaningful impact.
              Join our referral challenge and help us grow while earning amazing rewards.
            </p>
          </div>

          <div>
            <h3 className="text-gold font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-cream/70 hover:text-cream text-sm transition-colors">Home</Link></li>
              <li><Link href="/register" className="text-cream/70 hover:text-cream text-sm transition-colors">Register</Link></li>
              <li><Link href="/login" className="text-cream/70 hover:text-cream text-sm transition-colors">Login</Link></li>
              <li><Link href="/leaderboard" className="text-cream/70 hover:text-cream text-sm transition-colors">Leaderboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gold font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="https://instagram.com/heartsbycharming" target="_blank" rel="noopener noreferrer" className="text-cream/70 hover:text-cream text-sm transition-colors">Instagram</a></li>
              <li><a href="https://twitter.com/heartsbycharming" target="_blank" rel="noopener noreferrer" className="text-cream/70 hover:text-cream text-sm transition-colors">Twitter</a></li>
              <li><a href="https://facebook.com/heartsbycharming" target="_blank" rel="noopener noreferrer" className="text-cream/70 hover:text-cream text-sm transition-colors">Facebook</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/20 mt-12 pt-8 text-center">
          <p className="text-cream/50 text-sm">
            &copy; {new Date().getFullYear()} Hearts by Charming. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
