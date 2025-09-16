"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
// import { Avatar, AvatarFallback } from './ui/avatar';
// import { MockMapComponent } from './MockMapComponent';
import {
  MapPin,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Filter,
  Search,
  Users,
  AlertTriangle,
  CheckCircle,
  Timer,
  Eye,
  Loader2,
  ArrowUpCircle,
} from "lucide-react";
import axios from "axios";
import LocationMap from "components/map";
import IssuesMap from "components/map";
import { useSession } from "next-auth/react";

interface Issue {
  id: string;
  category: string;
  description: string;
  status: "pending" | "acknowledged" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  createdAt: string;
  location: string;
  citizenId: string;
  promotesCount?: number; 
    userId: string;  
    ticketId: string;
    photoUrl?: string;
  assignedWorker?: string;
  lat: number;
  lng: number;
  engagements?: {
    promote: number;
    shares: number;
    comments: number;
    userLiked?: boolean;
    userShared?: boolean;
  };
  distance?: number;
}

interface NearbyIssuesProps {
  issues: Issue[];
  currentUserId: string;
  onEngagement: (
    issueId: string,
    type: "promote" | "share" | "comment"
  ) => void;
}

export default function NearbyIssues({
  issues,
  currentUserId,
  onEngagement,
}: NearbyIssuesProps) {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("distance");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  // Add mock engagement data to issues
  const [issuesWithEngagement, setIssuesWithEngagement] = useState<Issue[]>([]);
  const session = useSession();

  //   useEffect(() => {
  //     const enhancedIssues = issues.map(issue => ({
  //       ...issue,
  //       engagements: {
  //         likes: Math.floor(Math.random() * 25) + 1,
  //         shares: Math.floor(Math.random() * 15) + 1,
  //         comments: Math.floor(Math.random() * 10) + 1,
  //         userLiked: Math.random() > 0.7,
  //         userShared: Math.random() > 0.8,
  //       },
  //       distance: Math.random() * 5 + 0.1 // Random distance in km
  //     }));
  //     setIssuesWithEngagement(enhancedIssues);
  //   }, [issues]);

  useEffect(() => {
    // if (!locationEnabled) return;
    setLoading(true);
    async function getLocationAndSend() {
      if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const location = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };

            const res = await axios.get("/api/fetchcurrentlocation", {
              params: location,
            });
            setLocation(res.data.postOffices?.Name || "");
            console.log(
              "✅ Current Location Data:",
              res.data.postOffices?.Name
            );

            // if (res.data) {
            //   setFormData((prev) => ({
            //     ...prev,
            //     location: res.data.postOffices?.Name || '',
            //     pincode: res.data.pincode || '',
            //   }));
            // }

            // console.log('📍 Pincode:', res.data.pincode);
            // console.log('🏢 Post Office:', res.data.postOffices?.Name);
          } catch (err) {
            console.error("❌ Error sending location", err);
          }
        },
        (err) => {
          console.error("❌ Error getting location", err);
          alert("Please allow location access.");
          //   setLocationEnabled(false); // reset toggle if denied
        }
      );
    }

    getLocationAndSend();
    // setLoading(false);
  }, []);

  useEffect(() => {
    async function fetchissue() {
      try {
        setLoading(true);
        const res = await axios.get("/api/nearbyissue", {
          params: { location },
        });
        console.log("Nearby Issues Data:", res.data);
        const fetchedIssues = res.data.datas || [];

        const enhancedIssues = fetchedIssues.map((issue: Issue) => ({
          ...issue,
          engagements: {
            likes: Math.floor(Math.random() * 25) + 1,
            shares: Math.floor(Math.random() * 15) + 1,
            comments: Math.floor(Math.random() * 10) + 1,
            userLiked: Math.random() > 0.7,
            userShared: Math.random() > 0.8,
          },
          distance: Math.random() * 5 + 0.1,
        }));
        setIssuesWithEngagement(enhancedIssues);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching nearby issues", err);
      }
    }
    if (location) fetchissue();
  }, [location]);

  const handleEngagement = (
    issueId: string,
    type: "promote" | "share" | "comment"
  ) => {
    setIssuesWithEngagement((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId && issue.engagements) {
          const updatedEngagements = { ...issue.engagements };

          if (type === "promote") {
            if (updatedEngagements.userLiked) {
              updatedEngagements.promote -= 1;
              updatedEngagements.userLiked = false;
            } else {
              updatedEngagements.promote += 1;
              updatedEngagements.userLiked = true;
            }
          } else if (type === "share") {
            if (!updatedEngagements.userShared) {
              updatedEngagements.shares += 1;
              updatedEngagements.userShared = true;
            }
          } else if (type === "comment") {
            updatedEngagements.comments += 1;
          }

          return { ...issue, engagements: updatedEngagements };
        }
        return issue;
      })
    );

    onEngagement(issueId, type);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-700";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700";
      case "acknowledged":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "medium":
        return <Timer className="w-4 h-4 text-yellow-500" />;
      default:
        return <Eye className="w-4 h-4 text-green-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "potholes":
        return "🕳️";
      case "streetlight":
        return "💡";
      case "garbage":
        return "🗑️";
      case "water":
        return "💧";
      default:
        return "📋";
    }
  };

  const filteredIssues = issuesWithEngagement
    .filter((issue) => {
      if (filter === "trending") {
        const totalEngagement =
          (issue.engagements?.promote || 0) + (issue.engagements?.shares || 0);
        return totalEngagement > 10;
      }
      if (filter === "recent") {
        const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
        return new Date(issue.createdAt).getTime() > dayAgo;
      }
      if (filter === "high-priority") return issue.priority === "high";
      return true;
    })
    .filter(
      (issue) =>
        selectedCategory === "all" || issue.category === selectedCategory
    )
    .filter(
      (issue) =>
        searchTerm === "" ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "distance") return (a.distance || 0) - (b.distance || 0);
      if (sortBy === "engagement") {
        const aTotal =
          (a.engagements?.promote || 0) + (a.engagements?.shares || 0);
        const bTotal =
          (b.engagements?.promote || 0) + (b.engagements?.shares || 0);
        return bTotal - aTotal;
      }
      if (sortBy === "recent")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      return 0;
    });

  const stats = {
    totalNearby: issuesWithEngagement.length,
    trending: issuesWithEngagement.filter((i) => {
      const total =
        (i.engagements?.promote || 0) + (i.engagements?.shares || 0);
      return total > 10;
    }).length,
    highPriority: issuesWithEngagement.filter((i) => i.priority === "high")
      .length,
    recent: issuesWithEngagement.filter((i) => {
      const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
      return new Date(i.createdAt).getTime() > dayAgo;
    }).length,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
        <p className="text-muted-foreground">Fetching issues near you...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl">Nearby Issues</h1>
          <p className="text-muted-foreground">
            Discover and engage with civic issues in your area
          </p>
        </div>

        <Button
          variant={showMap ? "default" : "outline"}
          onClick={() => setShowMap(!showMap)}
        >
          <MapPin className="w-4 h-4 mr-2" />
          {showMap ? "Hide Map" : "Show Map"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nearby Issues</p>
                <p className="text-2xl font-bold">{stats.totalNearby}</p>
              </div>
              <MapPin className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Trending</p>
                <p className="text-2xl font-bold">{stats.trending}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold">{stats.highPriority}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recent (24h)</p>
                <p className="text-2xl font-bold">{stats.recent}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map View */}
      {showMap && (
        <Card>
          <CardContent className="p-0">
            {/* <MockMapComponent issues={filteredIssues} /> */}
            <IssuesMap
              issues={[
                {
                  id: "1",
                  category: "potholes",
                  description: "Huge pothole near market",
                  lat: 30.6139,
                  lng: 77.209,
                  location: "Connaught Place",
                },
                {
                  id: "2",
                  category: "garbage",
                  description: "Garbage not collected",
                  lat: 28.62,
                  lng: 77.21,
                  location: "Karol Bagh",
                },
                {
                  id: "3",
                  category: "streetlight",
                  description: "Streetlight not working",
                  lat: 28.625,
                  lng: 77.215,
                  location: "Rajiv Chowk",
                },
              ]}
            />
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search issues by description or location..."
                  value={searchTerm}
                  onChange={(e: any) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="potholes">Potholes</SelectItem>
                <SelectItem value="streetlight">Street Lights</SelectItem>
                <SelectItem value="garbage">Garbage</SelectItem>
                <SelectItem value="water">Water Issues</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="engagement">Most Engaged</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-4" />

          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All Issues
            </Button>
            <Button
              variant={filter === "trending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("trending")}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Trending
            </Button>
            <Button
              variant={filter === "recent" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("recent")}
            >
              <Clock className="w-4 h-4 mr-1" />
              Recent
            </Button>
            <Button
              variant={filter === "high-priority" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("high-priority")}
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
              High Priority
            </Button>
          </div>
        </CardContent>
      </Card>

{/* Issues Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
  {filteredIssues.map((issue) => (
    <Card
      key={issue.id}
      className="hover:shadow-lg transition-all rounded-xl overflow-hidden"
    >
      {/* 🔹 Image Section */}
      {issue.photoUrl && (
        
        <div className="relative w-full h-40 bg-gray-100">
           {/* If issue belongs to current user */}
          {issue.userId === session.data?.user?.id && (
            <Badge className="absolute top-2 left-2 bg-green-600 text-white tracking-wide rounded-md px-2 py-1">
              You
            </Badge>
          )}

          <img
            src={issue.photoUrl}
            alt={issue.category}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
          <h3 className="font-semibold text-lg">{issue.category.toUpperCase()}</h3>
        </div>
       

        {/* Ticket ID as Unique Tag */}
        <Badge className="bg-green-600 text-white mt-2 tracking-wide rounded-md px-2 py-1">
          🎫 #{issue.ticketId.toUpperCase()}
        </Badge>

        {/* Status Badge */}
        <Badge className={`${getStatusColor(issue.status)} mt-1`}>
          {issue.status.replace("-", " ")}
        </Badge>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600 mb-3">{issue.description}</p>

        <div className="flex items-center text-xs text-gray-500 gap-2">
          <MapPin className="w-3 h-3" />
          {issue.location}
        </div>

        <div className="flex items-center text-xs text-gray-500 gap-2 mt-1">
          <Clock className="w-3 h-3" />
          {new Date(issue.createdAt).toLocaleDateString()}
        </div>

        <div className="flex items-center text-xs text-gray-500 gap-2 mt-1">
          🚀 {issue.promotesCount === 1
            ? "1 person promoted"
            : `${issue.promotesCount || 0} people promoted`}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="mt-4 w-full flex items-center justify-center gap-2"
          onClick={() => handleEngagement(issue.id, "promote")}
        >
          🚀 Promote
        </Button>
      </CardContent>
    </Card>
  ))}
</div>

  {filteredIssues.length === 0 && (
    <Card className="col-span-full">
      <CardContent className="p-8 text-center">
        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-medium mb-2">No issues found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or search terms to find issues in your area.
        </p>
      </CardContent>
    </Card>
  )}
</div>
  );
}
