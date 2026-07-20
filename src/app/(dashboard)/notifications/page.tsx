"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageWrapper, FadeIn } from "@/components/shared/animations";
import { Bell, Check, CheckCheck } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d) => setNotifications(d.notifications || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    await fetch(`/api/notifications/${id}/read`, { method: "PUT" });
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await fetch("/api/notifications/read-all", { method: "PUT" });
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>;
  }

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-5 sm:px-10 lg:px-20 py-8 lg:py-12">
        <FadeIn>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold text-brown-dark flex items-center gap-3">
              <Bell className="h-8 w-8 text-gold" />
              Notifications
              {unreadCount > 0 && <Badge className="bg-gold text-white">{unreadCount}</Badge>}
            </h1>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-1" /> Mark all read
              </Button>
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="space-y-3">
            {notifications.map((n) => (
              <Card
                key={n.id}
                className={`cursor-pointer transition-all card-hover ${!n.isRead ? "border-gold/30 bg-gold/5" : ""}`}
                onClick={() => !n.isRead && markAsRead(n.id)}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${n.isRead ? "bg-transparent" : "bg-gold"}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${n.isRead ? "text-brown-light" : "text-brown-dark"}`}>{n.title}</p>
                    <p className="text-sm text-brown-light/70 mt-1">{n.message}</p>
                    <p className="text-xs text-brown-light/40 mt-2">{new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                  {!n.isRead && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}>
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
            {notifications.length === 0 && (
              <Card><CardContent className="p-8 text-center"><Bell className="h-12 w-12 text-brown-light/20 mx-auto mb-3" /><p className="text-brown-light/50">No notifications yet</p></CardContent></Card>
            )}
          </div>
        </FadeIn>
      </div>
    </PageWrapper>
  );
}
