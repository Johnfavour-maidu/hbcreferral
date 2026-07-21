import { Logo } from "@/components/shared/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-y-auto bg-bg flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-[520px]">
        <div className="bg-white rounded-[24px] shadow-[0_8px_40px_rgba(74,46,31,0.1)] overflow-hidden">
          <div className="px-8 sm:px-10 pt-8 pb-10">
            <div className="flex justify-center mb-6">
              <Logo size="md" className="justify-center" />
            </div>
            {children}
          </div>
          <div className="px-8 sm:px-10 py-5 border-t border-border">
            <p className="text-center text-[11px] text-brown-light/50">
              &copy; {new Date().getFullYear()} Hearts by Charming. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
