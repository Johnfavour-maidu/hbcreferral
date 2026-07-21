"use client";

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "Weak", color: "bg-error" };
  if (score <= 3) return { score, label: "Fair", color: "bg-warning" };
  if (score <= 4) return { score, label: "Strong", color: "bg-gold" };
  return { score, label: "Very Strong", color: "bg-success" };
}

export function PasswordStrength({ password }: { password: string }) {
  const { score, label, color } = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i < score ? color : "bg-cream-dark"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${
        score <= 2 ? "text-error" : score <= 3 ? "text-warning" : score <= 4 ? "text-gold" : "text-success"
      }`}>
        {label}
      </p>
    </div>
  );
}
