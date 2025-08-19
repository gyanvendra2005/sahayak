"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
// import Link from "next/link";

const EditLecturePage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [isFree, setIsFree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch lecture data
  useEffect(() => {
    const fetchLectureData = async () => {
      setLoading(true);
      if (!id) {
        toast.error("Lecture ID is missing");
        setLoading(false);
        return;
      }
      console.log(`Fetching lecture data for ID: ${id}`);
      
      try {
        const { data } = await axios.get(`/api/singlelecture/${id}`);
        console.log(data);
        
        if (data) {
          setTitle(data.title);
          setDescription(data.description);
          setIsFree(data.isFree);
        } else {
          toast.error("Lecture not found");
        }
      } catch {
        toast.error("Failed to load lecture data");
      } finally {
        setLoading(false);
      }
    };
    fetchLectureData();
  }, [id]);

  // Submit form (update lecture + upload video in same request)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    const formData = new FormData();
    formData.append("id", id as string);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("isFree", String(isFree));
    if (videoFile) {
      formData.append("video", videoFile);
    }

    try {
      setSaving(true);
      const response = await axios.put(`/api/updatelecture`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast.success("Lecture updated successfully!");
        router.push(`/lecture/${id}`);
      } else {
        toast.error("Failed to update lecture");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="p-6 text-gray-600 dark:text-gray-300">Loading...</div>;

  return (
    <div className="w-full min-h-screen mt-15 bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      {/* <Link href={`/lecture/${id}`}>⬅ Back to Lectures</Link> */}

      <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
          Edit Lecture
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Is Free Toggle */}
          <div className="flex items-center w-40 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
            <Label htmlFor="isFree" className="font-medium mr-2 text-gray-700 dark:text-gray-300">
              {isFree ? "Free" : "Paid"}
            </Label>
            <Switch id="isFree" checked={isFree} onCheckedChange={setIsFree} />
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="lectureTitle" className="dark:text-gray-300">
              Title
            </Label>
            <Input
              id="lectureTitle"
              className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Enter lecture title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="dark:text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Describe your lecture..."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Video Upload */}
          <div>
            <Label htmlFor="video" className="dark:text-gray-300">
              Lecture Video*
            </Label>
            <Input
              id="video"
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button type="submit" className="w-full sm:w-auto" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
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

export default EditLecturePage;
