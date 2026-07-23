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
      window.location.href = "/dashboard";
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
