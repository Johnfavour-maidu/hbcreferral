"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Logo } from "@/components/shared/logo";
import { FadeIn } from "@/components/shared/animations";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
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
    <div className="min-h-screen bg-cream section-padding flex items-center justify-center">
      <FadeIn>
        <div className="w-full max-w-md mx-auto px-5">
          <div className="text-center mb-8">
            <Logo size="lg" />
            <p className="text-brown-light mt-3">Welcome back</p>
          </div>

          <Card className="shadow-xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Log In</CardTitle>
              <CardDescription>Access your referral dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/50" />
                    <Input className="pl-10" type="email" placeholder="you@example.com" {...register("email")} />
                  </div>
                  {errors.email && <p className="text-error text-xs">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/50" />
                    <Input className="pl-10" type={showPassword ? "text" : "password"} placeholder="Enter your password" {...register("password")} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-light/50 hover:text-brown transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-error text-xs">{errors.password.message}</p>}
                </div>

                <div className="flex items-center justify-end">
                  <Link href="/forgot-password" className="text-sm text-gold hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</>
                  ) : "Log In"}
                </Button>

                <p className="text-center text-sm text-brown-light">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-gold font-semibold hover:underline">Register now</Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </FadeIn>
    </div>
  );
}
