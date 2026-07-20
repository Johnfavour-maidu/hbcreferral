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
import { Eye, EyeOff, Loader2, CheckCircle2, User, Mail, Phone, MapPin, GraduationCap, Instagram } from "lucide-react";
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
    defaultValues: { referredBy: referredBy || undefined },
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
      if (!response.ok) throw new Error(result.error || "Registration failed");
      toast.success("Registration successful!", { description: "Welcome to Hearts by Charming!" });
      router.push("/login");
    } catch (error: any) {
      toast.error("Registration failed", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream section-padding flex items-center justify-center">
      <FadeIn>
        <div className="w-full max-w-lg mx-auto px-5">
          <div className="text-center mb-8">
            <Logo size="lg" />
            <p className="text-brown-light mt-3">Join the Referral Challenge 2026</p>
          </div>

          <Card className="shadow-xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Create Your Account</CardTitle>
              <CardDescription>Fill in your details to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/50" />
                    <Input className="pl-10" placeholder="e.g. Mary Johnson" {...register("fullName")} />
                  </div>
                  {errors.fullName && <p className="text-error text-xs">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/50" />
                    <Input className="pl-10" type="email" placeholder="you@example.com" {...register("email")} />
                  </div>
                  {errors.email && <p className="text-error text-xs">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/50" />
                    <Input className="pl-10" placeholder="e.g. 08012345678" {...register("phone")} />
                  </div>
                  {errors.phone && <p className="text-error text-xs">{errors.phone.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>State</Label>
                    <select
                      className="flex h-12 w-full rounded-xl border-2 border-cream-dark bg-white px-4 py-3 text-sm text-brown-dark focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-300"
                      {...register("state")}
                    >
                      <option value="">Select state</option>
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.state && <p className="text-error text-xs">{errors.state.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>School</Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/50" />
                      <Input className="pl-10" placeholder="School name" {...register("school")} />
                    </div>
                    {errors.school && <p className="text-error text-xs">{errors.school.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Instagram Username</Label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/50" />
                    <Input className="pl-10" placeholder="@username" {...register("instagram")} />
                  </div>
                  {errors.instagram && <p className="text-error text-xs">{errors.instagram.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      {...register("password")}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-light/50 hover:text-brown transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-error text-xs">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input type="password" placeholder="Repeat password" {...register("confirmPassword")} />
                  {errors.confirmPassword && <p className="text-error text-xs">{errors.confirmPassword.message}</p>}
                </div>

                {referredBy && <input type="hidden" {...register("referredBy")} value={referredBy} />}

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="agreeToRules" className="mt-1 rounded border-cream-dark text-gold focus:ring-gold" {...register("agreeToRules")} />
                  <label htmlFor="agreeToRules" className="text-sm text-brown-light">
                    I agree to the <Link href="/rules" className="text-gold hover:underline font-medium">rules and guidelines</Link> of the referral challenge
                  </label>
                </div>
                {errors.agreeToRules && <p className="text-error text-xs">{errors.agreeToRules.message}</p>}

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</>
                  ) : (
                    <><CheckCircle2 className="mr-2 h-4 w-4" /> Register Now</>
                  )}
                </Button>

                <p className="text-center text-sm text-brown-light">
                  Already have an account?{" "}
                  <Link href="/login" className="text-gold font-semibold hover:underline">Log in</Link>
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
