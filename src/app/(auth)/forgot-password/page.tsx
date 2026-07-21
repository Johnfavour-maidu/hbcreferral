"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/logo";
import {
  Loader2,
  ArrowLeft,
  Mail,
  Heart,
  Sparkles,
  CheckCircle2,
  Users,
  Gift,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setSent(true);
      toast.success("Reset link sent!");
    } catch {
      toast.error("Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Left branded panel — desktop only */}
      <div className="hidden lg:flex lg:w-[45%] brown-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 animate-float">
            <Heart className="h-16 w-16 text-white/30" />
          </div>
          <div className="bottom-32 right-16 absolute animate-float" style={{ animationDelay: "1s" }}>
            <Heart className="h-12 w-12 text-white/20" />
          </div>
          <div className="top-1/2 left-1/4 absolute animate-float" style={{ animationDelay: "2s" }}>
            <Sparkles className="h-10 w-10 text-white/20" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 w-full">
          <div className="space-y-8">
            <Logo size="lg" className="[&_span]:!text-white" />

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white/90 font-medium">
                <Sparkles className="h-4 w-4" />
                Referral Challenge 2026 — Edition 1
              </div>

              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                Reset Your<br />Password
              </h1>

              <p className="text-lg text-white/80 leading-relaxed max-w-md">
                No worries! Enter your email address and we&apos;ll send you a
                link to reset your password.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              {[
                { icon: Users, text: "5,000+ participants nationwide" },
                { icon: Gift, text: "Win up to ₦10,000 in rewards" },
                { icon: Shield, text: "Secure and transparent process" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/80">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-4 w-4 text-gold-light" />
                  </div>
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full max-w-[520px]">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Logo size="lg" className="justify-center" />
          </div>

          <div className="bg-white rounded-[20px] shadow-2xl shadow-brown/5 p-6 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-brown-dark">
                {sent ? "Check Your Email" : "Forgot Password?"}
              </h2>
              <p className="text-brown-light mt-2 text-sm sm:text-base">
                {sent
                  ? "We've sent a password reset link to your email."
                  : "Enter your email and we'll send you a reset link."}
              </p>
            </div>

            {sent ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <p className="text-sm text-brown-light">
                  Didn&apos;t receive the email? Check your spam folder or try again.
                </p>
                <Button
                  variant="outline"
                  className="w-full h-[54px] rounded-xl"
                  onClick={() => {
                    setSent(false);
                    setEmail("");
                  }}
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[13px] font-medium text-brown-dark">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/40" />
                    <Input
                      id="email"
                      className="h-[52px] rounded-xl border-cream-dark text-[15px] pl-10"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-[54px] rounded-xl text-[15px] font-semibold" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link href="/login" className="inline-flex items-center text-sm text-gold hover:underline font-medium">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
