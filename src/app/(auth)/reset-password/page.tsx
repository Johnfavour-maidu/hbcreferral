"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  AuthLayout,
  AuthPanel,
  AuthBrand,
  AuthHeader,
  AuthForm,
  AuthPassword,
  AuthButton,
} from "@/components/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = sessionStorage.getItem("reset-email");
    const otp = sessionStorage.getItem("reset-otp");

    if (!email || !otp) {
      toast.error("Session expired. Please start over.");
      router.push("/forgot-password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      sessionStorage.removeItem("reset-email");
      sessionStorage.removeItem("reset-otp");
      setSuccess(true);
      toast.success("Password updated successfully!");
    } catch (error: any) {
      toast.error("Failed to reset password", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthPanel>
        <AuthBrand />
        <AuthHeader
          title={success ? "Password Updated" : "Create New Password"}
          subtitle={
            success
              ? "Your password has been updated successfully."
              : "Enter your new password below."
          }
        />

        <AuthForm>
          {success ? (
            <div className="flex flex-col items-center space-y-5">
              <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-success" />
              </div>
              <p className="text-[14px] text-brown-light/60 text-center">
                You can now log in with your new password.
              </p>
              <AuthButton
                type="button"
                isLoading={false}
                onClick={() => router.push("/login")}
              >
                Go to Login
              </AuthButton>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-[18px]">
              <AuthPassword
                id="newPassword"
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <AuthPassword
                id="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <div style={{ paddingTop: 24 }}>
                <AuthButton type="submit" isLoading={isLoading} loadingText="Saving...">
                  Save Password
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
