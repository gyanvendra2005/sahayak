import dbconnect from "lib/dbconnect";
import UserModel from "models/User";
import { NextRequest } from "next/server";


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    // const data = [];
    dbconnect();
    try {
        console.log("Fetching enrolled courses for user ID:", userId);
        const courseData = await UserModel.findById(userId).populate("enrolledCourses");
        if(!courseData || courseData.enrolledCourses.length === 0) {
            return new Response(JSON.stringify({ message: "No courses found" }), {
                status: 404,
            });
        }
        // console.log("Enrolled Courses:", courseData);
        
          return Response.json({
            success: true,
            message: "Courses fetched successfully",
            data: courseData
        },{ status: 200 });
       
} catch (error) {
          return Response.json({
            success: false,
            message: "Error while fetching courses",
        },{ status: 500 });
    }
}