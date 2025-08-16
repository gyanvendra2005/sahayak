import dbconnect from "lib/dbconnect";
import { LectureModel } from "models/Lecture";

export async function GET(request: Request) {
    await dbconnect();    
    try {
         const { searchParams } = new URL(request.url);
         const id = searchParams.get('courseid');
         const res = await LectureModel.find({ courseId: id });

         if (!res) {
             return Response.json(
                 {
                     success: false,
                     message: 'No lectures found for this user',
                 }
             );
         }
         return Response.json(
             {
                 success: true,
                 message: 'Lecture fetched successfully',
                 data: res,
             },
             { status: 200 }
         );
    } catch (error) {
        console.log(error);
        return Response.json(
            {
                success: false,
                message: 'Failed to fetch lecture',
            }
        );
        
    }

}