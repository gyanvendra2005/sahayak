"use client";

import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  MessageSquare,
} from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";

interface Notification {
  id: string;
  type: "update" | "assignment" | "alert" | "message";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  issueId?: string;
}

interface NotificationsProps {
  userType: "citizen" | "admin";
}

let socket: Socket | null = null;

export default function Notifications({ userType }: NotificationsProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "update":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "assignment":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "alert":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "message":
        return <MessageSquare className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  // Mark single notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await axios.post("http://localhost:4000/notifications/mark-read", {
        notificationId,
      });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.post("http://localhost:4000/notifications/mark-all-read", {
        userId,
      });
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await axios.get("/api/fetchnofication", { params: { userId } });

      const formatted = res.data.map((n: any) => ({
        id: n._id,
        type: n.type,
        title: n.title,
        message: n.message,
        issueId: n.issueId,
        read: n.read,
        timestamp: n.timestamp
          ? new Date(n.timestamp).toISOString()
          : new Date().toISOString(),
      }));

      // Sort newest first
      formatted.sort(
        (a: Notification, b: Notification) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setNotifications(formatted);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // Socket setup for real-time notifications
  useEffect(() => {
    if (!userId) return;

    if (!socket) {
      socket = io("http://localhost:4000");

      socket.emit("register", userId);

      socket.on("notification", (notif: any) => {
        const newNotif: Notification = {
          id: notif._id,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          issueId: notif.issueId,
          read: notif.read,
          timestamp: notif.timestamp
            ? new Date(notif.timestamp).toISOString()
            : new Date().toISOString(),
        };
        setNotifications((prev) => [newNotif, ...prev]);
      });
    }

    fetchNotifications();

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl flex items-center gap-2 font-semibold">
            <Bell className="w-6 h-6" />
            Notifications
          </h1>
          <p className="text-muted-foreground">Stay updated on your civic issues</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Notification List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  !notification.read ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className={`font-medium ${!notification.read ? "" : "text-blue-900"}`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        {notification.issueId && (
                          <Badge variant="outline" className="mt-2 text-xs">{notification.issueId}</Badge>
                        )}
                      </div>

                      <div className="text-right flex flex-col items-end gap-2">
                        <span className="text-xs text-muted-foreground">
                          {notification.timestamp
                            ? new Date(notification.timestamp).toLocaleString()
                            : "Invalid date"}
                        </span>
                        {notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
