export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-[480px]">
        <div className="bg-white rounded-[24px] shadow-[0_8px_40px_rgba(74,46,31,0.1)] overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
