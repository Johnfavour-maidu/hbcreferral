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
    <div className="min-h-screen bg-cream section-padding flex items-center justify-center">
      <FadeIn>
        <div className="w-full max-w-md mx-auto px-5">
          <div className="text-center mb-8">
            <Logo size="lg" />
          </div>

          <Card className="shadow-xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">
                {sent ? "Check Your Email" : "Forgot Password?"}
              </CardTitle>
              <CardDescription>
                {sent ? "We've sent a password reset link to your email." : "Enter your email and we'll send you a reset link."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sent ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto">
                    <Mail className="h-8 w-8 text-gold" />
                  </div>
                  <p className="text-sm text-brown-light">Didn&apos;t receive the email? Check your spam folder or try again.</p>
                  <Button variant="outline" className="w-full" onClick={() => { setSent(false); setEmail(""); }}>
                    Try Again
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/50" />
                      <Input className="pl-10" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : "Send Reset Link"}
                  </Button>
                </form>
              )}

              <div className="mt-6 text-center">
                <Link href="/login" className="inline-flex items-center text-sm text-gold hover:underline font-medium">
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
