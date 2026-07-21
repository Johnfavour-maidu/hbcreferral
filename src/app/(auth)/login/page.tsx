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
    <div className="px-8 sm:px-10 pt-10 pb-8">
      <div className="flex flex-col items-center mb-8">
        <Link href="/" className="mb-7">
          <Image
            src="/assets/logo/logo-horizontal-md.png"
            alt="Hearts by Charming"
            width={220}
            height={60}
            style={{ width: 220, height: "auto" }}
            priority
          />
        </Link>
        <p className="text-gold font-semibold text-xs uppercase tracking-[0.15em] mb-2">
          Welcome Back
        </p>
        <h1 className="text-[26px] sm:text-[30px] font-extrabold text-brown-dark mb-2">
          Log In
        </h1>
        <p className="text-brown-light text-sm">
          Access your referral dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[13px] font-medium text-brown-dark">
            Email Address
          </Label>
          <Input
            id="email"
            className="h-12 rounded-xl border-cream-dark text-[15px]"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-error text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[13px] font-medium text-brown-dark">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              className="h-12 rounded-xl border-cream-dark text-[15px] pr-11"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
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
            <p className="text-error text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

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

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full h-[52px] rounded-xl text-[15px] font-semibold"
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

        <p className="text-center text-[13px] text-brown-light pt-1">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-gold font-semibold hover:underline"
          >
            Register Now
          </Link>
        </p>

        <p className="text-center text-[11px] text-brown-light/50 pt-4 border-t border-border">
          &copy; {new Date().getFullYear()} Hearts by Charming. All rights reserved.
        </p>
      </form>
    </div>
  );
}
