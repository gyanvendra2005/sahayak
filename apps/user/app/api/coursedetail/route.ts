// import dbconnect from "lib/dbconnect";
// import { CourseModel } from "../../../../admin/models/Course";
// import   "../../../../admin/models/Lecture";


// export async function GET(request: Request) {
//     await dbconnect();
    
//     try {
//         const { searchParams } = new URL(request.url);
//          const id = searchParams.get('id');
//         const data = await CourseModel.find({ _id:id })
//   .populate({
//     path: "lectures creator",
//     select: "name title description videoUrl",
//   });

//         if (!data) {
//             return Response.json(
//                 {
//                     success: false,
//                     message: "No courses found",
//                 },
//                 { status: 404 }
//             );
//         }
//          return Response.json({
//             success: true,
//             message: "Courses fetched successfully",
//             data: data
//         },{ status: 200 });
//     } catch (error) {
//         console.log("Error fetching courses:", error);
//         return Response.json(
//       {
//         success: false,
//         message: "Error while fetching courses",
//       },
//       { status: 500 }
//     );
        
//     }
// }


import dbconnect from "lib/dbconnect";
import { NextRequest, NextResponse } from "next/server";
import  CourseModel  from "../../../../admin/models/Course";
import  LectureModel  from "../../../../admin/models/Lecture";
import UserModel from "models/User";

export async function GET(request: NextRequest) {
  await dbconnect();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Course ID required" },
        { status: 400 }
      );
    }

    const course = await CourseModel.findById(id)
      .populate({
        path: "lectures",
        model: LectureModel, 
        select: "title description videoUrl isFree",
      })
      .populate({
        path: "creator",
        select: "name email photoUrl",
      });

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    // console.log("Fetched course:", course);
    

    let isEnrolled = false;
    let lectures = course.lectures; 

    if (userId) {
      const user = await UserModel.findById(userId).select("enrolledCourses");
      if (user && user.enrolledCourses.includes(id)) {
        isEnrolled = true;
        lectures = course.lectures; // full access if enrolled
      }
    }
    console.log("Lectures after filtering:", lectures);

    // return NextResponse.json(
    //   {
    //     success: true,
    //     message: "Course fetched successfully",
    //     data: {
    //       ...course.toObject(),
    //       lectures,
    //       isEnrolled,
    //     },
    //   },
    //   { status: 200 }
    // );
     return Response.json({
            success: true,
            message: "Courses fetched successfully",
            data: {
              ...course.toObject(),
              lectures,
              isEnrolled,
            }
        },{ status: 200 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { success: false, message: "Error while fetching courses" },
      { status: 500 }
    );
  }
}
