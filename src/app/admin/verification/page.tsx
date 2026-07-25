"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Check, X, RotateCcw, Instagram, Heart, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface VerificationItem {
  id: string;
  referredInstagram: string;
  followsPage: boolean;
  likedPost: boolean;
  commentedPost: boolean;
  commentText: string | null;
  status: string;
  createdAt: string;
}

export default function AdminVerificationPage() {
  const [items, setItems] = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");

  useEffect(() => {
    fetch("/api/admin/verify")
      .then((r) => r.json())
      .then((d) => setItems(d.verifications || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject" | "revoke", checks?: { followsPage: boolean; likedPost: boolean; commentedPost: boolean }) => {
    try {
      const body: Record<string, unknown> = { id, action };
      if (checks) {
        body.followsPage = checks.followsPage;
        body.likedPost = checks.likedPost;
        body.commentedPost = checks.commentedPost;
      }
      const res = await fetch("/api/admin/verify", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        if (action === "revoke") {
          setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: "REJECTED" } : i));
          toast.success("Approval revoked");
        } else {
          setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: action === "approve" ? "VERIFIED" : "REJECTED", ...(checks || {}) } : i));
          toast.success(action === "approve" ? "Referral approved!" : "Referral rejected");
        }
      }
    } catch {
      toast.error("Failed to process");
    }
  };

  const filtered = items.filter((i) => filter === "ALL" || i.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brown-dark">Verification Queue</h1>

      <div className="flex gap-2">
        {["PENDING", "VERIFIED", "REJECTED", "ALL"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-[12px] font-semibold transition-colors ${
              filter === f
                ? "bg-gold text-white"
                : "bg-white text-brown-dark border border-cream-dark hover:border-gold/30"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((item) => (
          <VerificationCard
            key={item.id}
            item={item}
            onAction={handleAction}
          />
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-cream-dark p-12 text-center">
            <CheckCircle className="h-12 w-12 text-cream-dark mx-auto mb-3" />
            <p className="text-brown-light/50 text-sm">No items to verify</p>
          </div>
        )}
      </div>
    </div>
  );
}

function VerificationCard({
  item,
  onAction,
}: {
  item: VerificationItem;
  onAction: (id: string, action: "approve" | "reject" | "revoke", checks?: { followsPage: boolean; likedPost: boolean; commentedPost: boolean }) => void;
}) {
  const [follows, setFollows] = useState(item.followsPage);
  const [liked, setLiked] = useState(item.likedPost);
  const [commented, setCommented] = useState(item.commentedPost);

  return (
    <div className="bg-white rounded-2xl border border-cream-dark p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <Instagram className="h-5 w-5 text-gold" />
          </div>
          <div>
            <p className="text-[15px] font-bold text-brown-dark">@{item.referredInstagram?.replace("@", "") || "unknown"}</p>
            <p className="text-[12px] text-brown-light/50">
              {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span
          className="px-3 py-1 rounded-full text-[11px] font-semibold"
          style={{
            background: item.status === "PENDING" ? "#FEF3C7" : item.status === "VERIFIED" ? "#DCFCE7" : "#FEE2E2",
            color: item.status === "PENDING" ? "#D97706" : item.status === "VERIFIED" ? "#16A34A" : "#DC2626",
          }}
        >
          {item.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
          follows ? "bg-success/5 border-success/20" : "bg-cream/30 border-cream-dark"
        }`}>
          <input
            type="checkbox"
            checked={follows}
            onChange={(e) => setFollows(e.target.checked)}
            className="w-4 h-4 rounded accent-success"
          />
          <div>
            <p className="text-[12px] font-semibold text-brown-dark">Follows Page</p>
            <Heart className="h-3.5 w-3.5 text-brown-light/40 mt-0.5" />
          </div>
        </label>

        <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
          liked ? "bg-success/5 border-success/20" : "bg-cream/30 border-cream-dark"
        }`}>
          <input
            type="checkbox"
            checked={liked}
            onChange={(e) => setLiked(e.target.checked)}
            className="w-4 h-4 rounded accent-success"
          />
          <div>
            <p className="text-[12px] font-semibold text-brown-dark">Liked Post</p>
            <Heart className="h-3.5 w-3.5 text-brown-light/40 mt-0.5" />
          </div>
        </label>

        <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
          commented ? "bg-success/5 border-success/20" : "bg-cream/30 border-cream-dark"
        }`}>
          <input
            type="checkbox"
            checked={commented}
            onChange={(e) => setCommented(e.target.checked)}
            className="w-4 h-4 rounded accent-success"
          />
          <div>
            <p className="text-[12px] font-semibold text-brown-dark">Commented</p>
            <MessageCircle className="h-3.5 w-3.5 text-brown-light/40 mt-0.5" />
          </div>
        </label>
      </div>

      {item.commentText && (
        <div className="bg-cream/40 rounded-xl px-4 py-2.5 mb-4 border border-cream-dark">
          <p className="text-[12px] text-brown-light/50 mb-0.5">Comment:</p>
          <p className="text-[13px] text-brown-dark font-medium">{item.commentText}</p>
        </div>
      )}

      <div className="flex gap-2">
        {item.status === "PENDING" && (
          <>
            <button
              onClick={() => onAction(item.id, "approve", { followsPage: follows, likedPost: liked, commentedPost: commented })}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold bg-success text-white hover:bg-green-700 transition-colors"
            >
              <Check className="h-3.5 w-3.5" /> Approve
            </button>
            <button
              onClick={() => onAction(item.id, "reject", { followsPage: follows, likedPost: liked, commentedPost: commented })}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold bg-error/10 text-error border border-error/20 hover:bg-error/20 transition-colors"
            >
              <X className="h-3.5 w-3.5" /> Reject
            </button>
          </>
        )}
        {item.status === "VERIFIED" && (
          <button
            onClick={() => onAction(item.id, "revoke")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold bg-error/10 text-error border border-error/20 hover:bg-error/20 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Revoke Approval
          </button>
        )}
      </div>
    </div>
  );
}
