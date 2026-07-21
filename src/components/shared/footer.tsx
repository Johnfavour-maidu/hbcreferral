import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-white border-t border-cream-dark">
      <div
        className="flex flex-col items-center text-center"
        style={{ paddingTop: 40, paddingBottom: 40, paddingLeft: 32, paddingRight: 32 }}
      >
        <Link href="/" className="mb-4">
          <Image
            src="/assets/logo/logo-horizontal-sm.png"
            alt="Hearts by Charming"
            width={140}
            height={40}
            style={{ width: 140, height: "auto" }}
          />
        </Link>

        <p className="text-brown-light text-xs font-medium tracking-wide mb-4">
          Referral Challenge 2026 – Edition 1
        </p>

        <p className="text-brown-light/50 text-[11px] mb-4">
          &copy; {new Date().getFullYear()} Hearts by Charming. All rights reserved.
        </p>

        <div className="flex items-center gap-4 text-[11px]">
          <Link
            href="/privacy"
            className="text-brown-light/50 hover:text-gold transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-brown-light/20">•</span>
          <Link
            href="/terms"
            className="text-brown-light/50 hover:text-gold transition-colors"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
