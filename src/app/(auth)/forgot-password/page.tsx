"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  AuthLayout,
  AuthPanel,
  AuthBrand,
  AuthHeader,
  AuthForm,
  AuthInput,
  AuthButton,
} from "@/components/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send verification code");
      }

      sessionStorage.setItem("reset-email", email.trim().toLowerCase());
      setSent(true);
      toast.success("Verification code sent!");
    } catch (error: any) {
      toast.error("Failed to send code", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthPanel>
        <AuthBrand />
        <AuthHeader
          title={sent ? "Check Your Email" : "Forgot Password?"}
          subtitle={
            sent
              ? "We've sent a verification code to your email."
              : "Enter your registered email address and we'll send you a verification code."
          }
        />

        <AuthForm>
          {sent ? (
            <div className="flex flex-col items-center space-y-5">
              <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-success" />
              </div>
              <p className="text-[14px] text-brown-light/60 text-center">
                Didn&apos;t receive the code? Check your spam folder or try again.
              </p>
              <div className="flex flex-col gap-3 w-full">
                <AuthButton
                  type="button"
                  isLoading={false}
                  onClick={() => router.push("/verify-otp")}
                >
                  Enter Verification Code
                </AuthButton>
                <AuthButton
                  type="button"
                  isLoading={false}
                  variant="outline"
                  onClick={() => {
                    setSent(false);
                    setEmail("");
                  }}
                >
                  Try Again
                </AuthButton>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-[18px]">
              <AuthInput
                id="email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div style={{ paddingTop: 24 }}>
                <AuthButton type="submit" isLoading={isLoading} loadingText="Sending...">
                  Send Verification Code
                </AuthButton>
              </div>
            </form>
          )}
        </AuthForm>

        <div className="text-center mt-8 pt-6 border-t border-border/40">
          <Link
            href="/login"
            className="inline-flex items-center text-[13px] text-gold hover:text-gold-dark font-medium transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Login
          </Link>
          <p className="text-[11px] text-brown-light/30 mt-4">
            &copy; {new Date().getFullYear()} Hearts by Charming. All rights reserved.
          </p>
        </div>
      </AuthPanel>
    </AuthLayout>
  );
}
