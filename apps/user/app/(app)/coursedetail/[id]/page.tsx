"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Script from "next/script";
import { useSession } from "next-auth/react";
import Link from "next/link";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Page() {
  const { data: session } = useSession();
  const { id } = useParams();
  const [courseDetails, setCourseDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const amount = courseDetails?.coursePrice || 0;

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/coursedetail`, {
        params: { id, userId: session?.user?.id }, // pass userId to backend
      });
      console.log("API Response:", response.data);

      if (response.data.success) {
        setCourseDetails(response.data.data); // backend returns array
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
  }, [id, session?.user?.id]);

  const handlePayment = async () => {
    try {
      const response = await axios.post("/api/createpayment", {
        amount: amount * 100,
      });

console.log("Payment creation response:", response.data);


      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: response.data.data.amount,
        currency: response.data.data.currency,
        name: "Course Payment",
        description: "Payment for course enrollment",
        order_id: response.data.data.id,
        handler: async (response: any) => {
          try {
            const paymentResponse = await axios.post("/api/verifyPayment", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              courseId: id,
              userId: session?.user?.id,
            });

            if (paymentResponse.data.success) {
              toast.success("Payment successful! Course enrolled.");
              fetchCourseDetails();
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("An error occurred while verifying payment");
          }
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp1 = new (window as Window).Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.log("Payment creation error:", error);
      toast.error("An error occurred while creating payment");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }
  console.log("Course Details:", courseDetails);

  if (!courseDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Course not found</p>
      </div>
    );
  }

  return (
    <div className="mt-14 px-4 md:px-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      {/* Hero Section */}{" "}
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black shadow-xl p-8 text-white rounded-2xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {courseDetails?.title || "Untitled Course"}{" "}
        </h1>
        <div className="space-y-2 text-gray-300 text-sm md:text-base">
          <p>
            <span className="font-semibold text-white">Created By:</span>{" "}
            {courseDetails?.creator?.name || "Unknown"}{" "}
          </p>
          <p>
            <span className="font-semibold text-white">Category:</span>{" "}
            {courseDetails?.category || "Uncategorized"}{" "}
          </p>
          <p>
            <span className="font-semibold text-white">Duration:</span>{" "}
            {courseDetails?.duration || "N/A"}{" "}
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
        {/* Enroll button only if not enrolled */}
        {!courseDetails?.isEnrolled ? (
          <div className="mt-6 flex gap-4">
            <Button
              onClick={handlePayment}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Enroll Now
            </Button>
          </div>
        ):(
          <div className="mt-6 flex gap-4">
            <Link href={`/my-course/${id}`}>
            <Button
              
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue to Course
            </Button>
            </Link>
          </div>
        )}
      </div>
      {/* Content Section */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lectures */}
        <div className="lg:col-span-2">
          <Card className="w-full h-full">
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                {courseDetails?.lectures?.length ? (
                  courseDetails.lectures.map((lec: any, index: number) => (
                    <li
                      key={index}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <span>{lec.title}</span>
                      {!lec.isFree && !courseDetails.isEnrolled && (
                        <Lock className="h-4 w-4 text-gray-500" />
                      )}
                    </li>
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

        {/* Intro Video */}
        <div className="lg:col-span-1">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Intro Video</CardTitle>
            </CardHeader>
            <CardContent>
              {courseDetails?.lectures?.length && courseDetails.lectures[0]?.videoUrl ? (
                courseDetails.isEnrolled ||
                courseDetails.lectures[0]?.isFree ? (
                  <video
                    controls
                    className="w-full h-48 rounded-lg object-cover"
                    src={courseDetails.lectures[0].videoUrl}
                  />
                ) : (
                  <p className="text-gray-500">Enroll to watch this video 🔒</p>
                )
              ) : (
                <p className="text-gray-500">No intro video available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
