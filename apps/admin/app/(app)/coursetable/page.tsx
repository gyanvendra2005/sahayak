"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";

type Invoice = {
  _id: string;
  coursePrice: string;
  isPublished: boolean;
  title: string;
};

const Page = () => {
  const { data: session } = useSession();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchCourses = async () => {
      try {
        const userId = session.user.id;
        const response = await axios.get("/api/getcourse", {
          params: { userid: userId },
        });

        if (response.status === 200) {
          setInvoices(response.data.data);
          toast.success("Courses fetched successfully!");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to fetch courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [session]);

  return (
    <div className="p-4 sm:p-10 max-w-6xl mt-14 mx-auto w-full bg-white dark:bg-gray-900 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Courses
        </h1>
        <Link href="createcourse">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Add New Course
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <Table>
          <TableCaption className="text-gray-600 dark:text-gray-400">
            A list of your created courses
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-800">
              <TableHead className="text-gray-700 dark:text-gray-200">
                Title
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200">
                Price
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200">
                Status
              </TableHead>
              <TableHead className="text-right text-gray-700 dark:text-gray-200">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))
              : invoices.map((invoice) => (
                  <TableRow
                    key={invoice._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <TableCell className="text-gray-900 dark:text-gray-100">
                      {invoice.title}
                    </TableCell>
                    <TableCell className="font-medium text-gray-700 dark:text-gray-300">
                      ₹{invoice.coursePrice}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={invoice.isPublished ? "default" : "secondary"}
                        className={
                          invoice.isPublished
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-gray-600 text-white hover:bg-gray-700"
                        }
                      >
                        {invoice.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          router.push(`/editcourse/${invoice._id}`)
                        }
                        className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
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
  );
};

export default Page;
