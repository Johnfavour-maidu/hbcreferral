"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopNav } from "@/components/admin/admin-topnav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <AdminSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopNav onMenuToggle={() => setMobileOpen(!mobileOpen)} />
        <main className="flex-1 p-4 lg:p-6 xl:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
