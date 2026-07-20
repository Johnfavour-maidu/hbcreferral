"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Download, FileText, FileSpreadsheet, File } from "lucide-react";
import { toast } from "sonner";

export default function AdminExportsPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleExport = async (type: string, format: string) => {
    setLoading(`${type}-${format}`);
    try {
      const res = await fetch(`/api/admin/export?type=${type}&format=${format}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${type}.${format}`;
        a.click();
        toast.success(`${type} exported as ${format.toUpperCase()}!`);
      }
    } catch {
      toast.error("Export failed");
    } finally {
      setLoading(null);
    }
  };

  const exports = [
    { type: "participants", label: "Participants", description: "All registered participants with their details" },
    { type: "leaderboard", label: "Leaderboard", description: "Current rankings and referral counts" },
    { type: "referrals", label: "Referrals", description: "All referral records with statuses" },
    { type: "verification", label: "Verification Log", description: "Admin verification actions log" },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <PageWrapper>
          <FadeIn>
            <h1 className="text-3xl font-bold text-chocolate flex items-center gap-3 mb-8">
              <Download className="h-8 w-8 text-purple" />
              Export Data
            </h1>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exports.map((exp, i) => (
              <FadeIn key={exp.type} delay={i * 0.1}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{exp.label}</CardTitle>
                    <p className="text-sm text-chocolate/60">{exp.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      {["csv", "json"].map((format) => (
                        <Button
                          key={format}
                          variant="outline"
                          size="sm"
                          onClick={() => handleExport(exp.type, format)}
                          disabled={loading === `${exp.type}-${format}`}
                        >
                          {format === "csv" ? (
                            <FileSpreadsheet className="h-4 w-4 mr-1" />
                          ) : (
                            <File className="h-4 w-4 mr-1" />
                          )}
                          {format.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </PageWrapper>
      </div>
    </div>
  );
}
