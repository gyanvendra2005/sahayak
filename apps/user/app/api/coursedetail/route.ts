import dbconnect from "lib/dbconnect";
import { CourseModel } from "../../../../admin/models/Course";
import   "../../../../admin/models/Lecture";


export async function GET(request: Request) {
    await dbconnect();
    
    try {
        const { searchParams } = new URL(request.url);
         const id = searchParams.get('id');
        const data = await CourseModel.find({ _id:id })
  .populate({
    path: "lectures creator",
    select: "name title description videoUrl",
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
            data: data
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