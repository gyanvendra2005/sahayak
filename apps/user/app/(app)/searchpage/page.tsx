"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import CourseCard from "components/CourseCard";

export default function SearchCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/searchcourse", {
        params: {
          q: searchQuery,
          category: category,
          level: level,
        },
      });
      setCourses(res.data.data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [category, level]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          {/* Search Input */}
          <div className="flex gap-2 w-full md:w-1/2">
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={fetchCourses}>Search</Button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 w-full md:w-auto">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              <option value="">All Categories</option>
              <option value="fullstack">Full-Stack</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
                <option value="backend">Next.js</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="data">Data Science</option>
                <option value="ai">AI / ML</option>
                <option value="devops">DevOps</option>
            </select>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Course Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <Skeleton key={idx} className="h-[200px] w-full rounded-xl" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No courses found 🚀
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course}  />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
