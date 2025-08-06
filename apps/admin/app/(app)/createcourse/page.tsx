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
  // Initial course data state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const {data:session} = useSession();



  const handleCancel = () => {
    router.push("/coursetable"); // or wherever you want to go
  };

  const handleSubmit = async (e: React.FormEvent) => {
       try {
        e.preventDefault(); // Prevent default form submission behavior
        // const formData = new FormData(e.target as HTMLFormElement);
        console.log(level, category, title, price, description);
        const userId = session?.user?.id;
        const response  = axios.post("/api/createcourse", {
          title: title,
          description: description,
          category: category,
          level: level,
           coursePrice: price,
          creator: userId, // Use the session user ID as the creator
          
          // creator: "admin", // Assuming the creator is hardcoded for now
          isPublished: false, // Assuming the course is not published initially
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
        <div className="flex flex-col space-y-1">
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
        </div>

        {/* Course Level */}
        <div className="flex flex-col space-y-1">
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
        </div>

        {/* Course Price */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="price">Price (INR)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price (e.g., 499)"
          />
        </div>

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
          <Button type="submit" onClick={handleSubmit}>Create Course</Button>
          <Button variant="outline" type="button" onClick={handleCancel}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
