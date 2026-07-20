"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { CheckCircle, XCircle, Clock, Check, X } from "lucide-react";
import { toast } from "sonner";

interface VerificationItem {
  id: string;
  referrerName: string;
  referredName: string;
  referredInstagram: string;
  status: string;
  createdAt: string;
}

export default function AdminVerificationPage() {
  const [items, setItems] = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch("/api/admin/verify");
        if (res.ok) {
          const data = await res.json();
          setItems(data.verifications);
        }
      } catch (error) {
        console.error("Failed to fetch verifications:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      const res = await fetch("/api/admin/verify", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });

      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        toast.success(action === "approve" ? "Referral approved!" : "Referral rejected");
      }
    } catch {
      toast.error("Failed to process");
    }
  };

  const filtered = items.filter((i) => filter === "ALL" || i.status === filter);

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
            <h1 className="text-3xl font-bold text-chocolate mb-8">Verification Queue</h1>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex gap-2 mb-6">
              {["PENDING", "VERIFIED", "REJECTED", "ALL"].map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f}
                </Button>
              ))}
            </div>
          </FadeIn>

          <div className="space-y-4">
            {filtered.map((item, i) => (
              <FadeIn key={item.id} delay={i * 0.05}>
                <Card>
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-medium text-chocolate">{item.referredName}</p>
                        <Badge variant="default">{item.referredInstagram}</Badge>
                        <Badge
                          variant={
                            item.status === "PENDING"
                              ? "warning"
                              : item.status === "VERIFIED"
                              ? "success"
                              : "danger"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-chocolate/60">
                        Referred by: <strong>{item.referrerName}</strong> •{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {item.status === "PENDING" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleAction(item.id, "approve")}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAction(item.id, "reject")}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </FadeIn>
            ))}

            {filtered.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-chocolate/20 mx-auto mb-3" />
                  <p className="text-chocolate/50">No items to verify</p>
                </CardContent>
              </Card>
            )}
          </div>
        </PageWrapper>
      </div>
    </div>
  );
}
