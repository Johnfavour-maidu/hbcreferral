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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Logo } from "@/components/shared/logo";
import { FadeIn } from "@/components/shared/animations";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referredBy = searchParams.get("ref") || "";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      referredBy: referredBy || undefined,
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      toast.success("Registration successful!", {
        description: "Welcome to Hearts by Charming!",
      });

      router.push("/login");
    } catch (error: any) {
      toast.error("Registration failed", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple/5 via-cream to-gold/5 flex items-center justify-center py-12 px-4">
      <FadeIn>
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <Logo size="lg" />
            <p className="text-chocolate/70 mt-3">Join the Referral Challenge 2026</p>
          </div>

          <Card className="shadow-xl border-cream-dark">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create Your Account</CardTitle>
              <CardDescription>Fill in your details to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="e.g. Mary Johnson" {...register("fullName")} />
                  {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="e.g. 08012345678" {...register("phone")} />
                  {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <select
                      id="state"
                      className="flex h-11 w-full rounded-lg border border-cream-dark bg-white px-4 py-2 text-sm text-chocolate focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple transition-all duration-200"
                      {...register("state")}
                    >
                      <option value="">Select state</option>
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.state && <p className="text-red-500 text-xs">{errors.state.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="school">School</Label>
                    <Input id="school" placeholder="School name" {...register("school")} />
                    {errors.school && <p className="text-red-500 text-xs">{errors.school.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram Username</Label>
                  <Input id="instagram" placeholder="@username" {...register("instagram")} />
                  {errors.instagram && <p className="text-red-500 text-xs">{errors.instagram.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-chocolate/50 hover:text-chocolate"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="Repeat password" {...register("confirmPassword")} />
                  {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
                </div>

                {referredBy && (
                  <input type="hidden" {...register("referredBy")} value={referredBy} />
                )}

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="agreeToRules"
                    className="mt-1 rounded border-cream-dark text-purple focus:ring-purple"
                    {...register("agreeToRules")}
                  />
                  <label htmlFor="agreeToRules" className="text-sm text-chocolate/70">
                    I agree to the{" "}
                    <Link href="/rules" className="text-purple hover:underline">rules and guidelines</Link>{" "}
                    of the referral challenge
                  </label>
                </div>
                {errors.agreeToRules && <p className="text-red-500 text-xs">{errors.agreeToRules.message}</p>}

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Register Now
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-chocolate/70">
                  Already have an account?{" "}
                  <Link href="/login" className="text-purple font-medium hover:underline">
                    Log in
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </FadeIn>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
