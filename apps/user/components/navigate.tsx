"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, MapPin, Search, Home } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Navigate = () => {
  const [activeTab, setActiveTab] = useState("home");
  const unreadNotifications = 2;
  const router = useRouter();

  const handleNavigation = (value: string) => {
    setActiveTab(value);

    // Navigate based on tab
    if (value === "home") {
      router.push("/"); // CitizenHome page
    } else if (value === "nearby") {
      router.push("/nearbyissue"); // You can create a nearby page
    } else if (value === "track") {
      router.push("/trackIssue");
    } else if (value === "notifications") {
      router.push("/notifications"); // You can create this
    }
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={handleNavigation} className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-xl mx-auto mt-4">
          <TabsTrigger value="home" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Report</span>
          </TabsTrigger>
          <TabsTrigger value="nearby" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Nearby</span>
          </TabsTrigger>
          <TabsTrigger value="track" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Track</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 relative">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Alerts</span>
            {unreadNotifications > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 min-w-5 h-5">
                {unreadNotifications}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default Navigate;
