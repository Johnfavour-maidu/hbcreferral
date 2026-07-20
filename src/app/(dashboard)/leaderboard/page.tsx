"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { Trophy } from "lucide-react";

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
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((d) => setEntries(d.leaderboard || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>;
  }

  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);
  const podiumOrder = podium.length >= 3 ? [podium[1], podium[0], podium[2]] : podium;
  const podiumHeights = ["h-28", "h-36", "h-24"];
  const podiumBg = ["bg-gray-200", "bg-gold/20", "bg-amber-100"];
  const medals = ["🥈", "🥇", "🥉"];

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-5 sm:px-10 lg:px-20 py-8 lg:py-12">
        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-brown-dark flex items-center justify-center gap-3">
              <Trophy className="h-8 w-8 text-gold" />
              Leaderboard
            </h1>
            <p className="text-brown-light mt-2">Top referrers in the challenge</p>
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
                    <Avatar alt={entry.fullName} fallback={entry.fullName.split(" ").map(n => n[0]).join("")} size={isWinner ? "xl" : "lg"} />
                    <p className="font-semibold text-brown-dark mt-2 text-sm text-center max-w-[100px] truncate">{entry.fullName}</p>
                    <p className="text-xs text-brown-light">{entry.verifiedReferrals} verified</p>
                    <div className={`w-24 ${podiumHeights[i]} ${podiumBg[i]} rounded-t-xl mt-2 flex items-start justify-center pt-3`}>
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
              <div className="space-y-2">
                {rest.map((entry, i) => (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.03 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-cream transition-colors"
                  >
                    <span className="w-8 text-center font-bold text-brown-light/50">#{entry.rank}</span>
                    <Avatar alt={entry.fullName} fallback={entry.fullName.split(" ").map(n => n[0]).join("")} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-brown-dark truncate">{entry.fullName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gold">{entry.verifiedReferrals}</p>
                      <p className="text-xs text-brown-light">verified</p>
                    </div>
                  </motion.div>
                ))}
                {rest.length === 0 && <p className="text-center text-brown-light/50 py-8">No rankings yet. Be the first to get verified referrals!</p>}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </PageWrapper>
  );
}
