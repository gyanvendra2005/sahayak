"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
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
import Link from "next/link";

const EditCoursePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/singlecourse/${id}`);
        if (data) {
          setTitle(data.title);
          setCategory(data.category);
          setLevel(data.level);
          setPrice(data.coursePrice);
          setDescription(data.description);
          setIsPublished(data.isPublished);
        } else {
          toast.error("Course not found");
        }
      } catch (error) {
        toast.error("Failed to load course data");
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/updatecourse`, {
        id,
        title,
        coursePrice: price,
        isPublished,
        description,
        category,
        level,
      });
      if (response.status === 200) {
        toast.success("Course updated successfully!");
        router.push("/dashboard");
      } else {
        toast.error("Failed to update course");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  if (loading)
    return <div className="p-6 text-gray-600 dark:text-gray-300">Loading...</div>;

  return (
    <div className="w-full min-h-screen mt-15 bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <Link href="#"> Go to lectures page</Link>
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
            {isPublished ? "Published" : "Publish Course"}
          </Label>
          <Switch
            id="isPublished"
            checked={isPublished}
            onCheckedChange={setIsPublished}
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
  );
};

export default EditCoursePage;


