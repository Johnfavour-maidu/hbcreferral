"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Logo } from "@/components/shared/logo";
import { FadeIn } from "@/components/shared/animations";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 1500));
      setSent(true);
      toast.success("Reset link sent!");
    } catch {
      toast.error("Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple/5 via-cream to-gold/5 flex items-center justify-center py-12 px-4">
      <FadeIn>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo size="lg" />
          </div>

          <Card className="shadow-xl border-cream-dark">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {sent ? "Check Your Email" : "Forgot Password?"}
              </CardTitle>
              <CardDescription>
                {sent
                  ? "We've sent a password reset link to your email."
                  : "Enter your email and we'll send you a reset link."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sent ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-purple/10 flex items-center justify-center mx-auto">
                    <Mail className="h-8 w-8 text-purple" />
                  </div>
                  <p className="text-sm text-chocolate/70">
                    Didn&apos;t receive the email? Check your spam folder or try again.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSent(false);
                      setEmail("");
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              )}

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm text-purple hover:underline"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>
    </div>
  );
}
