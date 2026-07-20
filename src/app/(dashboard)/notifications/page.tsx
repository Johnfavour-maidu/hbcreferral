"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await fetch(`/api/notifications/${id}/read`, { method: "PUT" });
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await fetch("/api/notifications/read-all", { method: "PUT" });
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple" />
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FadeIn>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-chocolate flex items-center gap-3">
              <Bell className="h-8 w-8 text-purple" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="bg-purple text-white">{unreadCount}</Badge>
              )}
            </h1>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.isRead ? "border-purple/30 bg-purple/5" : ""
                }`}
                onClick={() => !notification.isRead && markAsRead(notification.id)}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      notification.isRead ? "bg-transparent" : "bg-purple"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${notification.isRead ? "text-chocolate/70" : "text-chocolate"}`}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-chocolate/60 mt-1">{notification.message}</p>
                    <p className="text-xs text-chocolate/40 mt-2">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}

            {notifications.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-chocolate/20 mx-auto mb-3" />
                  <p className="text-chocolate/50">No notifications yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </FadeIn>
      </div>
    </PageWrapper>
  );
}
