"use client";

import { useState, useEffect } from "react";
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

const REMEMBER_EMAIL_KEY = "hbc_remember_email";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);
    if (savedEmail) {
      setValue("email", savedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      if (rememberMe) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, data.email);
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
      }

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) throw new Error("Invalid email or password");

      const res = await fetch("/api/auth/session");
      const session = await res.json();
      const role = session?.user?.role;

      if (role === "ADMIN" || role === "MODERATOR") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      toast.error("Login failed", { description: error.message });
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
              label="Email or Instagram Username"
              placeholder="you@example.com or @username"
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

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-gold focus:ring-gold/30 accent-gold"
                />
                <span className="text-[13px] text-brown-light/70">Remember Me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-[13px] text-gold hover:text-gold-dark font-medium transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <div style={{ paddingTop: 16 }}>
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
