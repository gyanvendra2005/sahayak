"use client"
import React, { useState, useEffect } from 'react'
import pic from '@/public/next.svg'
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from "../components/ui/skeleton";
import { useSession } from 'next-auth/react';
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

const CourseCard = ({course}) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  // Simulate loading delay
//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 1000);
//     return () => clearTimeout(timer);
//   }, []);

  if (loading) {
    return (
      <div className="flex flex-col space-y-3 w-full max-w-sm">
        <Skeleton className="h-[112px] w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[70%]" />
          <Skeleton className="h-4 w-[50%]" />
        </div>
      </div>
    );
  }

  return (
    <Link href={`/coursedetail/${course._id}`}>
       <Card className="rounded-xl border bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out w-full max-w-sm">
      <CardContent className="p-4">
        {/* Course Image */}
        <Avatar className="w-full h-36 sm:h-40 md:h-44 rounded-lg overflow-hidden">
          <AvatarImage
            src={course.creator?.photoUrl}
            alt="Course"
            className="object-cover w-full h-full"
          />
          <AvatarFallback>IMG</AvatarFallback>
        </Avatar>

        {/* Course Info */}
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
           {course.title || "Course Title"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">By: {course?.creator?.name ? course.creator.name:"gyani"}</p>
            <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 text-xs">
              {course.category.toUpperCase() || "Category"}
            </span>
          {/* Stats with badge-style layout */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mt-2">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-50 dark:bg-gray-800 border dark:border-gray-700">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              4.7
            </span>
           
            <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 text-xs">
              452K ratings
            </span>
            <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 text-xs">
              87.6 hrs
            </span>
            <span className="ml-auto px-2 py-0.5 rounded-md bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs font-medium">
              {course.coursePrice ? `$${course.coursePrice}` : "Free"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}


export default CourseCard;

