import { forwardRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon?: LucideIcon;
  error?: string;
  rightElement?: React.ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ id, label, icon: Icon, error, rightElement, className = "", style, ...props }, ref) => {
    return (
      <div className="space-y-[6px]">
        <Label htmlFor={id} className="text-[13px] font-medium text-brown-dark/80">
          {label}
        </Label>
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-[16px] w-[16px] text-brown-light/30 pointer-events-none" />
          )}
          <Input
            ref={ref}
            id={id}
            className={`h-[50px] rounded-xl border-border bg-white/80 text-[14px] shadow-[0_1px_2px_rgba(74,46,31,0.04)] focus:shadow-[0_0_0_3px_rgba(200,154,43,0.1)] transition-all duration-200 ${error ? "border-error/60" : ""} ${className}`}
            style={{
              padding: "0",
              paddingLeft: Icon ? "48px" : "16px",
              paddingRight: rightElement ? "48px" : "16px",
              ...style,
            }}
            {...props}
          />
          {rightElement}
        </div>
        {error && <p className="text-error text-[12px] mt-0.5">{error}</p>}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
