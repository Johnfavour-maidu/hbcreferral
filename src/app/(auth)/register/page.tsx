"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { NIGERIAN_STATES } from "@/config/site";
import { signIn } from "next-auth/react";
import { User, Mail, Phone, MapPin, Instagram, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PasswordStrength } from "@/components/ui/password-strength";
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

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referredBy = searchParams.get("ref") || "";
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
      const loginResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (loginResult?.error) {
        setIsSuccess(true);
        toast.success("Registration successful!", {
          description: "Please log in with your new account.",
        });
        setTimeout(() => router.push("/login"), 2500);
      } else {
        setIsSuccess(true);
        toast.success("Registration successful!", {
          description: "Welcome to Hearts by Charming!",
        });
        setTimeout(() => router.push("/dashboard"), 1500);
      }
    } catch (error: any) {
      toast.error("Registration failed", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout centered={false}>
        <AuthPanel>
          <div className="flex flex-col items-center py-8 animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-[22px] font-bold text-brown-dark mb-2">Registration Successful!</h2>
            <p className="text-brown-light/60 text-[14px] mb-1">Your account has been created.</p>
            <p className="text-brown-light/60 text-[14px] mb-4">Redirecting to dashboard...</p>
            <Loader2 className="h-5 w-5 text-gold animate-spin" />
          </div>
        </AuthPanel>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout centered={false}>
      <AuthPanel>
        <AuthBrand />
        <AuthHeader
          title="Create Account"
          subtitle="Join the Hearts by Charming Referral Challenge."
        />

        <AuthForm>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-[16px]">
            <AuthInput
              id="fullName"
              label="Full Name"
              placeholder="e.g. Mary Johnson"
              icon={User}
              error={errors.fullName?.message}
              {...register("fullName")}
            />

            <AuthInput
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              error={errors.email?.message}
              {...register("email")}
            />

            <AuthInput
              id="phone"
              label="Phone Number"
              placeholder="e.g. 08012345678"
              icon={Phone}
              error={errors.phone?.message}
              {...register("phone")}
            />

            <div className="space-y-[6px]">
              <label className="text-[13px] font-medium text-brown-dark/80">State</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-[16px] w-[16px] text-brown-light/30 pointer-events-none" />
                <select
                  className={`flex h-[50px] w-full rounded-xl bg-white/80 text-[14px] text-brown-dark shadow-[0_1px_2px_rgba(74,46,31,0.04)] focus:shadow-[0_0_0_3px_rgba(200,154,43,0.1)] focus:outline-none transition-all duration-200 appearance-none cursor-pointer ${errors.state ? "border-error/60" : ""}`}
                  style={{
                    padding: "0",
                    paddingLeft: "48px",
                    paddingRight: "16px",
                    border: "2px solid #E7D8C6",
                  }}
                  {...register("state")}
                >
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-brown-light/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.state && <p className="text-error text-[12px]">{errors.state.message}</p>}
            </div>

            <AuthInput
              id="instagram"
              label="Instagram Username"
              placeholder="username"
              icon={Instagram}
              error={errors.instagram?.message}
              {...register("instagram")}
            />

            <AuthPassword
              id="password"
              label="Password"
              placeholder="Min. 8 characters"
              error={errors.password?.message}
              {...register("password")}
            />
            <PasswordStrength password={passwordValue} />

            <AuthPassword
              id="confirmPassword"
              label="Confirm Password"
              placeholder="Repeat password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            {referredBy && <input type="hidden" {...register("referredBy")} value={referredBy} />}

            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                id="agreeToRules"
                className="mt-0.5 h-[15px] w-[15px] rounded border-border text-gold focus:ring-gold/20 cursor-pointer shrink-0"
                {...register("agreeToRules")}
              />
              <label htmlFor="agreeToRules" className="text-[13px] text-brown-light/60 leading-relaxed cursor-pointer">
                I agree to the{" "}
                <Link href="/rules" className="text-gold font-medium hover:text-gold-dark transition-colors">
                  Rules and Guidelines
                </Link>{" "}
                of the referral challenge
              </label>
            </div>
            {errors.agreeToRules && <p className="text-error text-[12px]">{errors.agreeToRules.message}</p>}

            <div style={{ paddingTop: 24 }}>
              <AuthButton type="submit" isLoading={isLoading} loadingText="Creating Account...">
                Create Account
              </AuthButton>
            </div>
          </form>
        </AuthForm>

        <AuthFooter text="Already have an account?" linkText="Sign In" linkHref="/login" />
      </AuthPanel>
    </AuthLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg flex items-center justify-center">
          <Loader2 className="h-6 w-6 text-gold animate-spin" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
