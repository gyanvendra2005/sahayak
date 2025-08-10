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
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";

export default function AddCourseForm() {
  const router = useRouter();
  // Initial course data state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const {data:session} = useSession();


    const { id } = useParams(); // Assuming you have a way to get the course ID if needed
  const handleCancel = () => {
    router.push(`/editcourse/${id}`); // or wherever you want to go
  };

  const handleSubmit = async (e: React.FormEvent) => {
       try {
        e.preventDefault(); 
        console.log(level, category, title, price, description);
        const userId = session?.user?.id;
        const response  = axios.post("/api/createlecture", {
          courseId: id, 
          title: title,
          description: description,
        })
                
        if((await response).status === 200) {
          toast.success("Course created successfully!");
          router.push("/coursetable"); // Redirect to course table after successful creation
        }
        else {
          toast.error("Failed to create course. Please try again.");
        }
        
       } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Failed to create course. Please try again.");
        
       }
  }


  return (
    <>
    <div className="flex-1 mx-6 md:mx-10 my-20">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="font-bold text-2xl">Add a New Course</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Provide basic information about your course to get started.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6 max-w-2xl">
        {/* Course Title */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="courseTitle">Title</Label>
          <Input
            id="courseTitle"
            name="courseTitle"
            type="text"
            placeholder="Enter course title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Course Category */}
        {/* <div className="flex flex-col space-y-1">
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={(e)=>{setCategory(e)}}>
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                <SelectItem value="fullstack">Full-Stack</SelectItem>
                <SelectItem value="frontend">Frontend</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
                <SelectItem value="backend">Next.js</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="data">Data Science</SelectItem>
                <SelectItem value="ai">AI / ML</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div> */}

        {/* Course Level */}
        {/* <div className="flex flex-col space-y-1">
          <Label htmlFor="level">Level</Label>
          <Select onValueChange={(e)=>{setLevel(e)}}>
            <SelectTrigger id="level" className="w-full">
              <SelectValue placeholder="Select difficulty level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        {/* Course Price */}
        {/* <div className="flex flex-col space-y-1">
          <Label htmlFor="price">Price (INR)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price (e.g., 499)"
          />
        </div> */}

        {/* Course Description */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe what this course is about..."
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" onClick={handleSubmit}>Create Lecture</Button>
          <Button variant="outline" type="button" onClick={handleCancel}>
            Back to Courses
          </Button>
        </div>
      </div>
    </div>




    <div className="w-full min-h-screen mt-15 bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <Link href={`/lecture/${id}`}> Go to lectures page</Link>
      <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
          Edit Course
        </h1>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
          Update your course details below and click save when done.
        </p>

        {/* Published Toggle */}
        <div className="flex items-center w-40  border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
          <Label htmlFor="isPublished" className="font-medium mr-2 text-gray-700 dark:text-gray-300">
            {/* {isPublished ? "Published" : "Publish Course"} */}
          </Label>
          <Switch
            id="isPublished"
            // checked={isPublished}
            // onCheckedChange={setIsPublished}
          />
        </div>

        {/* Form Fields */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="courseTitle" className="dark:text-gray-300">
              Title
            </Label>
            <Input
              id="courseTitle"
              className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Enter course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label className="dark:text-gray-300">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:text-white">
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

          <div>
            <Label className="dark:text-gray-300">Level</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                <SelectValue placeholder="Select difficulty level" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:text-white">
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price" className="dark:text-gray-300">
              Price (INR)
            </Label>
            <Input
              id="price"
              type="number"
              className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="e.g., 499"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description" className="dark:text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Describe your course..."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button type="submit" className="w-full sm:w-auto">
              Save Changes
            </Button>
            <Button
              variant="outline"
              type="button"
              className="w-full sm:w-auto dark:border-gray-500 dark:text-gray-300"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

