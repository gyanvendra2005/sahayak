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
    if (value === "Dashboard") {
      router.push("/"); 
    } else if (value === "Users") {
      router.push("/usermanagement"); 
    } else if (value === "Analytics") {
      router.push("/analytics");
    } else if (value === "notifications") {
      router.push("/notifications"); 
    }
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={handleNavigation} className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-xl mx-auto mt-4">
          <TabsTrigger value="Dashboard" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="Users" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">User</span>
          </TabsTrigger>
          <TabsTrigger value="Analytics" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
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


{/* <TabsContent value="dashboard" className="mt-6">
            <AdminDashboard 
              issues={issues}
              onIssueSelect={setSelectedIssue}
              selectedIssue={selectedIssue}
              userType={user.type as 'subadmin' | 'superadmin'}
              assignedArea={user.assignedArea}
            />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Analytics issues={issues} />
          </TabsContent>

          {user.type === 'superadmin' && (
            <TabsContent value="users" className="mt-6">
              <UserManagement currentUser={user} />
            </TabsContent>
          )}

          <TabsContent value="notifications" className="mt-6">
            <Notifications userType="admin" />
          </TabsContent>
        </Tabs> */}
