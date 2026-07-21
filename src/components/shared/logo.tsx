"use client";

import Link from "next/link";
import Image from "next/image";

const sizeMap = {
  sm: { src: "/assets/logo/logo-horizontal-sm.png", height: 44 },
  md: { src: "/assets/logo/logo-horizontal-md.png", height: 48 },
  lg: { src: "/assets/logo/logo-horizontal-lg.png", height: 64 },
  xl: { src: "/assets/logo/logo-xl.png", height: 100 },
  icon: { src: "/assets/logo/icon-64.png", height: 40 },
};

export function Logo({ size = "md", className = "" }: { size?: "sm" | "md" | "lg" | "xl" | "icon"; className?: string }) {
  const config = sizeMap[size];

  return (
    <Link href="/" className={`flex items-center group shrink-0 ${className}`}>
      <Image
        src={config.src}
        alt="Hearts by Charming"
        width={size === "xl" ? 300 : size === "lg" ? 200 : size === "md" ? 160 : 120}
        height={config.height}
        className="group-hover:opacity-85 transition-opacity duration-300"
        style={{ height: config.height, width: "auto", objectFit: "contain" }}
        priority
      />
    </Link>
  );
}
