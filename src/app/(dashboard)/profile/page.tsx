"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { User, Save, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  state: string;
  school: string;
  instagram: string;
  referralCode: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        toast.success("Profile updated!");
      } else {
        throw new Error("Failed to update");
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple" />
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FadeIn>
          <h1 className="text-3xl font-bold text-chocolate flex items-center gap-3 mb-8">
            <User className="h-8 w-8 text-purple" />
            Profile
          </h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="default" className="font-mono">
                  {profile.referralCode}
                </Badge>
                <span className="text-sm text-chocolate/50">Your referral code</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={profile.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instagram</Label>
                  <Input value={profile.instagram} disabled />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input
                    value={profile.state}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>School</Label>
                  <Input
                    value={profile.school}
                    onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                  />
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving} className="mt-4">
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </PageWrapper>
  );
}
