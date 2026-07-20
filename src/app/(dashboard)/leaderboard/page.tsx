"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { Trophy, Medal } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  fullName: string;
  totalReferrals: number;
  verifiedReferrals: number;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch("/api/leaderboard");
        if (res.ok) {
          const data = await res.json();
          setEntries(data.leaderboard);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple" />
      </div>
    );
  }

  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);

  const podiumOrder = podium.length >= 3 ? [podium[1], podium[0], podium[2]] : podium;
  const podiumHeights = ["h-28", "h-36", "h-24"];
  const podiumColors = ["bg-gray-300", "bg-gold", "bg-amber-600"];
  const medals = ["🥈", "🥇", "🥉"];

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-chocolate flex items-center justify-center gap-3">
              <Trophy className="h-8 w-8 text-gold" />
              Leaderboard
            </h1>
            <p className="text-chocolate/70 mt-2">Top referrers in the challenge</p>
          </div>
        </FadeIn>

        {podium.length >= 3 && (
          <FadeIn delay={0.1}>
            <div className="flex items-end justify-center gap-4 mb-12">
              {podiumOrder.map((entry, i) => {
                const isWinner = entry.rank === 1;
                return (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                    className="flex flex-col items-center"
                  >
                    <Avatar
                      alt={entry.fullName}
                      fallback={entry.fullName.split(" ").map(n => n[0]).join("")}
                      size={isWinner ? "xl" : "lg"}
                    />
                    <p className="font-semibold text-chocolate mt-2 text-sm text-center max-w-[100px] truncate">
                      {entry.fullName}
                    </p>
                    <p className="text-xs text-chocolate/70">{entry.verifiedReferrals} verified</p>
                    <div
                      className={`w-24 ${podiumHeights[i]} ${podiumColors[i]} rounded-t-xl mt-2 flex items-start justify-center pt-3`}
                    >
                      <span className="text-3xl">{medals[i]}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </FadeIn>
        )}

        <FadeIn delay={0.3}>
          <Card>
            <CardHeader>
              <CardTitle>All Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rest.map((entry, i) => (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.03 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-cream transition-colors"
                  >
                    <span className="w-8 text-center font-bold text-chocolate/50">
                      #{entry.rank}
                    </span>
                    <Avatar
                      alt={entry.fullName}
                      fallback={entry.fullName.split(" ").map(n => n[0]).join("")}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-chocolate truncate">{entry.fullName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple">{entry.verifiedReferrals}</p>
                      <p className="text-xs text-chocolate/50">verified</p>
                    </div>
                  </motion.div>
                ))}

                {rest.length === 0 && (
                  <p className="text-center text-chocolate/50 py-8">
                    No rankings yet. Be the first to get verified referrals!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </PageWrapper>
  );
}
