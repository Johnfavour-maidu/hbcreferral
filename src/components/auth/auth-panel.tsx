export function AuthPanel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-white rounded-[28px] shadow-[0_2px_20px_rgba(74,46,31,0.06),0_12px_48px_rgba(74,46,31,0.08)]"
      style={{ padding: "48px 48px 40px" }}
    >
      {children}
    </div>
  );
}
