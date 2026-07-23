"use client";

import { Navbar } from "@/components/shared/navbar";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      {children}
    </div>
  );
}
