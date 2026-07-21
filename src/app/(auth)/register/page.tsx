"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { NIGERIAN_STATES } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrength } from "@/components/ui/password-strength";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referredBy = searchParams.get("ref") || "";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { referredBy: referredBy || undefined },
  });

  const passwordValue = watch("password", "");

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Registration failed");
      setIsSuccess(true);
      toast.success("Registration successful!", {
        description: "Welcome to Hearts by Charming!",
      });
      setTimeout(() => router.push("/login"), 2500);
    } catch (error: any) {
      toast.error("Registration failed", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="px-8 sm:px-10 py-20 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-brown-dark">
            Registration Successful!
          </h2>
          <p className="text-brown-light mt-2">
            Your account has been created successfully.
          </p>
          <p className="text-brown-light text-sm mt-1">
            Redirecting to login...
          </p>
        </div>
        <Loader2 className="h-6 w-6 text-gold animate-spin mx-auto" />
      </div>
    );
  }

  const inputClass = "h-[52px] rounded-xl border-cream-dark text-[15px]";

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
        <h1 className="text-[26px] sm:text-[30px] font-extrabold text-brown-dark mb-2">
          Create Account
        </h1>
        <p className="text-brown-light text-sm text-center">
          Join the Referral Challenge 2026 — Edition 1
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-[20px]">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-[13px] font-medium text-brown-dark">
            Full Name
          </Label>
          <Input
            id="fullName"
            className={inputClass}
            placeholder="e.g. Mary Johnson"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-error text-xs mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[13px] font-medium text-brown-dark">
            Email Address
          </Label>
          <Input
            id="email"
            className={inputClass}
            type="email"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-error text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-[13px] font-medium text-brown-dark">
            Phone Number
          </Label>
          <Input
            id="phone"
            className={inputClass}
            placeholder="e.g. 08012345678"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-error text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="state" className="text-[13px] font-medium text-brown-dark">
              State
            </Label>
            <select
              id="state"
              className={`flex w-full rounded-xl border-2 border-cream-dark bg-white px-4 text-[15px] text-brown-dark focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-300 appearance-none cursor-pointer ${inputClass}`}
              {...register("state")}
            >
              <option value="">Select state</option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="text-error text-xs mt-1">{errors.state.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="school" className="text-[13px] font-medium text-brown-dark">
              School
            </Label>
            <Input
              id="school"
              className={inputClass}
              placeholder="School name"
              {...register("school")}
            />
            {errors.school && (
              <p className="text-error text-xs mt-1">{errors.school.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram" className="text-[13px] font-medium text-brown-dark">
            Instagram Username
          </Label>
          <Input
            id="instagram"
            className={inputClass}
            placeholder="@username"
            {...register("instagram")}
          />
          {errors.instagram && (
            <p className="text-error text-xs mt-1">{errors.instagram.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[13px] font-medium text-brown-dark">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              className={`${inputClass} pr-11`}
              placeholder="Min. 8 characters"
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
          <PasswordStrength password={passwordValue} />
          {errors.password && (
            <p className="text-error text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-[13px] font-medium text-brown-dark">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className={`${inputClass} pr-11`}
              placeholder="Repeat password"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brown-light/40 hover:text-brown transition-colors"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-[18px] w-[18px]" />
              ) : (
                <Eye className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-error text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {referredBy && (
          <input type="hidden" {...register("referredBy")} value={referredBy} />
        )}

        <div className="flex items-start gap-3 pt-2">
          <input
            type="checkbox"
            id="agreeToRules"
            className="mt-0.5 h-4 w-4 rounded border-cream-dark text-gold focus:ring-gold/20 cursor-pointer shrink-0"
            {...register("agreeToRules")}
          />
          <label
            htmlFor="agreeToRules"
            className="text-[13px] text-brown-light leading-relaxed cursor-pointer"
          >
            I agree to the{" "}
            <Link href="/rules" className="text-gold font-semibold hover:underline">
              Rules and Guidelines
            </Link>{" "}
            of the referral challenge
          </label>
        </div>
        {errors.agreeToRules && (
          <p className="text-error text-xs">{errors.agreeToRules.message}</p>
        )}

        <div className="pt-3">
          <Button
            type="submit"
            className="w-full h-[54px] rounded-xl text-[15px] font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Register Now"
            )}
          </Button>
        </div>

        <p className="text-center text-[13px] text-brown-light pt-2">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-gold font-semibold hover:underline"
          >
            Log In
          </Link>
        </p>

        <p className="text-center text-[11px] text-brown-light/50 pt-5 border-t border-border">
          &copy; {new Date().getFullYear()} Hearts by Charming. All rights reserved.
        </p>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 text-gold animate-spin" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
