"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { signIn } from "next-auth/react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import {
  AuthLayout,
  AuthPanel,
  AuthBrand,
  AuthHeader,
  AuthForm,
  AuthInput,
  AuthPassword,
  AuthButton,
  AuthFooter,
} from "@/components/auth";

export default function LoginPage() {
  const router = useRouter();
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
    <AuthLayout>
      <AuthPanel>
        <AuthBrand />
        <AuthHeader title="Log In" subtitle="Access your referral dashboard." />

        <AuthForm>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-[18px]">
            <AuthInput
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              error={errors.email?.message}
              {...register("email")}
            />

            <AuthPassword
              id="password"
              label="Password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-[15px] w-[15px] rounded border-border text-gold focus:ring-gold/20 cursor-pointer"
                />
                <span className="text-[13px] text-brown-light/60">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-[13px] text-gold hover:text-gold-dark font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <div style={{ paddingTop: 24 }}>
              <AuthButton type="submit" isLoading={isLoading} loadingText="Signing in...">
                Sign In
              </AuthButton>
            </div>
          </form>
        </AuthForm>

        <AuthFooter text="Don't have an account?" linkText="Create Account" linkHref="/register" />
      </AuthPanel>
    </AuthLayout>
  );
}
