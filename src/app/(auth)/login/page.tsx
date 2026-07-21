"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/logo";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  Heart,
  Sparkles,
  Users,
  Gift,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) throw new Error("Invalid email or password");
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error("Login failed", { description: error.message });
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
                Welcome<br />Back
              </h1>

              <p className="text-lg text-white/80 leading-relaxed max-w-md">
                Access your referral dashboard and track your progress in the
                Hearts by Charming Referral Challenge.
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
          {/* Mobile logo — outside card */}
          <div className="lg:hidden text-center mb-6">
            <Logo size="lg" className="justify-center" />
          </div>

          {/* Auth card */}
          <div className="bg-white rounded-[20px] shadow-2xl shadow-brown/5 px-8 sm:px-10 pt-8 pb-8">

            {/* Logo inside card — desktop only */}
            <div className="hidden lg:flex justify-center mb-6">
              <Logo size="lg" />
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <p className="text-gold font-semibold text-[11px] uppercase tracking-[0.18em] mb-2">
                Welcome Back
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-brown-dark">Log In</h2>
              <p className="text-brown-light mt-2 text-sm sm:text-base">
                Access your referral dashboard
              </p>
            </div>

            {/* Form — centered with max-width */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-[440px] mx-auto">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[13px] font-medium text-brown-dark">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/40" />
                  <Input
                    id="email"
                    className="h-[52px] rounded-xl border-cream-dark text-[15px] pl-10 placeholder:text-brown-light/40"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...register("email")}
                  />
                </div>
                {errors.email && <p className="text-error text-xs">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[13px] font-medium text-brown-dark">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/40" />
                  <Input
                    id="password"
                    className="h-[52px] rounded-xl border-cream-dark text-[15px] pl-10 pr-11 placeholder:text-brown-light/40"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brown-light/40 hover:text-brown transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
                {errors.password && <p className="text-error text-xs">{errors.password.message}</p>}
              </div>

              {/* Remember Me / Forgot */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-cream-dark text-gold focus:ring-gold/20 cursor-pointer" />
                  <span className="text-[13px] text-brown-light">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-[13px] text-gold hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <div className="pt-1">
                <Button type="submit" className="w-full h-[54px] rounded-xl text-[15px] font-semibold" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log In"
                  )}
                </Button>
              </div>

              <p className="text-center text-[13px] text-brown-light pt-1">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-gold font-semibold hover:underline">Register Now</Link>
              </p>
            </form>

            {/* Copyright — no divider */}
            <div className="mt-6 text-center">
              <p className="text-[11px] text-brown-light/50">
                &copy; {new Date().getFullYear()} Hearts by Charming. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
