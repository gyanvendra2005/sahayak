import dbconnect from "lib/dbconnect";
import { User } from "lucide-react";
import  CourseModel  from "../../../../admin/models/Course";
import UserModel from "models/User";


export async function GET() {
    await dbconnect();
    try {
        const data = await CourseModel.find({ isPublished: true })
  .populate({
    path: "creator",
    select: "name email photoUrl"
  });

        if (!data) {
            return Response.json(
                {
                    success: false,
                    message: "No courses found",
                },
                { status: 404 }
            );
        }
        return Response.json({
            success: true,
            message: "Courses fetched successfully",
            data: await data
        },{ status: 200 });
    } catch (error) {
        console.log("Error fetching courses:", error);
        return Response.json(
      {
        success: false,
        message: "Error while fetching courses",
      },
      { status: 500 }
    );
        
    }
}