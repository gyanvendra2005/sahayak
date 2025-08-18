"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function AddCourseForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const { data: session } = useSession();

  const handleCancel = () => {
    router.push("/coursetable");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const userId = session?.user?.id;

      if (session?.user.role !== "user") {
        const response = await axios.post("/api/createcourse", {
          title,
          description,
          category,
          level,
          coursePrice: price,
          creator: userId,
          isPublished: false,
        });

        if (response.status === 200) {
          toast.success("Course created successfully!");
          router.push("/coursetable");
        } else {
          toast.error("Failed to create course. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create course. Please try again.");
    }
  };

  return (
    <div className="flex-1 mx-6 md:mx-10 my-20 bg-white dark:bg-gray-900 p-6 md:p-10 rounded-xl shadow-sm">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
          Add a New Course
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Provide basic information about your course to get started.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6 max-w-2xl">
        {/* Course Title */}
        <div className="flex flex-col space-y-1">
          <Label
            htmlFor="courseTitle"
            className="text-gray-800 dark:text-gray-200"
          >
            Title
          </Label>
          <Input
            id="courseTitle"
            type="text"
            placeholder="Enter course title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          />
        </div>

        {/* Course Category */}
        <div className="flex flex-col space-y-1">
          <Label className="text-gray-800 dark:text-gray-200">Category</Label>
          <Select onValueChange={(e) => setCategory(e)}>
            <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                <SelectItem value="fullstack">Full-Stack</SelectItem>
                <SelectItem value="frontend">Frontend</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
                <SelectItem value="nextjs">Next.js</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="data">Data Science</SelectItem>
                <SelectItem value="ai">AI / ML</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Course Level */}
        <div className="flex flex-col space-y-1">
          <Label className="text-gray-800 dark:text-gray-200">Level</Label>
          <Select onValueChange={(e) => setLevel(e)}>
            <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
              <SelectValue placeholder="Select difficulty level" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Course Price */}
        <div className="flex flex-col space-y-1">
          <Label className="text-gray-800 dark:text-gray-200">Price (INR)</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price (e.g., 499)"
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          />
        </div>

        {/* Course Description */}
        <div className="flex flex-col space-y-1">
          <Label className="text-gray-800 dark:text-gray-200">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe what this course is about..."
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create Course
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={handleCancel}
            className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
