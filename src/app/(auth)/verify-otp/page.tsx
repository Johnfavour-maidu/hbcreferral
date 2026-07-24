"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
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

export default function VerifyOTPPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const email = sessionStorage.getItem("reset-email");
    if (!email) {
      toast.error("Session expired. Please start over.");
      router.push("/forgot-password");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      sessionStorage.setItem("reset-otp", otp);
      toast.success("Code verified!");
      router.push("/reset-password");
    } catch (error: any) {
      toast.error("Verification failed", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthPanel>
        <AuthBrand />
        <AuthHeader
          title="Verify Code"
          subtitle="Enter the 6-digit verification code sent to your email."
        />

        <AuthForm>
          <form onSubmit={handleSubmit} className="space-y-[18px]">
            <AuthInput
              id="otp"
              label="Verification Code"
              placeholder="000000"
              icon={ShieldCheck}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              required
              maxLength={6}
              style={{ letterSpacing: 8, textAlign: "center", fontSize: 20, fontWeight: 700 }}
            />
            <div style={{ paddingTop: 24 }}>
              <AuthButton type="submit" isLoading={isLoading} loadingText="Verifying...">
                Verify Code
              </AuthButton>
            </div>
          </form>
        </AuthForm>

        <div className="text-center mt-8 pt-6 border-t border-border/40">
          <Link
            href="/forgot-password"
            className="inline-flex items-center text-[13px] text-gold hover:text-gold-dark font-medium transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Forgot Password
          </Link>
          <p className="text-[11px] text-brown-light/30 mt-4">
            &copy; {new Date().getFullYear()} Hearts by Charming. All rights reserved.
          </p>
        </div>
      </AuthPanel>
    </AuthLayout>
  );
}
