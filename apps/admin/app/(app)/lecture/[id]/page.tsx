"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
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
    <div className="flex flex-col w-full gap-10 p-6 mt-20 md:p-10">
      {/* Header */}
      <div>
        <h1 className="font-bold text-2xl">Add a New Lecture</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Provide basic information about your lecture.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="flex flex-col space-y-1">
          <Label htmlFor="title">Lecture Title</Label>
          <Input
            id="title"
            placeholder="Enter lecture title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col space-y-1">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe this lecture..."
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center space-x-3">
          <Label htmlFor="isFree">Is Free?</Label>
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
          <h2 className="text-xl font-bold">Lectures in this Course</h2>
          {/* <Link href="/createcourse">
            <Button>Add New Course</Button>
          </Link> */}
        </div>

        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableCaption className="text-muted-foreground">
              A list of your created lectures
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                {/* <TableHead>Description</TableHead> */}
                <TableHead>Free?</TableHead>
                {/* <TableHead>Created At</TableHead> */}
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : lectures.map((lecture) => (
                    <TableRow key={lecture._id}>
                      <TableCell>{lecture.title}</TableCell>
                      {/* <TableCell className="max-w-md truncate">{lecture.description}</TableCell> */}
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
                      {/* <TableCell>{new Date(lecture.createdAt).toLocaleString()}</TableCell> */}
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => router.push(`/editlecture/${lecture._id}`)}
                        >
                          <Edit className="h-4 w-4" />
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
