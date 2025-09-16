"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  MessageSquare,
  Settings,
  Smartphone,
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

export default function Notifications({ userType }: NotificationsProps) {
  const {data:session} = useSession();
  const userId = session?.user?.id;
  const [notifications, setNotifications] = useState<Notification[]>([
    // {
    //   id: "1",
    //   type: "update",
    //   title: "Issue Status Updated",
    //   message:
    //     "Your pothole report #CIV123456 has been acknowledged and assigned.",
    //   timestamp: "2024-01-15T10:30:00Z",
    //   read: false,
    //   issueId: "CIV123456",
    // },
    // {
    //   id: "2",
    //   type: "assignment",
    //   title: "New Issue Assigned",
    //   message: "Street light issue #CIV789012 has been assigned to you.",
    //   timestamp: "2024-01-15T09:15:00Z",
    //   read: false,
    //   issueId: "CIV789012",
    // },
    // {
    //   id: "3",
    //   type: "alert",
    //   title: "High Priority Alert",
    //   message:
    //     "Multiple reports received for water main break in Downtown area.",
    //   timestamp: "2024-01-15T08:45:00Z",
    //   read: true,
    // },
    // {
    //   id: "4",
    //   type: "update",
    //   title: "Issue Resolved",
    //   message: "Your garbage collection issue #CIV345678 has been resolved.",
    //   timestamp: "2024-01-14T16:20:00Z",
    //   read: true,
    //   issueId: "CIV345678",
    // },
    // {
    //   id: "5",
    //   type: "message",
    //   title: "Feedback Request",
    //   message:
    //     "Please rate your experience with the recent pothole repair.",
    //   timestamp: "2024-01-14T14:10:00Z",
    //   read: true,
    // },
  ]);

  const [settings, setSettings] = useState({
    pushNotifications: true,
    smsNotifications: false,
    statusUpdates: true,
    assignments: true,
    alerts: true,
  });

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

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
  async function fetchNotifications() {
    try {
      const res = await axios.get('/api/fetchnofication', { params: { userId } });
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }

  fetchNotifications();
}, [userId]);


  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl flex items-center gap-2 font-semibold">
            <Bell className="w-6 h-6" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">{unreadCount}</Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            Stay updated on your civic issues
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            Mark All Read
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Methods */}
            <div className="space-y-4">
              <h4 className="font-medium">Delivery Methods</h4>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      In-app notifications
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, pushNotifications: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Text messages for updates
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, smsNotifications: checked }))
                  }
                />
              </div>
            </div>

            {/* Notification Types */}
            <div className="space-y-4">
              <h4 className="font-medium">Notification Types</h4>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Status Updates</p>
                  <p className="text-xs text-muted-foreground">
                    Issue progress notifications
                  </p>
                </div>
                <Switch
                  checked={settings.statusUpdates}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, statusUpdates: checked }))
                  }
                />
              </div>

              {userType === "admin" && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Assignments</p>
                    <p className="text-xs text-muted-foreground">
                      When issues are assigned
                    </p>
                  </div>
                  <Switch
                    checked={settings.assignments}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({ ...prev, assignments: checked }))
                    }
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Priority Alerts</p>
                  <p className="text-xs text-muted-foreground">
                    High priority issue alerts
                  </p>
                </div>
                <Switch
                  checked={settings.alerts}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, alerts: checked }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
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
                  !notification.read
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            !notification.read ? "text-blue-900" : ""
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        {notification.issueId && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            {notification.issueId}
                          </Badge>
                        )}
                      </div>

                      <div className="text-right flex flex-col items-end gap-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.timestamp).toLocaleString()}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SMS Notification Info */}
      {settings.smsNotifications && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">
                  SMS Notifications Enabled
                </p>
                <p className="text-sm text-blue-600">
                  You'll receive text messages for important updates.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
