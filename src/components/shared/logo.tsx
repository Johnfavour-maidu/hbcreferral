"use client";

import Link from "next/link";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-purple text-white font-bold text-sm group-hover:scale-105 transition-transform">
        H
      </div>
      <span className={`font-bold ${sizes[size]} text-chocolate`}>
        Hearts <span className="text-purple">by</span> Charming
      </span>
    </Link>
  );
}
