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
import { Logo } from "@/components/shared/logo";
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
  Heart,
  Sparkles,
  ArrowRight,
  Shield,
  Users,
  Gift,
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
      if (!response.ok) throw new Error(result.error || "Registration failed");
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
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md mx-auto animate-in fade-in zoom-in duration-500">
          <div className="mx-auto w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-brown-dark">Registration Successful!</h2>
            <p className="text-brown-light mt-2">Your account has been created successfully.</p>
            <p className="text-brown-light text-sm mt-1">Redirecting to login...</p>
          </div>
          <Loader2 className="h-6 w-6 text-gold animate-spin mx-auto" />
        </div>
      </div>
    );
  }

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
                Join the<br />Movement
              </h1>

              <p className="text-lg text-white/80 leading-relaxed max-w-md">
                Join thousands of young changemakers across Nigeria and earn
                exciting rewards by referring your friends.
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
              <h2 className="text-2xl sm:text-3xl font-bold text-brown-dark">Create Account</h2>
              <p className="text-brown-light mt-2 text-sm sm:text-base">
                Join the Referral Challenge 2026 — Edition 1
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-[13px] font-medium text-brown-dark">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/40" />
                  <Input id="fullName" className="h-[52px] rounded-xl border-cream-dark text-[15px] pl-10" placeholder="e.g. Mary Johnson" {...register("fullName")} />
                </div>
                {errors.fullName && <p className="text-error text-xs">{errors.fullName.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[13px] font-medium text-brown-dark">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/40" />
                  <Input id="email" className="h-[52px] rounded-xl border-cream-dark text-[15px] pl-10" type="email" placeholder="you@example.com" {...register("email")} />
                </div>
                {errors.email && <p className="text-error text-xs">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[13px] font-medium text-brown-dark">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/40" />
                  <Input id="phone" className="h-[52px] rounded-xl border-cream-dark text-[15px] pl-10" placeholder="e.g. 08012345678" {...register("phone")} />
                </div>
                {errors.phone && <p className="text-error text-xs">{errors.phone.message}</p>}
              </div>

              {/* State + School */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-[13px] font-medium text-brown-dark">State</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/40 pointer-events-none" />
                    <select
                      id="state"
                      className="flex h-[52px] w-full rounded-xl border-2 border-cream-dark bg-white pl-10 pr-4 text-[15px] text-brown-dark focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-300 appearance-none cursor-pointer"
                      {...register("state")}
                    >
                      <option value="">Select state</option>
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="h-4 w-4 text-brown-light/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.state && <p className="text-error text-xs">{errors.state.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school" className="text-[13px] font-medium text-brown-dark">School</Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/40" />
                    <Input id="school" className="h-[52px] rounded-xl border-cream-dark text-[15px] pl-10" placeholder="School name" {...register("school")} />
                  </div>
                  {errors.school && <p className="text-error text-xs">{errors.school.message}</p>}
                </div>
              </div>

              {/* Instagram */}
              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-[13px] font-medium text-brown-dark">Instagram Username</Label>
                <div className="relative">
                  <Instagram className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/40" />
                  <Input id="instagram" className="h-[52px] rounded-xl border-cream-dark text-[15px] pl-10" placeholder="@username" {...register("instagram")} />
                </div>
                {errors.instagram && <p className="text-error text-xs">{errors.instagram.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[13px] font-medium text-brown-dark">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="h-[52px] rounded-xl border-cream-dark text-[15px] pr-11"
                    placeholder="Min. 8 characters"
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
                <PasswordStrength password={passwordValue} />
                {errors.password && <p className="text-error text-xs">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[13px] font-medium text-brown-dark">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="h-[52px] rounded-xl border-cream-dark text-[15px] pr-11"
                    placeholder="Repeat password"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brown-light/40 hover:text-brown transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-error text-xs">{errors.confirmPassword.message}</p>}
              </div>

              {referredBy && <input type="hidden" {...register("referredBy")} value={referredBy} />}

              {/* Terms */}
              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  id="agreeToRules"
                  className="mt-0.5 h-4 w-4 rounded border-cream-dark text-gold focus:ring-gold/20 cursor-pointer shrink-0"
                  {...register("agreeToRules")}
                />
                <label htmlFor="agreeToRules" className="text-[13px] text-brown-light leading-relaxed cursor-pointer">
                  I agree to the{" "}
                  <Link href="/rules" className="text-gold font-semibold hover:underline">Rules and Guidelines</Link>{" "}
                  of the referral challenge
                </label>
              </div>
              {errors.agreeToRules && <p className="text-error text-xs">{errors.agreeToRules.message}</p>}

              {/* Submit */}
              <div className="pt-1">
                <Button type="submit" className="w-full h-[54px] rounded-xl text-[15px] font-semibold" disabled={isLoading}>
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
              </div>

              <p className="text-center text-[13px] text-brown-light pt-1">
                Already have an account?{" "}
                <Link href="/login" className="text-gold font-semibold hover:underline">Log In</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-gold animate-spin" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
