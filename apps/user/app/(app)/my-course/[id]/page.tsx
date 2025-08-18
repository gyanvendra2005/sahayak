// "use client";
// import { useParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Loader2, PlayCircle } from "lucide-react";
// import { toast } from "sonner";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// export default function CourseDetailsPage() {
// //   const { courseId } ="68a1cc093927c2200be6b23f"
//   const [course, setCourse] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedLecture, setSelectedLecture] = useState<any>(null);

//   // Fetch course with lectures
//   const fetchCourse = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("/api/coursedetail", {
//         params: { id: "68a1cc093927c2200be6b23f" },
//       });
//       console.log("API Response:", res.data.data.lectures);

//       if (res.data.success) {
//         const c = res.data.data.lectures;
//         setCourse(c);
//         if (c.lectures.length > 0) setSelectedLecture(c.lectures[0]); // default first lecture
//       } else {
//         toast.error(res.data.message || "Course not found");
//       }
//     } catch (err) {
//       console.error("Error fetching course:", err);
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//      fetchCourse();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   if (!course) {
//     return <p className="text-center mt-20">Course not found</p>;
//   }

//   return (
//     <div className="px-4 md:px-8 mt-14">
//       {/* Course Header */}
//       <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-xl text-white shadow-lg mb-8">
//         <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
//         <p className="text-gray-300 mt-2">{course.description}</p>
//       </div>

//       {/* Main Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Video Player */}
//         <div className="lg:col-span-2">
//           <Card>
//             <CardHeader>
//               <CardTitle>{selectedLecture?.title || "Select a Lecture"}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {selectedLecture ? (
//                 <video
//                   key={selectedLecture._id}
//                   src={selectedLecture.videoUrl}
//                   controls
//                   className="w-full h-[400px] rounded-lg"
//                 />
//               ) : (
//                 <p className="text-gray-500">No lecture selected</p>
//               )}
//               <p className="mt-3 text-gray-600 dark:text-gray-300">
//                 {selectedLecture?.description}
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Lectures List */}
//         <div>
//           <Card>
//             <CardHeader>
//               <CardTitle>Lectures</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ul className="space-y-3">
//                 {course.lectures.length > 0 ? (
//                   course.lectures.map((lec: any, i: number) => (
//                     <li
//                       key={lec._id}
//                       onClick={() => setSelectedLecture(lec)}
//                       className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
//                         selectedLecture?._id === lec._id
//                           ? "bg-blue-100 dark:bg-blue-800"
//                           : "hover:bg-gray-100 dark:hover:bg-gray-800"
//                       }`}
//                     >
//                       <PlayCircle className="w-5 h-5 text-blue-600" />
//                       <span>{i + 1}. {lec.title}</span>
//                     </li>
//                   ))
//                 ) : (
//                   <p>No lectures available</p>
//                 )}
//               </ul>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CourseDetailsPage() {
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLecture, setSelectedLecture] = useState<any>(null);
  const [enrolled, setEnrolled] = useState(false); // ✅ track enrollment status

  const { id } = useParams();
  const { data: session } = useSession();

  // Fetch course with lectures
  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/coursedetail`, {
        params: { id, userId: session?.user?.id }, // pass userId to backend
      });

      console.log("API Response:", res.data.data);

      if (res.data.success) {
        const c = res.data.data;
        setCourse(c);
        setEnrolled(c.isEnrolled); // ✅ set enrolled state from backend response

        if (c.lectures.length > 0) setSelectedLecture(c.lectures[0]); // default first lecture
      } else {
        toast.error(res.data.message || "Course not found");
      }
    } catch (err) {
      console.error("Error fetching course:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && session?.user?.id) {
      fetchCourse();
    }
  }, [id, session?.user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!course) {
    return <p className="text-center mt-20 text-gray-600">Course not found</p>;
  }

  return (
    <div className="px-4 md:px-8 mt-20 mb-10 max-w-7xl mx-auto">
      {/* Simple Course Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {course.title.toUpperCase()}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-3xl">
          {course.description}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Created by{" "}
          <span className="font-medium text-gray-800 dark:text-gray-300">
            {course?.creator?.name}
          </span>
        </p>
      </div>

      {!enrolled && (
        <p className="mb-6 text-red-500 font-medium">
          You are not enrolled in this course. Please enroll to watch lectures.
        </p>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedLecture?.title || "Select a Lecture"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLecture && enrolled ? ( // ✅ only play video if enrolled
                <div className="rounded-lg overflow-hidden">
                  <video
                    key={selectedLecture._id}
                    src={selectedLecture.videoUrl}
                    controls
                    controlsList="nodownload"
                    className="w-full h-[400px] rounded-lg bg-black"
                  />
                </div>
              ) : (
                <p className="text-gray-500">
                  {enrolled
                    ? "No lecture selected"
                    : "Enroll to access the lectures"}
                </p>
              )}
              {enrolled && (
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  {selectedLecture?.description}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Lectures List */}
        <div>
          <Card className="shadow-sm border border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Lectures</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {course.lectures.length > 0 ? (
                  course.lectures.map((lec: any, i: number) => (
                    <li
                      key={lec._id}
                      onClick={() => enrolled && setSelectedLecture(lec)} // ✅ only clickable if enrolled
                      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition ${
                        selectedLecture?._id === lec._id
                          ? "bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-600"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <PlayCircle className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-800 dark:text-gray-200 text-sm">
                        {i + 1}. {lec.title}
                      </span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No lectures available</p>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
