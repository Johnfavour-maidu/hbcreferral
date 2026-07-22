import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopNav } from "@/components/admin/admin-topnav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")
    redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopNav />
        <main className="flex-1 p-4 lg:p-6 xl:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
