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
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[520px]">
        {/* Card */}
        <div className="bg-white rounded-[24px] shadow-[0_8px_40px_rgba(74,46,31,0.06)] px-8 sm:px-10 pt-8 pb-8">

          {/* Logo */}
          <div className="flex justify-center mb-7">
            <Link href="/" aria-label="Hearts by Charming home">
              <Image
                src="/images/hearts-by-charming-logo.png"
                alt="Hearts by Charming"
                width={64}
                height={64}
                className="rounded-full object-contain"
                priority
              />
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-gold font-semibold text-[11px] uppercase tracking-[0.18em] mb-2">
              Welcome Back
            </p>
            <h1 className="text-[28px] sm:text-[32px] font-extrabold text-brown-dark mb-2 leading-tight">
              Log In
            </h1>
            <p className="text-brown-light text-[15px] leading-relaxed">
              Access your referral dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[13px] font-medium text-brown-dark">
                  Email Address
                </Label>
                <Input
                  id="email"
                  className="h-[52px] rounded-xl border-cream-dark text-[15px] placeholder:text-brown-light/40"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-error text-xs">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[13px] font-medium text-brown-dark">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    className="h-[52px] rounded-xl border-cream-dark text-[15px] pr-11 placeholder:text-brown-light/40"
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
                    {showPassword ? (
                      <EyeOff className="h-[18px] w-[18px]" />
                    ) : (
                      <Eye className="h-[18px] w-[18px]" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-error text-xs">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me / Forgot */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-cream-dark text-gold focus:ring-gold/20 cursor-pointer"
                  />
                  <span className="text-[13px] text-brown-light">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[13px] text-gold hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <div className="pt-1">
                <Button
                  type="submit"
                  className="w-full h-[54px] rounded-xl text-[15px] font-semibold"
                  disabled={isLoading}
                >
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

              {/* Register */}
              <p className="text-center text-[13px] text-brown-light pt-2">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-gold font-semibold hover:underline"
                >
                  Register Now
                </Link>
              </p>

            </div>
          </form>

          {/* Copyright */}
          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-center text-[11px] text-brown-light/50">
              &copy; {new Date().getFullYear()} Hearts by Charming. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
