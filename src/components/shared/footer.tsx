import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-white border-t border-cream-dark">
      <div
        className="flex flex-col items-center text-center"
        style={{ paddingTop: 40, paddingBottom: 40, paddingLeft: 32, paddingRight: 32 }}
      >
        <Link href="/" className="mb-5">
          <Image
            src="/assets/logo/logo-horizontal-sm.png"
            alt="Hearts by Charming"
            width={140}
            height={40}
            style={{ width: 140, height: "auto" }}
          />
        </Link>

        <p className="text-brown-light text-xs font-medium tracking-wide mb-3">
          Referral Challenge 2026 – Edition 1
        </p>

        <p className="text-brown-light/50 text-[11px]">
          &copy; {new Date().getFullYear()} Hearts by Charming. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
