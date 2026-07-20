"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { User, Save, Loader2, Mail, Phone, MapPin, GraduationCap, Instagram } from "lucide-react";
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
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => setProfile(d.profile))
      .catch(console.error)
      .finally(() => setLoading(false));
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
      if (res.ok) toast.success("Profile updated!");
      else throw new Error("Failed");
    } catch { toast.error("Failed to update profile"); }
    finally { setSaving(false); }
  };

  if (loading || !profile) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>;
  }

  const fields = [
    { key: "fullName", label: "Full Name", icon: User },
    { key: "phone", label: "Phone", icon: Phone },
    { key: "state", label: "State", icon: MapPin },
    { key: "school", label: "School", icon: GraduationCap },
  ] as const;

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-5 sm:px-10 lg:px-20 py-8 lg:py-12">
        <FadeIn>
          <h1 className="text-3xl font-extrabold text-brown-dark flex items-center gap-3 mb-8">
            <User className="h-8 w-8 text-gold" />
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
                <Badge variant="default" className="font-mono">{profile.referralCode}</Badge>
                <span className="text-sm text-brown-light">Your referral code</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map(({ key, label, icon: Icon }) => (
                  <div key={key} className="space-y-2">
                    <Label>{label}</Label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/50" />
                      <Input
                        className="pl-10"
                        value={profile[key]}
                        onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                      />
                    </div>
                  </div>
                ))}
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/50" />
                    <Input className="pl-10" value={profile.email} disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Instagram</Label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/50" />
                    <Input className="pl-10" value={profile.instagram} disabled />
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving} className="mt-4">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </PageWrapper>
  );
}
