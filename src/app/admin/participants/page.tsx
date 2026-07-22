"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { Search, Download, Eye, Ban } from "lucide-react";
import { toast } from "sonner";

interface Participant {
  id: string;
  participantId: string;
  fullName: string;
  email: string;
  phone: string;
  instagram: string;
  state: string;
  school: string;
  referralCode: string;
  totalReferrals: number;
  verifiedReferrals: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/participants")
      .then((r) => r.json())
      .then((d) => setParticipants(d.participants || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = participants.filter((p) => {
    const q = search.toLowerCase();
    const match = p.participantId.toLowerCase().includes(q) || p.fullName.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.instagram.toLowerCase().includes(q);
    if (filter === "active") return match && p.isActive;
    if (filter === "inactive") return match && !p.isActive;
    return match;
  });

  const exportCSV = () => {
    const headers = ["Participant ID", "Name", "Email", "Phone", "Instagram", "State", "School", "Referrals", "Verified"];
    const rows = filtered.map((p) => [p.participantId, p.fullName, p.email, p.phone, p.instagram, p.state, p.school, p.totalReferrals, p.verifiedReferrals]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "participants.csv";
    a.click();
    toast.success("CSV exported!");
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>;
  }

  return (
    <PageWrapper>
      <FadeIn>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-brown-dark">Participants</h1>
          <Button onClick={exportCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" /> Export CSV
          </Button>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light/50" />
                <Input className="pl-10" placeholder="Search by name, email, Instagram, or Participant ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="flex gap-2">
                {["all", "active", "inactive"].map((f) => (
                  <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">{f}</Button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-cream-dark">
                    <th className="text-left py-3 px-3 font-semibold text-brown-light">Participant ID</th>
                    <th className="text-left py-3 px-3 font-semibold text-brown-light">Name</th>
                    <th className="text-left py-3 px-3 font-semibold text-brown-light">Email</th>
                    <th className="text-left py-3 px-3 font-semibold text-brown-light">Instagram</th>
                    <th className="text-left py-3 px-3 font-semibold text-brown-light">State</th>
                    <th className="text-center py-3 px-3 font-semibold text-brown-light">Refs</th>
                    <th className="text-center py-3 px-3 font-semibold text-brown-light">Verified</th>
                    <th className="text-center py-3 px-3 font-semibold text-brown-light">Status</th>
                    <th className="text-center py-3 px-3 font-semibold text-brown-light">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-cream-dark/50 hover:bg-cream/50 transition-colors">
                      <td className="py-3 px-3 font-mono text-xs text-gold font-semibold">{p.participantId}</td>
                      <td className="py-3 px-3 font-medium text-brown-dark">{p.fullName}</td>
                      <td className="py-3 px-3 text-brown-light">{p.email}</td>
                      <td className="py-3 px-3 text-brown-light">{p.instagram}</td>
                      <td className="py-3 px-3 text-brown-light">{p.state}</td>
                      <td className="py-3 px-3 text-center font-bold text-gold">{p.totalReferrals}</td>
                      <td className="py-3 px-3 text-center font-bold text-success">{p.verifiedReferrals}</td>
                      <td className="py-3 px-3 text-center">
                        <Badge variant={p.isActive ? "success" : "danger"}>{p.isActive ? "Active" : "Suspended"}</Badge>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-error"><Ban className="h-3 w-3" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </PageWrapper>
  );
}
