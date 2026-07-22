export default function AuthLayout({
  children,
  centered = true,
}: {
  children: React.ReactNode;
  centered?: boolean;
}) {
  return (
    <div
      className={`min-h-screen bg-bg relative px-4 ${
        centered
          ? "flex items-center justify-center py-12"
          : "flex items-start justify-center py-16 sm:py-20"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/[0.03] rounded-full blur-[120px]" />
      </div>
      <div className="relative z-10" style={{ width: "100%", maxWidth: 480 }}>
        {children}
      </div>
    </div>
  );
}
