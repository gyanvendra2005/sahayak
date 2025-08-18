"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

type Lecture = {
  _id: string;
  title: string;
  description: string;
  isFree: boolean;
  courseId: string;
  createdAt: string;
  updatedAt: string;
};

export default function LecturePage() {
  const router = useRouter();
  const { id } = useParams(); // courseId
  const { data: session } = useSession();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFree, setIsFree] = useState(false);

  // Table state
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCancel = () => {
    router.push(`/editcourse/${id}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/createlecture", {
        courseId: id,
        title,
        description,
        isFree,
      });

      if (response.status === 200) {
        toast.success("Lecture created successfully!");
        setTitle("");
        setDescription("");
        setIsFree(false);
        fetchLectures(); // refresh list
      } else {
        toast.error("Failed to create lecture.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create lecture. Please try again.");
    }
  };

  const fetchLectures = async () => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);
      const response = await axios.get("/api/getlecture", {
        params: { courseid: id },
      });
      if (response.status === 200) {
        setLectures(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching lectures:", error);
      toast.error("Failed to fetch lectures.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, [session, id]);

  return (
    <div className="flex flex-col w-full gap-10 p-6 mt-20 md:p-10 bg-white dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="font-bold text-2xl text-gray-900 dark:text-white">Add a New Lecture</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Provide basic information about your lecture.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col space-y-1">
          <Label htmlFor="title" className="text-gray-800 dark:text-gray-200">Lecture Title</Label>
          <Input
            id="title"
            placeholder="Enter lecture title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <Label htmlFor="description" className="text-gray-800 dark:text-gray-200">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe this lecture..."
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="flex items-center space-x-3">
          <Label htmlFor="isFree" className="text-gray-800 dark:text-gray-200">Is Free?</Label>
          <Switch id="isFree" checked={isFree} onCheckedChange={setIsFree} />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit">Create Lecture</Button>
          <Button variant="outline" type="button" onClick={handleCancel}>
            Back to Course
          </Button>
        </div>
      </form>

      {/* Lecture Table */}
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lectures in this Course</h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <Table>
            <TableCaption className="text-gray-600 dark:text-gray-400">
              A list of your created lectures
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-800 dark:text-gray-200">Title</TableHead>
                <TableHead className="text-gray-800 dark:text-gray-200">Free?</TableHead>
                <TableHead className="text-right text-gray-800 dark:text-gray-200">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                    </TableRow>
                  ))
                : lectures.map((lecture) => (
                    <TableRow key={lecture._id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <TableCell className="text-gray-900 dark:text-gray-100">{lecture.title}</TableCell>
                      <TableCell>
                        <Badge
                          variant={lecture.isFree ? "default" : "secondary"}
                          className={
                            lecture.isFree
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-gray-600 text-white hover:bg-gray-700"
                          }
                        >
                          {lecture.isFree ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => router.push(`/editlecture/${lecture._id}`)}
                          className="dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                          <Edit className="h-4 w-4 text-gray-800 dark:text-gray-200" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
