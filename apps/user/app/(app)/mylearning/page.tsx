"use client";

import React, { useEffect, useState } from "react";
import CourseCard from "../../../components/CourseCard";
import { Skeleton } from "../../../components/ui/skeleton";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Fetch user courses
  const fetchUserCourses = async () => {
    try {
      const response = await axios.get("/api/enrolledcourses", {
        params: { userId },
      });
      setCourses(response.data.data.enrolledCourses || []);
    } catch (error) {
      console.error("Error fetching user courses:", error);
      toast.error("Failed to fetch courses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUserCourses();
  }, [userId]);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-950 px-4 sm:px-6 md:px-10 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
          <h1 className="text-3xl font-bold text-center sm:text-left text-gray-900 dark:text-white">
            My Courses
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 sm:mt-0">
            {isLoading
              ? "Loading your enrolled courses..."
              : `${courses.length} course${courses.length === 1 ? "" : "s"} enrolled`}
          </p>
        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md space-y-4"
              >
                <Skeleton className="h-[140px] w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-[70%]" />
                  <Skeleton className="h-4 w-[50%]" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              🚀 You are not enrolled in any courses yet.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Explore our catalog and start learning today!
            </p>
            <Link
              href="/explore"
              className="inline-block mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          // Course Cards Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              // <Link key={course._id} href={`/course/${course._id}`}>
                <CourseCard course={course} />
              
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Page;

