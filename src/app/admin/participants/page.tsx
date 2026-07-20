"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Search, Download, Eye, Ban, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Participant {
  id: string;
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
    async function fetchParticipants() {
      try {
        const res = await fetch("/api/admin/participants");
        if (res.ok) {
          const data = await res.json();
          setParticipants(data.participants);
        }
      } catch (error) {
        console.error("Failed to fetch participants:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchParticipants();
  }, []);

  const filtered = participants.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.instagram.toLowerCase().includes(search.toLowerCase());
    if (filter === "active") return matchesSearch && p.isActive;
    if (filter === "inactive") return matchesSearch && !p.isActive;
    return matchesSearch;
  });

  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Instagram", "State", "School", "Referrals", "Verified"];
    const rows = filtered.map((p) => [p.fullName, p.email, p.phone, p.instagram, p.state, p.school, p.totalReferrals, p.verifiedReferrals]);
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
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <PageWrapper>
          <FadeIn>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-chocolate">Participants</h1>
              <Button onClick={exportCSV} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-chocolate/40" />
                    <Input
                      placeholder="Search by name, email, or Instagram..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    {["all", "active", "inactive"].map((f) => (
                      <Button
                        key={f}
                        variant={filter === f ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter(f)}
                        className="capitalize"
                      >
                        {f}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-cream-dark">
                        <th className="text-left py-3 px-3 font-medium text-chocolate/70">Name</th>
                        <th className="text-left py-3 px-3 font-medium text-chocolate/70">Email</th>
                        <th className="text-left py-3 px-3 font-medium text-chocolate/70">Instagram</th>
                        <th className="text-left py-3 px-3 font-medium text-chocolate/70">State</th>
                        <th className="text-center py-3 px-3 font-medium text-chocolate/70">Refs</th>
                        <th className="text-center py-3 px-3 font-medium text-chocolate/70">Verified</th>
                        <th className="text-center py-3 px-3 font-medium text-chocolate/70">Status</th>
                        <th className="text-center py-3 px-3 font-medium text-chocolate/70">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((p) => (
                        <tr key={p.id} className="border-b border-cream-dark/50 hover:bg-cream/50">
                          <td className="py-3 px-3 font-medium text-chocolate">{p.fullName}</td>
                          <td className="py-3 px-3 text-chocolate/70">{p.email}</td>
                          <td className="py-3 px-3 text-chocolate/70">{p.instagram}</td>
                          <td className="py-3 px-3 text-chocolate/70">{p.state}</td>
                          <td className="py-3 px-3 text-center font-medium text-purple">{p.totalReferrals}</td>
                          <td className="py-3 px-3 text-center font-medium text-green-600">{p.verifiedReferrals}</td>
                          <td className="py-3 px-3 text-center">
                            <Badge variant={p.isActive ? "success" : "danger"}>
                              {p.isActive ? "Active" : "Suspended"}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                                <Ban className="h-3 w-3" />
                              </Button>
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
      </div>
    </div>
  );
}
