"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  MapPin,
  Calendar,
} from "lucide-react";
import axios from "axios";

interface Issue {
  id: string;
  category: string;
  status: string;
  createdAt: string;
}

export default function Analytics() {
  const [issues, setIssues] = useState<Issue[]>([]);

  // ✅ Fetch issues once
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get("/api/issues");
        setIssues(response.data?.data || response.data?.issues || []);
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };
    fetchIssues();
  }, []);

  // ✅ Basic Stats
  const totalIssues = issues.length;
  const resolvedIssues = issues.filter((i) => i.status === "Resolved").length;
  const pendingIssues = issues.filter((i) => i.status !== "Resolved").length;
  const inProgressIssues = issues.filter((i) => i.status === "in-progress").length;
  const resolutionRate =
    totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;

  // ✅ Category distribution (dynamic)
  const categories = ["potholes", "streetlight", "garbage", "water", "other"];
  const colors = ["#f97316", "#eab308", "#16a34a", "#3b82f6", "#6b7280"];
  const categoryData = categories.map((cat, i) => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: issues.filter((i) => i.category === cat).length,
    color: colors[i],
  }));

  // ✅ Weekly Trends (dynamic grouping)
  const groupByWeek = (items: Issue[]) => {
    const grouped: Record<string, { reported: number; resolved: number }> = {};
    items.forEach((i) => {
      const week = `W${Math.ceil(new Date(i.createdAt).getDate() / 7)}`;
      if (!grouped[week]) grouped[week] = { reported: 0, resolved: 0 };
      grouped[week].reported++;
      if (i.status === "Resolved") grouped[week].resolved++;
    });
    return Object.entries(grouped).map(([week, data]) => ({
      week,
      reported: data.reported,
      resolved: data.resolved,
    }));
  };

  const weeklyTrends = groupByWeek(issues);

  // KPI Cards
  const kpiCards = [
    {
      title: "Total Reports",
      value: totalIssues.toString(),
      icon: AlertTriangle,
      trend: "+12%",
      trendUp: true,
      description: "This month",
    },
    {
      title: "Resolution Rate",
      value: `${resolutionRate}%`,
      icon: CheckCircle,
      trend: "+8%",
      trendUp: true,
      description: "Success rate",
    },
    {
      title: "Avg Resolution Time",
      value: "4.2 days",
      icon: Clock,
      trend: "-1.5 days",
      trendUp: true,
      description: "Getting faster",
    },
    {
      title: "Active Issues",
      value: (pendingIssues + inProgressIssues).toString(),
      icon: Users,
      trend: "-5%",
      trendUp: true,
      description: "Currently open",
    },
  ];

  return (
    <div className="w-full mx-auto p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl mb-2">Analytics & Reports</h1>
        <p className="text-muted-foreground">
          Insights into civic issue management and resolution
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {kpi.trendUp ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span
                      className={`text-xs ${
                        kpi.trendUp ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {kpi.trend}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      {kpi.description}
                    </span>
                  </div>
                </div>
                <kpi.icon className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category + Weekly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       {/* Category Pie */}
<Card>
  <CardHeader>
    <CardTitle>Issues by Category</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, value }) => `${name} (${value})`} 
          >
            {categoryData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend /> 
        </PieChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>


        {/* Weekly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Reporting Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="reported"
                    stroke="#f97316"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    stroke="#16a34a"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Monthly Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {totalIssues}
              </div>
              <p className="text-sm text-muted-foreground">
                Total Reports Received
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {resolvedIssues}
              </div>
              <p className="text-sm text-muted-foreground">Issues Resolved</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {pendingIssues + inProgressIssues}
              </div>
              <p className="text-sm text-muted-foreground">Issues Pending</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
