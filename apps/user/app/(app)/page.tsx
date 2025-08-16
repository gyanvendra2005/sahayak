"use client";


import axios from "axios";
import CourseCard from "../../components/CourseCard";
import bg from "../../public/bg.png";
import { useEffect, useState } from "react";

type Course = {
  _id: string;
  // Add other properties as needed, e.g. title: string;
  [key: string]: any;
};

export default function Home() {

  const [totalCourses, setTotalCourses] = useState(5);
  const [courses, setCourses] = useState<Course[]>([]);
    const fetchCourses = async () => {
    // Simulate fetching courses from an API
    const response = await axios.get('/api/getcourses');
     console.log("Response from API:", response.data.data);
     
    if (response.data.success) {
      setTotalCourses(response.data.data.length);
      setCourses(response.data.data);
    } else {
      console.error("Failed to fetch courses:", response.data.message);
    }
  }

 useEffect(() => {
    fetchCourses();
   
 }, []);




  return (
    <>
    {/* Hero Section */}
    <section className="relative h-[85vh] flex items-center justify-center bg-gradient-to-br from-[#e0f7fa] to-white dark:from-[#1f2937] dark:to-[#111827] overflow-hidden px-4 sm:px-6">
      {/* Background Image */}
      <img
        src={bg.src}
        alt="Learning Background"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />

      {/* Dark overlay for background image */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40 " />

      {/* Optional light/dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-white/10 dark:from-black dark:via-gray-900/60 dark:to-gray-900/10 z-0" />

      {/* Glass Card */}
      <div className="relative z-2 w-full max-w-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-300 dark:border-gray-700 rounded-2xl shadow-lg px-6 sm:px-10 py-8 sm:py-10 text-center space-y-5">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
          Empower Your Future <br />
          <span className="text-teal-600 dark:text-teal-400">with SkillNest</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 font-medium">
          Learn from experts. Build real-world skills. <br className="hidden sm:block" /> Get ahead in tech, today.
        </p>
        <div className="pt-2">
          <button className="px-5 py-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-all duration-200 shadow-md">
            Explore Courses
          </button>
        </div>
      </div>
    </section>


  
    {/* Search Bar Section */}

    <section className="px-4 sm:px-6 mt-[-3rem] relative z-5 w-full flex justify-center">
  <div className="w-full max-w-3xl">
    <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full shadow-md overflow-hidden px-4 py-2">
      <input
        type="text"
        placeholder="Search courses, topics, or skills..."
        className="w-full bg-transparent focus:outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
      />
      <button className="ml-3 px-4 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-all duration-200">
        Search
      </button>
    </div>
  </div>
</section>

<section className="px-4 sm:px-6 mt-16 max-w-7xl mx-auto">
  {/* Section Heading */}
  <div className="text-center mb-10">
    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
      Explore Our Courses
    </h2>
    <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
      Learn in-demand skills with expert-led courses.
    </p>
  </div>

  {/* Course Cards */}
  <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-3">
    {
      // Array.from({ length: totalCourses }).map((_, index) => (
      //   <CourseCard key={index} />
      // ))
      courses.map((course) => (
        <CourseCard key={course._id} course={course} />
      ))
    }
    {/* Add more <CourseCard /> as needed */}
  </div>
</section>



</>
  );
}
