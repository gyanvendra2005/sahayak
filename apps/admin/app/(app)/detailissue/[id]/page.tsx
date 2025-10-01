"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
// import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Calendar,
  User,
  AlertTriangle,
  MessageSquare,
  UserCheck,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
// import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

interface Issue {
  _id: string;
  category: string;
  description: string;
  status: "pending" | "Acknowledged" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  timestamp: string;
  location: string;
  citizenId: string;
  userId: string;
  assignedWorker?: string;
  image?: string;
  department: string;
  photoUrl?: string;
  ticketId: string;
  createdAt: string;
}

interface Worker {
  id: string;
  name: string;
  department: string;
  location: string;
  activeIssues: number;
  rating: number;
}

export default function IssueDetailsPage() {
  const { id } = useParams(); // issueId from route
  const [issue, setIssue] = useState<Issue | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [newStatus, setNewStatus] = useState<Issue["status"]>("pending");
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch issue + workers from backend
  useEffect(() => {
    const fetchIssueDetails = async () => {
      try {
        const res = await axios.get(`/api/issues`,{ params: { id }});
        console.log(res.data.data);
        
        setIssue(res.data.data);
        setNewStatus(res.data.issue.status);
      } catch (err) {
        console.error("Error fetching issue:", err);
      } finally {
        setLoading(false);
      }
    };

   const fetchWorkers = async () => {
  try {
    const res = await axios.get("/api/workers", {
      params: { department: issue?.department },
    });

    // adapt backend shape to your interface
    const formattedWorkers = (res.data.res || []).map((w: any) => ({
      id: w._id,
      name: w.name,
      department: w.department,
      location: w.Location || "Kanpur", // default location
      activeIssues: w.activeIssues || 0,
      rating: w.rating || 0,
    }));

    setWorkers(formattedWorkers);
  } catch (err) {
    console.error("Error fetching workers:", err);
  }
};


    if (id) {
      fetchIssueDetails();
      fetchWorkers();
    }
  }, [id, issue?.department]);

  // change status
   const handleUpdate = async () => {
  try {
    const res = await axios.put("/api/updateStatus", { id, status: newStatus,userId:issue?.userId,ticketId:issue?.ticketId});

    if (res.status === 200) {
      toast.success("Issue updated successfully!");
    } else {
      toast.error("Error updating issue");
    }
  } catch (err) {
    console.error(err);
    toast.error("Error updating issue");
  }
};


  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "text-green-600 bg-green-50";
      case "Acknowledged":
        return "text-yellow-600 bg-yellow-50";
      case "acknowledged":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-red-600 bg-red-50";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-green-600 bg-green-50";
    }
  };

  const getCategoryImage = (category: string) => {
    const imageMap: { [key: string]: string } = {
      potholes:
        "https://images.unsplash.com/photo-1469510090920-fd33379d1f7c?fit=crop&w=800&q=80",
      streetlight:
        "https://images.unsplash.com/photo-1529119368496-2dfda6ec2804?fit=crop&w=800&q=80",
      garbage:
        "https://images.unsplash.com/photo-1637681262973-a516e647e826?fit=crop&w=800&q=80",
    };
    return imageMap[category] || imageMap["potholes"];
  };

  // const handleUpdate = async () => {
  //   if (!issue) return;
  //   try {
  //     await axios.put(`/api/issues/${issue._id}`, {
  //       status: newStatus,
  //       assignedWorker: selectedWorker || undefined,
  //     });
  //     alert("Issue updated successfully!");
  //   } catch (err) {
  //     console.error("Error updating issue:", err);
  //   }
  // };

 
  

  if (loading) return <p className="p-6">Loading issue...</p>;
  if (!issue) return <p className="p-6 text-red-500">Issue not found.</p>;

  // Filter relevant workers
  const relevantWorkers = workers;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => history.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Issue Details</h1>
          <p className="text-muted-foreground">Ticket #{issue.ticketId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Issue Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="capitalize">{issue.category} Issue</CardTitle>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(issue.status)}>
                    {issue.status}
                  </Badge>
                  <Badge className={getPriorityColor(issue.priority)}>
                    {issue.priority} priority
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-full h-56 rounded-lg overflow-hidden bg-gray-100">
                {/* <ImageWithFallback
                  src={issue.image || getCategoryImage(issue.category)}
                  alt={`${issue.category} issue`}
                  className="w-full h-full object-cover"
                /> */}
                <img
                  src={issue.photoUrl || getCategoryImage(issue.category)}
                  alt={`${issue.category} issue`}
                  className="w-full h-full object-cover"/>

              </div>

              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{issue.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{issue.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>Citizen #{issue.citizenId}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Internal Notes */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Internal Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add internal notes..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                rows={4}
              />
              <Button className="mt-3">Save Notes</Button>
            </CardContent>
          </Card> */}
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          {/* Status + Worker Update */}
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Issue Status
                </label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* <Separator /> */}

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Assign Supervisor
                </label>
                <Select
                  value={selectedWorker}
                  onValueChange={setSelectedWorker}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    {relevantWorkers.map((worker) => (
                      <SelectItem key={worker.id} value={worker.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{worker.name}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {worker.department}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleUpdate} className="w-full">
                Update Issue
              </Button>
            </CardContent>
          </Card>

          {/* Worker Info */}
          {selectedWorker && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Assigned Worker
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const worker = workers.find((w) => w.id === selectedWorker);
                  if (!worker) return null;

                  return (
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">{worker.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {worker.department}
                        </p>
                      </div>
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span>{worker.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active Issues:</span>
                          <span>{worker.activeIssues}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rating:</span>
                          <span>{worker.rating}/5 ⭐</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* Priority Alert */}
          {issue.priority === "high" && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  High Priority
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-600 mb-3">
                  This issue requires immediate attention. Consider expedited
                  processing.
                </p>
                <Button variant="destructive" size="sm" className="w-full">
                  Mark as Urgent
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

