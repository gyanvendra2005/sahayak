"use client";

import axios from "axios";
import CourseCard from "../../components/CourseCard";
import bg from "../../public/bg.png";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type Course = {
  _id: string;
  title: string;
  category: string;
  description: string;
  [key: string]: any;
};

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/getcourses");
      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/searchcourse", {
        params: { q: searchQuery },
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
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      {/* ✅ Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center bg-gradient-to-br from-[#e0f7fa] to-white dark:from-[#1f2937] dark:to-[#111827] overflow-hidden px-4 sm:px-6">
        <img
          src={bg.src}
          alt="Learning Background"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40 " />
        <div className="relative z-2 w-full max-w-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-300 dark:border-gray-700 rounded-2xl shadow-lg px-6 sm:px-10 py-8 text-center space-y-5">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Empower Your Future <br />
            <span className="text-teal-600 dark:text-teal-400">with SkillNest</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 font-medium">
            Learn from experts. Build real-world skills. Get ahead in tech, today.
          </p>
          <div className="pt-2">
            <Link href="/searchpage">
              <button className="px-5 py-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-all duration-200 shadow-md">
                Explore Courses
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ✅ Search Bar */}
      <section className="px-4 sm:px-6 mt-[-4rem] relative z-5 w-full flex justify-center">
        <div className="w-full max-w-3xl">
          <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full shadow-md overflow-hidden px-4 py-2">
            <input
              type="text"
              placeholder="Search courses, topics, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              onClick={fetchSearchCourses}
              className="ml-3 px-4 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-all duration-200"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* ✅ Courses Section */}
      <section className="px-4 sm:px-6 mt-16 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Explore Our Courses
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Learn in-demand skills with expert-led courses.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-3">
          {courses.slice(0, 6).map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/searchpage">
            <button className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-black text-white rounded-full shadow-md transition-all">
              View All Courses →
            </button>
          </Link>
        </div>
      </section>

      {/* ✅ Categories Section */}
      <section className="px-4 sm:px-6 mt-20 max-w-6xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Popular Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {["Frontend", "Backend", "Fullstack", "AI/ML"].map((cat) => (
            <div
              key={cat}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer border border-gray-200 dark:border-gray-700"
            >
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {cat}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Why Choose Us Section */}
      <section className="px-4 sm:px-6 mt-20 max-w-6xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Why Choose SkillNest?
        </h2>
        <div className="grid sm:grid-cols-3 gap-8 mt-8">
          {[
            "Hands-on Projects",
            "Expert Mentors",
            "Lifetime Access",
          ].map((feature) => (
            <div
              key={feature}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {feature}
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {feature === "Hands-on Projects" &&
                  "Work on real-world applications and strengthen your portfolio."}
                {feature === "Expert Mentors" &&
                  "Learn directly from industry professionals with years of experience."}
                {feature === "Lifetime Access" &&
                  "Revisit any course content whenever you want with unlimited access."}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ CTA Section */}
      <section className="px-4 sm:px-6 mt-20 max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 dark:from-teal-500 dark:to-teal-400 text-white py-12 px-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="mb-6 text-base sm:text-lg text-teal-100">
            Join thousands of learners upgrading their careers with SkillNest.
          </p>
          <Link href="/searchpage">
            <button className="px-6 py-3 bg-white text-teal-700 font-semibold rounded-full shadow hover:bg-gray-100 transition">
              Browse Courses
            </button>
          </Link>
        </div>
      </section>
    </>
  );
}
