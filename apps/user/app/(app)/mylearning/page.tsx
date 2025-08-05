"use client"

import React, { useState } from 'react'
import CourseCard from '../../../components/CourseCard'
import { Skeleton } from '../../../components/ui/skeleton'

const Page = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [noCourses, setNoCourses] = useState(3) // Replace with array of real course data later

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-950 px-4 sm:px-6 md:px-10 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center md:text-left text-gray-900 dark:text-white mb-8">
          My Courses
        </h1>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-[112px] w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[70%]" />
                  <Skeleton className="h-4 w-[50%]" />
                </div>
              </div>
            ))}
          </div>
        ) : noCourses === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
            You are not enrolled in any courses yet.
          </p>
        ) : (
          // Course Cards Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[...Array(noCourses)].map((_, i) => (
              <CourseCard key={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Page



