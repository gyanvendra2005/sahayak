import dbconnect from "lib/dbconnect";
import { LectureModel } from "models/Lecture";

export async function POST(request: Request) {
    dbconnect();
    try {
        const { courseId, title, description } = await request.json();
        const response = await LectureModel.create({
            title: title,
            description: description,
            courseId: courseId,
        });
         if(!response.success) {
            return Response.json(
                {
                    success: false,
                    message: 'Failed to create lecture',
                });}
             return Response.json(
      {
        success: true,
        message: 'Lecture ceated successfully',
      },
      { status: 201 });

    } catch (error) {
        console.log(error);
        
         return Response.json(
                {
                    success: false,
                    message: 'Failed to create lecture',
                });
    }
}