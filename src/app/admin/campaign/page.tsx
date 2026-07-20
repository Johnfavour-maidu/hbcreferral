"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Save, Loader2, Settings } from "lucide-react";
import { toast } from "sonner";

interface CampaignData {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  registrationEnabled: boolean;
  leaderboardVisible: boolean;
  goldReward: number;
  silverReward: number;
  bronzeReward: number;
}

export default function AdminCampaignPage() {
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/campaign")
      .then((r) => r.json())
      .then((d) => setCampaign(d.campaign))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!campaign) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/campaign", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaign),
      });
      if (res.ok) toast.success("Campaign updated!");
    } catch { toast.error("Failed to update campaign"); }
    finally { setSaving(false); }
  };

  if (loading || !campaign) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>;
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminSidebar />
      <div className="flex-1 p-6 lg:p-8">
        <PageWrapper>
          <FadeIn>
            <h1 className="text-3xl font-extrabold text-brown-dark flex items-center gap-3 mb-8">
              <Settings className="h-8 w-8 text-gold" />
              Campaign Settings
            </h1>
          </FadeIn>

          <div className="max-w-2xl space-y-6">
            <FadeIn delay={0.1}>
              <Card>
                <CardHeader><CardTitle>General</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Campaign Name</Label>
                    <Input value={campaign.name} onChange={(e) => setCampaign({ ...campaign, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="flex gap-2">
                      {["DRAFT", "ACTIVE", "PAUSED", "CLOSED"].map((s) => (
                        <Button key={s} variant={campaign.status === s ? "default" : "outline"} size="sm" onClick={() => setCampaign({ ...campaign, status: s })}>{s}</Button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input type="date" value={campaign.startDate?.split("T")[0] || ""} onChange={(e) => setCampaign({ ...campaign, startDate: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input type="date" value={campaign.endDate?.split("T")[0] || ""} onChange={(e) => setCampaign({ ...campaign, endDate: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={campaign.registrationEnabled} onChange={(e) => setCampaign({ ...campaign, registrationEnabled: e.target.checked })} className="rounded border-cream-dark text-gold focus:ring-gold" />
                      Registration Enabled
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={campaign.leaderboardVisible} onChange={(e) => setCampaign({ ...campaign, leaderboardVisible: e.target.checked })} className="rounded border-cream-dark text-gold focus:ring-gold" />
                      Leaderboard Visible
                    </label>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card>
                <CardHeader><CardTitle>Reward Values (₦)</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gold font-semibold">Gold</Label>
                      <Input type="number" value={campaign.goldReward} onChange={(e) => setCampaign({ ...campaign, goldReward: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-400 font-semibold">Silver</Label>
                      <Input type="number" value={campaign.silverReward} onChange={(e) => setCampaign({ ...campaign, silverReward: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-amber-600 font-semibold">Bronze</Label>
                      <Input type="number" value={campaign.bronzeReward} onChange={(e) => setCampaign({ ...campaign, bronzeReward: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.3}>
              <Button onClick={handleSave} disabled={saving} size="lg">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </FadeIn>
          </div>
        </PageWrapper>
      </div>
    </div>
  );
}
