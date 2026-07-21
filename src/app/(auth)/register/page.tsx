"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { NIGERIAN_STATES } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrength } from "@/components/ui/password-strength";
import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Instagram,
  ArrowRight,
} from "lucide-react";
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
      <div className="text-center space-y-6 py-4 animate-in fade-in zoom-in duration-500">
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

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-brown-dark">
          Create Account
        </h1>
        <p className="text-brown-light mt-2 text-sm">
          Join the Referral Challenge 2026 — Edition 1
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/40" />
            <Input
              id="fullName"
              className="pl-10 h-12"
              placeholder="e.g. Mary Johnson"
              {...register("fullName")}
            />
          </div>
          {errors.fullName && (
            <p className="text-error text-xs mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/40" />
            <Input
              id="email"
              className="pl-10 h-12"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-error text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/40" />
            <Input
              id="phone"
              className="pl-10 h-12"
              placeholder="e.g. 08012345678"
              {...register("phone")}
            />
          </div>
          {errors.phone && (
            <p className="text-error text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/40 pointer-events-none" />
              <select
                id="state"
                className="flex h-12 w-full rounded-xl border-2 border-cream-dark bg-white pl-10 pr-4 py-3 text-sm text-brown-dark focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-300 appearance-none cursor-pointer"
                {...register("state")}
              >
                <option value="">Select state</option>
                {NIGERIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="h-4 w-4 text-brown-light/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {errors.state && (
              <p className="text-error text-xs mt-1">{errors.state.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="school">School</Label>
            <div className="relative">
              <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/40" />
              <Input
                id="school"
                className="pl-10 h-12"
                placeholder="School name"
                {...register("school")}
              />
            </div>
            {errors.school && (
              <p className="text-error text-xs mt-1">{errors.school.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram Username</Label>
          <div className="relative">
            <Instagram className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/40" />
            <Input
              id="instagram"
              className="pl-10 h-12"
              placeholder="@username"
              {...register("instagram")}
            />
          </div>
          {errors.instagram && (
            <p className="text-error text-xs mt-1">{errors.instagram.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              className="h-12 pr-11"
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
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <PasswordStrength password={passwordValue} />
          {errors.password && (
            <p className="text-error text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className="h-12 pr-11"
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
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
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

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="agreeToRules"
            className="mt-1 h-4 w-4 rounded border-cream-dark text-gold focus:ring-gold/20 cursor-pointer"
            {...register("agreeToRules")}
          />
          <label
            htmlFor="agreeToRules"
            className="text-sm text-brown-light leading-relaxed cursor-pointer"
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

        <Button
          type="submit"
          className="w-full h-12 text-[15px] font-semibold rounded-xl"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              Register Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        <p className="text-center text-sm text-brown-light">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-gold font-semibold hover:underline"
          >
            Log In
          </Link>
        </p>
      </form>
    </>
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
