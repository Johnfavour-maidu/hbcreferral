import { Logo } from "@/components/shared/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-[520px]">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center" />
        </div>
        <div className="bg-white rounded-[20px] shadow-[0_8px_40px_rgba(74,46,31,0.08)] p-8 sm:p-10">
          {children}
        </div>
        <p className="text-center text-xs text-brown-light/50 mt-6">
          &copy; {new Date().getFullYear()} Hearts by Charming. All rights reserved.
        </p>
      </div>
    </div>
  );
}
