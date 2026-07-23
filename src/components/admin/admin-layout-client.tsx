"use client";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      {children}
    </div>
  );
}
