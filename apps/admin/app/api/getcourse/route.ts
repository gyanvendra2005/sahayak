import dbconnect from "lib/dbconnect";
import  CourseModel  from "models/Course";



export async function GET(request: Request) {
    dbconnect();
    try {
         const { searchParams } = new URL(request.url);
        const userid = searchParams.get('userid');
        const course = await CourseModel.find({ creator: userid });
        if (!course) {
            return Response.json(
                {
                    success: false,
                    message: 'No courses found for this user',
                }
            );
        }
        return Response.json(
            {
                success: true,
                message: 'Course fetched successfully',
                data: course,
            },
            { status: 200 }
        );
        
    } catch (error) {
        console.log(error);
        return Response.json(
            {
                success: false,
                message: 'Failed to fetch course',
            }
        );
        
    }
}