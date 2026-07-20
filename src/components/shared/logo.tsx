"use client";

import Link from "next/link";
import Image from "next/image";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { width: 120, height: 40 },
    md: { width: 160, height: 50 },
    lg: { width: 200, height: 60 },
  };

  return (
    <Link href="/" className="flex items-center gap-2 group">
      <Image
        src="/logo.png"
        alt="Hearts by Charming"
        width={sizes[size].width}
        height={sizes[size].height}
        className="group-hover:opacity-90 transition-opacity duration-300"
        priority
      />
    </Link>
  );
}
