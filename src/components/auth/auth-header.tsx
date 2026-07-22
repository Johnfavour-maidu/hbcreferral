export function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-[24px] font-bold text-brown-dark tracking-tight mb-2">{title}</h1>
      <p className="text-brown-light/70 text-[14px] leading-relaxed">{subtitle}</p>
    </div>
  );
}
