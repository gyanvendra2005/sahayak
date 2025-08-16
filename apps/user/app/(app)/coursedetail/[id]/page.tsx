"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function Page() {
  const { id } = useParams();
  const [courseDetails, setCourseDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/coursedetail`, {
        params: { id },
      });

      if (response.data.success) {
        const course = response.data.data[0];
        setCourseDetails(course);
        toast.success("Course details fetched successfully");
      } else {
        toast.error(response.data.message || "Failed to fetch course details");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Something went wrong while fetching course details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCourseDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="mt-14 px-4 md:px-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black shadow-xl p-8 text-white rounded-2xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {courseDetails?.title || "Untitled Course"}
        </h1>
        <div className="space-y-2 text-gray-300 text-sm md:text-base">
          <p>
            <span className="font-semibold text-white">Created By:</span>{" "}
            {courseDetails?.creator?.name || "Unknown"}
          </p>
          <p>
            <span className="font-semibold text-white">Category:</span>{" "}
            {courseDetails?.category || "Uncategorized"}
          </p>
          <p>
            <span className="font-semibold text-white">Duration:</span>{" "}
            {courseDetails?.duration || "N/A"}
          </p>
          <p>
            <span className="font-semibold text-white">Created At:</span>{" "}
            <span className="italic">
              {courseDetails?.createdAt
                ? new Date(courseDetails.createdAt).toDateString()
                : "N/A"}
            </span>
          </p>
          <p>
            <span className="font-semibold text-white">Updated At:</span>{" "}
            <span className="italic">
              {courseDetails?.updatedAt
                ? new Date(courseDetails.updatedAt).toDateString()
                : "N/A"}
            </span>
          </p>
        </div>
        <div className="mt-6 flex gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Enroll Now
          </Button>
        </div>
      </div>

  {/* Content Section: Overview + Video */}
<div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
  {/* Course Overview (takes 2/3 space) */}
  <div className="lg:col-span-2">
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Description</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300">
          {courseDetails?.description ||
            "No description available for this course."}
        </p>

        <h3 className="mt-6 text-lg md:text-xl font-semibold">
          What You'll Learn:
        </h3>
        <p className="text-sm md:text-base">
          {courseDetails?.lectures?.length || 0} Lectures
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700 dark:text-gray-300 text-sm md:text-base">
          {courseDetails?.lectures?.length ? (
            courseDetails.lectures.map((lec: any, index: number) => (
              <li key={index}>{lec.title}</li>
            ))
          ) : (
            <li className="italic text-gray-400">
              No lectures available yet
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  </div>

  {/* Intro Video (smaller right card) */}
  <div className="lg:col-span-1">
    <Card className="w-full max-w-sm h-auto">
      <CardHeader>
        <CardTitle>Intro Video</CardTitle>
      </CardHeader>
      <CardContent>
        {courseDetails?.lectures?.[0]?.videoUrl ? (
          <video
            controls
            className="w-full h-48 rounded-lg object-cover" // ✅ smaller height
            src={courseDetails.lectures[0].videoUrl}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No intro video available
          </p>
        )}
      </CardContent>
    </Card>
  </div>
</div>

    </div>
  );
}
