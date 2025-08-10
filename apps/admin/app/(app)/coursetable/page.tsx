"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
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
    <div className="p-4 sm:p-10 max-w-6xl mt-20 mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Your Courses</h1>
        <Link href="/createcourse">
          <Button>Add New Course</Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl ">
        <Table>
          <TableCaption className="text-muted-foreground">
            A list of your created courses
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="">Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
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
                  <TableRow key={invoice._id}>
                    <TableCell>{invoice.title}</TableCell>
                    <TableCell className="font-medium">
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
                      <Button variant="outline" size="icon" onClick={() => router.push(`/editcourse/${invoice._id}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
          {/* {!loading && invoices.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">₹2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          )} */}
        </Table>
      </div>
    </div>
    
  );
};

export default Page;
