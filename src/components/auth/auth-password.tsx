"use client";

import { useState, forwardRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock } from "lucide-react";

interface AuthPasswordProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

export const AuthPassword = forwardRef<HTMLInputElement, AuthPasswordProps>(
  ({ id, label, error, className = "", style, ...props }, ref) => {
    const [show, setShow] = useState(false);

    return (
      <div className="space-y-[6px]">
        <Label htmlFor={id} className="text-[13px] font-medium text-brown-dark/80">
          {label}
        </Label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[16px] w-[16px] text-brown-light/30 pointer-events-none" />
          <Input
            ref={ref}
            id={id}
            type={show ? "text" : "password"}
            className={`h-[50px] rounded-xl border-border bg-white/80 text-[14px] shadow-[0_1px_2px_rgba(74,46,31,0.04)] focus:shadow-[0_0_0_3px_rgba(200,154,43,0.1)] transition-all duration-200 ${error ? "border-error/60" : ""} ${className}`}
            style={{
              padding: "0",
              paddingLeft: "48px",
              paddingRight: "48px",
              ...style,
            }}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-brown-light/30 hover:text-brown-light/60 transition-colors"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="h-[16px] w-[16px]" /> : <Eye className="h-[16px] w-[16px]" />}
          </button>
        </div>
        {error && <p className="text-error text-[12px] mt-0.5">{error}</p>}
      </div>
    );
  }
);

AuthPassword.displayName = "AuthPassword";
